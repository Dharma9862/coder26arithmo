import React from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  SlidersHorizontal, 
  Wifi, 
  Battery, 
  Sparkles,
  Maximize2,
  Check,
  Vibrate
} from 'lucide-react';
import { DeviceConfig, DeviceMode, DeviceOrientation, DevicePreset } from '../types';
import { soundService } from '../services/soundService';

interface DeviceViewportControllerProps {
  config: DeviceConfig;
  onChangeConfig: (newConfig: DeviceConfig) => void;
  children: React.ReactNode;
}

export const DeviceViewportController: React.FC<DeviceViewportControllerProps> = ({
  config,
  onChangeConfig,
  children,
}) => {
  const { mode, orientation, scale, showBezel, preset } = config;

  const handleSetMode = (newMode: DeviceMode) => {
    soundService.triggerHaptic('light');
    let defaultPreset: DevicePreset = 'responsive';
    if (newMode === 'mobile') defaultPreset = 'iphone';
    if (newMode === 'tablet') defaultPreset = 'ipad';

    onChangeConfig({
      ...config,
      mode: newMode,
      preset: defaultPreset,
      // If switching to desktop, orientation is portrait/auto
    });
  };

  const handleToggleOrientation = () => {
    soundService.triggerHaptic('light');
    const newOrientation: DeviceOrientation = orientation === 'portrait' ? 'landscape' : 'portrait';
    onChangeConfig({
      ...config,
      orientation: newOrientation,
    });
  };

  const handleSetScale = (newScale: number) => {
    soundService.triggerHaptic('light');
    onChangeConfig({
      ...config,
      scale: Math.max(0.65, Math.min(1.1, newScale)),
    });
  };

  const handleToggleBezel = () => {
    soundService.triggerHaptic('light');
    onChangeConfig({
      ...config,
      showBezel: !showBezel,
    });
  };

  const handleSetPreset = (newPreset: DevicePreset) => {
    soundService.triggerHaptic('light');
    let newMode: DeviceMode = 'desktop';
    if (newPreset === 'iphone' || newPreset === 'pixel') newMode = 'mobile';
    if (newPreset === 'ipad') newMode = 'tablet';

    onChangeConfig({
      ...config,
      preset: newPreset,
      mode: newMode,
    });
  };

  // Dimensions based on Mode and Orientation
  const getDeviceDimensions = () => {
    if (mode === 'desktop') {
      return { width: '100%', height: 'auto', minHeight: '100vh' };
    }

    if (mode === 'mobile') {
      if (orientation === 'portrait') {
        return { width: '390px', height: '844px' };
      } else {
        return { width: '844px', height: '420px' };
      }
    }

    if (mode === 'tablet') {
      if (orientation === 'portrait') {
        return { width: '768px', height: '1024px' };
      } else {
        return { width: '1024px', height: '768px' };
      }
    }

    return { width: '100%', height: 'auto' };
  };

  const dimensions = getDeviceDimensions();

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#090D16]">
      
      {/* Top Device Simulator Control Bar (HUD) */}
      <aside aria-label="Device Viewport Controls" className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Mode Switcher Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-700/80 rounded-2xl">
            <button
              id="viewport-desktop-btn"
              onClick={() => handleSetMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all ${
                mode === 'desktop'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Full Width Responsive Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>

            <button
              id="viewport-tablet-btn"
              onClick={() => handleSetMode('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all ${
                mode === 'tablet'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="iPad / Tablet Mode (768px / 1024px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
              <span className="text-[10px] opacity-75 font-mono hidden md:inline">iPad</span>
            </button>

            <button
              id="viewport-mobile-btn"
              onClick={() => handleSetMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all ${
                mode === 'mobile'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Smartphone Mobile Mode (390px / 844px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
              <span className="text-[10px] opacity-75 font-mono hidden md:inline">Phone</span>
            </button>
          </div>

          {/* Secondary Controls: Orientation, Zoom, Frame */}
          {mode !== 'desktop' && (
            <div className="flex items-center gap-2 animate-in fade-in duration-200">
              
              {/* Orientation Switcher */}
              <button
                id="viewport-orientation-btn"
                onClick={handleToggleOrientation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-black uppercase tracking-wider transition-all"
                title="Rotate Orientation (Portrait / Landscape)"
              >
                <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                <span className="capitalize">{orientation}</span>
              </button>

              {/* Preset Selector */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-700/80 p-1 rounded-xl">
                {mode === 'mobile' ? (
                  <>
                    <button
                      onClick={() => handleSetPreset('iphone')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        preset === 'iphone' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      iPhone 15
                    </button>
                    <button
                      onClick={() => handleSetPreset('pixel')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        preset === 'pixel' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Pixel 8
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleSetPreset('ipad')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-800 text-sky-400"
                  >
                    iPad Pro (11-inch)
                  </button>
                )}
              </div>

              {/* Bezel Toggle */}
              <button
                id="viewport-bezel-toggle-btn"
                onClick={handleToggleBezel}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-black uppercase tracking-wider transition-all ${
                  showBezel
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Toggle Physical Device Chassis"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showBezel ? 'Frame On' : 'No Frame'}</span>
              </button>

              {/* Scale Adjuster */}
              <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-700/80 px-2 py-1 rounded-xl text-[11px] font-mono-math">
                <button
                  onClick={() => handleSetScale(scale - 0.05)}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-slate-200 px-1">{Math.round(scale * 100)}%</span>
                <button
                  onClick={() => handleSetScale(scale + 0.05)}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* Active Mode Status Badge */}
          <div className="hidden md:flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-[10px] font-black uppercase tracking-wider text-slate-400 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {mode === 'desktop' ? 'Fluid Desktop (100%)' : `${mode.toUpperCase()} • ${dimensions.width} × ${dimensions.height}`}
              </span>
            </span>
          </div>

        </div>
      </aside>

      {/* Main Viewport Workspace Area */}
      <div className={`flex-1 w-full flex items-center justify-center transition-all duration-300 ${
        mode === 'desktop' ? 'p-0' : 'p-3 sm:p-8 bg-[#0B0F19]'
      }`}>
        
        {mode === 'desktop' ? (
          /* Full Desktop View */
          <div className="w-full flex-1 min-h-screen">
            {children}
          </div>
        ) : (
          /* Mobile / Tablet Simulated Chassis */
          <div 
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'all 0.3s ease',
            }}
            className="flex items-center justify-center my-auto"
          >
            <div 
              style={{
                width: dimensions.width,
                height: dimensions.height,
              }}
              className={`relative flex flex-col bg-[#0F172A] shadow-2xl transition-all duration-300 overflow-hidden ${
                showBezel
                  ? mode === 'mobile'
                    ? 'rounded-[50px] border-[10px] border-slate-800 ring-4 ring-slate-900/50 shadow-cyan-500/5'
                    : 'rounded-[36px] border-[12px] border-slate-800 ring-4 ring-slate-900/50 shadow-cyan-500/5'
                  : 'rounded-2xl border-2 border-slate-700 shadow-xl'
              }`}
            >

              {/* Physical Frame Highlights & Hardware Buttons (if Bezel On) */}
              {showBezel && mode === 'mobile' && orientation === 'portrait' && (
                <>
                  {/* Dynamic Island / Camera Pill */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-50 flex items-center justify-between px-2.5 border border-slate-800 shadow-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-sky-950" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700" />
                    </div>
                  </div>

                  {/* Top Status Bar for Mobile */}
                  <div className="w-full pt-3 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-300 z-40 bg-[#0F172A] select-none">
                    <span className="font-mono-math font-black">9:41</span>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Wifi className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase">5G</span>
                      <Battery className="w-4 h-3.5 fill-emerald-400 text-emerald-400" />
                    </div>
                  </div>
                </>
              )}

              {/* Tablet Top Status Bar */}
              {showBezel && mode === 'tablet' && (
                <div className="w-full pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-400 z-40 bg-[#0F172A] border-b border-slate-800/60 select-none">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-math font-black text-white">iPadOS 18</span>
                    <span className="text-[10px] text-slate-500">• 9:41 AM</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700 mx-auto" />
                  <div className="flex items-center gap-2 text-slate-300 text-xs">
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">100%</span>
                    <Battery className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  </div>
                </div>
              )}

              {/* Scrollable Device Display Screen */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col justify-between relative overscroll-contain">
                {children}
              </div>

              {/* Bottom Home Indicator Bar (if Bezel On) */}
              {showBezel && (
                <div className="w-full py-2 bg-[#0F172A] flex items-center justify-center select-none z-40 border-t border-slate-850">
                  <div className="w-32 h-1 bg-slate-600 rounded-full hover:bg-sky-400 transition-colors cursor-pointer" />
                </div>
              )}

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
