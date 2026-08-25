import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  Flame, 
  Award, 
  Sparkles, 
  CheckCircle,
  Brain,
  Play
} from 'lucide-react';
import { GameSessionResult, UserProfile } from '../types';

interface AnalyticsScreenProps {
  profile: UserProfile;
  sessions: GameSessionResult[];
  onStartSuggestedSprint: (operation: any) => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  profile,
  sessions,
  onStartSuggestedSprint,
}) => {
  // Compute recent stats
  const recentSessions = sessions.slice(0, 7);
  const avgSpeed = recentSessions.length > 0
    ? (recentSessions.reduce((acc, s) => acc + s.avgTimeSpentMs, 0) / recentSessions.length / 1000).toFixed(1)
    : '2.1';

  const categoryMastery = [
    { name: 'Multiplication Tables', score: 94, color: 'bg-amber-500', status: 'Mastered' },
    { name: 'Addition & Sums', score: 92, color: 'bg-emerald-500', status: 'Mastered' },
    { name: 'Percentages & Fractions', score: 86, color: 'bg-blue-500', status: 'Proficient' },
    { name: 'Powers & Roots', score: 78, color: 'bg-purple-500', status: 'Improving' },
    { name: 'Division & Factors', score: 72, color: 'bg-rose-500', status: 'Needs Practice' },
  ];

  // Weak area recommendation
  const weakArea = categoryMastery.find(c => c.score < 80) || categoryMastery[4];

  // 7-Day sprint mock activity bars
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const sprintCounts = [8, 14, 12, 18, 15, 22, 19];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 pb-24 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#1E293B] border border-slate-700/60 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-sky-500/20 text-sky-400 border border-sky-500/30">
              PERFORMANCE DASHBOARD
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cognitive Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
            Calculations & Speed Intelligence
          </h1>
          <p className="text-xs text-slate-300 mt-2 max-w-xl font-medium leading-relaxed">
            Track your mental agility, reaction speeds, accuracy rates, and aptitude mastery over time.
          </p>
        </div>

        {/* XP Level Ring */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/60 flex items-center gap-3.5 shadow-md shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center font-mono-math font-black text-sky-400 text-lg">
            LV.{profile.level}
          </div>
          <div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-black uppercase tracking-tight text-white">Quant Prodigy</span>
              <span className="text-sky-400 font-mono-math font-black">{profile.xp % 250}/250 XP</span>
            </div>
            <div className="w-32 bg-slate-800 h-2 rounded-full mt-1.5 overflow-hidden border border-slate-700/40">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full" 
                style={{ width: `${((profile.xp % 250) / 250) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-5 rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2">
            <span>Overall Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-mono-math text-3xl font-black text-white">{profile.overallAccuracy}%</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Top 8% of Sprinters
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2">
            <span>Avg Reaction Time</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <p className="font-mono-math text-3xl font-black text-white">{avgSpeed}s</p>
          <p className="text-[11px] text-sky-400 mt-1 font-bold">
            -0.3s faster this week
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2">
            <span>Fastest Calc</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-mono-math text-3xl font-black text-white">
            {profile.fastestAnswerMs > 0 ? (profile.fastestAnswerMs / 1000).toFixed(2) : '0.98'}s
          </p>
          <p className="text-[11px] text-amber-400 mt-1 font-bold">
            Personal Best Record
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-black uppercase tracking-wider mb-2">
            <span>Total Solved</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="font-mono-math text-3xl font-black text-white">{profile.totalQuestionsAnswered}</p>
          <p className="text-[11px] text-purple-400 mt-1 font-bold">
            Across {profile.totalSprintsPlayed} Sprints
          </p>
        </div>
      </div>

      {/* Suggested Focus Drill Card */}
      <div className="p-6 rounded-3xl bg-[#1E293B] border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">RECOMMENDED FOCUS DRILL</span>
            </div>
            <h3 className="font-black text-lg uppercase tracking-tight text-white mt-1">
              Division & Factors Speed Drills
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl font-medium leading-relaxed">
              Your accuracy in 2-digit division quotients is currently 72%. A 60-second intermediate drill will boost your overall speed score.
            </p>
          </div>
        </div>

        <button
          id="start-weak-area-drill-btn"
          onClick={() => onStartSuggestedSprint('division')}
          className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Launch 60s Focus Drill</span>
        </button>
      </div>

      {/* 2-Column: Weekly Activity & Category Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Weekly Activity Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#1E293B] border border-slate-700/60 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              Weekly Questions Solved
            </h3>
            <span className="text-xs text-slate-400 font-mono-math font-bold">108 this week</span>
          </div>

          <div className="h-40 flex items-end justify-between gap-2.5 pt-6">
            {dayNames.map((day, idx) => {
              const count = sprintCounts[idx];
              const maxCount = Math.max(...sprintCounts);
              const heightPct = Math.round((count / maxCount) * 100);
              const isToday = idx === 6;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono-math font-bold text-slate-400">{count}</span>
                  <div className="w-full bg-slate-900 rounded-xl h-28 relative overflow-hidden flex items-end border border-slate-700/40">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday 
                          ? 'bg-sky-500' 
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isToday ? 'text-sky-400' : 'text-slate-500'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Mastery Progress */}
        <div className="p-6 rounded-3xl bg-[#1E293B] border border-slate-700/60 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Cognitive Category Mastery
            </h3>
            <span className="text-xs text-slate-400 font-mono-math font-bold">TOP TIER</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {categoryMastery.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-700/60">
                      {cat.status}
                    </span>
                    <span className="font-mono-math font-black text-white">{cat.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700/40">
                  <div 
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Sprint History Table */}
      <div className="p-6 rounded-3xl bg-[#1E293B] border border-slate-700/60 space-y-4 shadow-md">
        <h3 className="font-black text-sm uppercase tracking-wider text-white">Recent Sprint History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700/60 text-slate-400 font-black uppercase tracking-wider">
                <th className="pb-3">Operation</th>
                <th className="pb-3">Difficulty</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Accuracy</th>
                <th className="pb-3">Avg Speed</th>
                <th className="pb-3">Combo</th>
                <th className="pb-3">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40 font-mono-math">
              {sessions.slice(0, 5).map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 font-sans font-bold text-white capitalize">{s.operation}</td>
                  <td className="py-3 text-slate-400 capitalize">{s.difficulty}</td>
                  <td className="py-3 font-black text-sky-400">{s.score}</td>
                  <td className="py-3 text-emerald-400 font-bold">{s.accuracy}%</td>
                  <td className="py-3 text-slate-300 font-bold">{(s.avgTimeSpentMs / 1000).toFixed(1)}s</td>
                  <td className="py-3 text-amber-400 font-black">{s.maxCombo}x</td>
                  <td className="py-3 text-slate-400 font-bold">+{s.xpEarned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
