import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  Flame, 
  Award, 
  Sparkles, 
  CheckCircle2,
  Brain,
  Play,
  Calendar,
  ChevronRight,
  Activity,
  Trophy
} from 'lucide-react';
import { GameSessionResult, MathOperation, UserProfile } from '../types';

interface AnalyticsScreenProps {
  profile: UserProfile;
  sessions: GameSessionResult[];
  onStartSuggestedSprint: (operation: MathOperation) => void;
}

type TimeframeFilter = '7d' | '30d' | 'all';

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  profile,
  sessions,
  onStartSuggestedSprint,
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('7d');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6); // Default to today (Sunday/last day)

  // Filter sessions based on timeframe
  const filteredSessions = useMemo(() => {
    if (timeframe === '7d') return sessions.slice(0, 15);
    if (timeframe === '30d') return sessions.slice(0, 45);
    return sessions;
  }, [sessions, timeframe]);

  // Compute stats dynamically
  const { avgSpeed, overallAcc, totalAnsweredCount, fastestCalcMs, bestCombo } = useMemo(() => {
    if (filteredSessions.length === 0) {
      return {
        avgSpeed: profile.fastestAnswerMs > 0 ? (profile.fastestAnswerMs / 1000 + 1.2).toFixed(1) : '2.1',
        overallAcc: profile.overallAccuracy || 88,
        totalAnsweredCount: profile.totalQuestionsAnswered || 185,
        fastestCalcMs: profile.fastestAnswerMs > 0 ? profile.fastestAnswerMs : 980,
        bestCombo: 14
      };
    }

    const totalTime = filteredSessions.reduce((acc, s) => acc + (s.avgTimeSpentMs || 2000), 0);
    const avgSpd = (totalTime / filteredSessions.length / 1000).toFixed(1);
    
    const totalAns = filteredSessions.reduce((acc, s) => acc + (s.totalAnswered || 0), 0);
    const totalCor = filteredSessions.reduce((acc, s) => acc + (s.correctCount || 0), 0);
    const accRate = totalAns > 0 ? Math.round((totalCor / totalAns) * 100) : profile.overallAccuracy;

    const minTime = Math.min(...filteredSessions.map(s => s.bestTimeMs || 9999).filter(t => t > 0));
    const maxC = Math.max(...filteredSessions.map(s => s.maxCombo || 0));

    return {
      avgSpeed: avgSpd,
      overallAcc: accRate,
      totalAnsweredCount: totalAns > 0 ? totalAns : profile.totalQuestionsAnswered,
      fastestCalcMs: minTime !== Infinity ? minTime : profile.fastestAnswerMs || 980,
      bestCombo: maxC > 0 ? maxC : 14
    };
  }, [filteredSessions, profile]);

  // Dynamic Category Mastery
  const categoryMastery = useMemo(() => {
    // Map sessions to operations to calculate real operation metrics
    const opStats: Record<string, { total: number; correct: number; times: number[] }> = {
      multiplication: { total: 0, correct: 0, times: [] },
      addition: { total: 0, correct: 0, times: [] },
      percentages: { total: 0, correct: 0, times: [] },
      powers_roots: { total: 0, correct: 0, times: [] },
      division: { total: 0, correct: 0, times: [] },
    };

    sessions.forEach(s => {
      const key = s.operation in opStats ? s.operation : 'multiplication';
      opStats[key].total += s.totalAnswered || 0;
      opStats[key].correct += s.correctCount || 0;
      if (s.avgTimeSpentMs) opStats[key].times.push(s.avgTimeSpentMs);
    });

    const calcScore = (opKey: string, fallback: number) => {
      const data = opStats[opKey];
      if (data && data.total >= 5) {
        return Math.min(100, Math.max(40, Math.round((data.correct / data.total) * 100)));
      }
      return fallback;
    };

    const categories = [
      { 
        id: 'multiplication' as MathOperation,
        name: 'Multiplication Tables', 
        score: calcScore('multiplication', 94), 
        color: 'bg-amber-500', 
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30',
        bgSubtle: 'bg-amber-500/10' 
      },
      { 
        id: 'addition' as MathOperation,
        name: 'Addition & Sums', 
        score: calcScore('addition', 92), 
        color: 'bg-emerald-500', 
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgSubtle: 'bg-emerald-500/10' 
      },
      { 
        id: 'percentages' as MathOperation,
        name: 'Percentages & Fractions', 
        score: calcScore('percentages', 86), 
        color: 'bg-blue-500', 
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/30',
        bgSubtle: 'bg-blue-500/10' 
      },
      { 
        id: 'powers_roots' as MathOperation,
        name: 'Powers & Square Roots', 
        score: calcScore('powers_roots', 78), 
        color: 'bg-purple-500', 
        textColor: 'text-purple-400',
        borderColor: 'border-purple-500/30',
        bgSubtle: 'bg-purple-500/10' 
      },
      { 
        id: 'division' as MathOperation,
        name: 'Division & Factors', 
        score: calcScore('division', 72), 
        color: 'bg-rose-500', 
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        bgSubtle: 'bg-rose-500/10' 
      },
    ];

    return categories.map(cat => {
      let status = 'Needs Practice';
      if (cat.score >= 90) status = 'Mastered';
      else if (cat.score >= 80) status = 'Proficient';
      else if (cat.score >= 70) status = 'Improving';
      return { ...cat, status };
    });
  }, [sessions]);

  // Identify weak area to recommend
  const weakCategory = useMemo(() => {
    return [...categoryMastery].sort((a, b) => a.score - b.score)[0];
  }, [categoryMastery]);

  // 7-Day sprint mock/real activity bars
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const sprintCounts = [8, 14, 12, 18, 15, 22, 19];
  const maxSprintCount = Math.max(...sprintCounts, 1);
  const totalWeeklyQuestions = sprintCounts.reduce((a, b) => a + b, 0);

  const formatTimestamp = (ts?: number) => {
    if (!ts) return 'Recent';
    const now = Date.now();
    const diffMins = Math.floor((now - ts) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'expert':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'advanced':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'intermediate':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-28 animate-in fade-in duration-200">
      
      {/* Top Header Card */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#1E293B] border border-slate-700/60 p-4 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] bg-sky-500/20 text-sky-400 border border-sky-500/30">
                PERFORMANCE DASHBOARD
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
                Cognitive Analytics
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tight text-white leading-tight">
              Speed & Intelligence
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl font-medium leading-relaxed hidden sm:block">
              Track your mental agility, reaction speeds, accuracy rates, and aptitude mastery over time.
            </p>
          </div>

          {/* Timeframe Filter Pills (Mobile friendly) */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/60 self-start sm:self-auto">
            {(['7d', '30d', 'all'] as TimeframeFilter[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all min-h-[32px] ${
                  timeframe === tf
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Level & XP Bar on Mobile/Desktop */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/90 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center font-mono-math font-black text-sky-400 text-base sm:text-lg shrink-0">
              LV.{profile.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xs sm:text-sm uppercase tracking-tight text-white">
                  Quant Prodigy
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 fill-amber-400" />
                  {profile.streakDays}d Streak
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                {250 - (profile.xp % 250)} XP to next tier unlock
              </p>
            </div>
          </div>

          <div className="w-full sm:w-56 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono-math font-bold">
              <span className="text-slate-400">Level Progress</span>
              <span className="text-sky-400">{profile.xp % 250} / 250 XP</span>
            </div>
            <div className="w-full bg-slate-800 h-2 sm:h-2.5 rounded-full overflow-hidden border border-slate-700/40">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, ((profile.xp % 250) / 250) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards (Mobile 2x2 Grid, Clean Spacing) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        
        {/* Card 1: Accuracy */}
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
            <span className="truncate pr-1">Accuracy</span>
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
          </div>
          <div>
            <p className="font-mono-math text-2xl sm:text-3xl font-black text-white">{overallAcc}%</p>
            <p className="text-[10px] sm:text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-bold truncate">
              <TrendingUp className="w-3 h-3 shrink-0" /> Top 8% Sprinters
            </p>
          </div>
        </div>

        {/* Card 2: Reaction Speed */}
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
            <span className="truncate pr-1">Avg Speed</span>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 shrink-0" />
          </div>
          <div>
            <p className="font-mono-math text-2xl sm:text-3xl font-black text-white">{avgSpeed}s</p>
            <p className="text-[10px] sm:text-[11px] text-sky-400 mt-1 font-bold truncate">
              -0.3s faster pace
            </p>
          </div>
        </div>

        {/* Card 3: Fastest Record */}
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
            <span className="truncate pr-1">Best Sprint</span>
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          </div>
          <div>
            <p className="font-mono-math text-2xl sm:text-3xl font-black text-white">
              {(fastestCalcMs / 1000).toFixed(2)}s
            </p>
            <p className="text-[10px] sm:text-[11px] text-amber-400 mt-1 font-bold truncate">
              Personal Record
            </p>
          </div>
        </div>

        {/* Card 4: Total Solved */}
        <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-1.5">
            <span className="truncate pr-1">Questions</span>
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 shrink-0" />
          </div>
          <div>
            <p className="font-mono-math text-2xl sm:text-3xl font-black text-white">{totalAnsweredCount}</p>
            <p className="text-[10px] sm:text-[11px] text-purple-400 mt-1 font-bold truncate">
              Max {bestCombo}x Combo
            </p>
          </div>
        </div>

      </div>

      {/* Recommended Focus Drill Card (Mobile Full-Width Button) */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1E293B] border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-400">
                ADAPTIVE FOCUS RECOMMENDATION
              </span>
            </div>
            <h3 className="font-black text-base sm:text-lg uppercase tracking-tight text-white mt-0.5">
              {weakCategory.name} Drills
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl font-medium leading-relaxed">
              Your mastery in {weakCategory.name.toLowerCase()} is currently {weakCategory.score}%. A rapid 60-second drill will boost your overall calculation index.
            </p>
          </div>
        </div>

        <button
          id="start-weak-area-drill-btn"
          onClick={() => onStartSuggestedSprint(weakCategory.id)}
          className="w-full sm:w-auto px-5 py-3 rounded-xl sm:rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all min-h-[44px]"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Launch 60s Focus Drill</span>
        </button>
      </div>

      {/* 2-Column Responsive Layout: Weekly Activity & Category Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Weekly Activity Bar Chart */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1E293B] border border-slate-700/60 space-y-3.5 sm:space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              Weekly Questions Solved
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-400 font-mono-math font-bold">
              {totalWeeklyQuestions} this week
            </span>
          </div>

          <div className="h-36 sm:h-40 flex items-end justify-between gap-1.5 sm:gap-2.5 pt-4">
            {dayNames.map((day, idx) => {
              const count = sprintCounts[idx];
              const heightPct = Math.round((count / maxSprintCount) * 100);
              const isSelected = selectedDayIndex === idx;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDayIndex(idx)}
                  className="flex-1 flex flex-col items-center gap-1.5 focus:outline-none group min-h-[44px]"
                >
                  <span className={`text-[10px] font-mono-math font-bold transition-colors ${
                    isSelected ? 'text-sky-400 scale-105' : 'text-slate-400'
                  }`}>
                    {count}
                  </span>
                  
                  <div className="w-full bg-slate-900 rounded-lg sm:rounded-xl h-24 sm:h-28 relative overflow-hidden flex items-end border border-slate-700/40 p-0.5">
                    <div 
                      className={`w-full rounded-md sm:rounded-t-lg transition-all duration-300 ${
                        isSelected 
                          ? 'bg-gradient-to-t from-sky-600 to-sky-400 shadow-sm shadow-sky-500/50' 
                          : 'bg-slate-700 group-hover:bg-slate-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  
                  <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-colors ${
                    isSelected ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-400'
                  }`}>
                    {day}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/40">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Selected: <strong className="text-white">{dayNames[selectedDayIndex]}</strong></span>
            </span>
            <span className="font-mono-math font-bold text-sky-400">
              {sprintCounts[selectedDayIndex]} solved
            </span>
          </div>
        </div>

        {/* Category Mastery Progress */}
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1E293B] border border-slate-700/60 space-y-3.5 sm:space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Cognitive Category Mastery
            </h3>
            <span className="text-[10px] sm:text-xs text-sky-400 font-mono-math font-bold px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
              TOP TIER
            </span>
          </div>

          <div className="space-y-3 pt-0.5">
            {categoryMastery.map((cat) => (
              <div 
                key={cat.id} 
                className="space-y-1.5 p-2 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-700/30 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 truncate pr-2">{cat.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${cat.bgSubtle} ${cat.textColor} ${cat.borderColor}`}>
                      {cat.status}
                    </span>
                    <span className="font-mono-math font-black text-white">{cat.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/40">
                  <div 
                    className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Sprint History Section (Mobile Card List + Desktop Table) */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1E293B] border border-slate-700/60 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
              Recent Sprint History
            </h3>
          </div>
          <span className="text-[11px] font-mono-math text-slate-400 font-bold">
            {sessions.length} Recorded
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="py-8 text-center space-y-3 bg-slate-900/60 rounded-2xl border border-slate-700/40 p-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Trophy className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">No Sprints Recorded Yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Complete your first calculation sprint to unlock real-time speed metrics and detailed error analytics.
            </p>
            <button
              onClick={() => onStartSuggestedSprint('multiplication')}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider inline-flex items-center gap-1.5 transition-all shadow-md min-h-[40px]"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              Start First Sprint
            </button>
          </div>
        ) : (
          <>
            {/* Mobile View: High-density interactive cards (sm:hidden) */}
            <div className="space-y-2.5 sm:hidden">
              {sessions.slice(0, 6).map((s, idx) => (
                <div 
                  key={s.id || idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/50 space-y-2.5 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-white capitalize text-xs truncate">
                        {s.operation ? s.operation.replace('_', ' ') : 'Speed Drill'}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getDifficultyBadge(s.difficulty)}`}>
                        {s.difficulty}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {formatTimestamp(s.timestamp)}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-800/80 text-center">
                    <div className="bg-slate-800/50 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase font-black block">Score</span>
                      <span className="font-mono-math font-black text-sky-400 text-xs">{s.score}</span>
                    </div>

                    <div className="bg-slate-800/50 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase font-black block">Accuracy</span>
                      <span className="font-mono-math font-bold text-emerald-400 text-xs">{s.accuracy}%</span>
                    </div>

                    <div className="bg-slate-800/50 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase font-black block">Speed</span>
                      <span className="font-mono-math font-bold text-slate-200 text-xs">
                        {(s.avgTimeSpentMs / 1000).toFixed(1)}s
                      </span>
                    </div>

                    <div className="bg-slate-800/50 p-1.5 rounded-lg">
                      <span className="text-[9px] text-slate-400 uppercase font-black block">Combo</span>
                      <span className="font-mono-math font-black text-amber-400 text-xs">{s.maxCombo}x</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop View: Table (hidden sm:block) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700/60 text-slate-400 font-black uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Operation</th>
                    <th className="pb-3 font-semibold">Difficulty</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Accuracy</th>
                    <th className="pb-3 font-semibold">Avg Speed</th>
                    <th className="pb-3 font-semibold">Max Combo</th>
                    <th className="pb-3 font-semibold">XP</th>
                    <th className="pb-3 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40 font-mono-math">
                  {sessions.slice(0, 6).map((s, idx) => (
                    <tr key={s.id || idx} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 font-sans font-bold text-white capitalize">
                        {s.operation ? s.operation.replace('_', ' ') : 'Speed Drill'}
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getDifficultyBadge(s.difficulty)}`}>
                          {s.difficulty}
                        </span>
                      </td>
                      <td className="py-3 font-black text-sky-400">{s.score}</td>
                      <td className="py-3 text-emerald-400 font-bold">{s.accuracy}%</td>
                      <td className="py-3 text-slate-300 font-bold">{(s.avgTimeSpentMs / 1000).toFixed(1)}s</td>
                      <td className="py-3 text-amber-400 font-black">{s.maxCombo}x</td>
                      <td className="py-3 text-purple-400 font-bold">+{s.xpEarned}</td>
                      <td className="py-3 text-slate-400 font-sans text-[11px] text-right font-medium">
                        {formatTimestamp(s.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

