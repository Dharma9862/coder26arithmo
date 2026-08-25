import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  Settings, 
  Plus, 
  Minus, 
  Divide, 
  Sparkles, 
  Percent, 
  GraduationCap, 
  Crown,
  Play,
  Ban,
  ArrowLeft,
  Menu
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
  onOpenRateApp?: () => void;
  onOpenMoreApps?: () => void;
  onBack?: () => void;
  onSelectTab?: (tab: 'sprint' | 'examprep' | 'analytics' | 'leaderboard' | 'bookmarks') => void;
  bookmarkCount?: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  dailyChallenge,
  onLaunchSprint,
  onOpenExamPrep,
  onOpenPremium,
  onOpenProfile,
  onOpenAuth,
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

  const handleCardClick = (action: () => void) => {
    soundService.triggerHaptic('medium');
    soundService.playClick();
    action();
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
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-8 pt-5 pb-6 space-y-4">
        
        {/* Top Control Bar: Back Button, Streak, Ads, Settings, 3-Line Menu */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Left Side: Back Button & Streak Badge */}
          <div className="flex items-center gap-2.5">
            {/* Back Button */}
            <button
              id="header-back-btn"
              onClick={handleBackClick}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white backdrop-blur-md transition-all shadow-xs"
              title="Go Back / Reset Selection"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Active Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[#113876] font-extrabold text-xs">
              <Flame className="w-3.5 h-3.5 fill-[#ea580c] text-[#ea580c]" />
              <span>{profile.streakDays} Day Streak</span>
            </div>
            {profile.isPremium && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#1e40af] text-white text-[10px] font-black uppercase tracking-wider">
                PRO
              </span>
            )}
          </div>

          {/* Right Side: Ads Button, Settings Gear, and 3-Line Toggle Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Remove Ads Button */}
            <button
              id="header-remove-ads-btn"
              onClick={() => handleCardClick(onOpenPremium)}
              className="relative group flex items-center justify-center w-8 h-8 rounded-full bg-white/90 border-2 border-[#ef4444] text-[#ef4444] shadow-md hover:scale-105 active:scale-95 transition-transform"
              title="Remove Ads (PRO)"
            >
              <span className="text-[10px] font-black tracking-tighter uppercase leading-none">
                Ads
              </span>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[120%] h-[2px] bg-[#ef4444] -rotate-45" />
              </div>
            </button>

            {/* Settings Gear Icon */}
            <button
              id="header-settings-gear-btn"
              onClick={() => handleCardClick(onOpenProfile || onOpenPremium)}
              className="text-white hover:text-white/80 active:scale-95 transition-transform p-1"
              title="Settings & Profile"
            >
              <Settings className="w-6 h-6 stroke-[2.2] text-white fill-transparent" />
            </button>

            {/* 3-Line Toggle Menu (Hamburger Icon on Right Hand Side) */}
            <button
              id="header-menu-toggle-btn"
              onClick={() => {
                soundService.triggerHaptic('medium');
                soundService.playClick();
                setIsDrawerOpen(true);
              }}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white backdrop-blur-md transition-all shadow-xs"
              title="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* User Greeting */}
        <div className="space-y-1 pt-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15469e] tracking-tight">
            Hi {profile.name || 'Lala'}
          </h1>
          <p className="text-base sm:text-lg font-semibold text-[#184d9f]/90">
            Welcome back to Mind calculation
          </p>
        </div>

        {/* Carousel / Tab Pill Bar */}
        <div className="pt-2 pb-1 flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundService.triggerHaptic('light');
                  setSelectedCategory(cat.id);
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-md ${
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
      <div className="flex-1 w-full bg-white rounded-t-[32px] sm:rounded-t-[44px] shadow-2xl px-4 sm:px-8 pt-6 sm:pt-8 pb-32">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
          
          {/* Section Heading */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#15469e] tracking-tight">
              {categories.find(c => c.id === selectedCategory)?.label || 'Advance calculation Practice'}
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Adaptive Level {profile.level}
            </span>
          </div>

          {/* Cards List matching exact UI screenshot */}
          <div className="space-y-3.5 sm:space-y-4">
            
            {/* Card 1: Advance Calculation */}
            <div
              id="card-advance-calculation"
              onClick={() => handleCardClick(() => onLaunchSprint('advance_calc'))}
              className="w-full bg-[#1d5ce5] hover:bg-[#1853d6] text-white p-5 sm:p-6 rounded-[22px] shadow-lg shadow-blue-500/20 flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
            >
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Advance Calculation
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                  You haven't tried this
                </p>
              </div>

              {/* Minimalist White Outline Parentheses ( ) Icon */}
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <span className="text-3xl sm:text-4xl font-light text-white tracking-widest select-none">
                  ( )
                </span>
              </div>
            </div>

            {/* Card 2: Linear Sequence */}
            <div
              id="card-linear-sequence"
              onClick={() => handleCardClick(() => onLaunchSprint('linear_sequence'))}
              className="w-full bg-[#1d5ce5] hover:bg-[#1853d6] text-white p-5 sm:p-6 rounded-[22px] shadow-lg shadow-blue-500/20 flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
            >
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Linear Sequence
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                  You haven't tried this
                </p>
              </div>

              {/* Minimalist 3 Connected Squares □-□-□ */}
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <div className="flex items-center gap-1 text-white">
                  <div className="w-3.5 h-3.5 border-2 border-white rounded-[2px]" />
                  <div className="w-1 h-[2px] bg-white" />
                  <div className="w-3.5 h-3.5 border-2 border-white rounded-[2px]" />
                  <div className="w-1 h-[2px] bg-white" />
                  <div className="w-3.5 h-3.5 border-2 border-white rounded-[2px]" />
                </div>
              </div>
            </div>

            {/* Card 3: Right or Wrong */}
            <div
              id="card-right-or-wrong"
              onClick={() => handleCardClick(() => onLaunchSprint('right_or_wrong'))}
              className="w-full bg-[#1d5ce5] hover:bg-[#1853d6] text-white p-5 sm:p-6 rounded-[22px] shadow-lg shadow-blue-500/20 flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
            >
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Right or Wrong
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                  You haven't tried this
                </p>
              </div>

              {/* Minimalist Check & Cross ✓ ✗ */}
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <div className="flex flex-col items-center justify-center text-white select-none">
                  <span className="text-lg font-bold leading-none">✓</span>
                  <span className="text-sm font-bold leading-none -mt-1 font-mono">✕</span>
                </div>
              </div>
            </div>

            {/* Card 4: Math puzzle */}
            <div
              id="card-math-puzzle"
              onClick={() => handleCardClick(() => onLaunchSprint('math_puzzle'))}
              className="w-full bg-[#1d5ce5] hover:bg-[#1853d6] text-white p-5 sm:p-6 rounded-[22px] shadow-lg shadow-blue-500/20 flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
            >
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Math puzzle
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                  You haven't tried this
                </p>
              </div>

              {/* Minimalist Grid ⊞ */}
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <div className="w-6 h-6 border-2 border-white rounded-[4px] grid grid-cols-2 grid-rows-2 p-0.5 gap-0.5">
                  <div className="border border-white/80 rounded-[1px]" />
                  <div className="border border-white/80 rounded-[1px]" />
                  <div className="border border-white/80 rounded-[1px]" />
                  <div className="border border-white/80 rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Card 5: Speed Sprint Arena (Mixed) */}
            <div
              id="card-speed-sprint-mixed"
              onClick={() => handleCardClick(() => onLaunchSprint('mixed'))}
              className="w-full bg-[#1d5ce5] hover:bg-[#1853d6] text-white p-5 sm:p-6 rounded-[22px] shadow-lg shadow-blue-500/20 flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
            >
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Speed Sprint (Mixed Blitz)
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                  60-Second adaptive speed math challenge
                </p>
              </div>

              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <Zap className="w-7 h-7 text-white fill-white" />
              </div>
            </div>

            {/* Card 6: Multiplication Masters */}
            <div
              id="card-multiplication"
              onClick={() => handleCardClick(() => onLaunchSprint('multiplication'))}
              className="w-full bg-[#1d5ce5] hover:bg-[#1853d6] text-white p-5 sm:p-6 rounded-[22px] shadow-lg shadow-blue-500/20 flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
            >
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Multiplication Masters
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                  Tables 12-99 & Vedic shortcuts
                </p>
              </div>

              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <span className="text-3xl font-black text-white font-mono-math">×</span>
              </div>
            </div>

            {/* Card 7: Quantitative Exam Prep */}
            <div
              id="card-exam-prep"
              onClick={() => handleCardClick(onOpenExamPrep)}
              className="w-full bg-[#1d5ce5] hover:bg-[#1853d6] text-white p-5 sm:p-6 rounded-[22px] shadow-lg shadow-blue-500/20 flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
            >
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Quantitative Exam Prep
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                  16+ Packs for CAT, GMAT, Bank PO, SSC CGL
                </p>
              </div>

              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Card 8: Squares & Percentages */}
            <div
              id="card-squares-percentages"
              onClick={() => handleCardClick(() => onLaunchSprint('percentages'))}
              className="w-full bg-[#1d5ce5] hover:bg-[#1853d6] text-white p-5 sm:p-6 rounded-[22px] shadow-lg shadow-blue-500/20 flex items-center justify-between transition-all duration-150 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
            >
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Squares & Percentages
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 font-medium">
                  Rapid roots, ratios & quick estimation
                </p>
              </div>

              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <Percent className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
            </div>

          </div>

          {/* Daily Sprint Challenge Mini Card */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                <Flame className="w-5 h-5 fill-slate-950 text-slate-950" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                  Daily Challenge • {dailyChallenge.title}
                </h4>
                <p className="text-xs text-amber-800 font-medium">
                  {dailyChallenge.currentCount}/{dailyChallenge.targetCount} solved (+{dailyChallenge.rewardXp} XP)
                </p>
              </div>
            </div>

            <button
              onClick={() => handleCardClick(() => onLaunchSprint(dailyChallenge.operation))}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 transition-colors shadow-sm"
            >
              Play
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
