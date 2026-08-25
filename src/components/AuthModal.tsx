import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Phone,
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Flame,
  Trophy,
  ShieldCheck,
  RotateCcw,
  Smartphone,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { soundService } from '../services/soundService';

export type AuthTab = 'google' | 'email_signin' | 'email_signup' | 'phone_otp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (userData: Partial<UserProfile>) => void;
  initialMode?: 'signin' | 'signup' | 'otp';
  promptReason?: string;
}

const AVATAR_PRESETS = ['⚡', '🧠', '👑', '🚀', '💎', '🎯', '🔥', '🏆', '🌟', '🦁', '🥋', '🦊'];

const TARGET_GOALS = [
  { id: 'math_athlete', label: 'Speed Math Athlete & Vedic Drills' },
  { id: 'ssc_bank', label: 'Competitive Exams (SSC CGL, Bank PO, Railways)' },
  { id: 'cat_gre', label: 'Management & Grad (CAT, GMAT, GRE)' },
  { id: 'school_sat', label: 'School & Standardized Tests (SAT, ACT)' },
  { id: 'brain_fitness', label: 'Daily Mental Agility & Focus' },
];

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', name: 'India (+91)', flag: '🇮🇳' },
  { code: '+1', country: 'US', name: 'USA / Canada (+1)', flag: '🇺🇸' },
  { code: '+44', country: 'GB', name: 'United Kingdom (+44)', flag: '🇬🇧' },
  { code: '+880', country: 'BD', name: 'Bangladesh (+880)', flag: '🇧🇩' },
  { code: '+61', country: 'AU', name: 'Australia (+61)', flag: '🇦🇺' },
  { code: '+49', country: 'DE', name: 'Germany (+49)', flag: '🇩🇪' },
  { code: '+81', country: 'JP', name: 'Japan (+81)', flag: '🇯🇵' },
  { code: '+65', country: 'SG', name: 'Singapore (+65)', flag: '🇸🇬' },
  { code: '+971', country: 'AE', name: 'UAE (+971)', flag: '🇦🇪' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  initialMode = 'signin',
  promptReason,
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(
    initialMode === 'otp' ? 'phone_otp' : initialMode === 'signup' ? 'email_signup' : 'email_signin'
  );
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successInfo, setSuccessInfo] = useState<{ title: string; desc: string } | null>(null);

  // Email Sign In
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Email Sign Up
  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('⚡');
  const [targetGoal, setTargetGoal] = useState<string>('math_athlete');

  // Phone OTP
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpStep, setOtpStep] = useState<'phone_input' | 'otp_verify'>('phone_input');
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '', '', '']);
  const [sentOtpDisplay, setSentOtpDisplay] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Email OTP / Verification step (optional)
  const [emailOtpStep, setEmailOtpStep] = useState<boolean>(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState<string>('');
  const [sentEmailOtp, setSentEmailOtp] = useState<string>('');

  useEffect(() => {
    if (initialMode === 'otp') setActiveTab('phone_otp');
    else if (initialMode === 'signup') setActiveTab('email_signup');
    else setActiveTab('email_signin');
    setErrorMessage('');
    setSuccessInfo(null);
    setOtpStep('phone_input');
    setEmailOtpStep(false);
  }, [initialMode, isOpen]);

  // Resend Timer Countdown
  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  const triggerSuccessCelebration = (title: string, desc: string, userData: Partial<UserProfile>) => {
    soundService.triggerHaptic('heavy');
    soundService.playFanfare();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#34d399', '#818cf8']
      });
    } catch {
      // fallback
    }

    setSuccessInfo({ title, desc });
    onAuthenticate({
      ...userData,
      isGuest: false,
    });

    setTimeout(() => {
      onClose();
      setSuccessInfo(null);
    }, 1300);
  };

  // Google Authentication Handler
  const handleGoogleAuth = () => {
    soundService.triggerHaptic('medium');
    soundService.playCorrect();
    setErrorMessage('');

    // Pre-configured Google User
    const googleEmail = 'dharmapriyochakma72@gmail.com';
    const googleName = 'Dharmapriyo Chakma';

    triggerSuccessCelebration(
      'Google Sign-In Successful!',
      `Signed in with ${googleEmail}. All speed sprints and stats unlocked.`,
      {
        name: googleName,
        email: googleEmail,
        avatar: '🚀',
        authProvider: 'google',
        isEmailVerified: true,
        streakDays: Math.max(1, 4),
      }
    );
  };

  // Email Sign In Handler
  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email or username');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password');
      return;
    }

    soundService.triggerHaptic('success');
    soundService.playCorrect();

    const derivedName = loginEmail.includes('@')
      ? loginEmail.split('@')[0]
      : loginEmail;

    const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

    triggerSuccessCelebration(
      'Welcome Back!',
      `Signed in as ${loginEmail}. Your stats and rankings are synced.`,
      {
        name: formattedName,
        email: loginEmail.includes('@') ? loginEmail : `${loginEmail}@arithmo.app`,
        authProvider: 'email',
        isEmailVerified: true,
      }
    );
  };

  // Email Sign Up Handler
  const handleEmailSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signUpName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // Step into Email Verification Code Confirmation
    const generatedEmailCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSentEmailOtp(generatedEmailCode);
    setEmailOtpStep(true);
    soundService.playClick();
  };

  // Verify Email Code
  const handleVerifyEmailCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!emailVerificationCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email');
      return;
    }

    if (emailVerificationCode.trim() !== sentEmailOtp && emailVerificationCode.trim() !== '123456') {
      setErrorMessage(`Invalid code. Enter the code "${sentEmailOtp}" or 123456`);
      return;
    }

    triggerSuccessCelebration(
      'Account Verified & Created!',
      `Welcome to Arithmo, ${signUpName}! All activities are unlocked.`,
      {
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        avatar: selectedAvatar,
        authProvider: 'email',
        isEmailVerified: true,
        streakDays: 1,
      }
    );
  };

  // Phone OTP: Send Code
  const handleSendMobileOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 7 || cleanNumber.length > 15) {
      setErrorMessage('Please enter a valid mobile phone number');
      return;
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtpDisplay(generatedOtp);
    setOtpStep('otp_verify');
    setResendTimer(45);
    setOtpCode(['', '', '', '', '', '']);
    soundService.playCorrect();

    // Auto-focus first input
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  // Handle OTP digit input
  const handleOtpDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Phone OTP: Verify Code
  const handleVerifyMobileOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const enteredCode = otpCode.join('');
    if (enteredCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP code');
      return;
    }

    if (enteredCode !== sentOtpDisplay && enteredCode !== '123456') {
      setErrorMessage(`Invalid verification code. Enter "${sentOtpDisplay}" or 123456`);
      return;
    }

    const fullPhone = `${selectedCountryCode} ${phoneNumber.trim()}`;
    const autoName = `User ${phoneNumber.slice(-4) || 'Athlete'}`;

    triggerSuccessCelebration(
      'Mobile Number Verified!',
      `Signed in with ${fullPhone}. Speed Sprints and Exam Prep are now active!`,
      {
        name: autoName,
        email: `${phoneNumber.replace(/\D/g, '')}@mobile.arithmo.app`,
        phone: fullPhone,
        avatar: '📱',
        authProvider: 'otp',
        isPhoneVerified: true,
        streakDays: 1,
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-md max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700/60 bg-gradient-to-b from-sky-500/20 via-[#1E293B]/60 to-transparent relative shrink-0">
          <button
            id="close-auth-modal-btn"
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="absolute top-3.5 right-3.5 p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/25 font-black text-lg">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black italic tracking-tight text-white uppercase leading-tight">
                ARITH<span className="text-sky-400">MO</span> AUTH
              </h3>
              <p className="text-[11px] text-slate-300 font-medium leading-tight">
                Sign in or create account to unlock all drills & exam practice
              </p>
            </div>
          </div>

          {/* Context Banner if activities are locked */}
          {promptReason && (
            <div className="mt-3 p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{promptReason}</span>
            </div>
          )}

          {/* Auth Methods Switcher Navigation */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 border border-slate-700/70 rounded-2xl mt-3">
            <button
              id="auth-nav-google"
              onClick={() => {
                soundService.playClick();
                setActiveTab('google');
                setErrorMessage('');
              }}
              className={`py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                activeTab === 'google'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                <path fill={activeTab === 'google' ? '#020617' : '#EA4335'} d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                <path fill={activeTab === 'google' ? '#020617' : '#4285F4'} d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill={activeTab === 'google' ? '#020617' : '#FBBC05'} d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                <path fill={activeTab === 'google' ? '#020617' : '#34A853'} d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              id="auth-nav-email"
              onClick={() => {
                soundService.playClick();
                setActiveTab(activeTab === 'email_signup' ? 'email_signup' : 'email_signin');
                setErrorMessage('');
              }}
              className={`py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                activeTab === 'email_signin' || activeTab === 'email_signup'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>

            <button
              id="auth-nav-otp"
              onClick={() => {
                soundService.playClick();
                setActiveTab('phone_otp');
                setErrorMessage('');
              }}
              className={`py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                activeTab === 'phone_otp'
                  ? 'bg-sky-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile OTP</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {successInfo ? (
            <div className="text-center py-8 space-y-3 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white">
                {successInfo.title}
              </h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                {successInfo.desc}
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

              {/* 1. GOOGLE AUTH VIEW */}
              {activeTab === 'google' && (
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto shadow-inner">
                      <svg className="w-7 h-7" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Instant 1-Tap Google Sign-In</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Fastest way to sync your daily streaks, Vedic math stats, and exam rankings.
                      </p>
                    </div>

                    <button
                      id="google-primary-signin-btn"
                      onClick={handleGoogleAuth}
                      className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                        <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. EMAIL SIGN IN & SIGN UP VIEW */}
              {(activeTab === 'email_signin' || activeTab === 'email_signup') && (
                <div className="space-y-3">
                  {/* Mode switcher: Sign In vs Sign Up */}
                  <div className="flex items-center justify-center gap-4 text-xs font-bold pb-1 border-b border-slate-800">
                    <button
                      id="email-subtab-signin"
                      onClick={() => {
                        setActiveTab('email_signin');
                        setEmailOtpStep(false);
                        setErrorMessage('');
                      }}
                      className={`pb-1 transition-colors ${
                        activeTab === 'email_signin'
                          ? 'text-sky-400 border-b-2 border-sky-400 font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Sign In Existing
                    </button>
                    <button
                      id="email-subtab-signup"
                      onClick={() => {
                        setActiveTab('email_signup');
                        setEmailOtpStep(false);
                        setErrorMessage('');
                      }}
                      className={`pb-1 transition-colors ${
                        activeTab === 'email_signup'
                          ? 'text-sky-400 border-b-2 border-sky-400 font-black'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Create Free Account
                    </button>
                  </div>

                  {activeTab === 'email_signin' ? (
                    <form onSubmit={handleEmailSignIn} className="space-y-3 pt-1">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                          Email or Username
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            id="signin-email-input"
                            type="text"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
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
                        className="w-full py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2 mt-2"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                      </button>
                    </form>
                  ) : emailOtpStep ? (
                    /* Email OTP Verification Step */
                    <form onSubmit={handleVerifyEmailCode} className="space-y-3 pt-1 animate-fadeIn">
                      <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-center space-y-1">
                        <Mail className="w-5 h-5 text-sky-400 mx-auto" />
                        <span className="text-xs font-bold text-white block">
                          Verification Code Sent to {signUpEmail}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Demo OTP: <strong className="text-sky-300 font-mono-math">{sentEmailOtp}</strong> (or enter 123456)
                        </p>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                          6-Digit Email Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={emailVerificationCode}
                          onChange={(e) => setEmailVerificationCode(e.target.value)}
                          placeholder="123456"
                          className="w-full text-center tracking-[0.3em] font-mono-math text-base py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sky-400 focus:outline-none focus:border-sky-500 font-black"
                        />
                      </div>

                      <button
                        id="submit-email-otp-btn"
                        type="submit"
                        className="w-full py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Verify & Unlock Activities</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEmailOtpStep(false)}
                        className="w-full text-[11px] text-slate-400 hover:text-white text-center py-1"
                      >
                        ← Edit Account Details
                      </button>
                    </form>
                  ) : (
                    /* Account Details Input Form */
                    <form onSubmit={handleEmailSignUp} className="space-y-3 pt-1">
                      {/* Avatar Picker */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                          Choose Avatar
                        </label>
                        <div className="grid grid-cols-6 gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                          {AVATAR_PRESETS.map((av) => (
                            <button
                              key={av}
                              type="button"
                              onClick={() => {
                                soundService.playClick();
                                setSelectedAvatar(av);
                              }}
                              className={`p-1.5 rounded-xl text-lg flex items-center justify-center transition-all ${
                                selectedAvatar === av
                                  ? 'bg-sky-500 text-slate-950 scale-105 shadow-md'
                                  : 'hover:bg-slate-800 text-slate-300'
                              }`}
                            >
                              {av}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                          Full Name
                        </label>
                        <input
                          id="signup-name-input"
                          type="text"
                          value={signUpName}
                          onChange={(e) => setSignUpName(e.target.value)}
                          placeholder="Alex Rivera"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                          Email Address
                        </label>
                        <input
                          id="signup-email-input"
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
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
                          className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
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
                            value={signUpPassword}
                            onChange={(e) => setSignUpPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                            Confirm
                          </label>
                          <input
                            id="signup-confirm-password-input"
                            type="password"
                            value={signUpConfirmPassword}
                            onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                          />
                        </div>
                      </div>

                      <button
                        id="submit-signup-btn"
                        type="submit"
                        className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 mt-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Continue & Verify Email</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* 3. MOBILE PHONE OTP VIEW */}
              {activeTab === 'phone_otp' && (
                <div className="space-y-3 py-1">
                  {otpStep === 'phone_input' ? (
                    <form onSubmit={handleSendMobileOtp} className="space-y-3">
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-md">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-black text-white">Mobile SMS OTP Verification</h4>
                        <p className="text-xs text-slate-400">
                          Receive a fast 6-digit SMS verification code to sign in instantly.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                          Country & Phone Number
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={selectedCountryCode}
                            onChange={(e) => setSelectedCountryCode(e.target.value)}
                            className="w-28 px-2 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-bold shrink-0"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code + c.country} value={c.code}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>

                          <div className="relative flex-1">
                            <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              id="phone-number-input"
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="98765 43210"
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-sky-500 font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        id="send-mobile-otp-btn"
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 mt-2"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Send 6-Digit OTP Code</span>
                      </button>
                    </form>
                  ) : (
                    /* OTP Verification Digits */
                    <form onSubmit={handleVerifyMobileOtp} className="space-y-4 animate-fadeIn">
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-center space-y-1">
                        <span className="text-xs font-bold text-white block">
                          OTP Sent to {selectedCountryCode} {phoneNumber}
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Demo OTP Code: <strong className="text-amber-300 font-mono-math">{sentOtpDisplay}</strong> (or 123456)
                        </p>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 text-center">
                          Enter 6-Digit Verification Code
                        </label>
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                          {otpCode.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => (otpInputRefs.current[idx] = el)}
                              id={`otp-box-${idx}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-10 h-12 sm:w-11 sm:h-13 rounded-xl bg-slate-900 border-2 border-slate-700 text-center font-mono-math text-lg font-black text-amber-400 focus:border-amber-400 focus:outline-none transition-colors"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                        {resendTimer > 0 ? (
                          <span>Resend in <strong className="text-amber-400">{resendTimer}s</strong></span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleSendMobileOtp(e)}
                            className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Resend OTP
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setOtpStep('phone_input')}
                          className="text-slate-400 hover:text-white"
                        >
                          Change Number
                        </button>
                      </div>

                      <button
                        id="verify-mobile-otp-btn"
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Unlock App</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Fast 1-Click Demo Profiles */}
              <div className="pt-3 border-t border-slate-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center mb-2">
                  Fast 1-Click Demo Testing
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      triggerSuccessCelebration(
                        'Demo Grandmaster Signed In',
                        'Signed in as Vikram Sharma (Lvl 32). All features unlocked.',
                        {
                          name: 'Vikram Sharma',
                          email: 'vikram.vedic@arithmo.app',
                          avatar: '👑',
                          xp: 8450,
                          level: 32,
                          streakDays: 42,
                          overallAccuracy: 97,
                          totalSprintsPlayed: 160,
                          authProvider: 'email',
                          isEmailVerified: true,
                        }
                      );
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>👑 Grandmaster (Lvl 32)</span>
                  </button>

                  <button
                    onClick={() => {
                      triggerSuccessCelebration(
                        'Demo Aspirant Signed In',
                        'Signed in as Elena Rostova (Lvl 14). All features unlocked.',
                        {
                          name: 'Elena Rostova',
                          email: 'elena.cgl@arithmo.app',
                          avatar: '⚡',
                          xp: 3200,
                          level: 14,
                          streakDays: 12,
                          overallAccuracy: 92,
                          totalSprintsPlayed: 54,
                          authProvider: 'email',
                          isEmailVerified: true,
                        }
                      );
                    }}
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
