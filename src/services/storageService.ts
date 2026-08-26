import { 
  Achievement, 
  AptitudeQuestion, 
  DailyChallenge, 
  GameSessionResult, 
  LeaderboardEntry, 
  UserProfile 
} from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { QuestionBankService } from './questionBankGenerator';
import { FirebaseDatabaseService } from './firebase';

const PROFILE_KEY = 'numbersprint_user_profile';
const SESSIONS_KEY = 'numbersprint_game_sessions';
const BOOKMARKS_KEY = 'numbersprint_bookmarks';
const ACHIEVEMENTS_KEY = 'numbersprint_achievements';
const CUSTOM_QUESTIONS_KEY = 'numbersprint_custom_questions';
const DAILY_CHALLENGE_KEY = 'numbersprint_daily_challenge';
const CLOUD_LEADERBOARD_CACHE_KEY = 'numbersprint_cloud_leaderboard_cache';

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_' + Math.random().toString(36).substring(2, 9),
  name: 'Math Athlete',
  email: '',
  avatar: '⚡',
  preferredDifficulty: 'intermediate',
  preferredOperation: 'multiplication',
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  xp: 0,
  level: 1,
  isPremium: false,
  leaderboardRank: 1,
  totalSprintsPlayed: 0,
  totalQuestionsAnswered: 0,
  overallAccuracy: 100,
  fastestAnswerMs: 0,
  isGuest: true,
  soundEnabled: true,
  hapticsEnabled: true,
  audioFeedbackEnabled: true,
  theme: 'dark',
};

export class StorageService {
  public static getDefaultGuestProfile(): UserProfile {
    return {
      ...DEFAULT_PROFILE,
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: 'Guest Runner',
      email: '',
      isGuest: true,
      isPremium: false,
      xp: 0,
      level: 1,
      totalSprintsPlayed: 0,
      totalQuestionsAnswered: 0,
      streakDays: 1,
    };
  }

  public static getDefaultProfile(): UserProfile {
    return {
      ...DEFAULT_PROFILE,
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: 'Math Athlete',
      isGuest: false,
    };
  }

  public static async signOut(): Promise<UserProfile> {
    try {
      await FirebaseDatabaseService.signOut();
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
    const guestProfile = this.getDefaultGuestProfile();
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(guestProfile));
      localStorage.removeItem(CLOUD_LEADERBOARD_CACHE_KEY);
      this.notifyLocalUpdate(PROFILE_KEY, guestProfile);
    } catch {
      // ignore
    }
    return guestProfile;
  }

  private static notifyLocalUpdate(key: string, data?: any) {
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('numbersprint_local_update', {
          detail: { key, data, timestamp: Date.now() }
        }));
      } catch {
        // Fallback
      }
    }
  }

  public static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.avatar === '📱') {
          parsed.avatar = '⚡';
        }
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  }

  public static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      this.notifyLocalUpdate(PROFILE_KEY, profile);

      // Async sync to Cloud Firestore
      if (profile.id && !profile.isGuest) {
        FirebaseDatabaseService.saveUserProfile(profile).catch((err) => {
          console.warn('Background Firestore profile sync:', err);
        });
      }
    } catch {
      // LocalStorage error fallback
    }
  }

  public static getSessions(): GameSessionResult[] {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return [];
  }

  public static saveSession(session: GameSessionResult): void {
    try {
      const sessions = this.getSessions();
      sessions.unshift(session);
      if (sessions.length > 60) sessions.pop();
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));

      // Update user stats
      const profile = this.getProfile();
      profile.totalSprintsPlayed += 1;
      profile.totalQuestionsAnswered += session.totalAnswered;
      profile.xp += session.xpEarned;
      profile.level = Math.floor(profile.xp / 250) + 1;

      if (session.bestTimeMs > 0 && (profile.fastestAnswerMs === 0 || session.bestTimeMs < profile.fastestAnswerMs)) {
        profile.fastestAnswerMs = session.bestTimeMs;
      }

      // Update streak and activity
      const today = new Date().toISOString().split('T')[0];
      if (profile.lastActiveDate !== today) {
        const lastActive = new Date(profile.lastActiveDate);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          profile.streakDays += 1;
        } else if (diffDays > 1) {
          profile.streakDays = 1;
        }
        profile.lastActiveDate = today;
      }

      // Recalculate average accuracy
      const totalCorrect = sessions.reduce((sum, s) => sum + s.correctCount, 0);
      const totalAns = sessions.reduce((sum, s) => sum + s.totalAnswered, 0);
      profile.overallAccuracy = totalAns > 0 ? Math.round((totalCorrect / totalAns) * 100) : 100;

      this.saveProfile(profile);
      this.evaluateAchievements(session);
      this.notifyLocalUpdate(SESSIONS_KEY, session);

      // Async push session to Firebase Firestore
      FirebaseDatabaseService.saveGameSession(session, profile).catch((err) => {
        console.warn('Background Firestore session sync:', err);
      });
    } catch {
      // Storage error
    }
  }

  public static getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return INITIAL_ACHIEVEMENTS;
  }

  public static saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
      this.notifyLocalUpdate(ACHIEVEMENTS_KEY, achievements);
    } catch {
      // Fallback
    }
  }

  public static evaluateAchievements(latestSession?: GameSessionResult): Achievement[] {
    const list = this.getAchievements();
    const profile = this.getProfile();
    let updated = false;

    for (const ach of list) {
      if (ach.isUnlocked) continue;

      if (ach.id === 'first-sprint' && profile.totalSprintsPlayed >= 1) {
        ach.isUnlocked = true;
        ach.progress = 1;
        ach.unlockedAt = new Date().toISOString();
        updated = true;
      } else if (ach.id === 'speed-demon' && latestSession && latestSession.bestTimeMs <= 1200 && latestSession.bestTimeMs > 0) {
        ach.isUnlocked = true;
        ach.progress = 1;
        ach.unlockedAt = new Date().toISOString();
        updated = true;
      } else if (ach.id === 'flawless-streak' && latestSession) {
        ach.progress = Math.max(ach.progress, latestSession.maxCombo);
        if (ach.progress >= ach.maxProgress) {
          ach.isUnlocked = true;
          ach.unlockedAt = new Date().toISOString();
        }
        updated = true;
      } else if (ach.id === 'centurion') {
        ach.progress = Math.min(profile.totalQuestionsAnswered, ach.maxProgress);
        if (ach.progress >= ach.maxProgress) {
          ach.isUnlocked = true;
          ach.unlockedAt = new Date().toISOString();
        }
        updated = true;
      } else if (ach.id === 'streak-warrior') {
        ach.progress = Math.min(profile.streakDays, ach.maxProgress);
        if (ach.progress >= ach.maxProgress) {
          ach.isUnlocked = true;
          ach.unlockedAt = new Date().toISOString();
        }
        updated = true;
      } else if (ach.id === 'grand-champion') {
        ach.progress = Math.min(profile.xp, ach.maxProgress);
        if (ach.progress >= ach.maxProgress) {
          ach.isUnlocked = true;
          ach.unlockedAt = new Date().toISOString();
        }
        updated = true;
      } else if (ach.id === 'division-dynamo' && latestSession && latestSession.operation === 'division' && latestSession.accuracy >= 90) {
        ach.isUnlocked = true;
        ach.progress = 1;
        ach.unlockedAt = new Date().toISOString();
        updated = true;
      }
    }

    if (updated) {
      this.saveAchievements(list);
    }
    return list;
  }

  public static getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return [];
  }

  public static toggleBookmark(questionId: string): boolean {
    const list = this.getBookmarks();
    const idx = list.indexOf(questionId);
    let isBookmarked = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      isBookmarked = false;
    } else {
      list.push(questionId);
      isBookmarked = true;
    }
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
      this.notifyLocalUpdate(BOOKMARKS_KEY, list);

      // Async sync with cloud
      const profile = this.getProfile();
      if (profile.id && !profile.isGuest) {
        FirebaseDatabaseService.syncBookmarks(profile.id, list).catch((err) => {
          console.warn('Bookmarks cloud sync error:', err);
        });
      }
    } catch {
      // Storage error
    }
    return isBookmarked;
  }

  public static async fetchCloudBookmarks(): Promise<string[]> {
    const profile = this.getProfile();
    if (!profile.id || profile.isGuest) return this.getBookmarks();
    const remote = await FirebaseDatabaseService.fetchBookmarks(profile.id);
    if (remote && Array.isArray(remote)) {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(remote));
      this.notifyLocalUpdate(BOOKMARKS_KEY, remote);
      return remote;
    }
    return this.getBookmarks();
  }

  public static getAllAptitudeQuestions(): AptitudeQuestion[] {
    const initial = QuestionBankService.getFullQuestionBank();
    const custom = this.getCustomQuestions();
    const bookmarks = this.getBookmarks();

    const merged = [...initial, ...custom].map(q => ({
      ...q,
      isBookmarked: bookmarks.includes(q.id),
    }));

    return merged;
  }

  public static getCustomQuestions(): AptitudeQuestion[] {
    try {
      const data = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return [];
  }

  public static addCustomQuestions(questions: AptitudeQuestion[]): void {
    const existing = this.getCustomQuestions();
    const combined = [...existing, ...questions];
    try {
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(combined));
      this.notifyLocalUpdate(CUSTOM_QUESTIONS_KEY, combined);
    } catch {
      // Storage error
    }
  }

  public static getDailyChallenge(): DailyChallenge {
    try {
      const data = localStorage.getItem(DAILY_CHALLENGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }

    const defaultChallenge: DailyChallenge = {
      id: 'daily_' + new Date().toISOString().split('T')[0],
      title: 'Vedic Multiplication Sprint',
      description: 'Score 20 correct answers in Intermediate Multiplication within 60s',
      targetCount: 20,
      currentCount: 0,
      rewardXp: 350,
      isCompleted: false,
      expiresInHours: 24,
      operation: 'multiplication',
      difficulty: 'intermediate',
    };
    return defaultChallenge;
  }

  public static updateDailyChallenge(progressIncrement: number): DailyChallenge {
    const challenge = this.getDailyChallenge();
    if (!challenge.isCompleted) {
      challenge.currentCount = Math.min(challenge.currentCount + progressIncrement, challenge.targetCount);
      if (challenge.currentCount >= challenge.targetCount) {
        challenge.isCompleted = true;
        const profile = this.getProfile();
        profile.xp += challenge.rewardXp;
        this.saveProfile(profile);
      }
      try {
        localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(challenge));
        this.notifyLocalUpdate(DAILY_CHALLENGE_KEY, challenge);
      } catch {
        // Fallback
      }
    }
    return challenge;
  }

  public static async fetchRealtimeLeaderboard(): Promise<LeaderboardEntry[]> {
    const profile = this.getProfile();
    try {
      const remoteEntries = await FirebaseDatabaseService.fetchCloudLeaderboard(profile.id);
      if (remoteEntries.length > 0) {
        localStorage.setItem(CLOUD_LEADERBOARD_CACHE_KEY, JSON.stringify(remoteEntries));
        return remoteEntries;
      }
    } catch (err) {
      console.warn('Realtime leaderboard fetch error:', err);
    }
    return this.getLeaderboard();
  }

  public static getLeaderboard(
    timeframe: 'daily' | 'weekly' | 'season' | 'all-time' = 'daily',
    category: 'overall' | 'speed' | 'accuracy' | 'streak' = 'overall',
    scope: 'global' | 'country' | 'friends' = 'global'
  ): LeaderboardEntry[] {
    const profile = this.getProfile();
    const multiplier = timeframe === 'daily' ? 1 : (timeframe === 'weekly' ? 3.8 : (timeframe === 'season' ? 7.5 : 14));

    // Try reading cached cloud entries
    let cloudEntries: LeaderboardEntry[] = [];
    try {
      const cached = localStorage.getItem(CLOUD_LEADERBOARD_CACHE_KEY);
      if (cached) {
        cloudEntries = JSON.parse(cached);
      }
    } catch {
      // ignore
    }

    // Determine user's League from XP
    const userLeague = FirebaseDatabaseService.getLeagueFromXp(profile.xp);
    const userScore = Math.max(
      Math.round((profile.totalSprintsPlayed * 140 + profile.xp * 0.65) * (multiplier * 0.55)),
      profile.xp > 0 ? profile.xp : (profile.isGuest ? 0 : 250)
    );

    const userEntry: LeaderboardEntry = {
      id: profile.id,
      rank: 1,
      name: (profile.name || 'Math Athlete') + ' (You)',
      avatar: profile.avatar || '⚡',
      score: userScore,
      accuracy: profile.overallAccuracy || 100,
      streak: profile.streakDays || 1,
      xp: profile.xp,
      level: profile.level || 1,
      isCurrentUser: true,
      badge: profile.isPremium ? 'PRO Champion' : `${userLeague} Athlete`,
      countryCode: profile.countryCode || 'GLOBAL',
      countryFlag: '🌐',
      league: userLeague,
      avgReactionMs: profile.fastestAnswerMs > 0 ? profile.fastestAnswerMs : 980,
      bestOperation: profile.preferredOperation || 'Multiplication',
      trend: 'same',
      trendPositions: 0,
      sprintsPlayed: profile.totalSprintsPlayed,
    };

    let list: LeaderboardEntry[] = [];
    if (cloudEntries.length > 0) {
      // Merge user entry with cloud entries
      const filteredCloud = cloudEntries.filter(e => e.id !== profile.id);
      list = [userEntry, ...filteredCloud];
    } else {
      list = [userEntry];
    }

    // Sort according to selected category
    if (category === 'overall') {
      list.sort((a, b) => b.score - a.score);
    } else if (category === 'speed') {
      list.sort((a, b) => (a.avgReactionMs || 9999) - (b.avgReactionMs || 9999));
    } else if (category === 'accuracy') {
      list.sort((a, b) => b.accuracy - a.accuracy || b.score - a.score);
    } else if (category === 'streak') {
      list.sort((a, b) => b.streak - a.streak || b.score - a.score);
    }

    return list.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }
}
