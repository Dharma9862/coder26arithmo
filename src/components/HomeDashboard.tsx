import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  Settings, 
  Sparkles, 
  Percent, 
  GraduationCap, 
  ArrowLeft,
  Menu,
  ChevronRight,
  BookOpen,
  Trophy,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { DailyChallenge, MathOperation, UserProfile } from '../types';
import { soundService } from '../services/soundService';
import { SideDrawerMenu } from './SideDrawerMenu';

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
  iconType: 'parentheses' | 'sequence' | 'right_wrong' | 'grid' | 'zap' | 'cross' | 'exam' | 'percent' | 'trophy' | 'formula';
  action: 'sprint' | 'examprep' | 'analytics';
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

  const categories = [
    { id: 'advance', label: 'Advance calculation Practice' },
    { id: 'linear', label: 'Linear Sequence' },
    { id: 'right_wrong', label: 'Right or Wrong' },
    { id: 'puzzle', label: 'Math puzzle' },
    { id: 'sprints', label: 'Speed Sprints' },
    { id: 'exam', label: 'Aptitude Exam Prep' },
  ];

  // Dynamic practice cards mapped to selected category
  const getCardsForCategory = (catId: string): PracticeCardItem[] => {
    switch (catId) {
      case 'linear':
        return [
          {
            id: 'linear-seq-core',
            title: 'Linear Sequence Drill',
            subtitle: 'Determine arithmetic step & predict next term',
            operation: 'linear_sequence',
            iconType: 'sequence',
            action: 'sprint',
            badge: 'Pattern',
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
            badge: 'Fast',
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
            title: 'Math puzzle Grid',
            subtitle: 'Missing operator and grid arithmetic',
            operation: 'math_puzzle',
            iconType: 'grid',
            action: 'sprint',
            badge: 'Brain',
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
            id: 'puzzle-pattern',
            title: 'Sequence Matrix Riddle',
            subtitle: 'Solve 2x2 grid patterns & series',
            operation: 'linear_sequence',
            iconType: 'sequence',
            action: 'sprint',
          },
          {
            id: 'puzzle-exam-di',
            title: 'Data Interpretation Puzzles',
            subtitle: 'Charts, tables & numerical riddles',
            iconType: 'exam',
            action: 'examprep',
            badge: 'High Yield',
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
            id: 'exam-20-topics',
            title: '20 Quantitative Exam Topics',
            subtitle: 'CAT, SBI PO, SSC CGL & Placement Modules',
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
          {
            id: 'exam-speed-math',
            title: 'Exam Mental Speed Sprint',
            subtitle: 'Rapid arithmetic estimation for Mains',
            operation: 'advance_calc',
            iconType: 'parentheses',
            action: 'sprint',
          },
          {
            id: 'exam-series',
            title: 'Number Series & Inequalities',
            subtitle: 'Bank PO prelims patterns & shortcuts',
            operation: 'linear_sequence',
            iconType: 'sequence',
            action: 'sprint',
          },
        ];

      case 'advance':
      default:
        return [
          {
            id: 'card-advance-calculation',
            title: 'Advance Calculation',
            subtitle: "You haven't tried this",
            operation: 'advance_calc',
            iconType: 'parentheses',
            action: 'sprint',
          },
          {
            id: 'card-linear-sequence',
            title: 'Linear Sequence',
            subtitle: "You haven't tried this",
            operation: 'linear_sequence',
            iconType: 'sequence',
            action: 'sprint',
          },
          {
            id: 'card-right-or-wrong',
            title: 'Right or Wrong',
            subtitle: "You haven't tried this",
            operation: 'right_or_wrong',
            iconType: 'right_wrong',
            action: 'sprint',
          },
          {
            id: 'card-math-puzzle',
            title: 'Math puzzle',
            subtitle: "You haven't tried this",
            operation: 'math_puzzle',
            iconType: 'grid',
            action: 'sprint',
          },
          {
            id: 'card-speed-sprint-mixed',
            title: 'Speed Sprint (Mixed Blitz)',
            subtitle: '60-Second adaptive speed math challenge',
            operation: 'mixed',
            iconType: 'zap',
            action: 'sprint',
          },
          {
            id: 'card-multiplication',
            title: 'Multiplication Masters',
            subtitle: 'Tables 12-99 & Vedic shortcuts',
            operation: 'multiplication',
            iconType: 'cross',
            action: 'sprint',
          },
          {
            id: 'card-exam-prep',
            title: 'Quantitative Exam Prep',
            subtitle: '20 High-Yield Packs for CAT, SBI PO, SSC CGL',
            iconType: 'exam',
            action: 'examprep',
          },
          {
            id: 'card-squares-percentages',
            title: 'Squares & Percentages',
            subtitle: 'Rapid roots, ratios & quick estimation',
            operation: 'percentages',
            iconType: 'percent',
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
    } else if (card.action === 'analytics' && onSelectTab) {
      onSelectTab('analytics');
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

  const renderCardIcon = (type: PracticeCardItem['iconType']) => {
    switch (type) {
      case 'parentheses':
        return (
          <span className="text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-widest select-none">
            ( )
          </span>
        );
      case 'sequence':
        return (
          <div className="flex items-center gap-1 text-white">
            <div className="w-3 sm:w-3.5 h-3 sm:h-3.5 border-2 border-white rounded-[2px]" />
            <div className="w-1 h-[2px] bg-white" />
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
        
        {/* Top Control Bar: Back Button, Streak, Ads, Settings, 3-Line Menu */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Left Side: Back Button & Streak Badge */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Back Button */}
            <button
              id="header-back-btn"
              onClick={handleBackClick}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white backdrop-blur-md transition-all shadow-xs"
              title="Go Back / Reset Selection"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Active Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md rounded-full text-[#113876] font-extrabold text-xs sm:text-sm shadow-xs">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#ea580c] text-[#ea580c]" />
              <span>{profile.streakDays} Day Streak</span>
            </div>
            {profile.isPremium && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#1e40af] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                PRO
              </span>
            )}
          </div>

          {/* Right Side: Ads Button, Settings Gear, and 3-Line Toggle Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Remove Ads Button */}
            <button
              id="header-remove-ads-btn"
              onClick={() => {
                soundService.triggerHaptic('medium');
                soundService.playClick();
                onOpenPremium();
              }}
              className="relative group flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 border-2 border-[#ef4444] text-[#ef4444] shadow-md hover:scale-105 active:scale-95 transition-transform"
              title="Remove Ads (PRO)"
            >
              <span className="text-[10px] sm:text-[11px] font-black tracking-tighter uppercase leading-none">
                Ads
              </span>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[120%] h-[2px] bg-[#ef4444] -rotate-45" />
              </div>
            </button>

            {/* Settings Gear Icon */}
            <button
              id="header-settings-gear-btn"
              onClick={() => {
                soundService.triggerHaptic('light');
                soundService.playClick();
                if (onOpenProfile) onOpenProfile();
                else onOpenPremium();
              }}
              className="text-white hover:text-white/80 active:scale-95 transition-transform p-1.5 rounded-full hover:bg-white/10"
              title="Settings & Profile"
            >
              <Settings className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] text-white fill-transparent" />
            </button>

            {/* 3-Line Toggle Menu (Hamburger Icon on Right Hand Side) */}
            <button
              id="header-menu-toggle-btn"
              onClick={() => {
                soundService.triggerHaptic('medium');
                soundService.playClick();
                setIsDrawerOpen(true);
              }}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white backdrop-blur-md transition-all shadow-xs"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* User Greeting */}
        <div className="space-y-0.5 sm:space-y-1 pt-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#15469e] tracking-tight">
            Hi {profile.name || 'Lala'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-semibold text-[#184d9f]/90">
            Welcome back to Mind calculation
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

          {/* Daily Sprint Challenge Mini Card */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                <Flame className="w-5 h-5 fill-slate-950 text-slate-950" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-amber-900 uppercase tracking-wider">
                  Daily Challenge • {dailyChallenge.title}
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 font-medium">
                  {dailyChallenge.currentCount}/{dailyChallenge.targetCount} solved (+{dailyChallenge.rewardXp} XP)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundService.triggerHaptic('medium');
                soundService.playClick();
                onLaunchSprint(dailyChallenge.operation);
              }}
              className="px-4 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shrink-0 transition-colors shadow-sm self-start sm:self-center cursor-pointer active:scale-95"
            >
              Play Challenge
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
