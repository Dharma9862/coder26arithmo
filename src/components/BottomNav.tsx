import React from 'react';
import { 
  Zap, 
  GraduationCap, 
  BarChart3, 
  Trophy, 
  BookmarkCheck 
} from 'lucide-react';
import { soundService } from '../services/soundService';

export type TabType = 'sprint' | 'examprep' | 'analytics' | 'leaderboard' | 'bookmarks';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  bookmarkCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  bookmarkCount,
}) => {
  const tabs = [
    { id: 'sprint' as TabType, label: 'Practice', icon: Zap },
    { id: 'examprep' as TabType, label: 'Exam Prep', icon: GraduationCap },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'leaderboard' as TabType, label: 'Rankings', icon: Trophy },
    { id: 'bookmarks' as TabType, label: 'Saved', icon: BookmarkCheck, badge: bookmarkCount },
  ];

  const handleTabClick = (tabId: TabType) => {
    soundService.triggerHaptic('light');
    onSelectTab(tabId);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-lg border-t border-slate-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5 sm:py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1.5 rounded-2xl transition-all relative min-h-[48px] touch-manipulation active:scale-95 ${
                isActive
                  ? 'text-sky-400 font-black'
                  : 'text-slate-400 hover:text-slate-200 font-bold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.75px] text-sky-400' : 'stroke-2'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-[11px] mt-1 tracking-tight ${isActive ? 'font-black text-sky-400' : 'font-semibold text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-4 h-1 bg-sky-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
