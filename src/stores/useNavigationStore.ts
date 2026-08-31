import { create } from 'zustand';
import { PageRoute } from '../types';

interface NavigationState {
  currentRoute: PageRoute;
  history: PageRoute[];
  navigate: (route: PageRoute) => void;
  goBack: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentRoute: { name: 'home' },
  history: [],
  navigate: (route) =>
    set((state) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return {
        currentRoute: route,
        history: [...state.history, state.currentRoute],
      };
    }),
  goBack: () =>
    set((state) => {
      if (state.history.length === 0) {
        return { currentRoute: { name: 'home' } };
      }
      const prev = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return {
        currentRoute: prev,
        history: newHistory,
      };
    }),
}));
