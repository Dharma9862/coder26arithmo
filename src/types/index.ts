export type MathOperation = 
  | 'advance_calc'
  | 'linear_sequence'
  | 'right_or_wrong'
  | 'math_puzzle'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'mixed'
  | 'powers_roots'
  | 'percentages';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type GameDuration = 30 | 60 | 120 | 0; // 0 represents untimed practice

export interface MathQuestion {
  id: string;
  displayExpression: string;
  operand1: number;
  operand2: number;
  operator: string;
  correctAnswer: number;
  options: number[];
  userAnswer?: number;
  isCorrect?: boolean;
  timeSpentMs?: number;
  difficulty: DifficultyLevel;
}

export interface GameSessionResult {
  id: string;
  operation: MathOperation;
  difficulty: DifficultyLevel;
  duration: GameDuration;
  score: number;
  correctCount: number;
  wrongCount: number;
  totalAnswered: number;
  accuracy: number;
  maxCombo: number;
  avgTimeSpentMs: number;
  bestTimeMs: number;
  xpEarned: number;
  timestamp: number;
  mistakes: MathQuestion[];
  isNewPersonalBest?: boolean;
}

export interface AptitudeCategory {
  id: string;
  name: string;
  shortName: string;
  iconName: string;
  description: string;
  color: string;
  subtopics: string[];
  totalQuestions: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export type ExamLevel = 'Prelims' | 'Mains';

export interface AptitudeQuestion {
  id: string;
  categoryId: string;
  categoryName: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  examLevel?: ExamLevel;
  subtopic?: string;
  examTags: string[];
  formulaShortcut?: string;
  imageUrl?: string;
  isBookmarked?: boolean;
  userAttempt?: {
    selectedOption: number;
    isCorrect: boolean;
    timestamp: number;
  };
}

export interface TopicConceptGuide {
  categoryId: string;
  topicName: string;
  overview: string;
  deepExplanation?: string;
  fundamentalConcepts?: Array<{
    title: string;
    explanation: string;
    examTakeaway?: string;
  }>;
  keyFormulas: Array<{
    name: string;
    formula: string;
    description: string;
    example?: string;
  }>;
  vedicShortcuts: Array<{
    title: string;
    technique: string;
    speedAdvantage: string;
  }>;
  commonTraps: string[];
  examTrends: {
    prelimsWeightage: string;
    mainsWeightage: string;
    recommendedTimePerQuestion: string;
    targetExams?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  preferredDifficulty: DifficultyLevel;
  preferredOperation: MathOperation;
  streakDays: number;
  lastActiveDate: string;
  xp: number;
  level: number;
  isPremium: boolean;
  subscriptionPlan?: 'monthly' | 'yearly';
  purchasedProductId?: string;
  subscriptionExpiresAt?: string;
  leaderboardRank: number;
  totalSprintsPlayed: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
  fastestAnswerMs: number;
  isGuest: boolean;
  authProvider?: 'google' | 'email' | 'otp' | 'guest';
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  countryCode?: string;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  audioFeedbackEnabled: boolean;
  theme: 'dark' | 'light';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'streak' | 'exam' | 'mastery';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export type LeagueTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster';
export type LeaderboardCategory = 'overall' | 'speed' | 'accuracy' | 'streak';
export type LeaderboardTimeframe = 'daily' | 'weekly' | 'season' | 'all-time';
export type LeaderboardScope = 'global' | 'country' | 'friends';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  score: number;
  accuracy: number;
  streak: number;
  xp: number;
  level: number;
  isCurrentUser: boolean;
  badge?: string;
  countryCode?: string;
  countryFlag?: string;
  league?: LeagueTier;
  avgReactionMs?: number;
  bestOperation?: string;
  trend?: 'up' | 'down' | 'same';
  trendPositions?: number;
  sprintsPlayed?: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  isCompleted: boolean;
  expiresInHours: number;
  operation: MathOperation;
  difficulty: DifficultyLevel;
}

export interface ImportedQuestionDraft {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string | number;
  correctAnswerIndex: number;
  explanation: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  imageUrl?: string;
  errors: string[];
  isValid: boolean;
}

export interface AdStatus {
  bannerVisible: boolean;
  interstitialPending: boolean;
  rewardedAvailable: boolean;
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile' | 'auto';
export type DeviceOrientation = 'portrait' | 'landscape';
export type DevicePreset = 'iphone' | 'galaxy' | 'pixel' | 'ipad' | 'ipad_mini' | 'laptop' | 'responsive';

export interface DeviceConfig {
  mode: DeviceMode;
  orientation: DeviceOrientation;
  scale: number;
  showBezel: boolean;
  preset: DevicePreset;
  autoDetected?: boolean;
}
