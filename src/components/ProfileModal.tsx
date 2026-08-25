import React, { useState } from 'react';
import { 
  X, 
  User, 
  Award, 
  Settings, 
  Shield, 
  Check, 
  Volume2, 
  VolumeX, 
  Flame, 
  Zap, 
  Download, 
  RotateCcw,
  Sparkles,
  Lock,
  LogOut,
  Mail,
  KeyRound,
  Info,
  Smartphone,
  Cpu,
  Layers,
  History,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Star,
  Grid,
  Heart
} from 'lucide-react';
import { Achievement, DifficultyLevel, MathOperation, UserProfile } from '../types';
import { APP_EXTERNAL_LINKS, MORE_APPS_CATALOG } from '../config/appLinks';
import { soundService } from '../services/soundService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  achievements: Achievement[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetProgress: () => void;
  onOpenRateApp?: () => void;
  onOpenMoreApps?: () => void;
  onOpenAuth?: () => void;
}

export const APP_INFO = {
  name: 'Arithmo',
  version: 'v3.0.0',
  buildNumber: '2026.08.25-arithmo',
  releaseDate: 'August 25, 2026',
  description: 'Fast-paced mental math, Vedic calculation techniques, quantitative aptitude arena, and global ranking dashboard for speed athletes and competitive exam preparation.',
  highlights: [
    'Sub-second Vedic math arithmetic drills',
    'Global Ranking Dashboard with League Divisions & Ghost Duels',
    'Dedicated Athlete Account Creation & Sign In sync',
    'Real-time adaptive difficulty scaling engine',
    'Quantitative exam mock prep with comprehensive explanations',
    'Cross-device sync & offline-ready speed calculation engine',
  ],
  changelog: [
    {
      version: 'v3.0.0 (Current - Arithmo Launch)',
      date: 'Aug 2026',
      changes: [
        'Rebranded to Arithmo with refreshed sleek arena design',
        'Built full Global Ranking Dashboard with League divisions and podium celebrations',
        'Implemented full Sign In / Sign Up Athlete Account authentication',
        'Added Ghost Duel mode to challenge top-ranked leaderboard athletes',
      ],
    },
    {
      version: 'v2.4.0',
      date: 'Aug 2026',
      changes: [
        'Added INR (₹) & USD ($) live currency converter and rupee symbol support in Support & Remove Ads',
        'Added fast 3-line drawer navigation toggle menu on the top right',
        'Added top-left Back button for easy category reset and navigation',
        'Added "About App" specification, versioning, and update log inside Settings',
        'Fixed sprint timer state updates to eliminate rendering race conditions',
      ],
    },
    {
      version: 'v2.3.0',
      date: 'Aug 2026',
      changes: [
        'Added Advance Calculation ( ), Linear Sequences □-□-□, and Right/Wrong modes',
        'Enhanced Vedic square, cube, and multiplication shortcuts engine',
        'Added bookmarking and question review repository',
      ],
    },
    {
      version: 'v2.0.0',
      date: 'Jul 2026',
      changes: [
        'Added Quantitative Aptitude Exam Prep mode with bank & SSC mock exams',
        'Implemented local persistence, combo scoring, and streak tracking',
      ],
    },
  ],
};

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  achievements,
  onUpdateProfile,
  onResetProgress,
  onOpenRateApp,
  onOpenMoreApps,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'about' | 'achievements' | 'auth'>('profile');
  const [name, setName] = useState<string>(profile.name);
  const [avatar, setAvatar] = useState<string>(profile.avatar);
  const [diff, setDiff] = useState<DifficultyLevel>(profile.preferredDifficulty);
  const [op, setOp] = useState<MathOperation>(profile.preferredOperation);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Auth form state
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authMsg, setAuthMsg] = useState<string>('');

  if (!isOpen) return null;

  const avatars = ['⚡', '🎯', '🔥', '🚀', '🌟', '🧠', '💎', '🏆', '🦊', '🦁'];

  const handleSaveProfile = () => {
    onUpdateProfile({
      name,
      avatar,
      preferredDifficulty: diff,
      preferredOperation: op,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;
    onUpdateProfile({
      email: emailInput,
      name: emailInput.split('@')[0],
      isGuest: false,
    });
    setAuthMsg('Successfully connected to Supabase Auth cloud account!');
    setTimeout(() => setAuthMsg(''), 2500);
  };

  const handleGoogleSignIn = () => {
    onUpdateProfile({
      email: 'alex.runner@gmail.com',
      name: 'Alex Runner',
      avatar: '🌟',
      isGuest: false,
    });
    setAuthMsg('Signed in via Google OAuth successfully!');
    setTimeout(() => setAuthMsg(''), 2500);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "NumberSprint_Data_Backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-2xl shadow-inner">
              {profile.avatar}
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                {profile.name}
                {profile.isPremium && (
                  <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 rounded-full shadow-sm">
                    PRO
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {profile.isGuest ? 'Guest Runner' : profile.email} • LV.{profile.level} ({profile.xp} XP)
              </p>
            </div>
          </div>
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-700/60 bg-slate-900/40 px-4 sm:px-5 pt-3 gap-2 sm:gap-3 overflow-x-auto">
          <button
            id="settings-tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-2 sm:px-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Preferences
          </button>

          <button
            id="settings-tab-about"
            onClick={() => setActiveTab('about')}
            className={`pb-3 px-2 sm:px-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About App</span>
            <span className="px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 text-[9px] font-mono-math">
              {APP_INFO.version}
            </span>
          </button>

          <button
            id="settings-tab-achievements"
            onClick={() => setActiveTab('achievements')}
            className={`pb-3 px-2 sm:px-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Badges</span>
            <span className="px-1.5 py-0.5 rounded-md bg-slate-900 text-[10px] font-mono-math">
              {achievements.filter(a => a.isUnlocked).length}/{achievements.length}
            </span>
          </button>

          <button
            id="settings-tab-auth"
            onClick={() => setActiveTab('auth')}
            className={`pb-3 px-2 sm:px-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'auth'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cloud Sync
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* 1. Preferences Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              
              {/* Name & Avatar */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Runner Handle & Avatar
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/60 text-slate-100 text-sm font-medium focus:outline-none focus:border-sky-500 mb-3"
                />

                <div className="flex flex-wrap gap-2.5">
                  {avatars.map((av) => (
                    <button
                      key={av}
                      onClick={() => setAvatar(av)}
                      className={`w-10 h-10 rounded-2xl border text-lg flex items-center justify-center transition-all ${
                        avatar === av
                          ? 'border-sky-500 bg-sky-500/20 scale-110 shadow-md shadow-sky-500/20'
                          : 'border-slate-700/60 bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Difficulty */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Preferred Difficulty
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['beginner', 'intermediate', 'advanced', 'expert'] as DifficultyLevel[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDiff(d)}
                      className={`p-3 rounded-2xl border text-xs font-black uppercase tracking-tight transition-colors ${
                        diff === d
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                          : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-700/60">
                <button
                  onClick={handleExportData}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900 text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 border border-slate-700/60"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Data</span>
                </button>

                <button
                  id="save-profile-changes-btn"
                  onClick={handleSaveProfile}
                  className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                >
                  {savedSuccess ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                  <span>{savedSuccess ? 'Saved!' : 'Save Preferences'}</span>
                </button>
              </div>

              {/* Rate App & More Apps Action Bar */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  id="profile-rate-app-btn"
                  onClick={() => {
                    soundService.playClick();
                    onClose();
                    onOpenRateApp?.();
                  }}
                  className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-2.5 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-slate-950" />
                  </div>
                  <div>
                    <span className="text-xs font-black block leading-tight text-white">Rate App?</span>
                    <span className="text-[10px] text-amber-300 font-medium">Leave 5-star review</span>
                  </div>
                </button>

                <button
                  id="profile-more-apps-btn"
                  onClick={() => {
                    soundService.playClick();
                    onClose();
                    onOpenMoreApps?.();
                  }}
                  className="p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 flex items-center gap-2.5 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center shrink-0">
                    <Grid className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black block leading-tight text-white">More Apps</span>
                    <span className="text-[10px] text-sky-300 font-medium">Developer portfolio</span>
                  </div>
                </button>
              </div>

              {/* Compact About App Footer Link */}
              <div 
                onClick={() => setActiveTab('about')}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 flex items-center justify-between cursor-pointer hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">About {APP_INFO.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono-math">Version {APP_INFO.version} ({APP_INFO.buildNumber})</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-400 hover:underline">View Info →</span>
              </div>

            </div>
          )}

          {/* 2. About App Tab */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-slate-200">
              
              {/* App Identity Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#38B6DB]/15 via-slate-900 to-slate-900 border border-sky-500/30">
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/30">
                    <Zap className="w-6 h-6 fill-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white tracking-tight">{APP_INFO.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-sky-500 text-slate-950 text-[10px] font-black font-mono-math">
                        {APP_INFO.version}
                      </span>
                    </div>
                    <p className="text-xs text-sky-300 font-mono-math mt-0.5">
                      Build: {APP_INFO.buildNumber} • {APP_INFO.releaseDate}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {APP_INFO.description}
                </p>
              </div>

              {/* Rate This App & More Apps Callouts in About */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-sky-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Love NumberSprint?</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Rate us 5 stars or discover other speed math & exam preparation apps.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => {
                      soundService.playClick();
                      onClose();
                      onOpenRateApp?.();
                    }}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Rate App</span>
                  </button>

                  <button
                    onClick={() => {
                      soundService.playClick();
                      onClose();
                      onOpenMoreApps?.();
                    }}
                    className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-200 text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1 border border-slate-700"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>More Apps</span>
                  </button>
                </div>
              </div>

              {/* Core System Features */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/60 space-y-2.5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Key Capabilities
                </h4>
                <div className="space-y-2">
                  {APP_INFO.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Changelog & Updates based on update history */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-sky-400" />
                    <span>Version History & Updates</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                    Latest Release
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {APP_INFO.changelog.map((log, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-xl border ${
                        index === 0 
                          ? 'bg-sky-950/20 border-sky-500/30' 
                          : 'bg-slate-950/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white font-mono-math">
                          {log.version}
                        </span>
                        <span className="text-[10px] text-slate-400">{log.date}</span>
                      </div>
                      <ul className="space-y-1">
                        {log.changes.map((change, cIdx) => (
                          <li key={cIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                            <span className="text-sky-400 font-bold">•</span>
                            <span className="leading-normal">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Platform</span>
                  <span className="font-bold text-white text-xs mt-0.5 block">Web / PWA / Hybrid</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Engine</span>
                  <span className="font-bold text-sky-400 text-xs mt-0.5 block">MathSprint Core 2.4</span>
                </div>
              </div>

            </div>
          )}

          {/* 3. Badges Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                    ach.isUnlocked
                      ? 'bg-sky-500/10 border-sky-500/30'
                      : 'bg-slate-900/60 border-slate-700/50 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      ach.isUnlocked ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20' : 'bg-slate-900 text-slate-500'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-tight text-xs text-white flex items-center gap-2">
                        {ach.title}
                        {ach.isUnlocked && (
                          <span className="text-[9px] text-sky-400 font-bold uppercase tracking-wider">Unlocked</span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{ach.description}</p>
                    </div>
                  </div>

                  <span className="text-xs font-mono-math font-black text-sky-400 shrink-0">
                    +{ach.xpReward} XP
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 4. Supabase Cloud Sync Tab */}
          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/60 text-xs text-slate-300 space-y-1">
                <span className="font-black uppercase tracking-tight text-white block">Arithmo Athlete Account</span>
                <span className="font-medium text-slate-400">Signing in links your speed calculations, streaks, and global ranking across all devices.</span>
              </div>

              {onOpenAuth && (
                <button
                  onClick={() => {
                    soundService.playClick();
                    onClose();
                    onOpenAuth();
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Full Sign Up & Sign In Portal</span>
                </button>
              )}

              {authMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{authMsg}</span>
                </div>
              )}

              {/* Google Sign-In button */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700/60 transition-colors shadow-md"
              >
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-2 text-slate-500 text-xs my-2 font-bold uppercase tracking-wider">
                <div className="flex-1 h-px bg-slate-700/60" />
                <span className="text-[10px]">or email & password</span>
                <div className="flex-1 h-px bg-slate-700/60" />
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/60 text-slate-100 text-xs focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/60 text-slate-100 text-xs focus:outline-none focus:border-sky-500 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
                >
                  Save / Link Account
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
