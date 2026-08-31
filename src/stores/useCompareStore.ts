import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  compareIds: string[];
  addToCompare: (id: string) => boolean;
  removeFromCompare: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      compareIds: [],
      addToCompare: (id: string) => {
        const { compareIds } = get();
        if (compareIds.includes(id)) return false;
        if (compareIds.length >= 4) {
          return false;
        }
        set({ compareIds: [...compareIds, id] });
        return true;
      },
      removeFromCompare: (id: string) => {
        set((state) => ({
          compareIds: state.compareIds.filter((item) => item !== id),
        }));
      },
      toggleCompare: (id: string) => {
        const { compareIds } = get();
        if (compareIds.includes(id)) {
          set({ compareIds: compareIds.filter((item) => item !== id) });
        } else {
          if (compareIds.length >= 4) {
            set({ compareIds: [...compareIds.slice(1), id] });
          } else {
            set({ compareIds: [...compareIds, id] });
          }
        }
      },
      clearCompare: () => set({ compareIds: [] }),
      isInCompare: (id: string) => get().compareIds.includes(id),
    }),
    {
      name: 'nestora-compare-storage',
    }
  )
);
