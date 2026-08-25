import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Share2, 
  Zap, 
  Target, 
  Clock, 
  Flame, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { GameSessionResult } from '../types';

interface GameResultScreenProps {
  result: GameSessionResult;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onViewAnalytics: () => void;
}

export const GameResultScreen: React.FC<GameResultScreenProps> = ({
  result,
  onPlayAgain,
  onGoHome,
  onViewAnalytics,
}) => {
  const [showMistakes, setShowMistakes] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Launch celebratory confetti if good performance
    if (result.accuracy >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0ea5e9', '#f59e0b', '#10b981', '#a855f7'],
        });
      } catch {
        // Fallback
      }
    }
  }, [result]);

  // Determine performance grade
  let grade = 'B';
  let gradeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/40';
  if (result.accuracy >= 95 && result.score > 1200) {
    grade = 'S';
    gradeColor = 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20';
  } else if (result.accuracy >= 85) {
    grade = 'A';
    gradeColor = 'text-sky-400 bg-sky-500/20 border-sky-500/40';
  } else if (result.accuracy < 60) {
    grade = 'C';
    gradeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  }

  const shareScore = () => {
    const text = `⚡ I scored ${result.score} points on NumberSprint (${result.operation} - ${result.difficulty}) with ${result.accuracy}% accuracy & ${result.maxCombo}x combo! Can you beat me?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const avgSeconds = (result.avgTimeSpentMs / 1000).toFixed(1);
  const bestSeconds = (result.bestTimeMs / 1000).toFixed(2);

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Hero Summary Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1E293B] border border-slate-700/60 p-6 sm:p-8 text-center shadow-2xl">
        
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Grade Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-4 border border-slate-700 bg-slate-900 text-slate-300">
          <Award className="w-4 h-4 text-sky-400" />
          <span>Sprint Completed • {result.duration > 0 ? `${result.duration}S SPEED` : 'ZEN'}</span>
        </div>

        <div className="flex items-center justify-center gap-5 my-2">
          <div className={`w-16 h-16 rounded-3xl border-2 flex items-center justify-center font-black text-4xl font-mono-math shadow-md ${gradeColor}`}>
            {grade}
          </div>
          <div className="text-left">
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-wider">Final Score</p>
            <h1 className="font-mono-math text-5xl sm:text-6xl font-black text-white tracking-tight leading-none">
              {result.score}
            </h1>
          </div>
        </div>

        {/* XP Reward Banner */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-black text-xs sm:text-sm uppercase tracking-wider mt-4">
          <Sparkles className="w-4 h-4 fill-amber-400" />
          <span>+{result.xpEarned} XP GAINED</span>
        </div>

      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Accuracy */}
        <div className="p-4 rounded-3xl bg-[#1E293B] border border-slate-700/60 text-center shadow-md">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <Target className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Accuracy</p>
          <p className="font-mono-math text-2xl font-black text-white mt-0.5">
            {result.accuracy}%
          </p>
          <span className="text-[10px] text-slate-400 font-medium">{result.correctCount}/{result.totalAnswered} hits</span>
        </div>

        {/* Avg Speed */}
        <div className="p-4 rounded-3xl bg-[#1E293B] border border-slate-700/60 text-center shadow-md">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Avg Speed</p>
          <p className="font-mono-math text-2xl font-black text-white mt-0.5">
            {avgSeconds}s
          </p>
          <span className="text-[10px] text-slate-400 font-medium">per problem</span>
        </div>

        {/* Max Combo */}
        <div className="p-4 rounded-3xl bg-[#1E293B] border border-slate-700/60 text-center shadow-md">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <Flame className="w-4 h-4 fill-amber-400" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Max Combo</p>
          <p className="font-mono-math text-2xl font-black text-white mt-0.5">
            {result.maxCombo}x
          </p>
          <span className="text-[10px] text-slate-400 font-medium">streak</span>
        </div>

        {/* Fastest Answer */}
        <div className="p-4 rounded-3xl bg-[#1E293B] border border-slate-700/60 text-center shadow-md">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-2">
            <Zap className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Best Time</p>
          <p className="font-mono-math text-2xl font-black text-white mt-0.5">
            {bestSeconds}s
          </p>
          <span className="text-[10px] text-slate-400 font-medium">fastest solve</span>
        </div>

      </div>

      {/* Mistake Review Accordion */}
      {result.mistakes.length > 0 && (
        <div className="rounded-3xl bg-[#1E293B] border border-slate-700/60 overflow-hidden shadow-lg">
          <button
            id="toggle-mistakes-btn"
            onClick={() => setShowMistakes(!showMistakes)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-black">
                {result.mistakes.length}
              </div>
              <span className="text-sm font-black uppercase tracking-wider text-white">Review Mistakes & Solutions</span>
            </div>
            {showMistakes ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {showMistakes && (
            <div className="p-5 pt-0 space-y-3 border-t border-slate-700/60 divide-y divide-slate-700/40">
              {result.mistakes.map((mistake, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-mono-math font-black text-white text-base">
                      {mistake.displayExpression}
                    </span>
                    <div className="flex items-center gap-3 text-xs mt-1">
                      <span className="text-rose-400 flex items-center gap-1 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Picked: {mistake.userAnswer}
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1 font-black">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Answer: {mistake.correctAnswer}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono-math font-bold text-slate-400">
                    {((mistake.timeSpentMs || 0) / 1000).toFixed(1)}s
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          id="play-again-btn"
          onClick={onPlayAgain}
          className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span>PLAY AGAIN</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            id="share-score-btn"
            onClick={shareScore}
            className="py-3.5 px-4 rounded-2xl bg-[#1E293B] hover:bg-slate-800 text-slate-200 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-colors shadow-sm"
          >
            <Share2 className="w-4 h-4 text-sky-400" />
            <span>{copied ? 'Copied Link!' : 'Share Score'}</span>
          </button>
          
          <button
            id="view-analytics-btn"
            onClick={onViewAnalytics}
            className="py-3.5 px-4 rounded-2xl bg-[#1E293B] hover:bg-slate-800 text-slate-200 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-colors shadow-sm"
          >
            <span>Full Analytics</span>
            <ArrowRight className="w-4 h-4 text-sky-400" />
          </button>
        </div>

        <button
          id="back-home-result-btn"
          onClick={onGoHome}
          className="w-full py-2.5 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          Return to Dashboard
        </button>
      </div>

    </div>
  );
};
