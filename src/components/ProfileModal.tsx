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
  Cpu,
  Layers,
  History,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Star,
  Grid,
  Heart,
  Mic,
  Radio
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
  onSignOut?: () => void;
  onOpenRateApp?: () => void;
  onOpenMoreApps?: () => void;
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
  onTriggerAdmin?: () => void;
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
  onSignOut,
  onOpenRateApp,
  onOpenMoreApps,
  onOpenAuth,
  onTriggerAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'about' | 'achievements' | 'auth'>('profile');
  const [name, setName] = useState<string>(profile.name);
  const [avatar, setAvatar] = useState<string>(profile.avatar);
  const [diff, setDiff] = useState<DifficultyLevel>(profile.preferredDifficulty);
  const [op, setOp] = useState<MathOperation>(profile.preferredOperation);
  const [audioFeedbackEnabled, setAudioFeedbackEnabled] = useState<boolean>(profile.audioFeedbackEnabled ?? true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(profile.soundEnabled ?? true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(profile.hapticsEnabled ?? true);
  const [isTestingVoice, setIsTestingVoice] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState<boolean>(false);

  // Auth form state
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authMsg, setAuthMsg] = useState<string>('');

  // Hidden Admin Easter Egg trigger state
  const [secretTapCount, setSecretTapCount] = useState<number>(0);
  const secretTapTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSecretAdminTap = () => {
    if (secretTapTimeoutRef.current) clearTimeout(secretTapTimeoutRef.current);
    const nextCount = secretTapCount + 1;
    setSecretTapCount(nextCount);

    soundService.triggerHaptic('light');

    if (nextCount >= 5) {
      soundService.triggerHaptic('heavy');
      soundService.playClick();
      setSecretTapCount(0);
      onClose();
      onTriggerAdmin?.();
    } else {
      secretTapTimeoutRef.current = setTimeout(() => {
        setSecretTapCount(0);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  const avatars = ['⚡', '🎯', '🔥', '🚀', '🌟', '🧠', '💎', '🏆', '🦊', '🦁'];

  const handleSaveProfile = () => {
    onUpdateProfile({
      name,
      avatar,
      preferredDifficulty: diff,
      preferredOperation: op,
      audioFeedbackEnabled,
      soundEnabled,
      hapticsEnabled,
    });
    soundService.setAudioFeedbackEnabled(audioFeedbackEnabled);
    soundService.setMuted(!soundEnabled);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  const handleTestVoice = () => {
    soundService.triggerHaptic('medium');
    soundService.playClick();
    setIsTestingVoice(true);
    soundService.setAudioFeedbackEnabled(true);
    soundService.testVoiceAnnouncement(() => {
      setIsTestingVoice(false);
    });
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
                  <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white rounded-full shadow-xs flex items-center gap-1 border border-emerald-400">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    <span>Current Plan: PRO</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                LV.{profile.level} ({profile.xp} XP) • {profile.streakDays} Day Streak
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
            id="settings-tab-auth"
            onClick={() => setActiveTab('auth')}
            className={`pb-3 px-2 sm:px-3 text-xs font-black uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'auth'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Account & Sync</span>
            {!profile.isGuest && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
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

              {/* Audio Feedback & Sensory Preferences */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-sky-950/30 to-slate-900/90 border border-sky-500/30 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                        <span>Audio Feedback</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 text-[9px] font-mono-math">
                          Voice AI
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">Synthetic voice announcements in gameplay</p>
                    </div>
                  </div>

                  {/* Primary Audio Feedback Switch */}
                  <button
                    id="toggle-audio-feedback-btn"
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      const next = !audioFeedbackEnabled;
                      setAudioFeedbackEnabled(next);
                      soundService.setAudioFeedbackEnabled(next);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      audioFeedbackEnabled ? 'bg-sky-500' : 'bg-slate-700'
                    }`}
                    role="switch"
                    aria-checked={audioFeedbackEnabled}
                    title="Toggle Audio Feedback Voice Announcements"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                        audioFeedbackEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Subtext description */}
                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  🎙️ Spoken synthetic voice announcements for <strong className="text-sky-300">score milestones</strong> (500, 1,000, 1,500+ pts) and <strong className="text-amber-300">daily streak achievements</strong> during gameplay.
                </p>

                {/* Test Voice Announcement Preview Button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    id="test-voice-announcement-btn"
                    type="button"
                    disabled={isTestingVoice}
                    onClick={handleTestVoice}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    title="Hear a sample synthetic voice announcement"
                  >
                    {isTestingVoice ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[11px]">Speaking Sample...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-[11px]">Test Voice Announcement</span>
                      </>
                    )}
                  </button>

                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    audioFeedbackEnabled ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {audioFeedbackEnabled ? 'Voice Enabled' : 'Voice Muted'}
                  </span>
                </div>

                {/* Secondary Audio Settings: Sound Effects & Haptics */}
                <div className="pt-2.5 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  {/* Sound FX toggle */}
                  <button
                    id="pref-toggle-sound-effects-btn"
                    type="button"
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      soundService.setMuted(!next);
                    }}
                    className={`p-2 rounded-xl border flex items-center justify-between text-left transition-colors cursor-pointer ${
                      soundEnabled 
                        ? 'bg-slate-900/90 border-slate-700 text-white' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-sky-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                      <span className="text-[11px] font-bold">Sound FX</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase ${soundEnabled ? 'text-sky-400' : 'text-slate-500'}`}>
                      {soundEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Haptic Vibration toggle */}
                  <button
                    id="pref-toggle-haptics-btn"
                    type="button"
                    onClick={() => {
                      const next = !hapticsEnabled;
                      setHapticsEnabled(next);
                      if (next) soundService.triggerHaptic('medium');
                    }}
                    className={`p-2 rounded-xl border flex items-center justify-between text-left transition-colors cursor-pointer ${
                      hapticsEnabled 
                        ? 'bg-slate-900/90 border-slate-700 text-white' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${hapticsEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="text-[11px] font-bold">Haptics</span>
                    </div>
                    <span className={`text-[9px] font-black uppercase ${hapticsEnabled ? 'text-amber-400' : 'text-slate-500'}`}>
                      {hapticsEnabled ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end border-t border-slate-700/60">
                <button
                  id="save-profile-changes-btn"
                  onClick={handleSaveProfile}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
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

              {/* Account Status & Cloud Sync Row */}
              <div 
                onClick={() => {
                  soundService.playClick();
                  setActiveTab('auth');
                }}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-slate-900 border border-sky-500/30 flex items-center justify-between cursor-pointer hover:border-sky-400/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white block">
                        {profile.isGuest ? 'Guest Runner' : profile.name}
                      </span>
                      <span className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        profile.isGuest 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {profile.isGuest ? 'Guest' : 'Cloud Synced'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {profile.isGuest ? 'Tap to sign in or create an athlete account' : profile.email || 'Cloud sync active'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-400 hover:underline">
                  {profile.isGuest ? 'Sign In →' : 'Manage →'}
                </span>
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

          {/* Account & Sync Tab */}
          {activeTab === 'auth' && (
            <div className="space-y-4 text-slate-200">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-950/50 via-slate-900 to-slate-900 border border-sky-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-md">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {profile.isGuest ? 'Guest Runner Profile' : profile.name}
                    </h3>
                    <p className="text-xs text-sky-300 font-mono-math">
                      {profile.isGuest ? 'Local-only guest session' : (profile.email || 'Athlete Account')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Level & XP</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">Lv.{profile.level} ({profile.xp} XP)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Streak</span>
                    <span className="font-bold text-amber-400 text-sm mt-0.5 block">{profile.streakDays} Days</span>
                  </div>
                </div>

                {profile.isGuest ? (
                  <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-slate-300 space-y-3">
                    <p className="leading-relaxed">
                      You are currently using Arithmo as a guest. Sign in or create an account to sync your speed metrics, league rankings, and achievements across devices.
                    </p>
                    <div className="space-y-2">
                      <button
                        id="profile-open-signup-btn"
                        type="button"
                        onClick={() => {
                          soundService.playClick();
                          onClose();
                          onOpenAuth?.('signup');
                        }}
                        className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-sky-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Sign Up (Create Athlete Account)</span>
                      </button>
                      <button
                        id="profile-open-signin-btn"
                        type="button"
                        onClick={() => {
                          soundService.playClick();
                          onClose();
                          onOpenAuth?.('signin');
                        }}
                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer border border-slate-700"
                      >
                        <span>Sign In to Existing Account</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Cloud backup and sync active for your athlete profile.</span>
                    </div>

                    {!showSignOutConfirm ? (
                      <button
                        id="profile-signout-btn"
                        type="button"
                        onClick={() => setShowSignOutConfirm(true)}
                        className="w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                        <p className="text-xs text-rose-200">
                          Are you sure you want to sign out? Your cloud data remains safe.
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              soundService.playClick();
                              setShowSignOutConfirm(false);
                              onSignOut?.();
                              onClose();
                            }}
                            className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                          >
                            Yes, Sign Out
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowSignOutConfirm(false)}
                            className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                      <button
                        type="button"
                        onClick={handleSecretAdminTap}
                        className="px-2 py-0.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 text-[10px] font-black font-mono-math cursor-pointer active:scale-95 transition-all select-none"
                        title="App Version"
                      >
                        {APP_INFO.version}
                      </button>
                    </div>
                    <p 
                      onClick={handleSecretAdminTap}
                      className="text-xs text-sky-300 font-mono-math mt-0.5 cursor-pointer select-none"
                    >
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

        </div>

      </div>
    </div>
  );
};
