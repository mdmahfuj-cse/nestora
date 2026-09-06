import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompareStore } from '../../stores/useCompareStore';
import { useHostStore } from '../../stores/useHostStore';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { formatBDTShort } from '../../lib/utils';

export const FloatingCompareDock: React.FC = () => {
  const { compareIds, removeFromCompare, clearCompare } = useCompareStore();
  const { properties } = useHostStore();
  const { currentRoute, navigate } = useNavigationStore();

  if (compareIds.length === 0 || currentRoute.name === 'compare') {
    return null;
  }

  const comparedProperties = properties.filter((p) => compareIds.includes(p.id));

  return (
    <AnimatePresence>
      <motion.div
        role="region"
        aria-label="Rental comparison dock"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed bottom-6 right-6 z-40 bg-[#3f3531] text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-[#c9996b]/30 backdrop-blur-md max-w-lg flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
      >


        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => navigate({ name: 'compare' })}
            aria-label={`Compare ${compareIds.length} out of maximum 4 properties side-by-side`}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Compare ({compareIds.length}/4)</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={clearCompare}
            aria-label="Clear all compared properties"
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
