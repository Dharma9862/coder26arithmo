import React from 'react';
import { 
  Zap, 
  Flame, 
  Volume2, 
  VolumeX, 
  Crown, 
  Upload, 
  Smartphone, 
  Tablet,
  Monitor, 
  Code2, 
  User,
  ArrowLeft,
  Menu
} from 'lucide-react';
import { DeviceMode, UserProfile } from '../types';

interface NavbarProps {
  profile: UserProfile;
  onOpenProfile: () => void;
  onOpenPremium: () => void;
  onOpenAdmin: () => void;
  onOpenCodeViewer: () => void;
  onOpenAuth?: () => void;
  deviceMode: DeviceMode;
  onSelectDeviceMode: (mode: DeviceMode) => void;
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
  deviceMode,
  onSelectDeviceMode,
  onToggleSound,
  onBack,
  onToggleMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Left Side: Back button + App Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onBack && (
            <button
              id="navbar-back-btn"
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 active:scale-95 transition-all"
              title="Go Back to Practice Home"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/25 text-slate-950 font-black text-xl shrink-0">
            <Zap className="w-5 h-5 fill-slate-950 stroke-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-lg sm:text-2xl tracking-tighter uppercase italic text-white leading-none">
                ARITH<span className="text-sky-400">MO</span>
              </span>
              {profile.isPremium && (
                <span className="px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase bg-sky-400 text-slate-950 rounded-full shadow-xs">
                  PRO
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] hidden sm:block">
              Speed Math & Global Arena
            </p>
          </div>
        </div>

        {/* Device Viewport Toggle Segmented Control */}
        <div className="hidden sm:flex items-center p-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-inner">
          <button
            id="nav-device-desktop-btn"
            onClick={() => onSelectDeviceMode('desktop')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
              deviceMode === 'desktop'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            id="nav-device-tablet-btn"
            onClick={() => onSelectDeviceMode('tablet')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
              deviceMode === 'tablet'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet / iPad Mode"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            id="nav-device-mobile-btn"
            onClick={() => onSelectDeviceMode('mobile')}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
              deviceMode === 'mobile'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile Smartphone Mode"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Stats & Quick Actions on Right Hand Side */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Daily Streak */}
          <div 
            id="streak-badge"
            className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-black text-xs tracking-tight"
            title="Daily Active Streak"
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{profile.streakDays}D</span>
          </div>

          {/* XP & Level */}
          <div 
            id="xp-badge"
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E293B] border border-slate-700/70 text-slate-200 text-xs font-black tracking-wide"
          >
            <span className="text-sky-400">LV.{profile.level}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="text-slate-300 font-mono-math">{profile.xp} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
            title={profile.soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            )}
          </button>

          {/* Flutter & Backend Code Architecture Viewer */}
          <button
            id="code-architecture-btn"
            onClick={onOpenCodeViewer}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 text-xs font-black uppercase tracking-wider border border-slate-700 transition-all"
            title="View Full Flutter & Supabase Architecture Code"
          >
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>Code</span>
          </button>

          {/* Admin Upload */}
          <button
            id="admin-upload-nav-btn"
            onClick={onOpenAdmin}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 text-xs font-black uppercase tracking-wider border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Admin Content Upload"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Admin</span>
          </button>

          {/* Premium Upgrade Button */}
          {!profile.isPremium && (
            <button
              id="upgrade-premium-btn"
              onClick={onOpenPremium}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-sky-500/20 transition-all active:scale-95"
            >
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
              <span>PRO</span>
            </button>
          )}

          {/* Sign In CTA Button for Guest Users */}
          {profile.isGuest && onOpenAuth && (
            <button
              id="navbar-signin-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-sky-500/20 active:scale-95 transition-all"
              title="Sign In or Create Account"
            >
              <User className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Sign In</span>
            </button>
          )}

          {/* User Profile Avatar */}
          <button
            id="user-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 border border-slate-700 transition-colors"
            title="User Profile & Settings"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-sky-500/20 flex items-center justify-center text-xs sm:text-sm">
              {profile.avatar || <User className="w-4 h-4 text-sky-400" />}
            </div>
            <span className="text-xs font-bold text-slate-200 hidden xl:inline max-w-[80px] truncate">
              {profile.name}
            </span>
          </button>

          {/* 3-Line Toggle Menu Button on Right Hand Side */}
          {onToggleMenu && (
            <button
              id="navbar-menu-toggle-btn"
              onClick={onToggleMenu}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 active:scale-95 transition-all"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
