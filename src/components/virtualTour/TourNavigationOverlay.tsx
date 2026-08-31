import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Home,
  Compass,
  Sliders,
  ChevronDown as CollapseIcon,
  ChevronUp as ExpandIcon,
  RotateCcw
} from 'lucide-react';

interface TourNavigationOverlayProps {
  fov: number;
  onFovChange: (fov: number) => void;
  onPan: (deltaYaw: number, deltaPitch: number) => void;
  onResetHome: () => void;
  headingDeg?: number;
  pitchDeg?: number;
  className?: string;
}

export const TourNavigationOverlay: React.FC<TourNavigationOverlayProps> = ({
  fov,
  onFovChange,
  onPan,
  onResetHome,
  headingDeg = 0,
  pitchDeg = 0,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeDirection, setActiveDirection] = useState<string | null>(null);

  // Interval ref for smooth continuous panning and zooming when holding down buttons
  const holdIntervalRef = useRef<number | null>(null);
  const holdTimeoutRef = useRef<number | null>(null);

  const clearHoldTimers = useCallback(() => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setActiveDirection(null);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => clearHoldTimers();
  }, [clearHoldTimers]);

  // Start continuous pan action on hold
  const startPanHold = (deltaYaw: number, deltaPitch: number, directionKey: string) => {
    clearHoldTimers();
    setActiveDirection(directionKey);
    // Execute immediate step
    onPan(deltaYaw, deltaPitch);

    // If held longer than 220ms, initiate continuous fast repeating pan
    holdTimeoutRef.current = window.setTimeout(() => {
      holdIntervalRef.current = window.setInterval(() => {
        onPan(deltaYaw * 0.35, deltaPitch * 0.35);
      }, 45);
    }, 220);
  };

  // Start continuous zoom action on hold
  const startZoomHold = (zoomDelta: number, directionKey: string) => {
    clearHoldTimers();
    setActiveDirection(directionKey);
    onFovChange(Math.max(35, Math.min(95, fov + zoomDelta)));

    holdTimeoutRef.current = window.setTimeout(() => {
      holdIntervalRef.current = window.setInterval(() => {
        onFovChange((currentFov) => Math.max(35, Math.min(95, currentFov + (zoomDelta > 0 ? 2 : -2))));
      }, 60);
    }, 220);
  };

  // Calculate zoom percentage (65 deg FOV = 100% standard baseline)
  const zoomPercentage = Math.round((65 / fov) * 100);

  return (
    <div
      id="tour-navigation-overlay"
      className={`z-20 flex flex-col items-end gap-2 select-none pointer-events-auto transition-all duration-300 ${className}`}
    >
      {/* Minimized Quick Button */}
      {isCollapsed ? (
        <button
          onClick={() => setIsCollapsed(false)}
          className="group flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#2a231f]/95 hover:bg-[#3f3531] text-white border border-white/20 shadow-2xl backdrop-blur-xl text-xs font-bold font-['Outfit'] transition-all cursor-pointer hover:scale-105"
          title="Open Navigation Controls (Pan, Zoom, Home)"
        >
          <Compass className="w-4 h-4 text-[#c9996b] group-hover:rotate-45 transition-transform" />
          <span>Controls</span>
          <ExpandIcon className="w-3 h-3 text-stone-400" />
        </button>
      ) : (
        <div className="flex flex-col gap-2 p-3 rounded-3xl bg-[#221c19]/90 backdrop-blur-xl border border-white/15 shadow-2xl text-stone-200">
          {/* Header Bar with Minimize & Compass Heading */}
          <div className="flex items-center justify-between gap-3 px-1 pb-2 border-b border-white/10 text-[11px] font-bold">
            <div className="flex items-center gap-1.5 text-stone-300">
              <Compass className="w-3.5 h-3.5 text-[#c9996b]" />
              <span className="font-['Outfit'] tracking-wide">Nav Controls</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-stone-400 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                {Math.round(headingDeg)}°
              </span>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize Controls"
              >
                <CollapseIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* D-Pad Directional Pan & Home Cluster */}
          <div className="relative w-32 h-32 mx-auto my-1 flex items-center justify-center">
            {/* Background Disc Guide */}
            <div className="absolute inset-0 rounded-full border border-dashed border-white/15 pointer-events-none" />

            {/* Up Button (Tilt Up / Pitch Up) */}
            <button
              onMouseDown={() => startPanHold(0, 12, 'up')}
              onMouseUp={clearHoldTimers}
              onMouseLeave={clearHoldTimers}
              onTouchStart={() => startPanHold(0, 12, 'up')}
              onTouchEnd={clearHoldTimers}
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-9 h-9 rounded-2xl flex items-center justify-center border transition-all cursor-pointer shadow-md ${
                activeDirection === 'up'
                  ? 'bg-[#c9996b] text-white border-white scale-110 shadow-lg ring-2 ring-[#c9996b]/50'
                  : 'bg-[#352c27] hover:bg-[#483c35] text-stone-200 border-white/15 active:scale-95'
              }`}
              title="Pan Up (Hold for continuous tilt)"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            {/* Left Button (Pan Left / Yaw Left) */}
            <button
              onMouseDown={() => startPanHold(-14, 0, 'left')}
              onMouseUp={clearHoldTimers}
              onMouseLeave={clearHoldTimers}
              onTouchStart={() => startPanHold(-14, 0, 'left')}
              onTouchEnd={clearHoldTimers}
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-2xl flex items-center justify-center border transition-all cursor-pointer shadow-md ${
                activeDirection === 'left'
                  ? 'bg-[#c9996b] text-white border-white scale-110 shadow-lg ring-2 ring-[#c9996b]/50'
                  : 'bg-[#352c27] hover:bg-[#483c35] text-stone-200 border-white/15 active:scale-95'
              }`}
              title="Pan Left (Hold for continuous turn)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Center Home-Reset Button */}
            <button
              onClick={() => {
                onResetHome();
                clearHoldTimers();
              }}
              className="relative z-10 w-10 h-10 rounded-2xl bg-[#c9996b] hover:bg-[#b88557] active:scale-90 text-white flex flex-col items-center justify-center border border-white/30 shadow-lg transition-all cursor-pointer group"
              title="Reset View to Room Entrance Perspective (H)"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[8px] font-bold uppercase tracking-wider font-['Outfit']">Reset</span>
            </button>

            {/* Right Button (Pan Right / Yaw Right) */}
            <button
              onMouseDown={() => startPanHold(14, 0, 'right')}
              onMouseUp={clearHoldTimers}
              onMouseLeave={clearHoldTimers}
              onTouchStart={() => startPanHold(14, 0, 'right')}
              onTouchEnd={clearHoldTimers}
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-2xl flex items-center justify-center border transition-all cursor-pointer shadow-md ${
                activeDirection === 'right'
                  ? 'bg-[#c9996b] text-white border-white scale-110 shadow-lg ring-2 ring-[#c9996b]/50'
                  : 'bg-[#352c27] hover:bg-[#483c35] text-stone-200 border-white/15 active:scale-95'
              }`}
              title="Pan Right (Hold for continuous turn)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Down Button (Tilt Down / Pitch Down) */}
            <button
              onMouseDown={() => startPanHold(0, -12, 'down')}
              onMouseUp={clearHoldTimers}
              onMouseLeave={clearHoldTimers}
              onTouchStart={() => startPanHold(0, -12, 'down')}
              onTouchEnd={clearHoldTimers}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-9 h-9 rounded-2xl flex items-center justify-center border transition-all cursor-pointer shadow-md ${
                activeDirection === 'down'
                  ? 'bg-[#c9996b] text-white border-white scale-110 shadow-lg ring-2 ring-[#c9996b]/50'
                  : 'bg-[#352c27] hover:bg-[#483c35] text-stone-200 border-white/15 active:scale-95'
              }`}
              title="Pan Down (Hold for continuous tilt)"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Zoom Controls Bar */}
          <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-white/10 bg-black/20 p-2 rounded-2xl border border-white/5">
            {/* Zoom Out Button */}
            <button
              onMouseDown={() => startZoomHold(6, 'zoom-out')}
              onMouseUp={clearHoldTimers}
              onMouseLeave={clearHoldTimers}
              onTouchStart={() => startZoomHold(6, 'zoom-out')}
              onTouchEnd={clearHoldTimers}
              disabled={fov >= 95}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                fov >= 95
                  ? 'opacity-40 cursor-not-allowed border-transparent text-stone-500'
                  : activeDirection === 'zoom-out'
                  ? 'bg-[#c9996b] text-white border-white scale-105'
                  : 'bg-[#352c27] hover:bg-[#483c35] text-stone-200 border-white/15 active:scale-95'
              }`}
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            {/* Zoom Level Indicator & 100% Reset Click */}
            <button
              onClick={() => onFovChange(65)}
              className="flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer group"
              title="Reset Zoom to 100% (65°)"
            >
              <span className="text-[11px] font-bold font-mono text-[#c9996b] group-hover:text-white transition-colors">
                {zoomPercentage}%
              </span>
              <span className="text-[8px] uppercase tracking-wider text-stone-400 group-hover:text-stone-300">
                {fov === 65 ? 'Normal' : 'Reset'}
              </span>
            </button>

            {/* Zoom In Button */}
            <button
              onMouseDown={() => startZoomHold(-6, 'zoom-in')}
              onMouseUp={clearHoldTimers}
              onMouseLeave={clearHoldTimers}
              onTouchStart={() => startZoomHold(-6, 'zoom-in')}
              onTouchEnd={clearHoldTimers}
              disabled={fov <= 35}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                fov <= 35
                  ? 'opacity-40 cursor-not-allowed border-transparent text-stone-500'
                  : activeDirection === 'zoom-in'
                  ? 'bg-[#c9996b] text-white border-white scale-105'
                  : 'bg-[#352c27] hover:bg-[#483c35] text-stone-200 border-white/15 active:scale-95'
              }`}
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Keyboard Hints */}
          <div className="flex items-center justify-center gap-2 pt-1 text-[9px] text-stone-400 font-mono">
            <span>[Arrows] Pan</span>
            <span>•</span>
            <span>[+/-] Zoom</span>
            <span>•</span>
            <span>[H] Home</span>
          </div>
        </div>
      )}
    </div>
  );
};
