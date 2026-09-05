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
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#c9996b] text-white flex items-center justify-center shrink-0" aria-hidden="true">
            <Scale className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none" role="group" aria-label="Properties selected for comparison">
            {comparedProperties.map((item) => (
              <div key={item.id} className="relative group shrink-0">
                <img
                  src={item.images[0]}
                  alt={`Thumbnail of ${item.title}`}
                  className="w-10 h-10 rounded-xl object-cover border border-white/20"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(item.id);
                  }}
                  aria-label={`Remove ${item.title} from comparison`}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                  title={`Remove ${item.title}`}
                >
                  <X className="w-2.5 h-2.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

 
      </motion.div>
    </AnimatePresence>
  );
};
