import { create } from 'zustand';

interface MapState {
  hoveredPropertyId: string | null;
  selectedPropertyId: string | null;
  mapCenter: [number, number];
  mapZoom: number;
  setHoveredPropertyId: (id: string | null) => void;
  setSelectedPropertyId: (id: string | null) => void;
  setMapCenter: (center: [number, number], zoom?: number) => void;
  centerOnDhaka: () => void;
}

const DHAKA_CENTER: [number, number] = [23.7925, 90.4078];
const DEFAULT_ZOOM = 12;

export const useMapStore = create<MapState>((set) => ({
  hoveredPropertyId: null,
  selectedPropertyId: null,
  mapCenter: DHAKA_CENTER,
  mapZoom: DEFAULT_ZOOM,

  setHoveredPropertyId: (id) => set({ hoveredPropertyId: id }),

  setSelectedPropertyId: (id) =>
    set({ selectedPropertyId: id }),

  setMapCenter: (center, zoom) =>
    set((state) => ({
      mapCenter: center,
      mapZoom: zoom ?? state.mapZoom,
    })),

  centerOnDhaka: () =>
    set({
      mapCenter: DHAKA_CENTER,
      mapZoom: DEFAULT_ZOOM,
      selectedPropertyId: null,
    }),
}));
