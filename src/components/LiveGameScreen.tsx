import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Pause, 
  Play, 
  RotateCcw, 
  X, 
  Flame, 
  Sparkles, 
  Zap,
  HelpCircle,
  Volume2,
  VolumeX,
  ArrowLeft
} from 'lucide-react';
import { DifficultyLevel, GameDuration, GameSessionResult, MathOperation, MathQuestion } from '../types';
import { MathGenerator } from '../services/mathGenerator';
import { soundService } from '../services/soundService';

interface LiveGameScreenProps {
  operation: MathOperation;
  difficulty: DifficultyLevel;
  duration: GameDuration;
  onFinishGame: (result: GameSessionResult) => void;
  onQuit: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const LiveGameScreen: React.FC<LiveGameScreenProps> = ({
  operation,
  difficulty,
  duration,
  onFinishGame,
  onQuit,
  soundEnabled,
  onToggleSound,
}) => {
  // Game Flow States
  const [countdown, setCountdown] = useState<number>(3); // Initial 3..2..1..GO
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  
  // Scoring & Stats
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [adaptiveStreak, setAdaptiveStreak] = useState<number>(0);

  // Keep fresh refs to prevent stale closures when game ends
  const scoreRef = useRef<number>(0);
  const correctCountRef = useRef<number>(0);
  const wrongCountRef = useRef<number>(0);
  const maxComboRef = useRef<number>(0);

  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { correctCountRef.current = correctCount; }, [correctCount]);
  useEffect(() => { wrongCountRef.current = wrongCount; }, [wrongCount]);
  useEffect(() => { maxComboRef.current = maxCombo; }, [maxCombo]);
  
  // Question State
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // Mobile / Tablet Input Mode Toggle: 4-Option Cards vs Tactile Numpad
  const [inputMode, setInputMode] = useState<'options' | 'numpad'>('options');
  const [numpadBuffer, setNumpadBuffer] = useState<string>('');
  
  // Reaction Times & Tracking
  const questionTimesRef = useRef<number[]>([]);
  const mistakesRef = useRef<MathQuestion[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const sessionStartTimeRef = useRef<number>(0);
  const hasEndedRef = useRef<boolean>(false);

  // Sound sync
  useEffect(() => {
    soundService.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Load next question
  const loadNextQuestion = useCallback((streak: number = adaptiveStreak) => {
    const nextQ = MathGenerator.generateQuestion(operation, difficulty, streak);
    setCurrentQuestion(nextQ);
    setSelectedOption(null);
    setNumpadBuffer('');
    setFeedbackStatus('idle');
    setQuestionStartTime(Date.now());
  }, [operation, difficulty, adaptiveStreak]);

  // End Game Handler
  const handleEndGame = useCallback(() => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsPlaying(false);

    const currentScore = scoreRef.current;
    const curCorrect = correctCountRef.current;
    const curWrong = wrongCountRef.current;
    const curMaxCombo = maxComboRef.current;

    const times = questionTimesRef.current;
    const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
    const bestTime = times.length > 0 ? Math.min(...times) : 0;
    const totalAns = curCorrect + curWrong;
    const accuracy = totalAns > 0 ? Math.round((curCorrect / totalAns) * 100) : 0;

    // XP calculation factoring in combo & accuracy
    const baseScoreXp = Math.round(currentScore * 0.15);
    const accuracyBonus = accuracy >= 90 ? 50 : (accuracy >= 80 ? 25 : 0);
    const comboBonus = curMaxCombo * 5;
    const totalXp = Math.max(20, baseScoreXp + accuracyBonus + comboBonus);

    const result: GameSessionResult = {
      id: 'sess_' + Date.now(),
      operation,
      difficulty,
      duration,
      score: currentScore,
      correctCount: curCorrect,
      wrongCount: curWrong,
      totalAnswered: totalAns,
      accuracy,
      maxCombo: curMaxCombo,
      avgTimeSpentMs: avgTime,
      bestTimeMs: bestTime,
      xpEarned: totalXp,
      timestamp: Date.now(),
      mistakes: mistakesRef.current,
    };

    soundService.playFanfare();
    onFinishGame(result);
  }, [operation, difficulty, duration, onFinishGame]);

  // 3-2-1 Countdown before Sprint starts
  useEffect(() => {
    if (countdown > 0) {
      soundService.playCountdown(countdown === 1);
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 900);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isPlaying) {
      setIsPlaying(true);
      sessionStartTimeRef.current = Date.now();
      loadNextQuestion(0);
    }
  }, [countdown, isPlaying, loadNextQuestion]);

  // Main Sprint Timer Loop
  useEffect(() => {
    if (isPlaying && !isPaused && duration > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            // Defer execution outside React render cycle
            setTimeout(() => {
              handleEndGame();
            }, 0);
            return 0;
          }
          if (prev <= 5) {
            soundService.playTick();
          }
          return prev - 1;
        });
        setElapsedMs((prev) => prev + 1000);
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      };
    }
  }, [isPlaying, isPaused, duration, handleEndGame]);

  // Answer Submission Handler
  const handleAnswer = (option: number) => {
    if (!currentQuestion || feedbackStatus !== 'idle' || isPaused) return;

    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = option === currentQuestion.correctAnswer;
    
    setSelectedOption(option);
    questionTimesRef.current.push(timeSpent);

    if (isCorrect) {
      setFeedbackStatus('correct');
      const newCombo = combo + 1;
      const newAdaptive = adaptiveStreak + 1;
      
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      setAdaptiveStreak(newAdaptive);
      setCorrectCount((prev) => prev + 1);

      // Score multiplier: Base 100 + Speed Bonus + Combo Bonus
      const speedBonus = Math.max(0, Math.round((3000 - timeSpent) / 30));
      const comboMultiplier = 1 + Math.min(newCombo * 0.15, 2.0); // up to 3.0x
      const points = Math.round((100 + speedBonus) * comboMultiplier);
      setScore((prev) => prev + points);

      soundService.playCorrect(newCombo);
      soundService.triggerHaptic('light');

      setTimeout(() => {
        loadNextQuestion(newAdaptive);
      }, 240);

    } else {
      setFeedbackStatus('wrong');
      setCombo(0);
      setAdaptiveStreak(0);
      setWrongCount((prev) => prev + 1);
      
      // Deduct small penalty
      setScore((prev) => Math.max(0, prev - 25));

      // Record mistake
      mistakesRef.current.push({
        ...currentQuestion,
        userAnswer: option,
        isCorrect: false,
        timeSpentMs: timeSpent,
      });

      soundService.playWrong();
      soundService.triggerHaptic('error');

      setTimeout(() => {
        loadNextQuestion(0);
      }, 450);
    }
  };

  // Numpad Handlers for Mobile & Tablet
  const handleNumpadDigit = (digit: string) => {
    if (!currentQuestion || feedbackStatus !== 'idle' || isPaused) return;
    soundService.triggerHaptic('light');
    const newBuf = (numpadBuffer + digit).slice(0, 6);
    setNumpadBuffer(newBuf);

    // Auto-check if matches target or length
    const parsed = parseInt(newBuf, 10);
    if (!isNaN(parsed) && parsed === currentQuestion.correctAnswer) {
      handleAnswer(parsed);
    }
  };

  const handleNumpadBackspace = () => {
    soundService.triggerHaptic('light');
    setNumpadBuffer((prev) => prev.slice(0, -1));
  };

  const handleNumpadClear = () => {
    soundService.triggerHaptic('light');
    setNumpadBuffer('');
  };

  const handleNumpadSubmit = () => {
    if (!numpadBuffer || !currentQuestion || feedbackStatus !== 'idle') return;
    const parsed = parseInt(numpadBuffer, 10);
    if (!isNaN(parsed)) {
      handleAnswer(parsed);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentQuestion || feedbackStatus !== 'idle' || isPaused || !isPlaying) return;
      
      if (inputMode === 'options') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const index = parseInt(e.key, 10) - 1;
          if (currentQuestion.options[index] !== undefined) {
            handleAnswer(currentQuestion.options[index]);
          }
        }
      } else {
        // Numpad keyboard entry
        if (/^[0-9]$/.test(e.key)) {
          handleNumpadDigit(e.key);
        } else if (e.key === 'Backspace') {
          handleNumpadBackspace();
        } else if (e.key === 'Enter') {
          handleNumpadSubmit();
        } else if (e.key === 'c' || e.key === 'C') {
          handleNumpadClear();
        }
      }

      if (e.key === 'Escape') {
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, feedbackStatus, isPaused, isPlaying, inputMode, numpadBuffer]);

  // Progress percentage for circular ring
  const progressPct = duration > 0 ? (timeLeft / duration) * 100 : 100;

  // Combo multiplier label
  const comboMultiplier = combo > 0 ? (1 + Math.min(combo * 0.15, 2.0)).toFixed(1) : '1.0';

  // 3..2..1 Countdown Overlay
  if (countdown > 0) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col items-center justify-center p-6 select-none">
        <div className="text-center">
          <p className="text-sky-400 text-xs sm:text-sm uppercase tracking-[0.25em] font-black mb-6 animate-pulse">
            GET READY FOR SPRINT
          </p>
          <div className="w-40 h-40 rounded-3xl bg-[#1E293B] border-4 border-sky-500/50 flex items-center justify-center shadow-2xl shadow-sky-500/25 mx-auto transform scale-110 transition-all duration-300">
            <span className="font-mono-math text-7xl sm:text-8xl font-black text-white italic">
              {countdown}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-8 font-black uppercase tracking-widest">
            Keys [1] [2] [3] [4] or tap to answer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col justify-between p-4 sm:p-6 select-none max-w-2xl mx-auto">
      
      {/* Top Status Bar */}
      <div className="w-full flex items-center justify-between gap-3 bg-[#1E293B] backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-700/60 shadow-xl">
        
        {/* Back / Exit, Pause & Sound buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="back-exit-sprint-btn"
            onClick={onQuit}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700/50"
            title="Back / Exit Sprint"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            id="pause-sprint-btn"
            onClick={() => setIsPaused(true)}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700/50"
            title="Pause Game"
          >
            <Pause className="w-5 h-5" />
          </button>
          <button
            id="toggle-game-sound-btn"
            onClick={onToggleSound}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700/50"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-sky-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-500" />
            )}
          </button>
        </div>

        {/* Timer / Practice Mode Display */}
        <div className="flex items-center gap-2">
          {duration > 0 ? (
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono-math font-black text-lg sm:text-xl transition-colors ${
              timeLeft <= 5 
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse' 
                : 'bg-slate-900 border-slate-700 text-sky-400'
            }`}>
              <div className="w-2.5 h-2.5 rounded-full bg-current animate-ping" />
              <span>{timeLeft}S</span>
            </div>
          ) : (
            <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-black uppercase tracking-wider text-sky-400">
              Zen Practice
            </div>
          )}
        </div>

        {/* Score & Combo */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">SCORE</span>
            <span className="font-mono-math font-black text-xl sm:text-2xl text-white">
              {score}
            </span>
          </div>
          {combo >= 2 && (
            <div className="flex items-center justify-end gap-1 text-[11px] font-black uppercase tracking-wider text-amber-400 animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{combo}X COMBO ({comboMultiplier}x)</span>
            </div>
          )}
        </div>

      </div>

      {/* Timer Progress Bar */}
      {duration > 0 && (
        <div className="w-full bg-slate-800/80 h-2 rounded-full mt-3 overflow-hidden border border-slate-700/40">
          <div 
            className={`h-full transition-all duration-300 rounded-full ${
              timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-sky-500 to-emerald-400'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Main Arithmetic Equation Card */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10">
        
        {/* Adaptive level pill */}
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#1E293B] border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
            <span className="capitalize">{currentQuestion?.difficulty || difficulty} Tier</span>
          </span>
          {adaptiveStreak >= 5 && (
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              ADAPTIVE BOOST
            </span>
          )}
        </div>

        {/* Large Equation Display */}
        <div className={`w-full max-w-md py-8 sm:py-12 px-6 rounded-3xl bg-[#1E293B] border-2 transition-all duration-200 text-center shadow-2xl relative ${
          feedbackStatus === 'correct'
            ? 'border-emerald-500 shadow-emerald-500/25 scale-105'
            : feedbackStatus === 'wrong'
              ? 'border-rose-500 shadow-rose-500/25 animate-shake'
              : 'border-slate-700/80'
        }`}>
          
          <span className="font-mono-math text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
            {currentQuestion?.displayExpression || '...'}
          </span>

          <div className="mt-3">
            <span className="text-sky-400 font-mono-math text-2xl sm:text-3xl font-black">
              = {inputMode === 'numpad' ? (numpadBuffer ? <span className="text-white underline decoration-sky-400 decoration-4">{numpadBuffer}</span> : '?') : '?'}
            </span>
          </div>

          {/* Feedback Icon Overlay */}
          {feedbackStatus === 'correct' && (
            <div className="absolute top-3.5 right-4 text-emerald-400 font-black text-xs uppercase tracking-widest flex items-center gap-1 animate-in zoom-in-50">
              <Sparkles className="w-4 h-4" />
              <span>GREAT!</span>
            </div>
          )}
          {feedbackStatus === 'wrong' && (
            <div className="absolute top-3.5 right-4 text-rose-400 font-black text-xs uppercase tracking-widest flex items-center gap-1 animate-in zoom-in-50">
              <span>MISSED!</span>
            </div>
          )}

        </div>

      </div>

      {/* Input Mode Selector & Answer Controls */}
      <div className="w-full max-w-md mx-auto space-y-2 mb-2">
        
        {/* Mode Switcher Pill (4-Choice vs Tactile Numpad) */}
        <div className="flex items-center justify-between px-1 mb-1 text-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Input Mode
          </span>
          <div className="flex items-center p-0.5 bg-slate-900 border border-slate-700/80 rounded-xl">
            <button
              id="input-mode-options-btn"
              onClick={() => {
                soundService.triggerHaptic('light');
                setInputMode('options');
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                inputMode === 'options'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4 Cards
            </button>
            <button
              id="input-mode-numpad-btn"
              onClick={() => {
                soundService.triggerHaptic('light');
                setInputMode('numpad');
              }}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                inputMode === 'numpad'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rapid Numpad
            </button>
          </div>
        </div>

        {/* Option 1: 4 Multiple Choice Option Cards */}
        {inputMode === 'options' ? (
          <div className="grid grid-cols-2 gap-3.5">
            {currentQuestion?.options.map((opt, idx) => {
              const isThisSelected = selectedOption === opt;
              const isCorrectAnswer = currentQuestion.correctAnswer === opt;
              
              let btnStyle = 'bg-[#1E293B] border-slate-700 text-white hover:bg-slate-800 hover:border-sky-500/60 active:scale-[0.97]';
              
              if (feedbackStatus !== 'idle') {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-500 border-emerald-400 text-slate-950 font-black scale-[1.02] shadow-xl shadow-emerald-500/30';
                } else if (isThisSelected) {
                  btnStyle = 'bg-rose-500 border-rose-400 text-white font-black animate-shake';
                } else {
                  btnStyle = 'bg-[#1E293B]/40 border-slate-800/40 text-slate-600 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  id={`option-btn-${idx}`}
                  onClick={() => handleAnswer(opt)}
                  disabled={feedbackStatus !== 'idle'}
                  className={`py-5 sm:py-6 px-4 rounded-3xl border-2 transition-all font-mono-math font-black text-2xl sm:text-3xl relative overflow-hidden shadow-lg flex items-center justify-center ${btnStyle}`}
                >
                  {/* Keyboard shortcut hint */}
                  <span className="absolute top-2.5 left-3 text-[10px] font-sans font-black text-slate-500 opacity-80 uppercase tracking-widest">
                    [{idx + 1}]
                  </span>
                  <span>{operation === 'right_or_wrong' ? (opt === 1 ? '✓ RIGHT' : '✕ WRONG') : opt}</span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Option 2: Mobile & Tablet Tactile Numpad Grid (0-9, Clear, Backspace, Submit) */
          <div className="bg-[#1E293B] p-3 rounded-3xl border border-slate-700/80 shadow-2xl space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  id={`numpad-btn-${digit}`}
                  onClick={() => handleNumpadDigit(digit)}
                  disabled={feedbackStatus !== 'idle'}
                  className="py-3 sm:py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-sky-500 active:text-slate-950 text-white border border-slate-700/70 font-mono-math font-black text-2xl sm:text-3xl shadow-sm transition-all active:scale-95 flex items-center justify-center touch-manipulation"
                >
                  {digit}
                </button>
              ))}

              {/* Clear */}
              <button
                id="numpad-btn-clear"
                onClick={handleNumpadClear}
                disabled={feedbackStatus !== 'idle'}
                className="py-3 sm:py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-rose-400 border border-slate-700/50 font-black text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center touch-manipulation"
              >
                Clear
              </button>

              {/* Zero */}
              <button
                id="numpad-btn-0"
                onClick={() => handleNumpadDigit('0')}
                disabled={feedbackStatus !== 'idle'}
                className="py-3 sm:py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:bg-sky-500 active:text-slate-950 text-white border border-slate-700/70 font-mono-math font-black text-2xl sm:text-3xl shadow-sm transition-all active:scale-95 flex items-center justify-center touch-manipulation"
              >
                0
              </button>

              {/* Backspace / Delete */}
              <button
                id="numpad-btn-backspace"
                onClick={handleNumpadBackspace}
                disabled={feedbackStatus !== 'idle'}
                className="py-3 sm:py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-amber-400 border border-slate-700/50 font-black text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center touch-manipulation"
              >
                ⌫ Del
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="numpad-btn-submit"
              onClick={handleNumpadSubmit}
              disabled={feedbackStatus !== 'idle' || !numpadBuffer}
              className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 touch-manipulation ${
                numpadBuffer
                  ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/25'
                  : 'bg-slate-900 text-slate-500 border border-slate-800 opacity-60'
              }`}
            >
              <span>Submit Answer [{numpadBuffer || '—'}]</span>
            </button>
          </div>
        )}

        {/* Untimed Mode finish button */}
        {duration === 0 && (
          <button
            id="finish-zen-practice-btn"
            onClick={handleEndGame}
            className="w-full mt-3 py-3.5 rounded-2xl bg-[#1E293B] hover:bg-slate-800 text-slate-200 font-black text-xs uppercase tracking-wider border border-slate-700 transition-colors"
          >
            Finish Practice Session ({correctCount} Correct)
          </button>
        )}
      </div>

      {/* Pause Dialog Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">Sprint Paused</h3>
            <p className="text-xs text-slate-300">
              Take a breath! Your score is <span className="font-mono-math font-bold text-sky-400">{score}</span> with <span className="font-bold text-white">{correctCount}</span> correct answers.
            </p>
            
            <div className="space-y-2.5 pt-2">
              <button
                id="resume-sprint-btn"
                onClick={() => setIsPaused(false)}
                className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
              >
                Resume Sprint
              </button>
              <button
                id="quit-sprint-btn"
                onClick={() => {
                  setIsPaused(false);
                  onQuit();
                }}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-rose-400 font-bold text-xs uppercase tracking-wider border border-slate-700"
              >
                Quit to Home
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
