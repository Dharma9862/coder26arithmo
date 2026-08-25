import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Globe, 
  Target, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { soundService } from '../services/soundService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (userData: Partial<UserProfile>) => void;
  initialMode?: 'signin' | 'signup';
}

const AVATAR_PRESETS = ['⚡', '🧠', '👑', '🚀', '💎', '🎯', '🔥', '🏆', '🌟', '🦁', '🥋', '🦊'];

const TARGET_GOALS = [
  { id: 'math_athlete', label: 'Speed Math Athlete & Vedic Drills' },
  { id: 'ssc_bank', label: 'Competitive Exams (SSC CGL, Bank PO, Railways)' },
  { id: 'cat_gre', label: 'Management & Grad (CAT, GMAT, GRE)' },
  { id: 'school_sat', label: 'School & Standardized Tests (SAT, ACT)' },
  { id: 'brain_fitness', label: 'Daily Mental Agility & Focus' },
];

const COUNTRIES = [
  { code: 'GLOBAL', name: 'Global / International', flag: '🌐' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Sign In Form State
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  
  // Sign Up Form State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('⚡');
  const [targetGoal, setTargetGoal] = useState<string>('math_athlete');
  const [selectedCountry, setSelectedCountry] = useState<string>('GLOBAL');
  
  // Error & Status
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleToggleMode = (newMode: 'signin' | 'signup') => {
    soundService.playClick();
    setMode(newMode);
    setErrorMessage('');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginIdentifier.trim()) {
      setErrorMessage('Please enter your email or username');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password');
      return;
    }

    soundService.triggerHaptic('success');
    soundService.playCorrect();

    // Mock successful sign in
    const derivedName = loginIdentifier.includes('@')
      ? loginIdentifier.split('@')[0]
      : loginIdentifier;

    onAuthenticate({
      name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
      email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@arithmo.app`,
      isGuest: false,
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 1000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    soundService.triggerHaptic('heavy');
    soundService.playFanfare();

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#34d399', '#818cf8']
      });
    } catch {
      // Confetti fallback
    }

    const countryObj = COUNTRIES.find(c => c.code === selectedCountry) || COUNTRIES[0];

    onAuthenticate({
      name: fullName.trim(),
      email: email.trim(),
      avatar: selectedAvatar,
      isGuest: false,
      streakDays: 1,
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 1200);
  };

  const handleSocialAuth = (provider: 'google' | 'apple') => {
    soundService.triggerHaptic('medium');
    soundService.playCorrect();

    const providerName = provider === 'google' ? 'Google' : 'Apple';
    const mockUser: Partial<UserProfile> = {
      name: provider === 'google' ? 'Alex Rivera' : 'Math Athlete',
      email: provider === 'google' ? 'alex.rivera@gmail.com' : 'athlete@icloud.com',
      avatar: provider === 'google' ? '🚀' : '🍎',
      isGuest: false,
    };

    onAuthenticate(mockUser);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 900);
  };

  const handleQuickDemo = (demoType: 'grandmaster' | 'exam_aspirant') => {
    soundService.playClick();
    if (demoType === 'grandmaster') {
      onAuthenticate({
        name: 'Vikram Sharma',
        email: 'vikram.vedic@arithmo.app',
        avatar: '👑',
        xp: 8450,
        level: 32,
        isGuest: false,
        streakDays: 42,
        overallAccuracy: 97,
        totalSprintsPlayed: 160,
      });
    } else {
      onAuthenticate({
        name: 'Elena Rostova',
        email: 'elena.cgl@arithmo.app',
        avatar: '⚡',
        xp: 3200,
        level: 14,
        isGuest: false,
        streakDays: 12,
        overallAccuracy: 92,
        totalSprintsPlayed: 54,
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-md max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative text-slate-100">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-700/60 bg-gradient-to-b from-sky-500/20 via-[#1E293B]/60 to-transparent relative shrink-0">
          <button
            id="close-auth-modal-btn"
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/25 font-black text-xl">
              <Sparkles className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black italic tracking-tight text-white uppercase">
                ARITH<span className="text-sky-400">MO</span> ACCOUNT
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {mode === 'signin' ? 'Sign in to sync your global rank and streaks' : 'Join the Global Speed Math Arena'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900/90 border border-slate-700/70 rounded-2xl mt-4">
            <button
              id="auth-tab-signin"
              onClick={() => handleToggleMode('signin')}
              className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                mode === 'signin'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              id="auth-tab-signup"
              onClick={() => handleToggleMode('signup')}
              className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                mode === 'signup'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {isSuccess ? (
            <div className="text-center py-8 space-y-3 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-black text-white">
                {mode === 'signin' ? 'Welcome Back!' : 'Account Created Successfully!'}
              </h4>
              <p className="text-xs text-slate-300">
                Your streaks, calculations, and global rankings are synchronized.
              </p>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold animate-shake flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="social-auth-google"
                  onClick={() => handleSocialAuth('google')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  id="social-auth-apple"
                  onClick={() => handleSocialAuth('apple')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="text-base leading-none"></span>
                  <span>Apple ID</span>
                </button>
              </div>

              <div className="flex items-center gap-3 my-2">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Or with Email</span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              {/* Form by Mode */}
              {mode === 'signin' ? (
                <form onSubmit={handleSignIn} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                      Email or Username
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="signin-email-input"
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="athlete@arithmo.app"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="signin-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="submit-signin-btn"
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Sign In to Arithmo</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-3">
                  {/* Avatar Picker */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                      Choose Your Athlete Avatar
                    </label>
                    <div className="grid grid-cols-6 gap-1.5 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                      {AVATAR_PRESETS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => {
                            soundService.playClick();
                            setSelectedAvatar(av);
                          }}
                          className={`p-2 rounded-xl text-xl flex items-center justify-center transition-all ${
                            selectedAvatar === av
                              ? 'bg-sky-500 text-slate-950 scale-110 shadow-md'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                        Full Name
                      </label>
                      <input
                        id="signup-name-input"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                        Country Flag
                      </label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                      Email Address
                    </label>
                    <input
                      id="signup-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                      Target Focus / Exam
                    </label>
                    <select
                      value={targetGoal}
                      onChange={(e) => setTargetGoal(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                    >
                      {TARGET_GOALS.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                        Password
                      </label>
                      <input
                        id="signup-password-input"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                        Confirm
                      </label>
                      <input
                        id="signup-confirm-password-input"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    id="submit-signup-btn"
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2 mt-2"
                  >
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create Free Account</span>
                  </button>
                </form>
              )}

              {/* 1-Click Fast Demo Logins */}
              <div className="pt-3 border-t border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center mb-2">
                  Fast Demo Test Profiles
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickDemo('grandmaster')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>👑 Grandmaster (Lvl 32)</span>
                  </button>

                  <button
                    onClick={() => handleQuickDemo('exam_aspirant')}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-sky-500/30 text-sky-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5 text-sky-400" />
                    <span>⚡ Exam Sprinter (Lvl 14)</span>
                  </button>
                </div>
              </div>

            </>
          )}

        </div>

      </div>
    </div>
  );
};
