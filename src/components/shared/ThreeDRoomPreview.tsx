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
