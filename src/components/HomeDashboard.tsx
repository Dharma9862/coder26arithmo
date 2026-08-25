import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Flame, 
  Sparkles, 
  Percent, 
  GraduationCap, 
  ArrowLeft,
  Menu,
  ChevronRight,
  BookOpen,
  Trophy,
  Activity,
  CheckCircle2,
  Crown,
  User,
  Plus,
  Minus,
  Divide,
  X as MulIcon,
  HelpCircle,
  RotateCw,
  Award
} from 'lucide-react';
import { DailyChallenge, MathOperation, UserProfile } from '../types';
import { soundService } from '../services/soundService';
import { SideDrawerMenu } from './SideDrawerMenu';
import { AIDailyService, AIDailyTask } from '../services/aiDailyService';
import { getPlanTier, getProductById } from '../services/razorpayService';

interface HomeDashboardProps {
  profile: UserProfile;
  dailyChallenge: DailyChallenge;
  onLaunchSprint: (op: MathOperation) => void;
  onOpenExamPrep: () => void;
  onOpenPremium: () => void;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;
  onRequireAuth?: (reason?: string) => void;
  onOpenRateApp?: () => void;
  onOpenMoreApps?: () => void;
  onBack?: () => void;
  onSelectTab?: (tab: 'sprint' | 'examprep' | 'analytics' | 'leaderboard' | 'bookmarks') => void;
  bookmarkCount?: number;
}

interface PracticeCardItem {
  id: string;
  title: string;
  subtitle: string;
  operation?: MathOperation;
  badge?: string;
  iconType: 'parentheses' | 'sequence' | 'right_wrong' | 'grid' | 'zap' | 'cross' | 'exam' | 'percent' | 'trophy' | 'formula' | 'plus' | 'minus' | 'divide';
  action: 'sprint' | 'examprep' | 'analytics' | 'leaderboard';
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  dailyChallenge,
  onLaunchSprint,
  onOpenExamPrep,
  onOpenPremium,
  onOpenProfile,
  onOpenAuth,
  onRequireAuth,
  onOpenRateApp,
  onOpenMoreApps,
  onBack,
  onSelectTab,
  bookmarkCount = 0,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('advance');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [aiTasks, setAiTasks] = useState<AIDailyTask[]>([]);
  const [isLoadingAiTasks, setIsLoadingAiTasks] = useState<boolean>(false);
  const [claimedTasks, setClaimedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    AIDailyService.getTodayTasks().then((tasks) => {
      setAiTasks(tasks);
    });
  }, []);

  const handleRefreshAiTasks = async () => {
    soundService.triggerHaptic('medium');
    soundService.playClick();
    setIsLoadingAiTasks(true);
    const today = new Date().toISOString().split('T')[0];
    const tasks = await AIDailyService.fetchOrGenerateTasks(today, true);
    setAiTasks(tasks);
    setIsLoadingAiTasks(false);
  };

  const categories = [
    { id: 'advance', label: 'Advance calculation Practice' },
    { id: 'ranking', label: '🏆 Live Rankings & Leagues' },
    { id: 'multiplication', label: 'Multiplication (1,000+ Qs)' },
    { id: 'addition', label: 'Addition (1,000+ Qs)' },
    { id: 'subtraction', label: 'Subtraction (1,000+ Qs)' },
    { id: 'division', label: 'Division (1,000+ Qs)' },
    { id: 'puzzle', label: 'Math Puzzles (1,000+ Qs)' },
    { id: 'linear', label: 'Linear Sequence' },
    { id: 'right_wrong', label: 'Right or Wrong' },
    { id: 'sprints', label: 'Speed Sprints' },
    { id: 'exam', label: 'Aptitude Exam Prep (2,000+ Qs)' },
  ];

  // Dynamic practice cards mapped to selected category
  const getCardsForCategory = (catId: string): PracticeCardItem[] => {
    switch (catId) {
      case 'multiplication':
        return [
          {
            id: 'mul-vedic-crisscross',
            title: 'Vedic 2-Digit Criss-Cross',
            subtitle: 'Urdhva Tiryagbhyam: 2x2 & 3x2 multiplication in <5s',
            operation: 'multiplication',
            iconType: 'cross',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'mul-base-100',
            title: 'Base 100 & 1000 Vedic Multiplication',
            subtitle: 'Near-base speed technique for numbers like 96×94 & 104×108',
            operation: 'multiplication',
            iconType: 'cross',
            action: 'sprint',
            badge: 'Vedic',
          },
          {
            id: 'mul-squares-5',
            title: 'Squares of Numbers Ending in 5',
            subtitle: 'Ekadhikena Purvena: Instant squares in 2 seconds',
            operation: 'multiplication',
            iconType: 'percent',
            action: 'sprint',
            badge: 'Speed',
          },
          {
            id: 'mul-table-sprint',
            title: 'Tables 12-99 Rapid Fire',
            subtitle: 'Randomized 1,000+ procedural speed multiplication drills',
            operation: 'multiplication',
            iconType: 'zap',
            action: 'sprint',
            badge: 'Drill',
          },
        ];

      case 'addition':
        return [
          {
            id: 'add-carryover-surge',
            title: 'Carryover Sprint Addition',
            subtitle: 'Multi-digit mental addition from left to right',
            operation: 'addition',
            iconType: 'plus',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'add-3-term-chain',
            title: '3-Term Rapid Addition',
            subtitle: 'Continuous addition chains for instant reflexes',
            operation: 'addition',
            iconType: 'plus',
            action: 'sprint',
            badge: 'Chain',
          },
          {
            id: 'add-decimal-sprint',
            title: 'Decimal Addition Drills',
            subtitle: 'Rapid fractional and decimal estimations',
            operation: 'addition',
            iconType: 'plus',
            action: 'sprint',
            badge: 'Decimals',
          },
          {
            id: 'add-nikhilam-base',
            title: 'Vedic Nikhilam Addition',
            subtitle: 'Adding numbers close to base 100, 200, 500',
            operation: 'addition',
            iconType: 'zap',
            action: 'sprint',
            badge: 'Vedic',
          },
        ];

      case 'subtraction':
        return [
          {
            id: 'sub-allfrom9',
            title: 'All from 9 and Last from 10',
            subtitle: 'Vedic subtraction from 1000, 10000 with zero borrows',
            operation: 'subtraction',
            iconType: 'minus',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'sub-borrowing-speed',
            title: 'Multi-Digit Speed Subtraction',
            subtitle: 'High-speed borrow visualization under 2s',
            operation: 'subtraction',
            iconType: 'minus',
            action: 'sprint',
            badge: 'Speed',
          },
          {
            id: 'sub-3-term-chain',
            title: '3-Term Subtraction Chain',
            subtitle: 'Consecutive deductions and budget simulations',
            operation: 'subtraction',
            iconType: 'minus',
            action: 'sprint',
            badge: 'Chain',
          },
          {
            id: 'sub-complement-blitz',
            title: 'Tens Complement Blitz',
            subtitle: 'Subtractions using base complements',
            operation: 'subtraction',
            iconType: 'zap',
            action: 'sprint',
            badge: 'Complement',
          },
        ];

      case 'division':
        return [
          {
            id: 'div-clean-sprint',
            title: 'Clean Speed Division',
            subtitle: '1,000+ rapid quotient recognition problems',
            operation: 'division',
            iconType: 'divide',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'div-remainder-challenge',
            title: 'Modulo & Remainder Challenge',
            subtitle: 'Instant mental remainder determination',
            operation: 'division',
            iconType: 'divide',
            action: 'sprint',
            badge: 'Remainder',
          },
          {
            id: 'div-shortcut-25',
            title: 'Division by 5, 25 & 125',
            subtitle: 'Multiply by reciprocal powers of 2 & shift decimals',
            operation: 'division',
            iconType: 'divide',
            action: 'sprint',
            badge: 'Shortcut',
          },
          {
            id: 'div-simplification-drill',
            title: 'Fractional Simplification',
            subtitle: 'Canceling common factors in high-yield fractions',
            operation: 'division',
            iconType: 'zap',
            action: 'sprint',
            badge: 'Fraction',
          },
        ];

      case 'linear':
        return [
          {
            id: 'linear-seq-core',
            title: 'Linear Sequence Drill',
            subtitle: 'Determine arithmetic step & predict next term',
            operation: 'linear_sequence',
            iconType: 'sequence',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'linear-seq-delta',
            title: 'Variable Step Progression',
            subtitle: 'Increasing & alternating deltas (+2, +4, +8)',
            operation: 'linear_sequence',
            iconType: 'sequence',
            action: 'sprint',
            badge: 'Speed',
          },
          {
            id: 'linear-seq-adv',
            title: 'Advance Bracket Sequence',
            subtitle: 'Nested equations & sequence operations',
            operation: 'advance_calc',
            iconType: 'parentheses',
            action: 'sprint',
          },
          {
            id: 'linear-exam-prep',
            title: 'Quantitative Number Series',
            subtitle: 'SBI PO & SSC CGL exam series pack',
            iconType: 'exam',
            action: 'examprep',
            badge: 'Mains',
          },
        ];

      case 'right_wrong':
        return [
          {
            id: 'rw-rapid-check',
            title: 'Right or Wrong (Speed Check)',
            subtitle: 'Instant mental verification in <1.5s',
            operation: 'right_or_wrong',
            iconType: 'right_wrong',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'rw-inequality',
            title: 'Equation Verifier',
            subtitle: 'Multi-operator arithmetic true/false',
            operation: 'right_or_wrong',
            iconType: 'right_wrong',
            action: 'sprint',
          },
          {
            id: 'rw-adv-bracket',
            title: 'Advance Equation Verifier',
            subtitle: 'BODMAS priority check ( )',
            operation: 'advance_calc',
            iconType: 'parentheses',
            action: 'sprint',
          },
          {
            id: 'rw-exam-ds',
            title: 'Data Sufficiency Logic',
            subtitle: 'Verifying statement accuracy for exams',
            iconType: 'exam',
            action: 'examprep',
            badge: 'Exam',
          },
        ];

      case 'puzzle':
        return [
          {
            id: 'puzzle-matrix',
            title: 'Math Puzzle Grid & Matrix',
            subtitle: 'Missing operator and grid arithmetic',
            operation: 'math_puzzle',
            iconType: 'grid',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'puzzle-missing-div',
            title: 'Missing Divisor & Factor Puzzle',
            subtitle: 'Solve (? ÷ B) + C = Total under pressure',
            operation: 'math_puzzle',
            iconType: 'grid',
            action: 'sprint',
            badge: 'Puzzle',
          },
          {
            id: 'puzzle-bracket',
            title: 'Advance Equation Puzzle',
            subtitle: 'Find missing numbers in bracketed expressions',
            operation: 'advance_calc',
            iconType: 'parentheses',
            action: 'sprint',
          },
          {
            id: 'puzzle-exam-di',
            title: 'Data Interpretation Puzzles',
            subtitle: 'Charts, tables & numerical riddles for Mains',
            iconType: 'exam',
            action: 'examprep',
            badge: 'Mains',
          },
        ];

      case 'sprints':
        return [
          {
            id: 'sprint-mixed-blitz',
            title: 'Speed Sprint (Mixed Blitz)',
            subtitle: '60-Second adaptive speed math challenge',
            operation: 'mixed',
            iconType: 'zap',
            action: 'sprint',
            badge: 'Top Pick',
          },
          {
            id: 'sprint-multiplication',
            title: 'Multiplication Masters',
            subtitle: 'Tables 12-99 & Vedic shortcuts',
            operation: 'multiplication',
            iconType: 'cross',
            action: 'sprint',
          },
          {
            id: 'sprint-squares',
            title: 'Squares & Percentages',
            subtitle: 'Rapid roots, ratios & quick estimation',
            operation: 'percentages',
            iconType: 'percent',
            action: 'sprint',
          },
          {
            id: 'sprint-adv-calc',
            title: 'Advance Calculation',
            subtitle: 'Nested parentheses and multi-tier math',
            operation: 'advance_calc',
            iconType: 'parentheses',
            action: 'sprint',
          },
        ];

      case 'exam':
        return [
          {
            id: 'exam-prelims-bank',
            title: 'Prelims Question Bank (1,000+ Qs)',
            subtitle: 'Speed-focused 30-45s solving shortcuts across 20 topics',
            iconType: 'exam',
            action: 'examprep',
            badge: '1,000 Prelims',
          },
          {
            id: 'exam-mains-bank',
            title: 'Mains Question Bank (1,000+ Qs)',
            subtitle: 'Multi-step caselets, DI, and advanced quantitative problems',
            iconType: 'exam',
            action: 'examprep',
            badge: '1,000 Mains',
          },
          {
            id: 'exam-20-topics',
            title: 'All 20 Quantitative Syllabus Topics',
            subtitle: 'CAT, SBI PO, SSC CGL & Placement Modules (2,000+ Total)',
            iconType: 'exam',
            action: 'examprep',
            badge: 'Complete',
          },
          {
            id: 'exam-formulas',
            title: 'Topic Formula Cheatsheets',
            subtitle: 'Key shortcuts, identities & theory summaries',
            iconType: 'formula',
            action: 'examprep',
          },
        ];

      case 'ranking':
        return [
          {
            id: 'rank-grandmaster-league',
            title: 'Grandmaster Daily League',
            subtitle: 'Global real-time competitive leaderboard with rival challenges',
            iconType: 'trophy',
            action: 'leaderboard',
            badge: '👑 Tier 1',
          },
          {
            id: 'rank-national-ranking',
            title: 'National & Regional Leaderboards',
            subtitle: 'Compete against math sprinters and exam aspirants in your country',
            iconType: 'trophy',
            action: 'leaderboard',
            badge: '🇮🇳 National',
          },
          {
            id: 'rank-sprint-masters',
            title: 'Speed Sprint Accuracy Rankings',
            subtitle: 'Top 100 fastest reaction times & highest accuracy streaks',
            iconType: 'zap',
            action: 'leaderboard',
            badge: '⚡ Speed',
          },
        ];

      case 'advance':
      default:
        return [
          {
            id: 'card-advance-calculation',
            title: 'Advance Calculation',
            subtitle: 'Nested brackets, exponents & multi-tier math',
            operation: 'advance_calc',
            iconType: 'parentheses',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'card-math-puzzle',
            title: 'Math puzzle',
            subtitle: '1,000+ Procedural missing number & matrix riddles',
            operation: 'math_puzzle',
            iconType: 'grid',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'card-multiplication',
            title: 'Multiplication (1,000+ Qs)',
            subtitle: 'Vedic criss-cross, near-base & rapid tables',
            operation: 'multiplication',
            iconType: 'cross',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'card-addition',
            title: 'Addition (1,000+ Qs)',
            subtitle: 'Carryover surges, 3-term chains & decimal drills',
            operation: 'addition',
            iconType: 'plus',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'card-subtraction',
            title: 'Subtraction (1,000+ Qs)',
            subtitle: 'All from 9 last from 10 & borrow sprints',
            operation: 'subtraction',
            iconType: 'minus',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'card-division',
            title: 'Division (1,000+ Qs)',
            subtitle: 'Clean division, remainders & fraction shortcuts',
            operation: 'division',
            iconType: 'divide',
            action: 'sprint',
            badge: '1,000+ Qs',
          },
          {
            id: 'card-competitive-rankings',
            title: 'Competitive Rankings & Leagues',
            subtitle: 'Global, National & Daily Grandmaster leaderboards',
            iconType: 'trophy',
            action: 'leaderboard',
            badge: '🏆 Live Rank',
          },
          {
            id: 'card-exam-prep',
            title: 'Quantitative Exam Prep (2,000+ Qs)',
            subtitle: '1,000 Prelims + 1,000 Mains across 20 high-yield topics',
            iconType: 'exam',
            action: 'examprep',
            badge: '2,000+ Total',
          },
          {
            id: 'card-linear-sequence',
            title: 'Linear Sequence',
            subtitle: 'AP, GP, squared and delta progression patterns',
            operation: 'linear_sequence',
            iconType: 'sequence',
            action: 'sprint',
          },
        ];
    }
  };

  const handleCardClick = (card: PracticeCardItem) => {
    soundService.triggerHaptic('medium');
    soundService.playClick();

    if (profile.isGuest) {
      soundService.playWrong();
      if (onRequireAuth) {
        onRequireAuth('Please sign in or create an account to start calculations and drills.');
      } else if (onOpenAuth) {
        onOpenAuth();
      }
      return;
    }

    if (card.action === 'sprint' && card.operation) {
      onLaunchSprint(card.operation);
    } else if (card.action === 'examprep') {
      onOpenExamPrep();
    } else if (card.action === 'analytics') {
      if (onSelectTab) onSelectTab('analytics');
    } else if (card.action === 'leaderboard') {
      if (onSelectTab) onSelectTab('leaderboard');
    }
  };

  const handleBackClick = () => {
    soundService.triggerHaptic('light');
    soundService.playClick();
    if (selectedCategory !== 'advance') {
      setSelectedCategory('advance');
    } else if (onBack) {
      onBack();
    }
  };

  const renderCardIcon = (iconType: PracticeCardItem['iconType']) => {
    switch (iconType) {
      case 'parentheses':
        return (
          <div className="flex items-center justify-center font-mono text-2xl sm:text-3xl font-extrabold text-white select-none">
            <span className="opacity-90">(</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white mx-0.5" />
            <span className="opacity-90">)</span>
          </div>
        );
      case 'sequence':
        return (
          <div className="flex items-center justify-center gap-1 text-white select-none">
            <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 border-2 border-white rounded-[2px]" />
            <div className="w-1 h-[2px] bg-white" />
            <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 border-2 border-white rounded-[2px]" />
          </div>
        );
      case 'right_wrong':
        return (
          <div className="flex flex-col items-center justify-center text-white select-none">
            <span className="text-base sm:text-lg font-bold leading-none">✓</span>
            <span className="text-xs sm:text-sm font-bold leading-none -mt-0.5 font-mono">✕</span>
          </div>
        );
      case 'grid':
        return (
          <div className="w-5 sm:w-6 h-5 sm:h-6 border-2 border-white rounded-[4px] grid grid-cols-2 grid-rows-2 p-0.5 gap-0.5">
            <div className="border border-white/80 rounded-[1px]" />
            <div className="border border-white/80 rounded-[1px]" />
            <div className="border border-white/80 rounded-[1px]" />
            <div className="border border-white/80 rounded-[1px]" />
          </div>
        );
      case 'plus':
        return <Plus className="w-6 sm:w-7 h-6 sm:h-7 text-white stroke-[3]" />;
      case 'minus':
        return <Minus className="w-6 sm:w-7 h-6 sm:h-7 text-white stroke-[3]" />;
      case 'divide':
        return <Divide className="w-6 sm:w-7 h-6 sm:h-7 text-white stroke-[3]" />;
      case 'zap':
        return <Zap className="w-6 sm:w-7 h-6 sm:h-7 text-white fill-white" />;
      case 'cross':
        return <span className="text-2xl sm:text-3xl font-black text-white font-mono-math">×</span>;
      case 'exam':
        return <GraduationCap className="w-6 sm:w-7 h-6 sm:h-7 text-white" />;
      case 'percent':
        return <Percent className="w-5 sm:w-6 h-5 sm:h-6 text-white stroke-[2.5]" />;
      case 'trophy':
        return <Trophy className="w-6 sm:w-7 h-6 sm:h-7 text-white" />;
      case 'formula':
        return <BookOpen className="w-6 sm:w-7 h-6 sm:h-7 text-white" />;
      default:
        return <Zap className="w-6 sm:w-7 h-6 sm:h-7 text-white fill-white" />;
    }
  };

  const activeCards = getCardsForCategory(selectedCategory);

  return (
    <div className="w-full min-h-screen bg-[#38B6DB] flex flex-col justify-start selection:bg-blue-600 selection:text-white">
      
      {/* Side Drawer Menu Modal */}
      <SideDrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        profile={profile}
        onSelectTab={(tab) => {
          if (onSelectTab) onSelectTab(tab);
          else if (tab === 'examprep') onOpenExamPrep();
        }}
        onLaunchOperation={onLaunchSprint}
        onOpenProfile={() => {
          if (onOpenProfile) onOpenProfile();
        }}
        onOpenPremium={onOpenPremium}
        onOpenAuth={onOpenAuth}
        onOpenRateApp={onOpenRateApp}
        onOpenMoreApps={onOpenMoreApps}
        bookmarkCount={bookmarkCount}
      />

      {/* Top Cyan Header Area */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-6 space-y-4">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Left Side: App Brand Icon & Streak Badge */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-xs">
              <Zap className="w-5 h-5 fill-white stroke-white" />
            </div>

            <div className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md rounded-full text-[#113876] font-extrabold text-xs sm:text-sm shadow-xs">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#ea580c] text-[#ea580c]" />
              <span>{profile.streakDays} Day Streak</span>
            </div>
          </div>

          {/* Right Side: Upgrade Badge Button & User Toggle Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {!profile.isPremium ? (
              <button
                id="header-upgrade-btn"
                onClick={() => {
                  soundService.triggerHaptic('medium');
                  soundService.playClick();
                  onOpenPremium();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                title="Upgrade to PRO"
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950 stroke-slate-950" />
                <span>Upgrade</span>
              </button>
            ) : getPlanTier(profile.purchasedProductId || 'pro_supporter') < 4 ? (
              <button
                id="header-upgrade-plan-btn"
                onClick={() => {
                  soundService.triggerHaptic('medium');
                  soundService.playClick();
                  onOpenPremium();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                title="Upgrade to Bigger Plan"
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950 stroke-slate-950" />
                <span>Upgrade Plan</span>
              </button>
            ) : (
              <div 
                onClick={() => {
                  soundService.playClick();
                  onOpenPremium();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-[#113876] backdrop-blur-md text-xs font-black uppercase tracking-wider shadow-xs cursor-pointer active:scale-95 transition-all"
                title="View VIP Super Patron Status"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>Super Patron</span>
              </div>
            )}

            <button
              id="header-user-toggle-btn"
              onClick={() => {
                soundService.triggerHaptic('medium');
                soundService.playClick();
                setIsDrawerOpen(true);
              }}
              className="flex items-center gap-1.5 p-1 sm:p-1.5 pl-2 pr-2.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white backdrop-blur-md transition-all shadow-xs cursor-pointer"
              title="Toggle Profile, Settings & Menu"
            >
              <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold text-[#113876]">
                {profile.avatar || <User className="w-3.5 h-3.5 text-[#113876]" />}
              </div>
              <Menu className="w-4 h-4 stroke-[2.5] text-white" />
            </button>
          </div>
        </div>

        {/* User Greeting */}
        <div className="space-y-0.5 sm:space-y-1 pt-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15469e] tracking-tight">
            Hi {profile.name || 'Lala'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#184d9f]/90">
            Welcome back to Mind calculation • 1,000+ Daily Unique AI Quests & Drills
          </p>
        </div>

        {/* Guest Lock Banner */}
        {profile.isGuest && (
          <div className="p-3 bg-amber-400/25 backdrop-blur-md rounded-2xl border border-amber-300/40 flex items-center justify-between gap-2 text-[#113876] shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm shrink-0">🔒</span>
              <span className="text-xs font-black truncate">Sign in to unlock calculations & streaks</span>
            </div>
            <button
              onClick={() => {
                soundService.playClick();
                if (onRequireAuth) onRequireAuth('Sign in or create an account to start speed drills.');
                else if (onOpenAuth) onOpenAuth();
              }}
              className="px-2.5 py-1 bg-[#15469e] hover:bg-[#113876] text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-md shrink-0 active:scale-95 transition-all"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Carousel / Tab Pill Bar */}
        <div className="pt-2 pb-1 flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundService.triggerHaptic('light');
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-md shrink-0 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#1b4cb3] text-white shadow-[#1b4cb3]/30 scale-[1.02]'
                    : 'bg-[#2563eb]/80 hover:bg-[#1d4ed8] text-white/90'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </header>

      {/* Sweeping Curved White Sheet Container */}
      <div className="flex-1 w-full bg-white rounded-t-[32px] sm:rounded-t-[44px] shadow-2xl px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-32">
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Section Heading */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#15469e] tracking-tight">
              {categories.find(c => c.id === selectedCategory)?.label || 'Advance calculation Practice'}
            </h2>
            <span className="text-xs sm:text-sm font-bold text-slate-400">
              Adaptive Level {profile.level}
            </span>
          </div>

          {/* Cards List in responsive 1-col on mobile / 2-col on tablet & desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4.5">
            {activeCards.map((card) => (
              <div
                key={card.id}
                id={`card-${card.id}`}
                onClick={() => handleCardClick(card)}
                className="w-full bg-[#1d5ce5] hover:bg-[#1853d6] text-white p-4.5 sm:p-6 rounded-[22px] shadow-lg shadow-blue-500/20 flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer group"
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">
                      {card.title}
                    </h3>
                    {card.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                        {card.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                    {card.subtitle}
                  </p>
                </div>

                {/* Card Graphic / Icon Container */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {renderCardIcon(card.iconType)}
                </div>
              </div>
            ))}
          </div>

          {/* AI-Powered Unique Daily Tasks & Challenges Section */}
          <div className="mt-6 p-4 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                      AI Daily Unique Quests
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider border border-emerald-500/30">
                      Updated Daily
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    AI-curated quantitative targets with Vedic shortcuts & bonus XP
                  </p>
                </div>
              </div>

              <button
                id="refresh-ai-tasks-btn"
                onClick={handleRefreshAiTasks}
                disabled={isLoadingAiTasks}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-sky-400 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoadingAiTasks ? 'animate-spin' : ''}`} />
                <span>{isLoadingAiTasks ? 'Generating...' : 'Regenerate Quests'}</span>
              </button>
            </div>

            {/* Task Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiTasks.map((task) => {
                const progressPct = Math.min(100, Math.round((task.currentCount / task.targetCount) * 100));
                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-3 hover:border-slate-600 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] font-black uppercase tracking-wider text-sky-400 border border-slate-700">
                          {task.category || 'Speed Math'}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                          <Award className="w-3 h-3" /> +{task.rewardXp} XP
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {task.description}
                      </p>

                      {task.vedicTip && (
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] text-amber-300/90 font-mono-math">
                          💡 {task.vedicTip}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-1 border-t border-slate-700/60">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>Progress: {task.currentCount}/{task.targetCount}</span>
                        <span>{progressPct}%</span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>

                      <button
                        onClick={() => {
                          soundService.triggerHaptic('medium');
                          soundService.playClick();
                          if (task.category === 'Exam Prelims' || task.category === 'Exam Mains') {
                            onOpenExamPrep();
                          } else {
                            onLaunchSprint(task.operation || 'multiplication');
                          }
                        }}
                        className={`w-full py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          task.isCompleted
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                        }`}
                      >
                        {task.isCompleted ? '✓ Completed' : 'Start Task'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
