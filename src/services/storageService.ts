import { 
  Achievement, 
  AptitudeQuestion, 
  DailyChallenge, 
  GameSessionResult, 
  LeaderboardEntry, 
  UserProfile 
} from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { INITIAL_APTITUDE_QUESTIONS } from '../data/aptitudeQuestions';

const PROFILE_KEY = 'numbersprint_user_profile';
const SESSIONS_KEY = 'numbersprint_game_sessions';
const BOOKMARKS_KEY = 'numbersprint_bookmarks';
const ACHIEVEMENTS_KEY = 'numbersprint_achievements';
const CUSTOM_QUESTIONS_KEY = 'numbersprint_custom_questions';
const DAILY_CHALLENGE_KEY = 'numbersprint_daily_challenge';

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_' + Math.random().toString(36).substring(2, 9),
  name: 'Lala',
  email: 'lala@numbersprint.app',
  avatar: '⚡',
  preferredDifficulty: 'intermediate',
  preferredOperation: 'multiplication',
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  xp: 750,
  level: 4,
  isPremium: false,
  leaderboardRank: 18,
  totalSprintsPlayed: 14,
  totalQuestionsAnswered: 185,
  overallAccuracy: 88,
  fastestAnswerMs: 980,
  isGuest: true,
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'dark',
};

export class StorageService {
  public static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  }

  public static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
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
    // Return sample seeded sessions for rich initial analytics
    return [
      {
        id: 'sess_seed_1',
        operation: 'multiplication',
        difficulty: 'intermediate',
        duration: 60,
        score: 1420,
        correctCount: 22,
        wrongCount: 2,
        totalAnswered: 24,
        accuracy: 92,
        maxCombo: 14,
        avgTimeSpentMs: 2350,
        bestTimeMs: 1100,
        xpEarned: 180,
        timestamp: Date.now() - 86400000 * 2,
        mistakes: [],
      },
      {
        id: 'sess_seed_2',
        operation: 'addition',
        difficulty: 'advanced',
        duration: 30,
        score: 890,
        correctCount: 15,
        wrongCount: 1,
        totalAnswered: 16,
        accuracy: 94,
        maxCombo: 12,
        avgTimeSpentMs: 1820,
        bestTimeMs: 980,
        xpEarned: 120,
        timestamp: Date.now() - 86400000,
        mistakes: [],
      },
      {
        id: 'sess_seed_3',
        operation: 'mixed',
        difficulty: 'intermediate',
        duration: 60,
        score: 1650,
        correctCount: 26,
        wrongCount: 2,
        totalAnswered: 28,
        accuracy: 93,
        maxCombo: 18,
        avgTimeSpentMs: 2050,
        bestTimeMs: 1040,
        xpEarned: 210,
        timestamp: Date.now() - 3600000 * 4,
        mistakes: [],
      },
    ];
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

      // Recalculate average accuracy
      const totalCorrect = sessions.reduce((sum, s) => sum + s.correctCount, 0);
      const totalAns = sessions.reduce((sum, s) => sum + s.totalAnswered, 0);
      profile.overallAccuracy = totalAns > 0 ? Math.round((totalCorrect / totalAns) * 100) : 100;

      this.saveProfile(profile);
      this.evaluateAchievements(session);
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
    return ['num-1', 'pct-1', 'pnl-1'];
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
    } catch {
      // Storage error
    }
    return isBookmarked;
  }

  public static getAllAptitudeQuestions(): AptitudeQuestion[] {
    const initial = [...INITIAL_APTITUDE_QUESTIONS];
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
      currentCount: 8,
      rewardXp: 350,
      isCompleted: false,
      expiresInHours: 14,
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
      } catch {
        // Fallback
      }
    }
    return challenge;
  }

  public static getLeaderboard(
    timeframe: 'daily' | 'weekly' | 'season' | 'all-time' = 'daily',
    category: 'overall' | 'speed' | 'accuracy' | 'streak' = 'overall',
    scope: 'global' | 'country' | 'friends' = 'global'
  ): LeaderboardEntry[] {
    const profile = this.getProfile();
    const multiplier = timeframe === 'daily' ? 1 : (timeframe === 'weekly' ? 3.8 : (timeframe === 'season' ? 7.5 : 14));

    const basePeers: LeaderboardEntry[] = [
      { 
        id: 'p1', 
        rank: 1, 
        name: 'Aarav Sharma', 
        avatar: '⚡', 
        score: Math.round(2840 * multiplier), 
        accuracy: 99, 
        streak: 28, 
        xp: 9450, 
        level: 34, 
        isCurrentUser: false, 
        badge: 'Grandmaster #1', 
        countryCode: 'IN',
        countryFlag: '🇮🇳',
        league: 'Grandmaster',
        avgReactionMs: 780,
        bestOperation: 'Multiplication',
        trend: 'same',
        trendPositions: 0,
        sprintsPlayed: 142
      },
      { 
        id: 'p2', 
        rank: 2, 
        name: 'Elena Rostova', 
        avatar: '🎯', 
        score: Math.round(2620 * multiplier), 
        accuracy: 97, 
        streak: 21, 
        xp: 8120, 
        level: 29, 
        isCurrentUser: false, 
        badge: 'Grandmaster #2', 
        countryCode: 'US',
        countryFlag: '🇺🇸',
        league: 'Grandmaster',
        avgReactionMs: 840,
        bestOperation: 'Vedic Math',
        trend: 'up',
        trendPositions: 1,
        sprintsPlayed: 118
      },
      { 
        id: 'p3', 
        rank: 3, 
        name: 'Kenji Takahashi', 
        avatar: '🌸', 
        score: Math.round(2490 * multiplier), 
        accuracy: 98, 
        streak: 19, 
        xp: 7600, 
        level: 28, 
        isCurrentUser: false, 
        badge: 'Grandmaster #3', 
        countryCode: 'JP',
        countryFlag: '🇯🇵',
        league: 'Grandmaster',
        avgReactionMs: 810,
        bestOperation: 'Percentages',
        trend: 'down',
        trendPositions: 1,
        sprintsPlayed: 105
      },
      { 
        id: 'p4', 
        rank: 4, 
        name: 'Devon Chen', 
        avatar: '🔥', 
        score: Math.round(2380 * multiplier), 
        accuracy: 95, 
        streak: 16, 
        xp: 6890, 
        level: 26, 
        isCurrentUser: false, 
        badge: 'Master Div I', 
        countryCode: 'SG',
        countryFlag: '🇸🇬',
        league: 'Master',
        avgReactionMs: 890,
        bestOperation: 'Addition',
        trend: 'up',
        trendPositions: 2,
        sprintsPlayed: 94
      },
      { 
        id: 'p5', 
        rank: 5, 
        name: 'Priya Patel', 
        avatar: '🌟', 
        score: Math.round(2180 * multiplier), 
        accuracy: 94, 
        streak: 14, 
        xp: 5720, 
        level: 22, 
        isCurrentUser: false,
        badge: 'Master Div II',
        countryCode: 'GB',
        countryFlag: '🇬🇧',
        league: 'Master',
        avgReactionMs: 940,
        bestOperation: 'Division',
        trend: 'up',
        trendPositions: 1,
        sprintsPlayed: 86
      },
      { 
        id: 'p6', 
        rank: 6, 
        name: 'Marcus Vance', 
        avatar: '🚀', 
        score: Math.round(1950 * multiplier), 
        accuracy: 92, 
        streak: 11, 
        xp: 4800, 
        level: 19, 
        isCurrentUser: false,
        badge: 'Diamond Div I',
        countryCode: 'CA',
        countryFlag: '🇨🇦',
        league: 'Diamond',
        avgReactionMs: 1020,
        bestOperation: 'Subtraction',
        trend: 'down',
        trendPositions: 2,
        sprintsPlayed: 72
      },
      { 
        id: 'p7', 
        rank: 7, 
        name: 'Sophia Miller', 
        avatar: '💎', 
        score: Math.round(1790 * multiplier), 
        accuracy: 91, 
        streak: 9, 
        xp: 4100, 
        level: 16, 
        isCurrentUser: false,
        badge: 'Diamond Div II',
        countryCode: 'DE',
        countryFlag: '🇩🇪',
        league: 'Diamond',
        avgReactionMs: 1110,
        bestOperation: 'Multiplication',
        trend: 'same',
        trendPositions: 0,
        sprintsPlayed: 64
      },
      { 
        id: 'p8', 
        rank: 8, 
        name: 'Lucas Silva', 
        avatar: '⚽', 
        score: Math.round(1620 * multiplier), 
        accuracy: 90, 
        streak: 8, 
        xp: 3550, 
        level: 14, 
        isCurrentUser: false,
        badge: 'Platinum Div I',
        countryCode: 'BR',
        countryFlag: '🇧🇷',
        league: 'Platinum',
        avgReactionMs: 1180,
        bestOperation: 'Aptitude Mixed',
        trend: 'up',
        trendPositions: 3,
        sprintsPlayed: 55
      },
      { 
        id: 'p9', 
        rank: 9, 
        name: 'Karthik Raja', 
        avatar: '🏆', 
        score: Math.round(1490 * multiplier), 
        accuracy: 89, 
        streak: 7, 
        xp: 3150, 
        level: 13, 
        isCurrentUser: false,
        badge: 'Platinum Div II',
        countryCode: 'IN',
        countryFlag: '🇮🇳',
        league: 'Platinum',
        avgReactionMs: 1240,
        bestOperation: 'Percentages',
        trend: 'down',
        trendPositions: 1,
        sprintsPlayed: 48
      },
      { 
        id: 'p10', 
        rank: 10, 
        name: 'Hannah Weber', 
        avatar: '🦊', 
        score: Math.round(1350 * multiplier), 
        accuracy: 88, 
        streak: 6, 
        xp: 2750, 
        level: 11, 
        isCurrentUser: false,
        badge: 'Gold Div I',
        countryCode: 'AU',
        countryFlag: '🇦🇺',
        league: 'Gold',
        avgReactionMs: 1320,
        bestOperation: 'Addition',
        trend: 'same',
        trendPositions: 0,
        sprintsPlayed: 42
      },
    ];

    // Determine user's League from XP
    let userLeague: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster' = 'Bronze';
    if (profile.xp >= 8000) userLeague = 'Grandmaster';
    else if (profile.xp >= 6000) userLeague = 'Master';
    else if (profile.xp >= 4000) userLeague = 'Diamond';
    else if (profile.xp >= 2500) userLeague = 'Platinum';
    else if (profile.xp >= 1200) userLeague = 'Gold';
    else if (profile.xp >= 500) userLeague = 'Silver';

    const userEntry: LeaderboardEntry = {
      id: profile.id,
      rank: 11,
      name: profile.name + ' (You)',
      avatar: profile.avatar || '⚡',
      score: Math.max(
        Math.round((profile.totalSprintsPlayed * 140 + profile.xp * 0.65) * (multiplier * 0.55)),
        Math.round(480 * multiplier)
      ),
      accuracy: profile.overallAccuracy || 92,
      streak: profile.streakDays || 1,
      xp: profile.xp,
      level: profile.level,
      isCurrentUser: true,
      badge: profile.isPremium ? 'PRO Champion' : `${userLeague} Sprinter`,
      countryCode: 'GLOBAL',
      countryFlag: '🌐',
      league: userLeague,
      avgReactionMs: profile.fastestAnswerMs > 0 ? Math.round(profile.fastestAnswerMs * 1.15) : 1050,
      bestOperation: 'Multiplication',
      trend: 'up',
      trendPositions: 1,
      sprintsPlayed: profile.totalSprintsPlayed,
    };

    let list = [...basePeers, userEntry];

    // Filter by Scope
    if (scope === 'friends') {
      // Return top 5 peers plus current user as friends circle
      list = [basePeers[0], basePeers[2], basePeers[4], userEntry];
    } else if (scope === 'country') {
      // Filter by user's or selected flag
      list = [basePeers[0], basePeers[4], basePeers[8], userEntry];
    }

    // Sort according to selected category
    if (category === 'overall') {
      list.sort((a, b) => b.score - a.score);
    } else if (category === 'speed') {
      // Fastest reaction time first
      list.sort((a, b) => (a.avgReactionMs || 9999) - (b.avgReactionMs || 9999));
    } else if (category === 'accuracy') {
      list.sort((a, b) => b.accuracy - a.accuracy || b.score - a.score);
    } else if (category === 'streak') {
      list.sort((a, b) => b.streak - a.streak || b.score - a.score);
    }

    return list.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }
}
