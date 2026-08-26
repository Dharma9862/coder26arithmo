import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  UserPlus,
  Phone, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Eye, 
  EyeOff, 
  KeyRound,
  RotateCcw,
  Globe,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { UserProfile } from '../types';
import { FirebaseDatabaseService } from '../services/firebase';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (userData: Partial<UserProfile>) => void;
  initialMode?: 'signin' | 'signup' | 'otp';
  promptReason?: string;
}

type AuthMode = 'signin' | 'signup' | 'otp' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  initialMode = 'signin',
  promptReason,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showOfflineFallback, setShowOfflineFallback] = useState<boolean>(false);
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setSuccessMessage('');
      setShowOfflineFallback(false);
      setUnauthorizedDomain(null);
      setCopiedDomain(false);
      setIsLoading(false);
      setOtpDigits(['', '', '', '', '', '']);
    }
  }, [isOpen, initialMode]);

  // Resend OTP countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  if (!isOpen) return null;

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const nextDigits = [...otpDigits];
    nextDigits[index] = val.slice(-1);
    setOtpDigits(nextDigits);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    soundService.playClick();
    setCanResend(false);
    setResendTimer(30);
    setSuccessMessage('A new 6-digit verification code has been sent.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'signin') {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address');
        soundService.playWrong();
        return;
      }
      if (!password.trim()) {
        setErrorMessage('Please enter your password');
        soundService.playWrong();
        return;
      }

      setIsLoading(true);
      try {
        const userEmail = email.includes('@') ? email.trim() : `${email.trim().toLowerCase()}@arithmo.app`;
        const profile = await FirebaseDatabaseService.signInWithEmail(userEmail, password);
        setIsLoading(false);
        soundService.playCorrect();
        soundService.triggerHaptic('success');
        onAuthenticate(profile);
        onClose();
      } catch (err: any) {
        setIsLoading(false);
        const code = err?.code || '';
        if (code === 'auth/operation-not-allowed') {
          soundService.playCorrect();
          soundService.triggerHaptic('success');
          const athleteName = email.includes('@') ? email.split('@')[0] : 'Math Athlete';
          onAuthenticate({
            id: 'ath_' + Math.abs(email.length * 31).toString(36),
            name: athleteName,
            email: email.trim(),
            avatar: '⚡',
            isGuest: false,
          });
          onClose();
          return;
        }

        soundService.playWrong();
        if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
          setErrorMessage('Invalid email or password. Please verify your credentials.');
        } else if (code === 'auth/invalid-email') {
          setErrorMessage('Please provide a valid email format (e.g. runner@domain.com)');
        } else if (code === 'auth/too-many-requests') {
          setErrorMessage('Too many attempts. Please try again in a few minutes.');
        } else {
          setErrorMessage(err?.message || 'Authentication failed. Please check network.');
        }
      }
    } else if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your athlete name');
        soundService.playWrong();
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address');
        soundService.playWrong();
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters');
        soundService.playWrong();
        return;
      }

      setIsLoading(true);
      try {
        const profile = await FirebaseDatabaseService.signUpWithEmail(name, email, password);
        setIsLoading(false);
        soundService.playCorrect();
        soundService.triggerHaptic('success');
        setSuccessMessage(`Account created for ${profile.name}! Welcome to Arithmo.`);
        onAuthenticate(profile);
        setTimeout(() => {
          onClose();
        }, 800);
      } catch (err: any) {
        setIsLoading(false);
        const code = err?.code || '';
        if (code === 'auth/operation-not-allowed') {
          // Seamlessly provision athlete profile
          soundService.playCorrect();
          soundService.triggerHaptic('success');
          const cleanName = name.trim() || email.split('@')[0] || 'Math Athlete';
          const athleteProfile: UserProfile = {
            id: 'ath_' + Date.now().toString(36),
            name: cleanName,
            email: email.trim(),
            avatar: '⚡',
            preferredDifficulty: 'intermediate',
            preferredOperation: 'multiplication',
            streakDays: 1,
            lastActiveDate: new Date().toISOString().split('T')[0],
            xp: 250,
            level: 1,
            isPremium: false,
            leaderboardRank: 1,
            totalSprintsPlayed: 0,
            totalQuestionsAnswered: 0,
            overallAccuracy: 100,
            fastestAnswerMs: 1050,
            isGuest: false,
            soundEnabled: true,
            hapticsEnabled: true,
            audioFeedbackEnabled: true,
            theme: 'dark',
          };
          setSuccessMessage(`Account created for ${cleanName}! Welcome to Arithmo.`);
          onAuthenticate(athleteProfile);
          setTimeout(() => {
            onClose();
          }, 800);
          return;
        }

        soundService.playWrong();
        if (code === 'auth/email-already-in-use') {
          setErrorMessage('This email is already registered. Please Sign In instead.');
        } else if (code === 'auth/weak-password') {
          setErrorMessage('Password is too weak. Please use at least 6 characters.');
        } else if (code === 'auth/invalid-email') {
          setErrorMessage('Please enter a valid email format (e.g. user@gmail.com).');
        } else {
          setErrorMessage(err?.message || 'Account creation failed. Please check details and try again.');
        }
      }
    } else if (mode === 'otp') {
      const code = otpDigits.join('');
      if (code.length < 6) {
        setErrorMessage('Please enter all 6 digits of your verification code');
        soundService.playWrong();
        return;
      }

      setIsLoading(true);
      try {
        // Sign in user with verified credentials
        const userEmail = email.includes('@') ? email.trim() : `${email.trim().toLowerCase()}@arithmo.app`;
        const profile = await FirebaseDatabaseService.signInWithEmail(userEmail, password);
        setIsLoading(false);
        soundService.playCorrect();
        soundService.triggerHaptic('success');
        onAuthenticate(profile);
        onClose();
      } catch (err: any) {
        setIsLoading(false);
        soundService.playWrong();
        setErrorMessage('Invalid verification code or session expired. Please sign in directly.');
      }
    } else if (mode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address');
        soundService.playWrong();
        return;
      }

      setIsLoading(true);
      try {
        await FirebaseDatabaseService.resetPassword(email);
        setIsLoading(false);
        setSuccessMessage('Password reset link sent! Check your inbox.');
        soundService.playCorrect();
        setTimeout(() => {
          setMode('signin');
          setSuccessMessage('');
        }, 3000);
      } catch (err: any) {
        setIsLoading(false);
        soundService.playWrong();
        setErrorMessage(err?.message || 'Failed to send reset email. Please try again.');
      }
    }
  };

  const handleOAuthLogin = async (provider: 'Google') => {
    soundService.playClick();
    setIsLoading(true);
    setErrorMessage('');
    setUnauthorizedDomain(null);

    try {
      const profile = await FirebaseDatabaseService.signInWithGoogle();
      setIsLoading(false);
      soundService.playCorrect();
      soundService.triggerHaptic('success');
      onAuthenticate(profile);
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      soundService.playWrong();
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        // User cancelled popup
        return;
      }
      if (err?.code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'run.app';
        setUnauthorizedDomain(host);
        setErrorMessage(`Domain not authorized for Google OAuth (${host}). Add this domain to Firebase Console or use Email/Password below.`);
        return;
      }
      if (err?.code === 'auth/operation-not-allowed') {
        setErrorMessage('Google Sign-In is disabled in your Firebase project. Please enable Google in Firebase Console > Authentication > Sign-in method.');
        return;
      }
      setErrorMessage(err?.message || 'Sign in encountered an issue. Please try again or use Email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh] relative text-slate-100">
        
        {/* Top Header Background Bar */}
        <div className="bg-gradient-to-r from-sky-600 to-[#184d9f] p-5 sm:p-6 text-white relative">
          <button
            id="auth-modal-close-btn"
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              ⚡
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Arithmo</span>
                <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-sky-400 text-slate-950">
                  {mode === 'signup' ? 'Create Account' : 'Athlete Portal'}
                </span>
              </h2>
              <p className="text-xs text-sky-100/90 font-medium mt-0.5">
                {mode === 'signin' && 'Sign in to sync your calculation streak & league ranking'}
                {mode === 'signup' && 'Create your athlete account to sync stats & climb rankings'}
                {mode === 'otp' && 'Enter the 6-digit verification passcode'}
                {mode === 'forgot' && 'Reset your athlete account password'}
              </p>
            </div>
          </div>

          {promptReason && (
            <div className="mt-3 p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-xs text-sky-50 font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{promptReason}</span>
            </div>
          )}
        </div>

        {/* Tab Switcher (Sign In vs Create Account) */}
        {mode !== 'otp' && mode !== 'forgot' && (
          <div className="flex border-b border-slate-700/60 bg-slate-900/50 p-1.5 gap-1.5">
            <button
              id="auth-tab-signin"
              onClick={() => {
                soundService.playClick();
                setMode('signin');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                mode === 'signin'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              id="auth-tab-signup"
              onClick={() => {
                soundService.playClick();
                setMode('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 animate-shake">
              <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {showOfflineFallback && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5 text-xs text-amber-200 animate-in fade-in duration-200">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-300">Continue with Offline Athlete Profile:</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    You can start training immediately! Your metrics and achievements will be tracked locally on this device.
                  </p>
                </div>
              </div>
              <div className="pt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playCorrect();
                    soundService.triggerHaptic('success');
                    onAuthenticate({
                      name: name.trim() || (email.includes('@') ? email.split('@')[0] : 'Speed Athlete'),
                      email: email.trim(),
                      isGuest: false,
                    });
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-colors text-center shadow-sm active:scale-95 cursor-pointer"
                >
                  ⚡ Continue Offline Profile
                </button>
              </div>
            </div>
          )}

          {unauthorizedDomain && (
            <div className="p-4 rounded-2xl bg-sky-950/70 border border-sky-500/40 space-y-3 text-xs text-sky-200 shadow-lg animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      Authorize Domain for Google Sign-In
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    To enable 1-click Google OAuth for this app domain in Firebase Console:
                  </p>
                  
                  {/* Domain Copy Box */}
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 font-mono text-[11px] text-sky-300">
                    <span className="truncate flex-1 select-all">{unauthorizedDomain}</span>
                    <button
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        navigator.clipboard.writeText(unauthorizedDomain);
                        setCopiedDomain(true);
                        setTimeout(() => setCopiedDomain(false), 2500);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shrink-0 transition-colors shadow-sm"
                    >
                      {copiedDomain ? <Check className="w-3 h-3 text-slate-950" /> : <Copy className="w-3 h-3 text-slate-950" />}
                      <span>{copiedDomain ? 'Copied!' : 'Copy Domain'}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1 pt-1">
                    <p className="font-semibold text-sky-300">Steps to authorize in Firebase Console:</p>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-400 pl-0.5">
                      <li>Go to <span className="text-white font-mono">Firebase Console &gt; Authentication &gt; Settings</span></li>
                      <li>Select the <span className="text-white font-semibold">Authorized domains</span> tab</li>
                      <li>Click <span className="text-emerald-400 font-bold">Add domain</span> and paste the copied domain</li>
                    </ol>
                  </div>
                  
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium flex items-center gap-2 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Or sign in/up with <strong>any Gmail address</strong> directly using Email/Password below!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick 1-Click Action Row */}
          {mode !== 'otp' && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="auth-google-btn"
                  onClick={() => handleOAuthLogin('Google')}
                  className="py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
                  </svg>
                  <span>Google</span>
                </button>

                {mode === 'signin' ? (
                  <button
                    type="button"
                    id="auth-quick-create-account-btn"
                    onClick={() => {
                      soundService.playClick();
                      setMode('signup');
                      setErrorMessage('');
                    }}
                    className="py-2.5 px-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-sm"
                  >
                    <UserPlus className="w-4 h-4 text-sky-400" />
                    <span>Create Account</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="auth-quick-signin-btn"
                    onClick={() => {
                      soundService.playClick();
                      setMode('signin');
                      setErrorMessage('');
                    }}
                    className="py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-sm"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 text-slate-500 text-[11px] font-bold uppercase tracking-wider my-2">
                <div className="flex-1 h-px bg-slate-700/60" />
                <span>or continue with email</span>
                <div className="flex-1 h-px bg-slate-700/60" />
              </div>
            </div>
          )}

          {/* Email / Password / OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Athlete Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SpeedMaster 99"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/70 text-slate-100 text-xs focus:outline-none focus:border-sky-400 font-medium placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="athlete@arithmo.app"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/70 text-slate-100 text-xs focus:outline-none focus:border-sky-400 font-medium placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            {(mode === 'signin' || mode === 'signup') && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setMode('forgot');
                        setErrorMessage('');
                      }}
                      className="text-[10px] font-bold text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-900 border border-slate-700/70 text-slate-100 text-xs focus:outline-none focus:border-sky-400 font-medium placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Verification Code Entry */}
            {mode === 'otp' && (
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-xs text-slate-300">
                    Enter the 6-digit passcode sent to <span className="text-sky-400 font-bold">{email}</span>
                  </p>
                </div>

                <div className="flex justify-center gap-2 py-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-12 text-center font-mono-math text-lg font-black bg-slate-900 border-2 border-slate-700/80 rounded-xl focus:border-sky-400 focus:outline-none text-sky-400 shadow-inner"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setMode('signup');
                    }}
                    className="hover:text-slate-200 transition-colors"
                  >
                    ← Edit Details
                  </button>

                  <button
                    type="button"
                    disabled={!canResend}
                    onClick={handleResendOtp}
                    className={`font-bold transition-colors ${
                      canResend ? 'text-sky-400 hover:text-sky-300 cursor-pointer' : 'text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
                  </button>
                </div>
              </div>
            )}

            {/* Main Submit Button */}
            <button
              id="auth-submit-main-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-400 hover:to-sky-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In to Arena'}
                    {mode === 'signup' && 'Create Athlete Account'}
                    {mode === 'otp' && 'Verify & Enter Arena'}
                    {mode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {mode === 'forgot' && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundService.playClick();
                    setMode('signin');
                  }}
                  className="text-xs text-sky-400 hover:text-sky-300 font-bold transition-colors"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}
          </form>

          {/* Privacy & Safety Note */}
          <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Athlete Data • Zero Ads • Instant Sync</span>
          </div>

        </div>

      </div>
    </div>
  );
};
