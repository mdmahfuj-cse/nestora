import { useState, useEffect, useRef, useCallback } from 'react';

export interface GyroOrientation {
  alpha: number; // 0 to 360 (compass/z-axis)
  beta: number;  // -180 to 180 (tilt front/back)
  gamma: number; // -90 to 90 (tilt left/right)
  screenOrientation: number; // 0, 90, 180, -90
}

interface UseDeviceGyroscopeOptions {
  initialYaw?: number;
  initialPitch?: number;
  onOrientationUpdate?: (yaw: number, pitch: number) => void;
}

export function useDeviceGyroscope(options: UseDeviceGyroscopeOptions = {}) {
  const { initialYaw = 0, initialPitch = 0, onOrientationUpdate } = options;

  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasSensorData, setHasSensorData] = useState<boolean | null>(null);
  const [permissionState, setPermissionState] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calibration reference angles
  const refAlphaRef = useRef<number | null>(null);
  const refBetaRef = useRef<number | null>(null);
  const refGammaRef = useRef<number | null>(null);

  const baseYawRef = useRef<number>(initialYaw);
  const basePitchRef = useRef<number>(initialPitch);

  // Smoothed outputs
  const smoothedYawRef = useRef<number>(initialYaw);
  const smoothedPitchRef = useRef<number>(initialPitch);

  // Check initial support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  // Update base anchors if room defaults change and gyro is not active
  useEffect(() => {
    if (!isActive) {
      baseYawRef.current = initialYaw;
      basePitchRef.current = initialPitch;
      smoothedYawRef.current = initialYaw;
      smoothedPitchRef.current = initialPitch;
      refAlphaRef.current = null;
      refBetaRef.current = null;
      refGammaRef.current = null;
    }
  }, [initialYaw, initialPitch, isActive]);

  // Recenter gyroscope heading to current view
  const recenter = useCallback((currentYaw?: number, currentPitch?: number) => {
    if (typeof currentYaw === 'number') baseYawRef.current = currentYaw;
    if (typeof currentPitch === 'number') basePitchRef.current = currentPitch;
    refAlphaRef.current = null;
    refBetaRef.current = null;
    refGammaRef.current = null;
  }, []);

  // Request Permission (iOS 13+) and enable
  const enableGyro = useCallback(async (): Promise<boolean> => {
    setErrorMessage(null);

    // iOS 13+ DeviceOrientationEvent permission flow
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
          setPermissionState('granted');
          setIsActive(true);
          return true;
        } else {
          setPermissionState('denied');
          setErrorMessage('Motion & Orientation access was denied. Please allow sensor permissions in device settings.');
          setIsActive(false);
          return false;
        }
      } catch (err) {
        console.warn('Error requesting device orientation permission:', err);
        setPermissionState('denied');
        setErrorMessage('Device orientation permission request failed.');
        setIsActive(false);
        return false;
      }
    } else if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      // Standard Android/modern browsers without requestPermission API
      setPermissionState('granted');
      setIsActive(true);
      return true;
    } else {
      setErrorMessage('Device gyroscope sensor is not available on this device.');
      return false;
    }
  }, []);

  // Disable Gyro
  const disableGyro = useCallback(() => {
    setIsActive(false);
    refAlphaRef.current = null;
    refBetaRef.current = null;
    refGammaRef.current = null;
  }, []);

  // Toggle
  const toggleGyro = useCallback(async () => {
    if (isActive) {
      disableGyro();
      return false;
    } else {
      return await enableGyro();
    }
  }, [isActive, disableGyro, enableGyro]);

  // Listen to orientation events when active
  useEffect(() => {
    if (!isActive) return;

    let animFrameId: number;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const alpha = e.alpha; // 0..360 (rotation around z)
      const beta = e.beta;   // -180..180 (x tilt)
      const gamma = e.gamma; // -90..90 (y tilt)

      if (alpha === null || beta === null || gamma === null) {
        setHasSensorData(false);
        return;
      }

      setHasSensorData(true);

      // Get screen orientation (portrait vs landscape)
      let screenAngle = 0;
      if (typeof window !== 'undefined') {
        if (window.screen && window.screen.orientation && typeof window.screen.orientation.angle === 'number') {
          screenAngle = window.screen.orientation.angle;
        } else if (typeof window.orientation === 'number') {
          screenAngle = window.orientation;
        }
      }

      // First reading: set reference anchors
      if (refAlphaRef.current === null) refAlphaRef.current = alpha;
      if (refBetaRef.current === null) refBetaRef.current = beta;
      if (refGammaRef.current === null) refGammaRef.current = gamma;

      // Calculate relative deltas based on screen orientation
      let deltaYaw = 0;
      let deltaPitch = 0;

      if (screenAngle === 0) {
        // Portrait mode
        // Turning phone left/right corresponds to alpha change (inverted) or gamma tilt
        deltaYaw = (alpha - refAlphaRef.current);
        deltaPitch = (beta - 90); // 90 is holding phone upright
      } else if (screenAngle === 90) {
        // Landscape Left
        deltaYaw = (alpha - refAlphaRef.current);
        deltaPitch = (gamma);
      } else if (screenAngle === -90 || screenAngle === 270) {
        // Landscape Right
        deltaYaw = (alpha - refAlphaRef.current);
        deltaPitch = (-gamma);
      } else {
        // Upside down portrait
        deltaYaw = (alpha - refAlphaRef.current);
        deltaPitch = (-(beta - 90));
      }

      // Normalize deltaYaw to -180..180
      deltaYaw = ((((deltaYaw % 360) + 540) % 360) - 180);

      // Compute target camera coordinates
      const targetYaw = baseYawRef.current - deltaYaw;
      const targetPitch = Math.max(-80, Math.min(80, basePitchRef.current + deltaPitch));

      // Low-pass filter for buttery smooth jitter-free motion (damping: 0.15)
      smoothedYawRef.current += (targetYaw - smoothedYawRef.current) * 0.2;
      smoothedPitchRef.current += (targetPitch - smoothedPitchRef.current) * 0.2;

      if (onOrientationUpdate) {
        onOrientationUpdate(smoothedYawRef.current, smoothedPitchRef.current);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [isActive, onOrientationUpdate]);

  return {
    isSupported,
    isActive,
    hasSensorData,
    permissionState,
    errorMessage,
    enableGyro,
    disableGyro,
    toggleGyro,
    recenter,
    smoothedYaw: smoothedYawRef.current,
    smoothedPitch: smoothedPitchRef.current,
  };
}
