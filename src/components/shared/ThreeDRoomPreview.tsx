import React, { useState, useRef } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'motion/react';
import { Sparkles, Layers, ShieldCheck, Eye } from 'lucide-react';
import { formatBDT } from '../../lib/utils';
import { useNavigationStore } from '../../stores/useNavigationStore';

export const ThreeDRoomPreview: React.FC = () => {
  const { navigate } = useNavigationStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative perspective-1000 w-full max-w-xl mx-auto select-none"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-3xl bg-[#ede9e6] border-2 border-[#5c4f4a]/20 p-4 shadow-2xl shadow-[#5c4f4a]/25 transition-shadow duration-300"
      >
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-stone-900">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
            alt="Dhaka Luxury Penthouse Living Room"
            className="w-full h-full object-cover opacity-90 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3f3531]/80 via-transparent to-black/30" />

          <div
            style={{ transform: 'translateZ(50px)' }}
            className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 shadow-lg"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#3f3531]">3D Interactive Spatial View</span>
          </div>

          <div
            style={{ transform: 'translateZ(65px)' }}
            className="absolute top-4 right-4 bg-[#5c4f4a] text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c9996b]" />
            <span>Gulshan 2 Penthouse</span>
          </div>

          <div
            style={{ transform: 'translateZ(80px)' }}
            className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#c9996b] uppercase tracking-wider">
                  Verified Executive Rental
                </span>
                <h4 className="text-base font-bold font-['Outfit'] text-[#3f3531] mt-0.5">
                  Lakeside Panoramic Duplex
                </h4>
                <p className="text-xs text-[#5c4f4a]/75 flex items-center gap-1 mt-1">
                  <span>Road 54, Gulshan-2</span>
                  <span>•</span>
                  <span>4 Beds</span>
                  <span>•</span>
                  <span>3,850 sq ft</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-black font-['Outfit'] text-[#3f3531]">
                  {formatBDT(185000)}
                </div>
                <span className="text-[10px] text-[#5c4f4a]/75 font-semibold">/ month</span>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5c766d]">
                <ShieldCheck className="w-4 h-4" />
                <span>Smart Home + Standby Generator</span>
              </div>
              <button
                onClick={() => navigate({ name: 'property', id: 'prop-1' })}
                className="px-3.5 py-1.5 rounded-xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold flex items-center gap-1 shadow-md transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Tour Home</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ transform: 'translateZ(100px)' }}
        className="hidden sm:flex absolute -bottom-6 -left-6 bg-[#5c766d] text-white p-3 rounded-2xl shadow-xl items-center gap-2.5 border border-white/20"
      >
        <Layers className="w-4 h-4 text-[#ede9e6]" />
        <div>
          <div className="text-[10px] uppercase font-bold text-[#ede9e6]/80">Spatial Depth</div>
          <div className="text-xs font-extrabold font-['Outfit']">Floor-to-Ceiling Light</div>
        </div>
      </motion.div>
    </div>
  );
};
