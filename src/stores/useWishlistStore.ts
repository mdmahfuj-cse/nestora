import { create } from 'zustand';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (propertyId: string) => void;
  isWishlisted: (propertyId: string) => boolean;
  clearWishlist: () => void;
}

const STORAGE_KEY = 'nestora_wishlist_ids';

const loadSavedWishlist = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse saved wishlist', e);
  }
  return ['prop-1', 'prop-3'];
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: loadSavedWishlist(),

  toggleWishlist: (propertyId: string) => {
    set((state) => {
      const exists = state.wishlistIds.includes(propertyId);
      const newIds = exists
        ? state.wishlistIds.filter((id) => id !== propertyId)
        : [...state.wishlistIds, propertyId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      } catch (e) {
        console.error('LocalStorage write error', e);
      }
      return { wishlistIds: newIds };
    });
  },

  isWishlisted: (propertyId: string) => {
    return get().wishlistIds.includes(propertyId);
  },

  clearWishlist: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    set({ wishlistIds: [] });
  },
}));
