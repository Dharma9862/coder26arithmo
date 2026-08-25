import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Zap, 
  Medal, 
  Target, 
  Clock, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Swords, 
  Globe, 
  Users, 
  Flag, 
  Sparkles, 
  ChevronRight, 
  X, 
  Award,
  ArrowUpRight,
  Crosshair
} from 'lucide-react';
import { 
  LeaderboardEntry, 
  LeaderboardCategory, 
  LeaderboardTimeframe, 
  LeaderboardScope, 
  LeagueTier, 
  UserProfile 
} from '../types';
import { soundService } from '../services/soundService';

interface LeaderboardScreenProps {
  profile?: UserProfile;
  getLeaderboard?: (
    timeframe: LeaderboardTimeframe,
    category: LeaderboardCategory,
    scope: LeaderboardScope
  ) => LeaderboardEntry[];
  onChallengeRival?: (rival: LeaderboardEntry) => void;
  onOpenAuth?: () => void;
}

const LEAGUES: { tier: LeagueTier; minXp: number; color: string; bgGradient: string; badge: string }[] = [
  { tier: 'Grandmaster', minXp: 8000, color: 'text-amber-400', bgGradient: 'from-amber-500/20 to-rose-500/20 border-amber-400', badge: '👑 Grandmaster' },
  { tier: 'Master', minXp: 6000, color: 'text-purple-400', bgGradient: 'from-purple-500/20 to-indigo-500/20 border-purple-400', badge: '🔮 Master' },
  { tier: 'Diamond', minXp: 4000, color: 'text-sky-400', bgGradient: 'from-sky-500/20 to-cyan-500/20 border-sky-400', badge: '💎 Diamond' },
  { tier: 'Platinum', minXp: 2500, color: 'text-emerald-400', bgGradient: 'from-emerald-500/20 to-teal-500/20 border-emerald-400', badge: '⚡ Platinum' },
  { tier: 'Gold', minXp: 1200, color: 'text-amber-300', bgGradient: 'from-amber-500/15 to-yellow-500/15 border-amber-300', badge: '🥇 Gold' },
  { tier: 'Silver', minXp: 500, color: 'text-slate-300', bgGradient: 'from-slate-400/15 to-slate-500/15 border-slate-400', badge: '🥈 Silver' },
  { tier: 'Bronze', minXp: 0, color: 'text-amber-700', bgGradient: 'from-amber-800/15 to-amber-900/15 border-amber-700', badge: '🥉 Bronze' },
];

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ 
  profile,
  getLeaderboard,
  onChallengeRival,
  onOpenAuth 
}) => {
  // Filters & State
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('daily');
  const [category, setCategory] = useState<LeaderboardCategory>('overall');
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRival, setSelectedRival] = useState<LeaderboardEntry | null>(null);
  const [activeLeagueTab, setActiveLeagueTab] = useState<LeagueTier | 'all'>('all');

  // Fetch entries
  const allEntries = useMemo(() => {
    if (getLeaderboard) {
      return getLeaderboard(timeframe, category, scope);
    }
    return [];
  }, [getLeaderboard, timeframe, category, scope]);

  // Current user's ranking entry
  const currentUserEntry = useMemo(() => {
    return allEntries.find(e => e.isCurrentUser);
  }, [allEntries]);

  // Filtered by Search & League
  const filteredEntries = useMemo(() => {
    return allEntries.filter(entry => {
      const matchesSearch = 
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.badge && entry.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (entry.countryCode && entry.countryCode.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesLeague = activeLeagueTab === 'all' || entry.league === activeLeagueTab;

      return matchesSearch && matchesLeague;
    });
  }, [allEntries, searchQuery, activeLeagueTab]);

  const topThree = filteredEntries.slice(0, 3);
  const remaining = filteredEntries.slice(3);

  // User's current League info
  const userXp = profile?.xp || 0;
  const currentLeagueObj = LEAGUES.find(l => userXp >= l.minXp) || LEAGUES[LEAGUES.length - 1];
  const nextLeagueIndex = LEAGUES.findIndex(l => l.tier === currentLeagueObj.tier) - 1;
  const nextLeagueObj = nextLeagueIndex >= 0 ? LEAGUES[nextLeagueIndex] : null;
  const xpNeededForNext = nextLeagueObj ? nextLeagueObj.minXp - userXp : 0;
  const xpProgressInTier = nextLeagueObj 
    ? Math.round(((userXp - currentLeagueObj.minXp) / (nextLeagueObj.minXp - currentLeagueObj.minXp)) * 100)
    : 100;

  // Handler for rival inspection
  const handleInspectRival = (rival: LeaderboardEntry) => {
    soundService.triggerHaptic('light');
    setSelectedRival(rival);
  };

  const handleStartGhostDuel = (rival: LeaderboardEntry) => {
    soundService.triggerHaptic('success');
    soundService.playClick();
    if (onChallengeRival) {
      onChallengeRival(rival);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3.5 sm:p-6 space-y-6 pb-28 animate-in fade-in duration-200">
      
      {/* 1. Header Banner & League Season HUD */}
      <div className="rounded-3xl bg-[#1E293B] border border-slate-700/60 p-5 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <Trophy className="w-4 h-4 fill-sky-400" />
              <span>GLOBAL SPEED ARENA • SEASON 4</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight text-white">
              Calculation Hall of Fame
            </h1>
            <p className="text-xs text-slate-300 max-w-xl font-medium">
              Compete against the world's fastest mental math sprinters. Maintain sub-second reaction speeds and unbroken streaks to secure promotion.
            </p>
          </div>

          {/* Season Countdown */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/70 shrink-0 text-center sm:text-right">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Season 4 Reset in</div>
            <div className="font-mono-math text-base sm:text-lg font-black text-amber-400 flex items-center justify-center sm:justify-end gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>5D 14H 28M</span>
            </div>
          </div>
        </div>

        {/* User's Current League Tier Status Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-amber-400/40 flex items-center justify-center text-2xl shadow-md">
              {currentLeagueObj.tier === 'Grandmaster' ? '👑' : currentLeagueObj.tier === 'Master' ? '🔮' : currentLeagueObj.tier === 'Diamond' ? '💎' : '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm sm:text-base font-black uppercase tracking-wide ${currentLeagueObj.color}`}>
                  {currentLeagueObj.tier} Division
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Promotion Zone
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono-math mt-0.5">
                {userXp.toLocaleString()} XP • Top {currentUserEntry ? (currentUserEntry.rank <= 3 ? '1%' : `${currentUserEntry.rank * 4}%`) : '15%'} Global Percentile
              </p>
            </div>
          </div>

          {/* XP Progress Bar to Next League */}
          {nextLeagueObj && (
            <div className="w-full md:w-64 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                <span className="text-slate-400">Next: {nextLeagueObj.tier}</span>
                <span className="text-sky-400 font-mono-math">+{xpNeededForNext} XP Needed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
                <div 
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(8, xpProgressInTier))}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Guest Sign-In Notice Banner */}
        {profile?.isGuest && onOpenAuth && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-amber-950/40 border border-sky-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  Playing as Guest • Rank #{currentUserEntry?.rank || 11}
                </h4>
                <p className="text-[11px] text-slate-300">
                  Create a free Arithmo account to permanently lock in your streaks, badges, and national ranking.
                </p>
              </div>
            </div>

            <button
              id="leaderboard-signup-cta-btn"
              onClick={() => {
                soundService.playClick();
                onOpenAuth();
              }}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
            >
              Sign Up / Sign In
            </button>
          </div>
        )}

        {/* Navigation Filters HUD: Timeframe, Scope & Category */}
        <div className="space-y-3 pt-1 border-t border-slate-700/40">
          
          {/* Row 1: Timeframe & Scope Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Timeframe */}
            <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl">
              {(['daily', 'weekly', 'season', 'all-time'] as const).map((t) => (
                <button
                  key={t}
                  id={`timeframe-${t}`}
                  onClick={() => {
                    soundService.triggerHaptic('light');
                    setTimeframe(t);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    timeframe === t
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {t === 'daily' ? 'Today' : t === 'weekly' ? 'This Week' : t === 'season' ? 'Season 4' : 'All-Time'}
                </button>
              ))}
            </div>

            {/* Scope (Global vs Country vs Friends) */}
            <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl">
              <button
                id="scope-global-btn"
                onClick={() => {
                  soundService.triggerHaptic('light');
                  setScope('global');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  scope === 'global'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Global</span>
              </button>

              <button
                id="scope-country-btn"
                onClick={() => {
                  soundService.triggerHaptic('light');
                  setScope('country');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  scope === 'country'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>National</span>
              </button>

              <button
                id="scope-friends-btn"
                onClick={() => {
                  soundService.triggerHaptic('light');
                  setScope('friends');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  scope === 'friends'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Friends</span>
              </button>
            </div>
          </div>

          {/* Row 2: Ranking Metric Category Switcher */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'overall' as LeaderboardCategory, label: 'Sprint Score', icon: Zap, desc: 'Weighted points' },
              { id: 'speed' as LeaderboardCategory, label: 'Reaction Time', icon: Clock, desc: 'Sub-second ms' },
              { id: 'accuracy' as LeaderboardCategory, label: 'Accuracy %', icon: Target, desc: 'Precision rate' },
              { id: 'streak' as LeaderboardCategory, label: 'Streak Days', icon: Flame, desc: 'Unbroken daily' },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => {
                    soundService.triggerHaptic('light');
                    setCategory(cat.id);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-sky-500/15 border-sky-500/50 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-sky-300' : 'text-slate-300'}`}>
                      {cat.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono-math">
                      {cat.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* 2. Top 3 Podium Showcase */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
          
          {/* 2nd Place (Silver) */}
          <div 
            onClick={() => handleInspectRival(topThree[1])}
            className="p-3 sm:p-5 rounded-3xl bg-[#1E293B] border-2 border-slate-400/60 text-center flex flex-col items-center justify-end relative shadow-xl hover:border-slate-300 transition-all cursor-pointer group"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-md uppercase tracking-wider">
              <span>🥈 2nd</span>
            </div>
            
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border-2 border-slate-400 flex items-center justify-center text-2xl sm:text-3xl mb-2 group-hover:scale-105 transition-transform">
              {topThree[1].avatar}
            </div>

            <div className="flex items-center gap-1 justify-center max-w-full">
              <span className="text-sm">{topThree[1].countryFlag}</span>
              <p className="font-black uppercase tracking-tight text-xs sm:text-sm text-white truncate">
                {topThree[1].name}
              </p>
            </div>

            <p className="font-mono-math text-xs sm:text-base font-black text-slate-200 mt-1">
              {category === 'speed' 
                ? `${topThree[1].avgReactionMs}ms` 
                : category === 'accuracy' 
                ? `${topThree[1].accuracy}%` 
                : category === 'streak' 
                ? `${topThree[1].streak}D` 
                : `${topThree[1].score.toLocaleString()} PTS`}
            </p>

            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono-math mt-1">
              <span>{topThree[1].accuracy}% ACC</span>
              <span>•</span>
              <span className="text-sky-400">{topThree[1].avgReactionMs}ms</span>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleStartGhostDuel(topThree[1]);
              }}
              className="mt-3 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border border-slate-700 transition-colors"
            >
              <Swords className="w-3 h-3 text-sky-400" />
              <span>Duel</span>
            </button>
          </div>

          {/* 1st Place (Gold Champion) */}
          <div 
            onClick={() => handleInspectRival(topThree[0])}
            className="p-4 sm:p-6 rounded-3xl bg-gradient-to-b from-amber-500/20 via-[#1E293B] to-[#1E293B] border-2 border-amber-400 text-center flex flex-col items-center justify-end relative shadow-2xl shadow-amber-500/20 scale-105 hover:border-amber-300 transition-all cursor-pointer group z-10"
          >
            <Crown className="w-7 h-7 text-amber-400 fill-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
            
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-lg uppercase tracking-wider">
              <span>👑 Champion</span>
            </div>

            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/30 border-2 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl mb-2 group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
              {topThree[0].avatar}
            </div>

            <div className="flex items-center gap-1 justify-center max-w-full">
              <span className="text-base">{topThree[0].countryFlag}</span>
              <p className="font-black uppercase tracking-tight text-sm sm:text-base text-amber-300 truncate">
                {topThree[0].name}
              </p>
            </div>

            <p className="font-mono-math text-base sm:text-xl font-black text-white mt-1">
              {category === 'speed' 
                ? `${topThree[0].avgReactionMs}ms` 
                : category === 'accuracy' 
                ? `${topThree[0].accuracy}%` 
                : category === 'streak' 
                ? `${topThree[0].streak}D` 
                : `${topThree[0].score.toLocaleString()} PTS`}
            </p>

            <div className="flex items-center gap-1 text-[11px] font-black text-emerald-400 font-mono-math mt-1">
              <span>{topThree[0].accuracy}% ACC</span>
              <span>•</span>
              <span className="text-amber-400">{topThree[0].streak}D STREAK</span>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleStartGhostDuel(topThree[0]);
              }}
              className="mt-3 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition-colors"
            >
              <Swords className="w-3.5 h-3.5 fill-slate-950" />
              <span>Challenge #1</span>
            </button>
          </div>

          {/* 3rd Place (Bronze) */}
          <div 
            onClick={() => handleInspectRival(topThree[2])}
            className="p-3 sm:p-5 rounded-3xl bg-[#1E293B] border-2 border-amber-700/70 text-center flex flex-col items-center justify-end relative shadow-xl hover:border-amber-600 transition-all cursor-pointer group"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-700 text-white font-black text-[11px] flex items-center gap-1 shadow-md uppercase tracking-wider">
              <span>🥉 3rd</span>
            </div>

            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border-2 border-amber-700 flex items-center justify-center text-2xl sm:text-3xl mb-2 group-hover:scale-105 transition-transform">
              {topThree[2].avatar}
            </div>

            <div className="flex items-center gap-1 justify-center max-w-full">
              <span className="text-sm">{topThree[2].countryFlag}</span>
              <p className="font-black uppercase tracking-tight text-xs sm:text-sm text-white truncate">
                {topThree[2].name}
              </p>
            </div>

            <p className="font-mono-math text-xs sm:text-base font-black text-slate-200 mt-1">
              {category === 'speed' 
                ? `${topThree[2].avgReactionMs}ms` 
                : category === 'accuracy' 
                ? `${topThree[2].accuracy}%` 
                : category === 'streak' 
                ? `${topThree[2].streak}D` 
                : `${topThree[2].score.toLocaleString()} PTS`}
            </p>

            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono-math mt-1">
              <span>{topThree[2].accuracy}% ACC</span>
              <span>•</span>
              <span className="text-sky-400">{topThree[2].avgReactionMs}ms</span>
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleStartGhostDuel(topThree[2]);
              }}
              className="mt-3 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 border border-slate-700 transition-colors"
            >
              <Swords className="w-3 h-3 text-sky-400" />
              <span>Duel</span>
            </button>
          </div>

        </div>
      )}

      {/* 3. Search Bar & League Filter Pill Rows */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="leaderboard-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sprinter, country or badge..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* League Selector Chips */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveLeagueTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeLeagueTab === 'all'
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Leagues
          </button>
          {['Grandmaster', 'Master', 'Diamond', 'Platinum', 'Gold'].map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveLeagueTab(tier as LeagueTier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeLeagueTab === tier
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

      </div>

      {/* 4. Full Leaderboard Table List */}
      <div className="rounded-3xl bg-[#1E293B] border border-slate-700/60 overflow-hidden shadow-xl">
        
        {/* Table Header */}
        <div className="p-4 border-b border-slate-700/60 flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-900/60">
          <div className="flex items-center gap-4">
            <span>Rank & Sprinter</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-10">
            <span className="hidden md:inline">Reaction Speed</span>
            <span className="hidden sm:inline">Accuracy</span>
            <span className="text-right min-w-[80px]">
              {category === 'speed' ? 'Solve Time' : category === 'accuracy' ? 'Accuracy' : category === 'streak' ? 'Streak' : 'Score'}
            </span>
          </div>
        </div>

        {/* Sprinters Rows */}
        <div className="divide-y divide-slate-700/40">
          {remaining.map((entry) => {
            const isMe = entry.isCurrentUser;
            
            return (
              <div
                key={entry.id}
                id={`leaderboard-row-${entry.rank}`}
                onClick={() => handleInspectRival(entry)}
                className={`p-3.5 sm:p-4 flex items-center justify-between transition-all cursor-pointer group ${
                  isMe
                    ? 'bg-sky-500/15 border-l-4 border-sky-500'
                    : 'hover:bg-slate-800/60'
                }`}
              >
                {/* Left: Rank, Avatar, Trend & Details */}
                <div className="flex items-center gap-3">
                  
                  {/* Rank Position */}
                  <div className="flex flex-col items-center justify-center w-8 shrink-0">
                    <span className={`font-mono-math text-xs sm:text-sm font-black ${
                      isMe ? 'text-sky-400' : 'text-slate-400'
                    }`}>
                      #{entry.rank}
                    </span>

                    {/* Trend Icon */}
                    {entry.trend === 'up' && (
                      <span className="flex items-center text-[9px] text-emerald-400 font-bold">
                        <TrendingUp className="w-2.5 h-2.5" />
                        {entry.trendPositions || 1}
                      </span>
                    )}
                    {entry.trend === 'down' && (
                      <span className="flex items-center text-[9px] text-rose-400 font-bold">
                        <TrendingDown className="w-2.5 h-2.5" />
                        {entry.trendPositions || 1}
                      </span>
                    )}
                    {entry.trend === 'same' && (
                      <span className="text-[9px] text-slate-600 font-bold">
                        <Minus className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-lg shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    {entry.avatar}
                  </div>

                  {/* Name, Flag & League Badge */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{entry.countryFlag}</span>
                      <span className={`text-xs sm:text-sm font-black uppercase tracking-tight ${isMe ? 'text-sky-400' : 'text-white'}`}>
                        {entry.name}
                      </span>
                      {entry.badge && (
                        <span className="hidden sm:inline px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-900 text-slate-300 border border-slate-700">
                          {entry.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono-math mt-0.5">
                      <span>LV.{entry.level}</span>
                      <span>•</span>
                      <span className="text-slate-300">{entry.league || 'Sprinter'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                        <Flame className="w-3 h-3 fill-amber-400" /> {entry.streak}D
                      </span>
                    </div>
                  </div>

                </div>

                {/* Right: Metrics & Ghost Duel Button */}
                <div className="flex items-center gap-4 sm:gap-8">
                  
                  {/* Reaction Time */}
                  <span className="font-mono-math text-xs font-bold text-sky-400 hidden md:inline">
                    {entry.avgReactionMs ? `${entry.avgReactionMs}ms` : '—'}
                  </span>

                  {/* Accuracy */}
                  <span className="font-mono-math text-xs font-bold text-emerald-400 hidden sm:inline">
                    {entry.accuracy}%
                  </span>

                  {/* Primary Score */}
                  <div className="text-right min-w-[80px]">
                    <span className="font-mono-math text-sm sm:text-base font-black text-white block">
                      {category === 'speed' 
                        ? `${entry.avgReactionMs || 900}ms` 
                        : category === 'accuracy' 
                        ? `${entry.accuracy}%` 
                        : category === 'streak' 
                        ? `${entry.streak}D` 
                        : entry.score.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-mono-math text-slate-400 block sm:hidden">
                      {entry.accuracy}% ACC
                    </span>
                  </div>

                  {/* Ghost Duel Trigger */}
                  {!isMe && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartGhostDuel(entry);
                      }}
                      className="hidden sm:flex p-2 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-all"
                      title="Challenge Ghost Duel"
                    >
                      <Swords className="w-4 h-4" />
                    </button>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* 5. Sticky Current User Position Bar (Floating HUD) */}
      {currentUserEntry && (
        <aside aria-label="User Rank Summary" className="fixed bottom-16 sm:bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 bg-[#0F172A]/95 backdrop-blur-xl border-2 border-sky-500/60 rounded-3xl p-3.5 sm:p-4 shadow-2xl shadow-sky-500/15 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between gap-3">
            
            {/* Rank & User Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                #{currentUserEntry.rank}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-white">
                    Your Standing: {currentUserEntry.league} Division
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono-math">
                  {currentUserEntry.score.toLocaleString()} PTS • {currentUserEntry.accuracy}% Accuracy • {currentUserEntry.streak}D Streak
                </p>
              </div>
            </div>

            {/* Quick Action: Climb Rank Sprint */}
            <div className="flex items-center gap-2">
              <button
                id="sticky-sprint-rank-btn"
                onClick={() => {
                  soundService.triggerHaptic('success');
                  if (onChallengeRival) {
                    onChallengeRival(allEntries[0]);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span className="hidden sm:inline">Sprint to Climb</span>
                <span className="sm:hidden">Sprint</span>
              </button>
            </div>

          </div>
        </aside>
      )}

      {/* 6. Rival Dossier & Ghost Duel Modal */}
      {selectedRival && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-black uppercase italic tracking-wider text-white">
                  Sprinter Dossier
                </h3>
              </div>
              <button
                onClick={() => setSelectedRival(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Competitor Profile Overview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-700/70">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-sky-400/40 flex items-center justify-center text-3xl shadow-md">
                {selectedRival.avatar}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{selectedRival.countryFlag}</span>
                  <h4 className="text-base font-black uppercase tracking-tight text-white">
                    {selectedRival.name}
                  </h4>
                </div>
                <p className="text-xs text-sky-400 font-bold font-mono-math mt-0.5">
                  Rank #{selectedRival.rank} • {selectedRival.league} Division
                </p>
                <p className="text-[11px] text-slate-400 font-mono-math">
                  Specialty: {selectedRival.bestOperation || 'Mental Math'}
                </p>
              </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Score</div>
                <div className="font-mono-math text-base font-black text-white mt-0.5">
                  {selectedRival.score.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Reaction</div>
                <div className="font-mono-math text-base font-black text-sky-400 mt-0.5">
                  {selectedRival.avgReactionMs}ms
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Accuracy</div>
                <div className="font-mono-math text-base font-black text-emerald-400 mt-0.5">
                  {selectedRival.accuracy}%
                </div>
              </div>
            </div>

            {/* Duel Call to Action */}
            <div className="space-y-2 pt-2">
              <button
                id="modal-start-ghost-duel-btn"
                onClick={() => {
                  setSelectedRival(null);
                  handleStartGhostDuel(selectedRival);
                }}
                className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 active:scale-95 transition-all"
              >
                <Swords className="w-4 h-4 fill-slate-950" />
                <span>Race Ghost Sprint (60s)</span>
              </button>

              <button
                onClick={() => setSelectedRival(null)}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
