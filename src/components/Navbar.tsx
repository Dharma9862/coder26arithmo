import React from 'react';
import { 
  Zap, 
  Flame, 
  Volume2, 
  VolumeX, 
  Crown, 
  Upload, 
  Code2, 
  User,
  UserPlus,
  ArrowLeft,
  Menu
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenPremium: () => void;
  onOpenAdmin: () => void;
  onOpenCodeViewer: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onToggleSound: () => void;
  onBack?: () => void;
  onToggleMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenProfile,
  onOpenPremium,
  onOpenAdmin,
  onOpenCodeViewer,
  onOpenAuth,
  onToggleSound,
  onBack,
  onToggleMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800">
      <div className="w-full px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Left Side: Back button + App Logo & Title */}
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              id="navbar-back-btn"
              onClick={onBack}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 active:scale-95 transition-all"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-md shadow-sky-500/25 text-slate-950 font-black text-lg shrink-0">
            <Zap className="w-4 h-4 fill-slate-950 stroke-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tighter uppercase italic text-white leading-none">
                ARITH<span className="text-sky-400">MO</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Streak Badge and User Menu Toggle (Visible after login) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Streak */}
          <div 
            id="streak-badge"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-black text-xs tracking-tight"
            title="Daily Active Streak"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{profile.streakDays}D</span>
          </div>

          {/* User Profile & Menu Toggle Button - Enabled after login */}
          {!profile.isGuest ? (
            <button
              id="navbar-user-toggle-btn"
              onClick={() => {
                if (onToggleMenu) onToggleMenu();
                else onOpenProfile();
              }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1E293B] hover:bg-slate-700 border border-slate-700/80 active:scale-95 transition-all text-white flex items-center justify-center shadow-sm cursor-pointer"
              title="Toggle Profile, Settings & Menu"
            >
              <Menu className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-slate-200 stroke-[2.4]" />
            </button>
          ) : onOpenAuth ? (
            <button
              id="navbar-login-btn"
              onClick={() => onOpenAuth('signin')}
              className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              Sign In
            </button>
          ) : null}
        </div>

      </div>
    </header>
  );
};
