import { create } from 'zustand';
import { FilterState, Property, PropertyType, FurnishedStatus, Amenity } from '../types';
import { mockProperties } from '../data/mockData';

interface SearchStore {
  filters: FilterState;
  setSearch: (search: string) => void;
  setLocation: (location: string) => void;
  setPropertyType: (type: PropertyType | 'All') => void;
  setPriceRange: (min: number, max: number) => void;
  setBedrooms: (bedrooms: number | 'any') => void;
  setBathrooms: (bathrooms: number | 'any') => void;
  setFurnished: (status: FurnishedStatus | 'All') => void;
  toggleAmenity: (amenity: Amenity) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  resetFilters: () => void;
  getFilteredProperties: (allProperties: Property[]) => Property[];
}

export const initialFilters: FilterState = {
  search: '',
  location: '',
  propertyType: 'All',
  minPrice: 15000,
  maxPrice: 400000,
  bedrooms: 'any',
  bathrooms: 'any',
  furnished: 'All',
  amenities: [],
  availability: 'All',
  sortBy: 'recommended',
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  filters: initialFilters,

  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),

  setLocation: (location) =>
    set((state) => ({ filters: { ...state.filters, location } })),

  setPropertyType: (propertyType) =>
    set((state) => ({ filters: { ...state.filters, propertyType } })),

  setPriceRange: (minPrice, maxPrice) =>
    set((state) => ({ filters: { ...state.filters, minPrice, maxPrice } })),

  setBedrooms: (bedrooms) =>
    set((state) => ({ filters: { ...state.filters, bedrooms } })),

  setBathrooms: (bathrooms) =>
    set((state) => ({ filters: { ...state.filters, bathrooms } })),

  setFurnished: (furnished) =>
    set((state) => ({ filters: { ...state.filters, furnished } })),

  toggleAmenity: (amenity) =>
    set((state) => {
      const exists = state.filters.amenities.includes(amenity);
      const amenities = exists
        ? state.filters.amenities.filter((a) => a !== amenity)
        : [...state.filters.amenities, amenity];
      return { filters: { ...state.filters, amenities } };
    }),

  setSortBy: (sortBy) =>
    set((state) => ({ filters: { ...state.filters, sortBy } })),

  resetFilters: () => set({ filters: initialFilters }),

  getFilteredProperties: (allProperties: Property[]) => {
    const { filters } = get();

    return allProperties.filter((prop) => {
      if (prop.published === false) return false;

      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesQuery =
          prop.title.toLowerCase().includes(q) ||
          prop.description.toLowerCase().includes(q) ||
          prop.area.toLowerCase().includes(q) ||
          prop.location.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (filters.location.trim()) {
        const loc = filters.location.toLowerCase();
        const matchesLoc =
          prop.area.toLowerCase().includes(loc) ||
          prop.location.toLowerCase().includes(loc) ||
          prop.city.toLowerCase().includes(loc);
        if (!matchesLoc) return false;
      }

      if (filters.propertyType !== 'All' && prop.propertyType !== filters.propertyType) {
        return false;
      }

      if (prop.price < filters.minPrice || prop.price > filters.maxPrice) {
        return false;
      }

      if (filters.bedrooms !== 'any' && prop.bedrooms < Number(filters.bedrooms)) {
        return false;
      }

      if (filters.bathrooms !== 'any' && prop.bathrooms < Number(filters.bathrooms)) {
        return false;
      }

      if (filters.furnished !== 'All' && prop.furnished !== filters.furnished) {
        return false;
      }

      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every((amenity) =>
          prop.amenities.includes(amenity)
        );
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating;
    });
  },
}));
