import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Plus, 
  Minus, 
  Divide, 
  Dice6, 
  Percent, 
  Infinity,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { DifficultyLevel, GameDuration, MathOperation } from '../types';

interface GameSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (operation: MathOperation, difficulty: DifficultyLevel, duration: GameDuration) => void;
  initialOperation?: MathOperation;
}

export const GameSelectionModal: React.FC<GameSelectionModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
  initialOperation = 'multiplication',
}) => {
  const [operation, setOperation] = useState<MathOperation>(initialOperation);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [duration, setDuration] = useState<GameDuration>(60);

  if (!isOpen) return null;

  const operations = [
    { id: 'advance_calc' as MathOperation, label: 'Advance Calculation', icon: Sparkles, symbol: '( )', desc: 'Multi-step equations and parentheses drills' },
    { id: 'linear_sequence' as MathOperation, label: 'Linear Sequence', icon: Zap, symbol: '□-□', desc: 'Number series & progression patterns' },
    { id: 'right_or_wrong' as MathOperation, label: 'Right or Wrong', icon: Zap, symbol: '✓✗', desc: 'Rapid boolean speed verification' },
    { id: 'math_puzzle' as MathOperation, label: 'Math Puzzle', icon: Dice6, symbol: '⊞', desc: 'Missing value equations & grid puzzles' },
    { id: 'addition' as MathOperation, label: 'Addition', icon: Plus, symbol: '+', desc: 'Single to 4-digit rapid summation' },
    { id: 'subtraction' as MathOperation, label: 'Subtraction', icon: Minus, symbol: '−', desc: 'Borrowing and difference drills' },
    { id: 'multiplication' as MathOperation, label: 'Multiplication', icon: X, symbol: '×', desc: 'Tables 12-99 & Vedic shortcuts' },
    { id: 'division' as MathOperation, label: 'Division', icon: Divide, symbol: '÷', desc: 'Clean quotients and factors' },
    { id: 'mixed' as MathOperation, label: 'Mixed Arena', icon: Dice6, symbol: '🎲', desc: 'Random blitz across all operations' },
    { id: 'powers_roots' as MathOperation, label: 'Powers & Roots', icon: Sparkles, symbol: 'x²', desc: 'Squares, cubes & square roots' },
    { id: 'percentages' as MathOperation, label: 'Percentages', icon: Percent, symbol: '%', desc: 'Quick fractional percentages' },
  ];

  const difficulties: { id: DifficultyLevel; label: string; sub: string; color: string }[] = [
    { id: 'beginner', label: 'Beginner', sub: 'Single/small digits', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
    { id: 'intermediate', label: 'Intermediate', sub: 'Standard aptitude', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { id: 'advanced', label: 'Advanced', sub: 'Fast competitive', color: 'border-orange-500/40 text-orange-400 bg-orange-500/10' },
    { id: 'expert', label: 'Expert', sub: 'Quant grandmaster', color: 'border-rose-500/40 text-rose-400 bg-rose-500/10' },
  ];

  const durations: { id: GameDuration; label: string; icon: typeof Clock | typeof Infinity; desc: string }[] = [
    { id: 30, label: '30 Sec', icon: Clock, desc: 'Blitz sprint' },
    { id: 60, label: '60 Sec', icon: Clock, desc: 'Standard sprint' },
    { id: 120, label: '120 Sec', icon: Clock, desc: 'Endurance mode' },
    { id: 0, label: 'Zen Practice', icon: Infinity, desc: 'Untimed drills' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-700/60 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black">
              <Zap className="w-5 h-5 fill-sky-400" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">Configure Sprint</h2>
              <p className="text-xs text-slate-400 font-medium">Select operation, difficulty, and duration</p>
            </div>
          </div>
          <button
            id="close-sprint-config-btn"
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Operation selection */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5">
              Select Math Operation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {operations.map((op) => {
                const isSelected = operation === op.id;
                return (
                  <button
                    key={op.id}
                    id={`op-select-${op.id}`}
                    onClick={() => setOperation(op.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-500 text-white shadow-md shadow-sky-500/15'
                        : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black uppercase tracking-tight text-xs sm:text-sm">{op.label}</span>
                      <span className="font-mono-math text-base font-black text-sky-400">{op.symbol}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 font-medium">{op.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty selection */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5">
              Difficulty Tier
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {difficulties.map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    id={`diff-select-${diff.id}`}
                    onClick={() => setDifficulty(diff.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-sm font-black'
                        : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-black uppercase tracking-tight text-xs sm:text-sm block text-white">{diff.label}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{diff.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration selection */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5">
              Sprint Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {durations.map((dur) => {
                const isSelected = duration === dur.id;
                const Icon = dur.icon;
                return (
                  <button
                    key={dur.id}
                    id={`dur-select-${dur.id}`}
                    onClick={() => setDuration(dur.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'bg-sky-500 border-sky-400 text-slate-950 font-black shadow-md shadow-sky-500/25'
                        : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mx-auto mb-1.5 ${isSelected ? 'stroke-slate-950' : 'text-slate-400'}`} />
                    <span className="text-xs font-black uppercase tracking-tight block">{dur.label}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-slate-950 font-bold' : 'text-slate-400 font-medium'}`}>
                      {dur.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer with Start CTA */}
        <div className="p-5 sm:p-6 border-t border-slate-700/60 bg-slate-900/90">
          <button
            id="start-live-sprint-btn"
            onClick={() => onStartGame(operation, difficulty, duration)}
            className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 active:scale-[0.98] transition-all"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>START NUMBER SPRINT</span>
          </button>
        </div>

      </div>
    </div>
  );
};
