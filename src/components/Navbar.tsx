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
  onOpenAuth?: () => void;
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
              {profile.isPremium && (
                <span className="px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase bg-sky-400 text-slate-950 rounded-full shadow-xs">
                  PRO
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Stats & Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Streak */}
          <div 
            id="streak-badge"
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-black text-xs tracking-tight"
            title="Daily Active Streak"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{profile.streakDays}D</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
            title={profile.soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Premium Upgrade Button */}
          {!profile.isPremium && (
            <button
              id="upgrade-premium-btn"
              onClick={onOpenPremium}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-sky-500/20 transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>PRO</span>
            </button>
          )}

          {/* User Profile Avatar */}
          <button
            id="user-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 border border-slate-700 transition-colors"
            title="User Profile & Settings"
          >
            <div className="w-6 h-6 rounded-lg bg-sky-500/20 flex items-center justify-center text-xs">
              {profile.avatar || <User className="w-3.5 h-3.5 text-sky-400" />}
            </div>
          </button>

          {/* 3-Line Toggle Menu Button */}
          {onToggleMenu && (
            <button
              id="navbar-menu-toggle-btn"
              onClick={onToggleMenu}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 active:scale-95 transition-all"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
