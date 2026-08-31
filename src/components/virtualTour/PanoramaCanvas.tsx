import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { VirtualTourRoom, TourHotspot } from '../../types';

interface PanoramaCanvasProps {
  room: VirtualTourRoom;
  autoRotate: boolean;
  fov: number;
  onFovChange?: (fov: number) => void;
  lightingPreset?: 'day' | 'sunset' | 'night';
  showMeasurements?: boolean;
  gyroActive?: boolean;
  gyroCalibrateTrigger?: number;
  panCommand?: { deltaYaw: number; deltaPitch: number; id: number } | null;
  resetOrientationTrigger?: number;
  onGyroSensorStatus?: (hasSensor: boolean) => void;
  onHotspotClick?: (hotspot: TourHotspot) => void;
  onHeadingChange?: (headingDeg: number, pitchDeg: number) => void;
  className?: string;
}

export const PanoramaCanvas: React.FC<PanoramaCanvasProps> = ({
  room,
  autoRotate,
  fov,
  onFovChange,
  lightingPreset = 'day',
  showMeasurements = true,
  gyroActive = false,
  gyroCalibrateTrigger = 0,
  panCommand = null,
  resetOrientationTrigger = 0,
  onGyroSensorStatus,
  onHotspotClick,
  onHeadingChange,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Callback Refs to prevent effect re-triggers
  const onHeadingChangeRef = useRef(onHeadingChange);
  const onGyroSensorStatusRef = useRef(onGyroSensorStatus);
  const onHotspotClickRef = useRef(onHotspotClick);
  const onFovChangeRef = useRef(onFovChange);

  useEffect(() => {
    onHeadingChangeRef.current = onHeadingChange;
    onGyroSensorStatusRef.current = onGyroSensorStatus;
    onHotspotClickRef.current = onHotspotClick;
    onFovChangeRef.current = onFovChange;
  });

  // State Refs for animation loop
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const gyroActiveRef = useRef(gyroActive);
  gyroActiveRef.current = gyroActive;

  const fovRef = useRef(fov);
  fovRef.current = fov;

  const roomRef = useRef(room);
  roomRef.current = room;

  // Three.js State Refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Hotspot DOM Elements Ref for direct transform updates (0 React re-renders)
  const hotspotElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Interaction State Refs
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);
  const lastInteractionTimeRef = useRef<number>(0);

  // Camera Spherical Coordinates
  const lonRef = useRef<number>(room.initialYaw || 0);
  const latRef = useRef<number>(room.initialPitch || 0);
  const targetLonRef = useRef<number>(room.initialYaw || 0);
  const targetLatRef = useRef<number>(room.initialPitch || 0);

  // Gyroscope State Refs
  const deviceOrientationRef = useRef<{ alpha: number; beta: number; gamma: number } | null>(null);
  const screenOrientationRef = useRef<number>(0);
  const gyroHeadingOffsetRef = useRef<number>(room.initialYaw || 0);
  const lastCalibrateRef = useRef<number>(0);

  // Throttled heading notification ref
  const lastReportedHeadingRef = useRef<number>(-999);
  const lastReportedPitchRef = useRef<number>(-999);
  const lastHeadingReportTimeRef = useRef<number>(0);

  // Math objects reused per frame
  const zee = useRef(new THREE.Vector3(0, 0, 1)).current;
  const upAxis = useRef(new THREE.Vector3(0, 1, 0)).current;
  const euler = useRef(new THREE.Euler()).current;
  const q0 = useRef(new THREE.Quaternion()).current;
  const q1 = useRef(new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5))).current; // - PI/2 on X

  const [loading, setLoading] = useState(true);

  const setObjectQuaternion = useCallback(
    (quaternion: THREE.Quaternion, alpha: number, beta: number, gamma: number, orient: number) => {
      euler.set(beta, alpha, -gamma, 'YXZ');
      quaternion.setFromEuler(euler);
      quaternion.multiply(q1); // Camera looks out the back of device
      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // Adjust for screen orientation
    },
    [euler, q0, q1, zee]
  );

  // Recenter / Calibrate Gyroscope
  useEffect(() => {
    if (gyroCalibrateTrigger !== lastCalibrateRef.current) {
      lastCalibrateRef.current = gyroCalibrateTrigger;
      if (deviceOrientationRef.current) {
        const alpha = deviceOrientationRef.current.alpha || 0;
        gyroHeadingOffsetRef.current = (room.initialYaw || 0) + alpha;
      } else {
        gyroHeadingOffsetRef.current = room.initialYaw || 0;
      }
    }
  }, [gyroCalibrateTrigger, room.initialYaw]);

  // Handle On-Screen Navigation Pan Commands
  const lastPanCommandIdRef = useRef<number>(0);
  useEffect(() => {
    if (panCommand && panCommand.id !== lastPanCommandIdRef.current) {
      lastPanCommandIdRef.current = panCommand.id;
      lastInteractionTimeRef.current = performance.now();
      if (gyroActiveRef.current) {
        gyroHeadingOffsetRef.current += panCommand.deltaYaw;
      } else {
        targetLonRef.current += panCommand.deltaYaw;
        targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current + panCommand.deltaPitch));
      }
    }
  }, [panCommand]);

  // Handle Home / Reset Orientation Command
  const lastResetTriggerRef = useRef<number>(0);
  useEffect(() => {
    if (resetOrientationTrigger && resetOrientationTrigger !== lastResetTriggerRef.current) {
      lastResetTriggerRef.current = resetOrientationTrigger;
      lastInteractionTimeRef.current = performance.now();
      targetLonRef.current = roomRef.current.initialYaw || 0;
      targetLatRef.current = roomRef.current.initialPitch || 0;
      gyroHeadingOffsetRef.current = roomRef.current.initialYaw || 0;
    }
  }, [resetOrientationTrigger]);

  // Device Orientation Event Listener
  useEffect(() => {
    if (!gyroActive) {
      deviceOrientationRef.current = null;
      return;
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha === null || e.beta === null || e.gamma === null) {
        if (onGyroSensorStatusRef.current) onGyroSensorStatusRef.current(false);
        return;
      }
      if (onGyroSensorStatusRef.current) onGyroSensorStatusRef.current(true);

      // On first reading, calibrate offset to current room yaw
      if (!deviceOrientationRef.current) {
        gyroHeadingOffsetRef.current = (roomRef.current.initialYaw || 0) + (e.alpha || 0);
      }

      deviceOrientationRef.current = {
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma,
      };
    };

    const handleScreenOrientation = () => {
      if (typeof window !== 'undefined') {
        if (window.screen?.orientation?.angle !== undefined) {
          screenOrientationRef.current = window.screen.orientation.angle;
        } else if (typeof window.orientation === 'number') {
          screenOrientationRef.current = window.orientation;
        }
      }
    };

    handleScreenOrientation();
    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener('orientationchange', handleScreenOrientation);
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleScreenOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('orientationchange', handleScreenOrientation);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleScreenOrientation);
      }
    };
  }, [gyroActive]);

  // Create Procedural High-Res Texture Fallback
  const createProceduralTexture = useCallback((roomName: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Warm Architectural Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#3f3531'); // Ceiling warm wood tone
    gradient.addColorStop(0.3, '#ede9e6'); // Wall warm neutral
    gradient.addColorStop(0.7, '#d6cec7'); // Horizon
    gradient.addColorStop(1, '#5c4f4a'); // Teak Floor

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Architectural Grid & Window Guides
    ctx.strokeStyle = 'rgba(201, 153, 107, 0.25)';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Windows Simulation
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(400, 300, 500, 400);
    ctx.fillRect(1300, 300, 400, 400);

    // Room Label
    ctx.fillStyle = '#3f3531';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Nestora 360° — ${roomName}`, canvas.width / 2, 512);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Update Lighting Preset dynamically
  useEffect(() => {
    if (!ambientLightRef.current) return;
    if (lightingPreset === 'day') {
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 1.0;
    } else if (lightingPreset === 'sunset') {
      ambientLightRef.current.color.setHex(0xffba77);
      ambientLightRef.current.intensity = 0.9;
    } else if (lightingPreset === 'night') {
      ambientLightRef.current.color.setHex(0x9cb8d9);
      ambientLightRef.current.intensity = 0.6;
    }
  }, [lightingPreset]);

  // Update Camera FOV dynamically
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = fov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [fov]);

  // Load Panorama Texture when Room Changes
  useEffect(() => {
    if (!sphereMeshRef.current) return;
    setLoading(true);

    // Reset Camera Angles to Room Defaults
    targetLonRef.current = room.initialYaw || 0;
    targetLatRef.current = room.initialPitch || 0;
    lonRef.current = room.initialYaw || 0;
    latRef.current = room.initialPitch || 0;
    gyroHeadingOffsetRef.current = room.initialYaw || 0;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    textureLoader.load(
      room.panoramaUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        if (sphereMeshRef.current) {
          const mat = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
          if (mat.map) mat.map.dispose();
          mat.map = texture;
          mat.needsUpdate = true;
        }
        setLoading(false);
      },
      undefined,
      (err) => {
        console.warn('Fallback to procedural panorama texture:', err);
        const fallbackTex = createProceduralTexture(room.name);
        if (sphereMeshRef.current) {
          const mat = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
          if (mat.map) mat.map.dispose();
          mat.map = fallbackTex;
          mat.needsUpdate = true;
        }
        setLoading(false);
      }
    );
  }, [room.id, room.panoramaUrl, room.name, room.initialYaw, room.initialPitch, createProceduralTexture]);

  // Initialize Three.js WebGL Scene ONCE
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Inverted Panorama Sphere Geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert faces inward so texture shows inside

    const initialTexture = createProceduralTexture(roomRef.current.name);
    const material = new THREE.MeshBasicMaterial({ map: initialTexture });
    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Load initial texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    textureLoader.load(
      roomRef.current.panoramaUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        if (sphereMeshRef.current) {
          const mat = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
          if (mat.map) mat.map.dispose();
          mat.map = texture;
          mat.needsUpdate = true;
        }
        setLoading(false);
      },
      undefined,
      () => {
        setLoading(false);
      }
    );

    // Animation Render Loop
    const renderLoop = () => {
      animFrameIdRef.current = requestAnimationFrame(renderLoop);

      let currentHeading = 0;
      let currentPitch = 0;

      if (gyroActiveRef.current && deviceOrientationRef.current) {
        // --- 6-DOF / 3-DOF Physical Gyroscope Mode ---
        const alphaRad = THREE.MathUtils.degToRad(deviceOrientationRef.current.alpha || 0);
        const betaRad = THREE.MathUtils.degToRad(deviceOrientationRef.current.beta || 0);
        const gammaRad = THREE.MathUtils.degToRad(deviceOrientationRef.current.gamma || 0);
        const orientRad = THREE.MathUtils.degToRad(screenOrientationRef.current || 0);

        const deviceQuat = new THREE.Quaternion();
        setObjectQuaternion(deviceQuat, alphaRad, betaRad, gammaRad, orientRad);

        // Apply manual drag / room yaw offset
        const offsetQuat = new THREE.Quaternion().setFromAxisAngle(
          upAxis,
          THREE.MathUtils.degToRad(gyroHeadingOffsetRef.current)
        );

        const targetQuat = offsetQuat.multiply(deviceQuat);

        // Smooth slerp damping
        camera.quaternion.slerp(targetQuat, 0.25);

        // Derive world forward direction
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);

        currentHeading = (((THREE.MathUtils.radToDeg(Math.atan2(dir.x, dir.z)) + 180) % 360) + 360) % 360;
        currentPitch = THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, dir.y))));

        lonRef.current = currentHeading;
        latRef.current = currentPitch;
      } else {
        // --- Manual Orbit & Auto-Rotation Mode ---
        const isInteracting = isDraggingRef.current || (performance.now() - lastInteractionTimeRef.current < 1200);
        if (autoRotateRef.current && !isInteracting) {
          // Slow, consistent, architectural auto-panning speed (~4.5 deg/s)
          targetLonRef.current += 0.075;
        }

        // Smooth camera interpolation (Damping)
        lonRef.current += (targetLonRef.current - lonRef.current) * 0.12;
        latRef.current += (targetLatRef.current - latRef.current) * 0.12;

        // Clamp latitude / pitch to prevent flipping
        latRef.current = Math.max(-85, Math.min(85, latRef.current));
        targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current));

        const phi = THREE.MathUtils.degToRad(90 - latRef.current);
        const theta = THREE.MathUtils.degToRad(lonRef.current);

        const targetX = 500 * Math.sin(phi) * Math.cos(theta);
        const targetY = 500 * Math.cos(phi);
        const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

        camera.lookAt(targetX, targetY, targetZ);

        currentHeading = ((lonRef.current % 360) + 360) % 360;
        currentPitch = latRef.current;
      }

      renderer.render(scene, camera);

      // Throttled heading notification (max 10 times / sec, delta > 0.5 deg)
      const now = performance.now();
      if (
        now - lastHeadingReportTimeRef.current > 100 &&
        (Math.abs(currentHeading - lastReportedHeadingRef.current) > 0.5 ||
          Math.abs(currentPitch - lastReportedPitchRef.current) > 0.5)
      ) {
        lastHeadingReportTimeRef.current = now;
        lastReportedHeadingRef.current = currentHeading;
        lastReportedPitchRef.current = currentPitch;
        if (onHeadingChangeRef.current) {
          onHeadingChangeRef.current(Math.round(currentHeading), Math.round(currentPitch));
        }
      }

      // Direct DOM Projection of 3D Hotspots (0 React state overhead)
      if (containerRef.current && roomRef.current.hotspots) {
        const contW = containerRef.current.clientWidth;
        const contH = containerRef.current.clientHeight;

        for (const hs of roomRef.current.hotspots) {
          const el = hotspotElementsRef.current.get(hs.id);
          if (!el) continue;

          const hsPhi = THREE.MathUtils.degToRad(90 - hs.pitch);
          const hsTheta = THREE.MathUtils.degToRad(hs.yaw);

          const pos = new THREE.Vector3(
            500 * Math.sin(hsPhi) * Math.cos(hsTheta),
            500 * Math.cos(hsPhi),
            500 * Math.sin(hsPhi) * Math.sin(hsTheta)
          );

          const projectedVec = pos.clone().project(camera);
          const isVisible = projectedVec.z < 1;
          const screenX = ((projectedVec.x + 1) * contW) / 2;
          const screenY = ((-projectedVec.y + 1) * contH) / 2;
          const scale = Math.max(0.6, Math.min(1.2, 1 - (fovRef.current - 65) / 100));

          if (isVisible && screenX >= -50 && screenX <= contW + 50 && screenY >= -50 && screenY <= contH + 50) {
            el.style.display = 'block';
            el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -50%) scale(${scale})`;
          } else {
            el.style.display = 'none';
          }
        }
      }
    };

    renderLoop();

    // Handle Container Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newW / newH;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newW, newH);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [createProceduralTexture, setObjectQuaternion]);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastInteractionTimeRef.current = performance.now();
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    lastInteractionTimeRef.current = performance.now();
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;

    if (gyroActiveRef.current) {
      gyroHeadingOffsetRef.current -= deltaX * 0.22;
    } else {
      targetLonRef.current -= deltaX * 0.18;
      targetLatRef.current += deltaY * 0.18;
    }

    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    lastInteractionTimeRef.current = performance.now();
  };

  // Wheel Zoom Handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    lastInteractionTimeRef.current = performance.now();
    if (!onFovChangeRef.current) return;
    const delta = e.deltaY * 0.05;
    const newFov = Math.max(35, Math.min(95, fovRef.current + delta));
    onFovChangeRef.current(newFov);
  };

  // Touch Swipe & Pinch Zoom Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    lastInteractionTimeRef.current = performance.now();
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchDistanceRef.current = null;
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    lastInteractionTimeRef.current = performance.now();
    if (e.touches.length === 1 && isDraggingRef.current) {
      const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
      const deltaY = e.touches[0].clientY - prevMouseRef.current.y;

      if (gyroActiveRef.current) {
        gyroHeadingOffsetRef.current -= deltaX * 0.25;
      } else {
        targetLonRef.current -= deltaX * 0.22;
        targetLatRef.current += deltaY * 0.22;
      }

      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null && onFovChangeRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const diff = touchDistanceRef.current - newDist;

      const newFov = Math.max(35, Math.min(95, fovRef.current + diff * 0.15));
      onFovChangeRef.current(newFov);
      touchDistanceRef.current = newDist;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    touchDistanceRef.current = null;
    lastInteractionTimeRef.current = performance.now();
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center pointer-events-none z-20 transition-opacity">
          <div className="flex flex-col items-center gap-2 bg-[#3f3531]/90 text-white px-5 py-3 rounded-2xl border border-white/10 shadow-xl">
            <div className="w-6 h-6 border-2 border-[#c9996b] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold font-['Outfit']">Rendering 360° Sphere...</span>
          </div>
        </div>
      )}

      {/* Direct DOM Hotspot Elements Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {room.hotspots?.map((hotspot) => {
          const isNav = hotspot.type === 'navigation';
          const isUtility = hotspot.type === 'utility';

          return (
            <div
              key={hotspot.id}
              ref={(el) => {
                if (el) {
                  hotspotElementsRef.current.set(hotspot.id, el);
                } else {
                  hotspotElementsRef.current.delete(hotspot.id);
                }
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                display: 'none',
                willChange: 'transform',
              }}
              className="pointer-events-auto transition-opacity duration-150"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onHotspotClickRef.current) onHotspotClickRef.current(hotspot);
                }}
                className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md border transition-all cursor-pointer hover:scale-110 active:scale-95 ${
                  isNav
                    ? 'bg-[#c9996b]/95 text-white border-white/40 ring-4 ring-[#c9996b]/30'
                    : isUtility
                    ? 'bg-[#5c766d]/95 text-white border-white/40 ring-4 ring-[#5c766d]/30'
                    : 'bg-[#5c4f4a]/95 text-white border-[#c9996b]/50 ring-4 ring-[#5c4f4a]/30'
                }`}
                title={hotspot.title}
              >
                {/* Pulsing Center Dot / Icon */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                </span>

                <span className="text-[11px] font-bold tracking-tight whitespace-nowrap drop-shadow-xs max-w-[150px] sm:max-w-[200px] truncate">
                  {hotspot.title}
                </span>

                {hotspot.tag && (
                  <span className="hidden sm:inline-block text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-white/20 text-white">
                    {hotspot.tag}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating Measurements Overlay if active */}
      {showMeasurements && room.measurements && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {room.measurements.map((m) => (
            <div
              key={m.id}
              className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/10 text-xs shadow-md flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#c9996b]" />
              <span className="font-semibold text-stone-300">{m.label}:</span>
              <span className="font-bold text-[#ede9e6]">{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
