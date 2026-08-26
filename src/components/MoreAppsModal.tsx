import React from 'react';
import { 
  X, 
  ExternalLink, 
  Star, 
  Grid, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { MORE_APPS_CATALOG, APP_EXTERNAL_LINKS } from '../config/appLinks';
import { soundService } from '../services/soundService';

interface MoreAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreAppsModal: React.FC<MoreAppsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOpenApp = (url: string) => {
    soundService.playClick();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenDeveloperPortfolio = () => {
    soundService.playClick();
    window.open(APP_EXTERNAL_LINKS.MORE_APPS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col relative text-slate-100">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-700/60 bg-gradient-to-b from-[#38B6DB]/20 via-[#1E293B]/60 to-transparent flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                More Apps by Developer
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Speed learning, memory training, and exam prep apps
              </p>
            </div>
          </div>

          <button
            id="close-more-apps-modal-btn"
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Apps List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MORE_APPS_CATALOG.map((app) => (
              <div
                key={app.id}
                id={`featured-app-${app.id}`}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-700/70 hover:border-sky-500/50 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-xl flex items-center justify-center shadow-inner">
                        {app.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white leading-tight">
                          {app.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {app.category}
                        </span>
                      </div>
                    </div>

                    {app.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {app.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 mb-3 line-clamp-2 leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-1">
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold font-mono-math">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{app.rating}</span>
                  </div>

                  <button
                    id={`open-app-${app.id}`}
                    onClick={() => handleOpenApp(app.url)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-sky-500 group-hover:text-slate-950 text-slate-200 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1"
                  >
                    <span>Get App</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Developer Portfolio Banner */}
          <div 
            onClick={handleOpenDeveloperPortfolio}
            className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-sky-950/60 border border-sky-500/30 flex items-center justify-between cursor-pointer hover:border-sky-500/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-bold">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  Visit Full Developer Store
                </h4>
                <p className="text-[11px] text-slate-400">
                  Browse all educational tools and upcoming releases
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-sky-400">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Edit info reminder */}
          <p className="text-[10px] text-center text-slate-500 pt-1">
            Store URLs can be configured directly in <code className="text-slate-400">src/config/appLinks.ts</code>
          </p>

        </div>

      </div>
    </div>
  );
};
