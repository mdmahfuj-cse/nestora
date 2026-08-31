import React from 'react';
import { TourHotspot } from '../../types';
import {
  X,
  CheckCircle2,
  Zap,
  Flame,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';

interface HotspotDetailsModalProps {
  hotspot: TourHotspot | null;
  onClose: () => void;
  onNavigateToRoom?: (roomId: string) => void;
}

export const HotspotDetailsModal: React.FC<HotspotDetailsModalProps> = ({
  hotspot,
  onClose,
  onNavigateToRoom,
}) => {
  if (!hotspot) return null;

  const isUtility = hotspot.type === 'utility';
  const isFeature = hotspot.type === 'feature';
  const isNav = hotspot.type === 'navigation';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#3f3531] text-[#ede9e6] border border-white/15 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header Ribbon */}
        <div className="relative p-6 pb-4 bg-linear-to-b from-black/40 to-transparent border-b border-white/10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border ${
                isUtility
                  ? 'bg-[#5c766d] border-[#5c766d]/40 text-white'
                  : isFeature
                  ? 'bg-[#c9996b] border-[#c9996b]/40 text-white'
                  : 'bg-stone-700 border-white/20 text-white'
              }`}
            >
              {isUtility ? (
                <Zap className="w-5 h-5" />
              ) : isFeature ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#c9996b]">
                  {hotspot.tag || (isUtility ? 'Utility Inspection' : 'Architectural Highlight')}
                </span>
                {hotspot.details?.verified && (
                  <span className="flex items-center gap-1 text-[9px] bg-[#5c766d]/40 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    Nestora Verified
                  </span>
                )}
              </div>
              <h3 className="font-['Outfit'] text-lg font-bold text-white mt-0.5">
                {hotspot.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {hotspot.description && (
            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              {hotspot.description}
            </p>
          )}

          {hotspot.details && (
            <div className="bg-black/30 rounded-2xl p-4 border border-white/10 space-y-2.5">
              {hotspot.details.brand && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-medium">Manufacturer / System:</span>
                  <span className="font-bold text-white text-right">{hotspot.details.brand}</span>
                </div>
              )}
              {hotspot.details.spec && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-medium">Technical Specification:</span>
                  <span className="font-bold text-[#c9996b] text-right">{hotspot.details.spec}</span>
                </div>
              )}
            </div>
          )}

          {/* Dhaka Verification Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#5c766d]/20 border border-[#5c766d]/40 text-xs text-stone-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Inspected on-site during Nestora Field Auditing. Tested under active load and Dhaka monsoon conditions.
            </span>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {isNav && hotspot.targetRoomId && (
              <button
                onClick={() => {
                  if (onNavigateToRoom && hotspot.targetRoomId) {
                    onNavigateToRoom(hotspot.targetRoomId);
                    onClose();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#c9996b] hover:bg-[#b58557] text-white font-bold text-sm shadow-lg transition-all"
              >
                <span>Teleport to Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {!isNav && (
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors text-center"
              >
                Close Inspection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
