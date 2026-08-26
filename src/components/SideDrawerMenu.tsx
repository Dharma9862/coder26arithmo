import React from 'react';
import { 
  X, 
  Zap, 
  GraduationCap, 
  BarChart3, 
  BookmarkCheck, 
  Settings, 
  Volume2, 
  VolumeX, 
  Crown, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  User,
  UserPlus,
  LogIn,
  ExternalLink,
  Ban,
  Star,
  Grid,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { MathOperation, UserProfile } from '../types';
import { soundService } from '../services/soundService';
import { syncService } from '../services/syncService';
import { getPlanTier, getProductById } from '../services/razorpayService';

interface SideDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSelectTab: (tab: 'sprint' | 'examprep' | 'analytics' | 'bookmarks') => void;
  onLaunchOperation: (op: MathOperation) => void;
  onOpenProfile: () => void;
  onOpenPremium: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onSignOut?: () => void;
  onOpenRateApp?: () => void;
  onOpenMoreApps?: () => void;
  onTriggerAdmin?: () => void;
  bookmarkCount?: number;
}

export const SideDrawerMenu: React.FC<SideDrawerMenuProps> = ({
  isOpen,
  onClose,
  profile,
  onSelectTab,
  onLaunchOperation,
  onOpenProfile,
  onOpenPremium,
  onOpenAuth,
  onSignOut,
  onOpenRateApp,
  onOpenMoreApps,
  onTriggerAdmin,
  bookmarkCount = 0,
}) => {
  const [isSoundMuted, setIsSoundMuted] = React.useState(soundService.getMuted());
  const [secretAdminTaps, setSecretAdminTaps] = React.useState(0);
  const secretTapTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handleSecretTap = () => {
    if (secretTapTimer.current) clearTimeout(secretTapTimer.current);
    const count = secretAdminTaps + 1;
    setSecretAdminTaps(count);

    if (count >= 5) {
      soundService.triggerHaptic('heavy');
      soundService.playClick();
      setSecretAdminTaps(0);
      onClose();
      onTriggerAdmin?.();
    } else {
      secretTapTimer.current = setTimeout(() => {
        setSecretAdminTaps(0);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  const handleTabClick = (tab: 'sprint' | 'examprep' | 'analytics' | 'bookmarks') => {
    soundService.triggerHaptic('light');
    soundService.playClick();
    onSelectTab(tab);
    onClose();
  };

  const handleOpClick = (op: MathOperation) => {
    soundService.triggerHaptic('medium');
    soundService.playClick();
    onLaunchOperation(op);
    onClose();
  };

  const toggleSound = () => {
    const next = soundService.toggleMute();
    setIsSoundMuted(next);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fadeIn">
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          soundService.playClick();
          onClose();
        }}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-out border-l border-slate-200">
        
        <div>
          {/* Header */}
          <div className="bg-[#38B6DB] p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shadow-inner">
                {profile.avatar && profile.avatar !== '📱' ? profile.avatar : '⚡'}
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-[#113876] tracking-tight leading-tight">
                  {profile.name || 'Math Athlete'}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-[#15469e] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-[#ea580c] text-[#ea580c]" />
                    {profile.streakDays} Day Streak
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#1b4cb3] text-white">
                    Lv {profile.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              id="drawer-close-btn"
              onClick={() => {
                soundService.playClick();
                onClose();
              }}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white active:scale-95 transition-all"
              title="Close Menu"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Quick Support & Remove Ads Banner */}
          {/* Support & Remove Ads OR Current Plan & Upgrade Options */}
          {!profile.isPremium ? (
            <div 
              id="drawer-support-ads-banner"
              onClick={() => {
                onOpenPremium();
                onClose();
              }}
              className="mx-4 mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 fill-amber-200 text-amber-200" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider">Support & Remove Ads</h4>
                  <p className="text-[11px] text-amber-100 font-medium">Remove ads forever & support future updates</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-200 shrink-0" />
            </div>
          ) : (() => {
            const currentPlanTier = getPlanTier(profile.purchasedProductId || 'pro_supporter');
            const currentProduct = getProductById(profile.purchasedProductId || 'pro_supporter');
            const canUpgrade = currentPlanTier < 4;

            return (
              <div 
                id="drawer-current-plan-banner"
                onClick={() => {
                  onOpenPremium();
                  onClose();
                }}
                className={`mx-4 mt-4 p-3 rounded-2xl text-white shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-between border ${
                  canUpgrade 
                    ? 'bg-gradient-to-r from-emerald-600/95 via-sky-700 to-slate-800 border-emerald-400/40' 
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 border-amber-400/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Crown className={`w-5 h-5 ${canUpgrade ? 'fill-amber-300 text-amber-300' : 'fill-amber-200 text-amber-200'}`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        {currentProduct?.name.split(' & ')[0] || 'Active Plan'}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded-full bg-emerald-400/30 text-emerald-100 text-[9px] font-black uppercase tracking-wider">
                        Current Plan
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-medium">
                      {canUpgrade 
                        ? '⚡ Tap to upgrade to a bigger plan' 
                        : '👑 Highest tier unlocked (VIP Patron)'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-200 shrink-0" />
              </div>
            );
          })()}

          {/* Main Navigation Section */}
          <div className="px-4 py-4 space-y-1">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 pb-1">
              Main Menu
            </p>

            <button
              id="menu-nav-practice"
              onClick={() => handleTabClick('sprint')}
              className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-800 hover:bg-blue-50/80 active:bg-blue-100 transition-colors font-bold text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <span>Mind Calculation Practice</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              id="menu-nav-exam"
              onClick={() => handleTabClick('examprep')}
              className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-800 hover:bg-blue-50/80 active:bg-blue-100 transition-colors font-bold text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span>Quantitative Exam Prep</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              id="menu-nav-analytics"
              onClick={() => handleTabClick('analytics')}
              className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-800 hover:bg-blue-50/80 active:bg-blue-100 transition-colors font-bold text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span>Performance Analytics</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              id="menu-nav-bookmarks"
              onClick={() => handleTabClick('bookmarks')}
              className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-800 hover:bg-blue-50/80 active:bg-blue-100 transition-colors font-bold text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <span>Saved Questions</span>
              </div>
              {bookmarkCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-black rounded-full">
                  {bookmarkCount}
                </span>
              )}
            </button>
          </div>

          {/* Practice Modes Shortcuts */}
          <div className="px-4 py-2 space-y-2 border-t border-slate-100">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 pt-2">
              Practice Drills
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleOpClick('advance_calc')}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl text-left transition-colors border border-blue-100"
              >
                <span className="text-base font-light text-blue-700 block tracking-widest">( )</span>
                <span className="text-xs font-black text-blue-900 mt-1 block">Advance Calc</span>
              </button>

              <button
                onClick={() => handleOpClick('linear_sequence')}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl text-left transition-colors border border-blue-100"
              >
                <span className="text-xs font-bold text-blue-700 block tracking-tighter">□-□-□</span>
                <span className="text-xs font-black text-blue-900 mt-1 block">Linear Seq</span>
              </button>

              <button
                onClick={() => handleOpClick('right_or_wrong')}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl text-left transition-colors border border-blue-100"
              >
                <span className="text-xs font-bold text-blue-700 block">✓ ✕</span>
                <span className="text-xs font-black text-blue-900 mt-1 block">Right/Wrong</span>
              </button>

              <button
                onClick={() => handleOpClick('math_puzzle')}
                className="p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl text-left transition-colors border border-blue-100"
              >
                <span className="text-sm font-bold text-blue-700 block leading-none">⊞</span>
                <span className="text-xs font-black text-blue-900 mt-1 block">Math Puzzle</span>
              </button>
            </div>
          </div>

          {/* Rate App & More Apps Quick Section */}
          <div className="px-4 py-2 space-y-1.5 border-t border-slate-100">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 pt-1">
              Community & More
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="drawer-rate-app-btn"
                onClick={() => {
                  soundService.playClick();
                  onClose();
                  onOpenRateApp?.();
                }}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 flex items-center gap-2 transition-all active:scale-95 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Star className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <span className="text-xs font-black block leading-tight">Rate App?</span>
                  <span className="text-[10px] text-amber-700 font-medium">5 Star Review</span>
                </div>
              </button>

              <button
                id="drawer-more-apps-btn"
                onClick={() => {
                  soundService.playClick();
                  onClose();
                  onOpenMoreApps?.();
                }}
                className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200/80 text-sky-900 flex items-center gap-2 transition-all active:scale-95 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Grid className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black block leading-tight">More Apps</span>
                  <span className="text-[10px] text-sky-700 font-medium">Explore All</span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Settings & Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between p-2">
            <span className="text-xs font-bold text-slate-600">Sound Effects</span>
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all ${
                !isSoundMuted
                  ? 'bg-blue-500 text-white border-blue-500 shadow-xs'
                  : 'bg-white text-slate-400 border-slate-200'
              }`}
              title="Toggle Sound"
            >
              {!isSoundMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <button
            id="drawer-live-sync-btn"
            onClick={() => {
              soundService.triggerHaptic('medium');
              soundService.playStreakSound(2);
              syncService.triggerSync();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4 text-sky-600" />
            <span>Live Sync & Reload</span>
          </button>

          <button
            id="drawer-settings-btn"
            onClick={() => {
              onOpenProfile();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
          >
            <Settings className="w-4 h-4" />
            <span>Profile & Settings</span>
          </button>

          {profile.isGuest ? (
            <div className="space-y-1.5 w-full">
              <button
                id="drawer-sign-up-btn"
                onClick={() => {
                  soundService.playClick();
                  onClose();
                  onOpenAuth?.('signup');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up (Free Athlete Account)</span>
              </button>
              <button
                id="drawer-sign-in-btn"
                onClick={() => {
                  soundService.playClick();
                  onClose();
                  onOpenAuth?.('signin');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Existing Account</span>
              </button>
            </div>
          ) : (
            <button
              id="drawer-sign-out-btn"
              onClick={() => {
                soundService.triggerHaptic('medium');
                soundService.playClick();
                onClose();
                onSignOut?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out ({profile.name})</span>
            </button>
          )}

          <div 
            onClick={handleSecretTap}
            className="pt-2 text-center text-[10px] text-slate-400 font-mono-math cursor-pointer select-none"
            title="Arithmo Core"
          >
            Arithmo v3.0 • Speed Math Engine
          </div>
        </div>

      </div>
    </div>
  );
};
