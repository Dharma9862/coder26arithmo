import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { GameSessionResult, LeaderboardEntry, UserProfile } from '../types';

const STORAGE_SUPABASE_URL = 'arithmo_supabase_url';
const STORAGE_SUPABASE_ANON_KEY = 'arithmo_supabase_anon_key';

// Read config from Environment Variables or LocalStorage
const getInitialConfig = () => {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  const envUrl = (metaEnv?.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
  const envKey = (metaEnv?.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';
  
  const customUrl = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_SUPABASE_URL) : null)?.trim() || '';
  const customKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_SUPABASE_ANON_KEY) : null)?.trim() || '';

  const url = customUrl || envUrl;
  const anonKey = customKey || envKey;

  return { url, anonKey };
};

class SupabaseManager {
  private client: SupabaseClient | null = null;
  private url: string = '';
  private anonKey: string = '';

  constructor() {
    const config = getInitialConfig();
    this.url = config.url;
    this.anonKey = config.anonKey;
    this.initClient();
  }

  private initClient() {
    if (this.url && this.anonKey && this.url.startsWith('https://')) {
      try {
        this.client = createClient(this.url, this.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        });
      } catch (err) {
        console.warn('Failed to initialize Supabase client:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  public isConfigured(): boolean {
    return !!this.client;
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  public getConfig(): { url: string; anonKey: string } {
    return { url: this.url, anonKey: this.anonKey };
  }

  public setCustomConfig(url: string, anonKey: string) {
    this.url = url.trim();
    this.anonKey = anonKey.trim();
    if (typeof window !== 'undefined') {
      if (this.url) localStorage.setItem(STORAGE_SUPABASE_URL, this.url);
      else localStorage.removeItem(STORAGE_SUPABASE_URL);

      if (this.anonKey) localStorage.setItem(STORAGE_SUPABASE_ANON_KEY, this.anonKey);
      else localStorage.removeItem(STORAGE_SUPABASE_ANON_KEY);
    }
    this.initClient();
  }

  public getLeagueFromXp(xp: number): string {
    if (xp >= 8000) return 'Grandmaster';
    if (xp >= 6000) return 'Master';
    if (xp >= 4000) return 'Diamond';
    if (xp >= 2500) return 'Platinum';
    if (xp >= 1200) return 'Gold';
    if (xp >= 500) return 'Silver';
    return 'Bronze';
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash;
  }

  /**
   * Listen to Supabase Auth state changes
   */
  public onAuthStateChange(callback: (user: SupabaseUser | null, profile?: Partial<UserProfile>) => void) {
    if (this.client) {
      const { data } = this.client.auth.onAuthStateChange(async (event, session) => {
        const user = session?.user || null;
        if (user) {
          const profile = await this.fetchUserProfile(user.id);
          callback(user, profile || undefined);
        } else {
          callback(null);
        }
      });
      return () => {
        data.subscription.unsubscribe();
      };
    }

    // Unconfigured fallback listener
    return () => {};
  }

  /**
   * Sign Up with Email & Password in Supabase
   */
  public async signUpWithEmail(name: string, email: string, pass: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0] || 'Math Athlete';

    if (this.client) {
      const { data, error } = await this.client.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            display_name: cleanName,
            name: cleanName,
          },
        },
      });

      if (error) {
        throw error;
      }

      const user = data.user;
      const userProfile: UserProfile = {
        id: user ? user.id : 'usr_' + Date.now().toString(36),
        name: cleanName,
        email: cleanEmail,
        avatar: '⚡',
        preferredDifficulty: 'intermediate',
        preferredOperation: 'multiplication',
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        xp: 250,
        level: 1,
        isPremium: false,
        leaderboardRank: 1,
        totalSprintsPlayed: 0,
        totalQuestionsAnswered: 0,
        overallAccuracy: 100,
        fastestAnswerMs: 1050,
        isGuest: false,
        soundEnabled: true,
        hapticsEnabled: true,
        audioFeedbackEnabled: true,
        theme: 'dark',
      };

      if (user) {
        await this.saveUserProfile(userProfile).catch(() => {});
      }

      return userProfile;
    }

    // Local / Offline Athlete Profile Mode
    const localId = 'usr_' + Math.abs(this.hashCode(cleanEmail)).toString(36);
    const athleteProfile: UserProfile = {
      id: localId,
      name: cleanName,
      email: cleanEmail,
      avatar: '⚡',
      preferredDifficulty: 'intermediate',
      preferredOperation: 'multiplication',
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      xp: 250,
      level: 1,
      isPremium: false,
      leaderboardRank: 1,
      totalSprintsPlayed: 0,
      totalQuestionsAnswered: 0,
      overallAccuracy: 100,
      fastestAnswerMs: 1050,
      isGuest: false,
      soundEnabled: true,
      hapticsEnabled: true,
      audioFeedbackEnabled: true,
      theme: 'dark',
    };

    return athleteProfile;
  }

  /**
   * Sign In with Email & Password
   */
  public async signInWithEmail(email: string, pass: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();

    if (this.client) {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        throw error;
      }

      const user = data.user;
      if (!user) {
        throw new Error('User not found');
      }

      const existingProfile = await this.fetchUserProfile(user.id);
      if (existingProfile) {
        return existingProfile;
      }

      const newProfile: UserProfile = {
        id: user.id,
        name: user.user_metadata?.display_name || user.user_metadata?.name || cleanEmail.split('@')[0] || 'Math Athlete',
        email: cleanEmail,
        avatar: '⚡',
        preferredDifficulty: 'intermediate',
        preferredOperation: 'multiplication',
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        xp: 250,
        level: 1,
        isPremium: false,
        leaderboardRank: 1,
        totalSprintsPlayed: 0,
        totalQuestionsAnswered: 0,
        overallAccuracy: 100,
        fastestAnswerMs: 1050,
        isGuest: false,
        soundEnabled: true,
        hapticsEnabled: true,
        audioFeedbackEnabled: true,
        theme: 'dark',
      };

      await this.saveUserProfile(newProfile).catch(() => {});
      return newProfile;
    }

    // Local athlete profile mode
    const localId = 'usr_' + Math.abs(this.hashCode(cleanEmail)).toString(36);
    const athleteName = cleanEmail.includes('@') ? cleanEmail.split('@')[0] : 'Math Athlete';
    return {
      id: localId,
      name: athleteName,
      email: cleanEmail,
      avatar: '⚡',
      preferredDifficulty: 'intermediate',
      preferredOperation: 'multiplication',
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      xp: 250,
      level: 1,
      isPremium: false,
      leaderboardRank: 1,
      totalSprintsPlayed: 0,
      totalQuestionsAnswered: 0,
      overallAccuracy: 100,
      fastestAnswerMs: 1050,
      isGuest: false,
      soundEnabled: true,
      hapticsEnabled: true,
      audioFeedbackEnabled: true,
      theme: 'dark',
    };
  }

  /**
   * 1-Click OAuth Sign In (Google / GitHub)
   */
  public async signInWithOAuth(provider: 'google' | 'github'): Promise<void> {
    if (this.client) {
      const { error } = await this.client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
      return;
    }

    throw new Error('Supabase project URL & Anon Key are required to initiate OAuth. You can configure them or continue with direct Email authentication.');
  }

  /**
   * Reset Password
   */
  public async resetPassword(email: string): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();
    if (this.client) {
      const { error } = await this.client.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      });
      if (error) throw error;
      return;
    }
    // Simulation
    await new Promise((resolve) => setTimeout(resolve, 800));
  }

  /**
   * Sign Out
   */
  public async signOut(): Promise<void> {
    if (this.client) {
      await this.client.auth.signOut().catch(() => {});
    }
  }

  /**
   * Fetch User Profile from Supabase `profiles` table
   */
  public async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    if (!this.client || !userId) return null;

    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        name: data.name || 'Math Athlete',
        email: data.email || '',
        avatar: data.avatar || '⚡',
        preferredDifficulty: data.preferred_difficulty || 'intermediate',
        preferredOperation: data.preferred_operation || 'multiplication',
        streakDays: data.streak_days || 1,
        lastActiveDate: data.last_active_date || new Date().toISOString().split('T')[0],
        xp: data.xp || 0,
        level: data.level || 1,
        isPremium: data.is_premium || false,
        leaderboardRank: data.leaderboard_rank || 1,
        totalSprintsPlayed: data.total_sprints_played || 0,
        totalQuestionsAnswered: data.total_questions_answered || 0,
        overallAccuracy: data.overall_accuracy || 100,
        fastestAnswerMs: data.fastest_answer_ms || 0,
        isGuest: false,
        soundEnabled: data.sound_enabled ?? true,
        hapticsEnabled: data.haptics_enabled ?? true,
        audioFeedbackEnabled: data.audio_feedback_enabled ?? true,
        theme: data.theme || 'dark',
      };
    } catch (err) {
      console.warn('Failed to fetch Supabase user profile:', err);
      return null;
    }
  }

  /**
   * Save User Profile to Supabase `profiles` table
   */
  public async saveUserProfile(profile: UserProfile): Promise<void> {
    if (!this.client || !profile.id || profile.isGuest) return;

    try {
      await this.client
        .from('profiles')
        .upsert({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
          preferred_difficulty: profile.preferredDifficulty,
          preferred_operation: profile.preferredOperation,
          streak_days: profile.streakDays,
          last_active_date: profile.lastActiveDate,
          xp: profile.xp,
          level: profile.level,
          is_premium: profile.isPremium,
          leaderboard_rank: profile.leaderboardRank,
          total_sprints_played: profile.totalSprintsPlayed,
          total_questions_answered: profile.totalQuestionsAnswered,
          overall_accuracy: profile.overallAccuracy,
          fastest_answer_ms: profile.fastestAnswerMs,
          sound_enabled: profile.soundEnabled,
          haptics_enabled: profile.hapticsEnabled,
          audio_feedback_enabled: profile.audioFeedbackEnabled,
          theme: profile.theme,
          updated_at: new Date().toISOString(),
        });
    } catch (err) {
      console.warn('Failed to save user profile to Supabase:', err);
    }
  }

  /**
   * Save Game Session Result to Supabase
   */
  public async saveGameSession(session: GameSessionResult, profile: UserProfile): Promise<void> {
    if (!this.client || !profile.id || profile.isGuest) return;

    try {
      await this.client.from('game_sessions').insert({
        id: session.id,
        user_id: profile.id,
        user_name: profile.name,
        operation: session.operation,
        difficulty: session.difficulty,
        duration: session.duration,
        score: session.score,
        accuracy: session.accuracy,
        total_answered: session.totalAnswered,
        correct_count: session.correctCount,
        wrong_count: session.wrongCount,
        best_time_ms: session.bestTimeMs,
        avg_time_ms: session.avgTimeSpentMs,
        max_combo: session.maxCombo,
        xp_earned: session.xpEarned,
        timestamp: session.timestamp,
      });

      // Also update aggregate profile in background
      await this.saveUserProfile(profile);
    } catch (err) {
      console.warn('Failed to save game session to Supabase:', err);
    }
  }

  /**
   * Fetch Cloud Leaderboard from Supabase
   */
  public async fetchCloudLeaderboard(currentUserId?: string): Promise<LeaderboardEntry[]> {
    if (!this.client) return [];

    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(40);

      if (error || !data) return [];

      return data.map((p, idx) => {
        const userLeague = this.getLeagueFromXp(p.xp || 0);
        return {
          id: p.id,
          rank: idx + 1,
          name: p.name || 'Math Athlete',
          avatar: p.avatar || '⚡',
          score: p.xp || 0,
          accuracy: p.overall_accuracy || 100,
          streak: p.streak_days || 1,
          xp: p.xp || 0,
          level: p.level || 1,
          isCurrentUser: p.id === currentUserId,
          badge: p.is_premium ? 'PRO Champion' : `${userLeague} Athlete`,
          countryCode: 'GLOBAL',
          countryFlag: '🌐',
          league: userLeague as any,
          avgReactionMs: p.fastest_answer_ms || 950,
          bestOperation: p.preferred_operation || 'Multiplication',
          trend: 'same',
          trendPositions: 0,
          sprintsPlayed: p.total_sprints_played || 0,
        };
      });
    } catch (err) {
      console.warn('Failed to fetch cloud leaderboard from Supabase:', err);
      return [];
    }
  }

  /**
   * Bookmarks cloud sync
   */
  public async syncBookmarks(userId: string, bookmarks: string[]): Promise<void> {
    if (!this.client || !userId) return;

    try {
      await this.client.from('user_bookmarks').upsert({
        user_id: userId,
        bookmarks: bookmarks,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Failed to sync bookmarks to Supabase:', err);
    }
  }

  public async fetchBookmarks(userId: string): Promise<string[] | null> {
    if (!this.client || !userId) return null;

    try {
      const { data, error } = await this.client
        .from('user_bookmarks')
        .select('bookmarks')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;
      return data.bookmarks || [];
    } catch (err) {
      console.warn('Failed to fetch bookmarks from Supabase:', err);
      return null;
    }
  }
}

export const SupabaseService = new SupabaseManager();
