import React, { useState, useRef, useEffect } from 'react';
import { Lock, ShieldAlert, KeyRound, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundService } from '../services/soundService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg('');
      setIsUnlocked(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = (passcode: string) => {
    const clean = passcode.trim();
    // Accepted admin passcodes
    if (clean === '2026' || clean === 'admin8888' || clean === 'admin' || clean === '9999') {
      soundService.triggerHaptic('success');
      soundService.playCorrect();
      setIsUnlocked(true);
      setErrorMsg('');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    } else {
      soundService.triggerHaptic('heavy');
      soundService.playWrong();
      setErrorMsg('Incorrect Admin Passcode. Access restricted.');
      setPin('');
    }
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 8) {
      const next = pin + num;
      setPin(next);
      if (next.length === 4 && (next === '2026' || next === '9999')) {
        handleVerify(next);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-5 text-slate-100 relative space-y-4">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundService.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Cancel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="text-center pt-2 space-y-2">
          <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center transition-all ${
            isUnlocked 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20' 
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/20'
          }`}>
            {isUnlocked ? (
              <CheckCircle2 className="w-7 h-7 animate-bounce" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>

          <div>
            <h3 className="text-base font-black uppercase tracking-tight text-white">
              {isUnlocked ? 'Admin Access Granted' : 'Restricted Admin Portal'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isUnlocked 
                ? 'Opening Question Database Management Studio...' 
                : 'Enter admin security passcode to manage database questions'}
            </p>
          </div>
        </div>

        {/* Pin Input Display */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="relative w-full max-w-[220px]">
              <input
                ref={inputRef}
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter PIN..."
                className="w-full text-center tracking-[0.3em] font-mono-math text-xl font-black py-2.5 px-4 rounded-xl bg-slate-900 border-2 border-slate-700 focus:border-amber-400 focus:outline-none text-amber-400 placeholder:text-slate-600 placeholder:tracking-normal placeholder:text-xs"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-shake">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleKeyPress(n)}
                className="h-11 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-mono-math text-base font-black active:scale-95 transition-all shadow-xs"
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className="h-11 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400 font-bold text-xs active:scale-95 transition-all"
            >
              DEL
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-11 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-mono-math text-base font-black active:scale-95 transition-all shadow-xs"
            >
              0
            </button>
            <button
              type="submit"
              className="h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md shadow-amber-500/20 flex items-center justify-center"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="pt-2 text-center border-t border-slate-800">
          <p className="text-[10px] text-slate-500 font-medium">
            Default Master Passcode: <span className="font-mono text-slate-400 font-bold">2026</span>
          </p>
        </div>

      </div>
    </div>
  );
};
