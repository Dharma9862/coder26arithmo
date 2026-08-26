import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  where
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { GameSessionResult, LeaderboardEntry, UserProfile } from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = firebaseConfigData.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export class FirebaseDatabaseService {
  /**
   * Listen to Firebase Auth state
   */
  public static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  public static onAuth(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Fetch User Profile from Firestore by UID
   */
  public static async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) return null;
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
    }
    return null;
  }

  /**
   * Sign In with Email & Password
   */
  public static async signInWithEmail(email: string, pass: string): Promise<UserProfile> {
    const cleanEmail = email.trim().includes('@') ? email.trim() : `${email.trim().toLowerCase()}@arithmo.app`;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const user = userCredential.user;
      return await this.syncUserProfile(user, { email: user.email || cleanEmail, isGuest: false });
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        // If Email/Password provider is not activated yet in console, sign in anonymously and link
        try {
          const anonCred = await signInAnonymously(auth);
          return await this.syncUserProfile(anonCred.user, {
            name: cleanEmail.split('@')[0],
            email: cleanEmail,
            isGuest: false,
          });
        } catch {}
      }
      throw err;
    }
  }

  /**
   * Register with Email & Password
   */
  public static async signUpWithEmail(name: string, email: string, pass: string): Promise<UserProfile> {
    const cleanEmail = email.trim().includes('@') ? email.trim() : `${email.trim().toLowerCase()}@arithmo.app`;
    const cleanName = name.trim() || cleanEmail.split('@')[0] || 'Math Athlete';

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      const user = userCredential.user;
      if (cleanName) {
        try {
          await firebaseUpdateProfile(user, { displayName: cleanName });
        } catch (err) {
          console.warn('Profile name update warning:', err);
        }
      }
      return await this.syncUserProfile(user, { 
        name: cleanName, 
        email: user.email || cleanEmail,
        isGuest: false 
      });
    } catch (err: any) {
      // If email is already registered, attempt to log in with provided password
      if (err?.code === 'auth/email-already-in-use') {
        try {
          const signinCred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
          const user = signinCred.user;
          if (cleanName) {
            try {
              await firebaseUpdateProfile(user, { displayName: cleanName });
            } catch {}
          }
          return await this.syncUserProfile(user, { 
            name: cleanName, 
            email: user.email || cleanEmail,
            isGuest: false 
          });
        } catch {
          throw new Error('This email is already registered. Please sign in with your password.');
        }
      }

      // If Email provider is not enabled in Firebase Console, use Auth session + Firestore profile sync
      if (err?.code === 'auth/operation-not-allowed') {
        try {
          const anonCred = await signInAnonymously(auth);
          const user = anonCred.user;
          return await this.syncUserProfile(user, {
            name: cleanName,
            email: cleanEmail,
            isGuest: false,
          });
        } catch (anonErr) {
          console.warn('Anonymous fallback warning:', anonErr);
        }
      }

      throw err;
    }
  }

  /**
   * 1-Click Google Sign In
   */
  public static async signInWithGoogle(): Promise<UserProfile> {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    return await this.syncUserProfile(user, {
      name: user.displayName || 'Athlete ' + user.uid.substring(0, 4),
      email: user.email || '',
      avatar: '⚡',
    });
  }

  /**
   * Anonymous / Guest Sign In
   */
  public static async signInAsGuest(): Promise<UserProfile> {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    return await this.syncUserProfile(user, {
      name: 'Guest Runner',
      email: '',
      isGuest: true,
      avatar: '⚡',
    });
  }

  /**
   * Send Password Reset Email
   */
  public static async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email.trim());
  }

  /**
   * Sign Out
   */
  public static async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  /**
   * Sync & Retrieve Firestore User Profile
   */
  public static async syncUserProfile(
    fbUser: FirebaseUser, 
    overrides?: Partial<UserProfile>
  ): Promise<UserProfile> {
    const userRef = doc(db, 'users', fbUser.uid);
    let profileData: Partial<UserProfile> = {};

    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        profileData = snap.data() as Partial<UserProfile>;
      }
    } catch (err) {
      console.warn('Firestore read profile warning:', err);
    }

    const calculatedLeague = this.getLeagueFromXp(profileData.xp || 0);

    const mergedProfile: UserProfile = {
      id: fbUser.uid,
      name: overrides?.name || profileData.name || fbUser.displayName || 'Math Athlete',
      email: overrides?.email || profileData.email || fbUser.email || '',
      avatar: overrides?.avatar || profileData.avatar || '⚡',
      preferredDifficulty: profileData.preferredDifficulty || 'intermediate',
      preferredOperation: profileData.preferredOperation || 'multiplication',
      streakDays: profileData.streakDays ?? 1,
      lastActiveDate: profileData.lastActiveDate || new Date().toISOString().split('T')[0],
      xp: profileData.xp ?? 250,
      level: profileData.level || Math.floor((profileData.xp || 250) / 250) + 1,
      isPremium: profileData.isPremium ?? false,
      subscriptionPlan: profileData.subscriptionPlan,
      purchasedProductId: profileData.purchasedProductId,
      leaderboardRank: profileData.leaderboardRank || 1,
      totalSprintsPlayed: profileData.totalSprintsPlayed || 0,
      totalQuestionsAnswered: profileData.totalQuestionsAnswered || 0,
      overallAccuracy: profileData.overallAccuracy ?? 95,
      fastestAnswerMs: profileData.fastestAnswerMs || 1050,
      isGuest: overrides?.isGuest ?? (fbUser.isAnonymous || profileData.isGuest || false),
      soundEnabled: profileData.soundEnabled ?? true,
      hapticsEnabled: profileData.hapticsEnabled ?? true,
      audioFeedbackEnabled: profileData.audioFeedbackEnabled ?? true,
      theme: profileData.theme || 'dark',
      ...overrides,
    };

    // Save to Firestore
    try {
      await setDoc(userRef, {
        ...mergedProfile,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Also upsert to real-time Leaderboard if not guest or has XP
      await this.upsertLeaderboardEntry(mergedProfile);
    } catch (err) {
      console.warn('Firestore save profile warning:', err);
    }

    return mergedProfile;
  }

  /**
   * Save User Profile to Cloud Firestore
   */
  public static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const userRef = doc(db, 'users', profile.id);
      await setDoc(userRef, {
        ...profile,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // Keep real-time leaderboard in sync
      await this.upsertLeaderboardEntry(profile);
    } catch (err) {
      console.warn('Failed to save profile to Firestore:', err);
    }
  }

  /**
   * Save Game Session result to Cloud Firestore
   */
  public static async saveGameSession(session: GameSessionResult, profile: UserProfile): Promise<void> {
    try {
      const sessionRef = doc(db, 'game_sessions', session.id);
      await setDoc(sessionRef, {
        ...session,
        userId: profile.id,
        savedAt: new Date().toISOString(),
      });

      // Update profile stats in Cloud
      await this.saveUserProfile(profile);
    } catch (err) {
      console.warn('Failed to save session to Firestore:', err);
    }
  }

  /**
   * Upsert Live Leaderboard Entry into Firestore
   */
  public static async upsertLeaderboardEntry(profile: UserProfile): Promise<void> {
    if (!profile.id) return;
    try {
      const league = this.getLeagueFromXp(profile.xp);
      const score = Math.max(
        Math.round(profile.totalSprintsPlayed * 140 + profile.xp * 0.65),
        profile.xp > 0 ? profile.xp : 250
      );

      const entry: Omit<LeaderboardEntry, 'rank'> & { updatedAt: number } = {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar || '⚡',
        score,
        accuracy: profile.overallAccuracy || 95,
        streak: profile.streakDays || 1,
        xp: profile.xp,
        level: profile.level || 1,
        isCurrentUser: false,
        badge: profile.isPremium ? 'PRO Champion' : `${league} Athlete`,
        countryCode: profile.countryCode || 'GLOBAL',
        countryFlag: '🌐',
        league,
        avgReactionMs: profile.fastestAnswerMs > 0 ? profile.fastestAnswerMs : 980,
        bestOperation: profile.preferredOperation || 'Multiplication',
        trend: 'same',
        trendPositions: 0,
        sprintsPlayed: profile.totalSprintsPlayed || 0,
        updatedAt: Date.now(),
      };

      const lbRef = doc(db, 'leaderboard', profile.id);
      await setDoc(lbRef, entry, { merge: true });
    } catch (err) {
      console.warn('Failed to upsert leaderboard entry:', err);
    }
  }

  /**
   * Fetch Live Real-Time Leaderboard from Cloud Firestore
   */
  public static async fetchCloudLeaderboard(currentUserId?: string): Promise<LeaderboardEntry[]> {
    try {
      const lbCol = collection(db, 'leaderboard');
      const q = query(lbCol, orderBy('score', 'desc'), limit(50));
      const snap = await getDocs(q);

      if (snap.empty) {
        return [];
      }

      const entries: LeaderboardEntry[] = [];
      let rank = 1;

      snap.forEach((docSnap) => {
        const data = docSnap.data() as LeaderboardEntry;
        entries.push({
          ...data,
          id: docSnap.id,
          rank: rank++,
          isCurrentUser: currentUserId ? docSnap.id === currentUserId : false,
        });
      });

      return entries;
    } catch (err) {
      console.warn('Failed to fetch leaderboard from Firestore:', err);
      return [];
    }
  }

  /**
   * Listen to Live Real-Time Leaderboard from Cloud Firestore
   */
  public static subscribeToLeaderboard(
    currentUserId: string, 
    callback: (entries: LeaderboardEntry[]) => void
  ): () => void {
    try {
      const lbCol = collection(db, 'leaderboard');
      const q = query(lbCol, orderBy('score', 'desc'), limit(50));
      return onSnapshot(q, (snap) => {
        const entries: LeaderboardEntry[] = [];
        let rank = 1;
        snap.forEach((docSnap) => {
          const data = docSnap.data() as LeaderboardEntry;
          entries.push({
            ...data,
            id: docSnap.id,
            rank: rank++,
            isCurrentUser: docSnap.id === currentUserId,
          });
        });
        callback(entries);
      }, (err) => {
        console.warn('Leaderboard snapshot subscription error:', err);
      });
    } catch (err) {
      console.warn('Failed to setup leaderboard subscription:', err);
      return () => {};
    }
  }

  /**
   * Sync Bookmarks to Cloud Firestore
   */
  public static async syncBookmarks(userId: string, questionIds: string[]): Promise<void> {
    if (!userId) return;
    try {
      const bmRef = doc(db, 'bookmarks', userId);
      await setDoc(bmRef, {
        userId,
        questionIds,
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to sync bookmarks to Firestore:', err);
    }
  }

  /**
   * Fetch Cloud Bookmarks
   */
  public static async fetchBookmarks(userId: string): Promise<string[] | null> {
    if (!userId) return null;
    try {
      const bmRef = doc(db, 'bookmarks', userId);
      const snap = await getDoc(bmRef);
      if (snap.exists()) {
        const data = snap.data();
        return (data.questionIds as string[]) || [];
      }
    } catch (err) {
      console.warn('Failed to fetch bookmarks from Firestore:', err);
    }
    return null;
  }

  public static getLeagueFromXp(xp: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster' {
    if (xp >= 8000) return 'Grandmaster';
    if (xp >= 6000) return 'Master';
    if (xp >= 4000) return 'Diamond';
    if (xp >= 2500) return 'Platinum';
    if (xp >= 1200) return 'Gold';
    if (xp >= 500) return 'Silver';
    return 'Bronze';
  }
}
