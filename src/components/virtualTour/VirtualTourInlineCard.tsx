import React, { useState } from 'react';
import { Property } from '../../types';
import { getVirtualTourForProperty } from '../../data/virtualTourData';
import { VirtualTourViewer } from './VirtualTourViewer';
import { VirtualTourModal } from './VirtualTourModal';
import { Compass, Maximize2, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface VirtualTourInlineCardProps {
  property: Property;
}

export const VirtualTourInlineCard: React.FC<VirtualTourInlineCardProps> = ({
  property,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tour = getVirtualTourForProperty(property);

  return (
    <div id="virtual-tour-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c9996b]">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Interactive 360° Walkthrough</span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1 text-[#5c766d] bg-[#5c766d]/10 px-2 py-0.5 rounded-full border border-[#5c766d]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              {tour.rooms.length} Verified Rooms
            </span>
          </div>
          <h2 className="font-['Outfit'] text-2xl font-bold text-[#3f3531] mt-1">
            360° Virtual Tour & Inspection
          </h2>
          <p className="text-xs sm:text-sm text-[#5c4f4a]/80 mt-0.5">
            Click and drag to pan 360°, or tilt your mobile device with real-time gyroscope sensing. Inspect live utility connections, generator switchboards, and room dimensions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3f3531] hover:bg-[#2d2421] text-white text-xs font-bold rounded-2xl shadow-md transition-all hover:scale-102 self-start sm:self-auto cursor-pointer"
        >
          <Maximize2 className="w-4 h-4 text-[#c9996b]" />
          <span>Immersive Fullscreen Tour</span>
        </button>
      </div>

      {/* Embedded 360 Viewer Card */}
      <div className="relative rounded-3xl overflow-hidden border border-[#5c4f4a]/15 shadow-xl bg-[#241d1a]">
        <VirtualTourViewer
          tour={tour}
          property={property}
          isModal={false}
          onExpandModal={() => setIsModalOpen(true)}
          className="h-[520px] sm:h-[580px]"
        />
      </div>

      {/* Fullscreen Tour Modal */}
      <VirtualTourModal
        isOpen={isModalOpen}
        tour={tour}
        property={property}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
