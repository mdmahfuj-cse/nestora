import React, { useState } from 'react';
import { VirtualTourData, VirtualTourRoom } from '../../types';
import { MapPin, Compass, ChevronDown, ChevronUp } from 'lucide-react';

interface TourMinimapProps {
  tour: VirtualTourData;
  activeRoomId: string;
  cameraHeading: number; // 0 - 360 degrees
  fov: number;
  onSelectRoom: (roomId: string) => void;
  className?: string;
}

export const TourMinimap: React.FC<TourMinimapProps> = ({
  tour,
  activeRoomId,
  cameraHeading,
  fov,
  onSelectRoom,
  className = '',
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const activeRoom = tour.rooms.find((r) => r.id === activeRoomId) || tour.rooms[0];
  const activeCoords = activeRoom.floorplanCoords || { x: 50, y: 50 };

  return (
    <div
      className={`bg-[#3f3531]/95 text-white backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl overflow-hidden transition-all duration-300 ${
        collapsed ? 'w-48' : 'w-64 sm:w-72'
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#c9996b] animate-spin-slow" />
          <span className="text-xs font-bold font-['Outfit'] tracking-wide">
            Floorplan Radar
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          title={collapsed ? 'Expand Floorplan' : 'Collapse Floorplan'}
        >
          {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-3">
          {/* Architectural Layout Stage */}
          <div className="relative w-full aspect-4/3 bg-stone-900/90 rounded-xl border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(201, 153, 107, 0.4) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Architectural Layout Walls Simulation */}
            <div className="absolute inset-2 border-2 border-stone-600/50 rounded-lg pointer-events-none">
              {/* Internal Wall Partitions */}
              <div className="absolute left-1/2 top-0 bottom-1/2 w-0.5 bg-stone-600/40" />
              <div className="absolute top-1/2 left-0 right-1/2 h-0.5 bg-stone-600/40" />
              <div className="absolute top-1/3 right-0 left-1/2 h-0.5 bg-stone-600/40" />
            </div>

            {/* Real-time Camera Vision Cone / Radar */}
            <div
              className="absolute pointer-events-none transition-transform duration-75 origin-center"
              style={{
                left: `${activeCoords.x}%`,
                top: `${activeCoords.y}%`,
                transform: `translate(-50%, -50%) rotate(${cameraHeading}deg)`,
              }}
            >
              {/* Vision Cone Wedge */}
              <div
                className="w-24 h-24 origin-bottom pointer-events-none"
                style={{
                  clipPath: `polygon(50% 100%, ${50 - Math.tan((fov * Math.PI) / 360) * 50}% 0%, ${
                    50 + Math.tan((fov * Math.PI) / 360) * 50
                  }% 0%)`,
                  background:
                    'linear-gradient(to top, rgba(201, 153, 107, 0.7), rgba(201, 153, 107, 0.05))',
                  transform: 'translate(-50%, -100%)',
                  left: '50%',
                  position: 'absolute',
                }}
              />
            </div>

            {/* Room Pins */}
            {tour.rooms.map((room) => {
              const coords = room.floorplanCoords || { x: 50, y: 50 };
              const isActive = room.id === activeRoomId;

              return (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`group absolute p-1.5 rounded-full transition-all duration-200 z-10 ${
                    isActive
                      ? 'bg-[#c9996b] text-white ring-4 ring-[#c9996b]/40 scale-125'
                      : 'bg-stone-800 text-stone-300 hover:bg-[#5c766d] hover:text-white border border-white/30 hover:scale-110'
                  }`}
                  title={room.name}
                >
                  <MapPin className="w-3 h-3" />

                  {/* Tooltip on Hover */}
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 text-white text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 z-30 font-semibold">
                    {room.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Room Indicator Footer */}
          <div className="mt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-stone-400 font-medium">Viewing:</span>
            <span className="font-bold text-[#c9996b] truncate max-w-[160px]">
              {activeRoom.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
