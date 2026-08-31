import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  VirtualTourData,
  VirtualTourRoom,
  TourHotspot,
  Property
} from '../../types';
import { PanoramaCanvas } from './PanoramaCanvas';
import { TourMinimap } from './TourMinimap';
import { HotspotDetailsModal } from './HotspotDetailsModal';
import { TourNavigationOverlay } from './TourNavigationOverlay';
import { tourSoundscape } from '../../lib/ambientSound';
import {
  Compass,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Sun,
  Sunset,
  Moon,
  Ruler,
  Volume2,
  VolumeX,
  HelpCircle,
  X,
  Sparkles,
  Layers,
  Home,
  Bed,
  ChefHat,
  Trees,
  DoorOpen,
  ArrowRight,
  Eye,
  Smartphone,
  RotateCcw,
  RotateCw,
  Target,
  AlertCircle
} from 'lucide-react';

interface VirtualTourViewerProps {
  tour: VirtualTourData;
  property?: Property;
  onClose?: () => void;
  onExpandModal?: () => void;
  isModal?: boolean;
  className?: string;
}

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  tour,
  property,
  onClose,
  onExpandModal,
  isModal = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeRoomId, setActiveRoomId] = useState<string>(
    tour.defaultRoomId || tour.rooms[0]?.id || ''
  );
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [fov, setFov] = useState<number>(65);
  const [lightingPreset, setLightingPreset] = useState<'day' | 'sunset' | 'night'>('day');
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [showMinimap, setShowMinimap] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<TourHotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isInternalFullscreen, setIsInternalFullscreen] = useState<boolean>(false);
  const [headingDeg, setHeadingDeg] = useState<number>(0);
  const [pitchDeg, setPitchDeg] = useState<number>(0);

  const isEffectiveModal = isModal || isInternalFullscreen;

  // Full-Browser Modal Open & Close Handlers
  const handleExpandFullscreen = useCallback(() => {
    if (onExpandModal) {
      onExpandModal();
    } else {
      setIsInternalFullscreen(true);
    }
  }, [onExpandModal]);

  const handleCloseFullscreenModal = useCallback(() => {
    if (isInternalFullscreen) {
      setIsInternalFullscreen(false);
    } else if (onClose) {
      onClose();
    }
  }, [isInternalFullscreen, onClose]);

  // Lock body scroll when in internal fullscreen modal
  useEffect(() => {
    if (isInternalFullscreen) {
      document.body.style.overflow = 'hidden';
    } else if (!isModal) {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isInternalFullscreen, isModal]);

  // Gyroscope State
  const [gyroActive, setGyroActive] = useState<boolean>(false);
  const [gyroCalibrateTrigger, setGyroCalibrateTrigger] = useState<number>(0);
  const [gyroSensorStatus, setGyroSensorStatus] = useState<boolean | null>(null);
  const [gyroFeedback, setGyroFeedback] = useState<string | null>(null);

  // On-Screen Navigation Overlay Pan & Reset Commands
  const [panCommand, setPanCommand] = useState<{ deltaYaw: number; deltaPitch: number; id: number } | null>(null);
  const [resetOrientationTrigger, setResetOrientationTrigger] = useState<number>(0);

  const handlePan = useCallback((deltaYaw: number, deltaPitch: number) => {
    setPanCommand({
      deltaYaw,
      deltaPitch,
      id: Date.now() + Math.random(),
    });
  }, []);

  const handleResetHome = useCallback(() => {
    setResetOrientationTrigger(Date.now());
    setFov(65);
    setGyroFeedback('Perspective reset to room entrance');
    setTimeout(() => setGyroFeedback(null), 2500);
  }, []);

  const activeRoom =
    tour.rooms.find((r) => r.id === activeRoomId) || tour.rooms[0];

  // Toggle Gyroscope with iOS 13+ permission support
  const handleToggleGyro = async () => {
    if (gyroActive) {
      setGyroActive(false);
      setGyroFeedback(null);
      return;
    }

    // Check iOS 13+ permission API
    if (
      typeof window !== 'undefined' &&
      typeof (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } })
        .DeviceOrientationEvent?.requestPermission === 'function'
    ) {
      try {
        const response = await (
          window as unknown as { DeviceOrientationEvent: { requestPermission: () => Promise<string> } }
        ).DeviceOrientationEvent.requestPermission();

        if (response === 'granted') {
          setGyroActive(true);
          setAutoRotate(false);
          setGyroCalibrateTrigger(Date.now());
          setGyroFeedback('Gyroscope Active: Tilt device to look around');
          setTimeout(() => setGyroFeedback(null), 4000);
        } else {
          setGyroFeedback('Motion sensor permission was denied in device settings');
          setTimeout(() => setGyroFeedback(null), 4000);
        }
      } catch (err) {
        console.warn('Gyroscope permission request error:', err);
        setGyroFeedback('Could not access device motion sensor');
        setTimeout(() => setGyroFeedback(null), 4000);
      }
    } else {
      // Standard Android / Desktop with orientation sensor
      setGyroActive(true);
      setAutoRotate(false);
      setGyroCalibrateTrigger(Date.now());
      setGyroFeedback('Gyroscope Active: Tilt or move device to explore 360°');
      setTimeout(() => setGyroFeedback(null), 4000);
    }
  };

  // Toggle Auto-Rotate with feedback
  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => {
      const next = !prev;
      if (next && gyroActive) {
        setGyroActive(false);
      }
      setGyroFeedback(next ? 'Auto-Rotate: Enabled (Panning 360°)' : 'Auto-Rotate: Paused');
      setTimeout(() => setGyroFeedback(null), 3000);
      return next;
    });
  }, [gyroActive]);

  // Recenter Gyro Heading
  const handleRecenterGyro = () => {
    setGyroCalibrateTrigger(Date.now());
    setGyroFeedback('Calibrated: View centered to current holding angle');
    setTimeout(() => setGyroFeedback(null), 3000);
  };

  // Handle Room Switching
  const handleSelectRoom = useCallback((roomId: string) => {
    setActiveRoomId(roomId);
    setSelectedHotspot(null);
  }, []);

  // Handle Heading Change from Canvas
  const handleHeadingChange = useCallback((heading: number, pitch: number) => {
    setHeadingDeg(heading);
    setPitchDeg(pitch);
  }, []);

  // Handle Gyro Status
  const handleGyroSensorStatus = useCallback((hasSensor: boolean) => {
    setGyroSensorStatus(hasSensor);
  }, []);

  // Handle Hotspot Click
  const handleHotspotClick = useCallback((hs: TourHotspot) => {
    if (hs.type === 'navigation' && hs.targetRoomId) {
      handleSelectRoom(hs.targetRoomId);
    } else {
      setSelectedHotspot(hs);
    }
  }, [handleSelectRoom]);

  // Sound Toggle
  const toggleSound = () => {
    if (soundEnabled) {
      tourSoundscape.stop();
      setSoundEnabled(false);
    } else {
      tourSoundscape.play('breeze');
      setSoundEnabled(true);
    }
  };

  // Cleanup Sound on Unmount
  useEffect(() => {
    return () => {
      tourSoundscape.stop();
    };
  }, []);

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.warn('Fullscreen request failed:', err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.warn('Exit fullscreen failed:', err));
    }
  };

  // Listen for fullscreen change event
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting input if focused on an input or textarea
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleToggleAutoRotate();
      } else if (e.key === '+' || e.key === '=') {
        setFov((prev) => Math.max(35, prev - 5));
      } else if (e.key === '-' || e.key === '_') {
        setFov((prev) => Math.min(95, prev + 5));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePan(-12, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handlePan(12, 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePan(0, 10);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handlePan(0, -10);
      } else if (e.key === 'h' || e.key === 'H') {
        handleResetHome();
      } else if (e.key === 'm' || e.key === 'M') {
        setShowMeasurements((prev) => !prev);
      } else if (e.key === 'Escape' && isEffectiveModal) {
        handleCloseFullscreenModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCloseFullscreenModal, handlePan, handleResetHome, handleToggleAutoRotate, isEffectiveModal]);

  // Compass Heading Name Helper
  const getCompassDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
    return directions[index];
  };

  const getRoomIcon = (type: string) => {
    switch (type) {
      case 'bedroom':
        return <Bed className="w-3.5 h-3.5" />;
      case 'kitchen':
        return <ChefHat className="w-3.5 h-3.5" />;
      case 'balcony':
        return <Trees className="w-3.5 h-3.5" />;
      case 'living':
      default:
        return <Home className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-[#2d2421] text-white select-none overflow-hidden ${
        isEffectiveModal || isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen'
          : 'rounded-3xl border border-[#5c4f4a]/30 shadow-2xl h-[620px]'
      } ${className}`}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex items-center justify-between gap-2 pointer-events-none bg-linear-to-b from-black/80 via-black/40 to-transparent">
        {/* Left: Property & Active Room Info */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#3f3531]/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 shadow-lg">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9996b] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9996b]" />
            </span>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#c9996b]">
                <span>360° Virtual Tour</span>
                <span>•</span>
                <span>{getCompassDirection(headingDeg)} {Math.round(headingDeg)}°</span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold font-['Outfit'] text-white truncate max-w-[200px] sm:max-w-[320px]">
                {activeRoom.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Gyroscope / Motion Tilt Button */}
          <button
            id="virtual-tour-gyro-toggle"
            onClick={handleToggleGyro}
            className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-2xl backdrop-blur-md border shadow-lg transition-all cursor-pointer ${
              gyroActive
                ? 'bg-[#c9996b] text-white border-white/40 ring-2 ring-[#c9996b]/60 scale-102'
                : 'bg-[#3f3531]/90 text-stone-300 hover:text-white border-white/15'
            }`}
            title={gyroActive ? 'Disable Gyroscope Motion' : 'Enable Gyroscope Motion (Tilt Device)'}
          >
            <Smartphone className={`w-4 h-4 ${gyroActive ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline text-xs font-bold font-['Outfit']">
              {gyroActive ? 'Gyro On' : 'Gyro'}
            </span>
            {gyroActive && (
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
            )}
          </button>

          {/* Gyro Recenter Button (Shown when Gyro is Active) */}
          {gyroActive && (
            <button
              onClick={handleRecenterGyro}
              className="flex items-center gap-1 px-2 py-2 rounded-2xl bg-[#3f3531]/90 text-stone-200 hover:text-white backdrop-blur-md border border-white/20 shadow-lg transition-all cursor-pointer"
              title="Recenter Front View to Current Angle"
            >
              <Target className="w-4 h-4 text-[#c9996b]" />
              <span className="hidden sm:inline text-[11px] font-bold">Recenter</span>
            </button>
          )}

          {/* Lighting Mode Selector */}
          <div className="hidden sm:flex items-center bg-[#3f3531]/90 backdrop-blur-md p-1 rounded-2xl border border-white/15 shadow-lg">
            <button
              onClick={() => setLightingPreset('day')}
              className={`p-1.5 rounded-xl transition-all ${
                lightingPreset === 'day'
                  ? 'bg-[#c9996b] text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Daylight Setting"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingPreset('sunset')}
              className={`p-1.5 rounded-xl transition-all ${
                lightingPreset === 'sunset'
                  ? 'bg-[#c9996b] text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Sunset Golden Hour Setting"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingPreset('night')}
              className={`p-1.5 rounded-xl transition-all ${
                lightingPreset === 'night'
                  ? 'bg-[#c9996b] text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Evening Ambient Setting"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auto-Rotation Play/Pause Toggle */}
          <button
            id="virtual-tour-autorotate-toggle"
            onClick={handleToggleAutoRotate}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl backdrop-blur-md border shadow-lg transition-all cursor-pointer ${
              autoRotate
                ? 'bg-[#c9996b] text-white border-white/40 ring-2 ring-[#c9996b]/40'
                : 'bg-[#3f3531]/90 text-stone-300 hover:text-white border-white/15'
            }`}
            title={autoRotate ? 'Pause Auto-Rotate (Spacebar)' : 'Start Auto-Rotate (Spacebar)'}
          >
            {autoRotate ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 text-[#c9996b]" />
            )}
            <span className="hidden sm:inline text-xs font-bold font-['Outfit']">
              {autoRotate ? 'Auto-Rotate On' : 'Auto-Rotate'}
            </span>
            {autoRotate && (
              <RotateCw className="w-3 h-3 text-white/80 animate-spin-slow hidden md:inline" />
            )}
          </button>

          {/* Measurements Toggle */}
          <button
            onClick={() => setShowMeasurements(!showMeasurements)}
            className={`p-2 rounded-2xl backdrop-blur-md border border-white/15 shadow-lg transition-all ${
              showMeasurements
                ? 'bg-[#5c766d] text-white'
                : 'bg-[#3f3531]/90 text-stone-300 hover:text-white'
            }`}
            title="Toggle Room Dimensions (M)"
          >
            <Ruler className="w-4 h-4" />
          </button>

          {/* Ambient Soundscape Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-2xl backdrop-blur-md border border-white/15 shadow-lg transition-all ${
              soundEnabled
                ? 'bg-[#5c766d] text-white'
                : 'bg-[#3f3531]/90 text-stone-300 hover:text-white'
            }`}
            title={soundEnabled ? 'Mute Ambient Sound' : 'Play Calm Breeze Soundscape'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Help Shortcuts */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-2xl bg-[#3f3531]/90 text-stone-300 hover:text-white backdrop-blur-md border border-white/15 shadow-lg transition-all"
            title="Tour Navigation Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Expand to Fullscreen / Exit Fullscreen Button in Top-Right */}
          {!isEffectiveModal ? (
            <button
              id="virtual-tour-expand-fullscreen"
              onClick={handleExpandFullscreen}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#c9996b] hover:bg-[#b88557] active:scale-95 text-white backdrop-blur-md border border-white/30 shadow-xl transition-all hover:scale-105 cursor-pointer"
              title="Expand to Fullscreen (Full-Browser Modal)"
            >
              <Maximize2 className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-xs font-bold font-['Outfit']">Fullscreen</span>
            </button>
          ) : (
            <button
              id="virtual-tour-close-modal"
              onClick={handleCloseFullscreenModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/15 text-stone-200 hover:text-white hover:bg-red-600/90 active:scale-95 backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-105 cursor-pointer"
              title="Exit Fullscreen Modal (Esc)"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold font-['Outfit']">Exit</span>
              <X className="w-4 h-4 ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Gyro Feedback Toast Banner */}
      {gyroFeedback && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-[#3f3531]/95 text-white border border-[#c9996b]/40 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-bold font-['Outfit'] pointer-events-none animate-in fade-in slide-in-from-top-2">
          <Smartphone className="w-4 h-4 text-[#c9996b]" />
          <span>{gyroFeedback}</span>
        </div>
      )}

      {/* Main 360 Panorama Stage */}
      <div className="relative flex-1 w-full h-full">
        <PanoramaCanvas
          room={activeRoom}
          autoRotate={autoRotate}
          fov={fov}
          onFovChange={setFov}
          lightingPreset={lightingPreset}
          showMeasurements={showMeasurements}
          gyroActive={gyroActive}
          gyroCalibrateTrigger={gyroCalibrateTrigger}
          panCommand={panCommand}
          resetOrientationTrigger={resetOrientationTrigger}
          onGyroSensorStatus={handleGyroSensorStatus}
          onHotspotClick={handleHotspotClick}
          onHeadingChange={handleHeadingChange}
          className="w-full h-full"
        />

        {/* Auto-Rotate Floating Status Indicator (Visible when Auto-Panning and Gyro is off) */}
        {autoRotate && !gyroActive && (
          <div className="absolute top-20 left-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-stone-200 text-[11px] font-medium shadow-lg pointer-events-none transition-opacity">
            <RotateCw className="w-3.5 h-3.5 text-[#c9996b] animate-spin-slow" />
            <span>Auto-panning 360° • Drag or touch to interact</span>
          </div>
        )}

        {/* Mobile Floating Quick-Access Actions (Gyro & Auto-Rotate) */}
        <div className="absolute bottom-4 left-4 z-20 sm:hidden flex items-center gap-2">
          {!gyroActive ? (
            <>
              <button
                onClick={handleToggleGyro}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#3f3531]/90 hover:bg-[#3f3531] text-white border border-[#c9996b]/40 shadow-xl backdrop-blur-md text-xs font-bold cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#c9996b]" />
                <span>Tilt</span>
              </button>
              <button
                onClick={handleToggleAutoRotate}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl backdrop-blur-md border shadow-xl text-xs font-bold cursor-pointer ${
                  autoRotate
                    ? 'bg-[#c9996b] text-white border-white/30'
                    : 'bg-[#3f3531]/90 text-stone-300 border-white/15'
                }`}
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#c9996b]" />}
                <span>{autoRotate ? 'Auto Pan' : 'Paused'}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1 bg-[#3f3531]/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 shadow-xl">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                <Smartphone className="w-3 h-3 text-[#c9996b] animate-pulse" />
                <span>Tilt Active</span>
              </span>
              <button
                onClick={handleRecenterGyro}
                className="ml-1.5 px-2 py-0.5 rounded-lg bg-[#c9996b] text-white text-[10px] font-bold"
              >
                Recenter
              </button>
            </div>
          )}
        </div>

        {/* On-Screen Navigation Overlay (Pan D-Pad, Zoom, Home Reset) */}
        <TourNavigationOverlay
          fov={fov}
          onFovChange={setFov}
          onPan={handlePan}
          onResetHome={handleResetHome}
          headingDeg={headingDeg}
          pitchDeg={pitchDeg}
          className="absolute right-4 bottom-24 sm:bottom-28"
        />

        {/* Floorplan Minimap Radar in Top Right or Bottom */}
        {showMinimap && (
          <div className="absolute top-20 right-4 z-20 hidden md:block">
            <TourMinimap
              tour={tour}
              activeRoomId={activeRoomId}
              cameraHeading={headingDeg}
              fov={fov}
              onSelectRoom={handleSelectRoom}
            />
          </div>
        )}
      </div>

      {/* Bottom Room Switcher Carousel */}
      <div className="relative z-30 bg-[#241d1a]/95 backdrop-blur-xl border-t border-white/10 p-3 sm:p-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Room Thumbnails */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1 scrollbar-none">
            {tour.rooms.map((room) => {
              const isSelected = room.id === activeRoomId;
              return (
                <button
                  key={room.id}
                  onClick={() => handleSelectRoom(room.id)}
                  className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-2xl transition-all duration-200 shrink-0 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#c9996b] border-[#c9996b] text-white shadow-lg ring-2 ring-[#c9996b]/40 scale-102'
                      : 'bg-[#3f3531]/80 border-white/10 text-stone-300 hover:bg-[#3f3531] hover:text-white hover:border-white/30'
                  }`}
                >
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-white/20">
                    <img
                      src={room.thumbnail}
                      alt={room.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold opacity-80">
                      {getRoomIcon(room.roomType)}
                      <span>{room.roomType}</span>
                    </div>
                    <div className="text-xs font-bold font-['Outfit'] whitespace-nowrap max-w-[130px] sm:max-w-[170px] truncate">
                      {room.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Helper Tips */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-stone-400 border-l border-white/10 pl-4 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-stone-300">
                Drag
              </span>{' '}
              to look 360°
            </span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-stone-300">
                Scroll
              </span>{' '}
              to zoom
            </span>
            <span className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-stone-300">
                Click Pins
              </span>{' '}
              to inspect
            </span>
          </div>
        </div>
      </div>

      {/* Hotspot Details Modal */}
      <HotspotDetailsModal
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
        onNavigateToRoom={(roomId) => handleSelectRoom(roomId)}
      />

      {/* Keyboard Shortcuts & Help Modal */}
      {showHelp && (
        <div
          onClick={() => setShowHelp(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#3f3531] text-[#ede9e6] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#c9996b]" />
                <h3 className="font-['Outfit'] text-lg font-bold text-white">
                  360° Tour Guide & Controls
                </h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                <span className="text-stone-300 font-medium">On-Screen Navigation Overlay</span>
                <span className="font-bold text-[#c9996b]">D-Pad Arrows, Zoom & Reset</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                <span className="text-stone-300 font-medium">Home Perspective Reset</span>
                <span className="font-bold text-[#c9996b]">H Key or Center Home Button</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                <span className="text-stone-300 font-medium">Pan Around View</span>
                <span className="font-bold text-[#c9996b]">Click & Drag / Arrow Keys</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                <span className="text-stone-300 font-medium">Zoom In / Out</span>
                <span className="font-bold text-[#c9996b]">Mouse Wheel / Pinch / + - Keys</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                <span className="text-stone-300 font-medium">Auto-Rotate Toggle</span>
                <span className="font-bold text-[#c9996b]">Spacebar or Play Button</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                <span className="text-stone-300 font-medium">Device Gyroscope (Mobile)</span>
                <span className="font-bold text-[#c9996b]">Tilt Phone / Tap Phone Icon</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                <span className="text-stone-300 font-medium">Toggle Measurements</span>
                <span className="font-bold text-[#c9996b]">M Key or Ruler Icon</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                <span className="text-stone-300 font-medium">Switch Rooms</span>
                <span className="font-bold text-[#c9996b]">Click Door Pins or Bottom Bar</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-black/20">
                <span className="text-stone-300 font-medium">Dhaka Utility Inspections</span>
                <span className="font-bold text-[#c9996b]">Click Green Utility Pins</span>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#c9996b] text-white font-bold text-xs hover:bg-[#b58557] transition-colors"
            >
              Got it, Resume Tour
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
