import { create } from 'zustand';
import { Property } from '../types';
import { mockProperties } from '../data/mockData';

interface HostState {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'reviews'>) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  togglePublish: (id: string) => void;
  getPropertyById: (id: string) => Property | undefined;
}

const STORAGE_KEY = 'nestora_host_properties';

const loadProperties = (): Property[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const mockMap = new Map(mockProperties.map((p) => [p.id, p]));
        const userCreated = parsed.filter((p: Property) => !mockMap.has(p.id));
        const updatedMockList = mockProperties.map((mp) => {
          const userSaved = parsed.find((p: Property) => p.id === mp.id);
          return userSaved ? { ...mp, published: userSaved.published, propertyType: mp.propertyType } : mp;
        });
        const merged = [...updatedMockList, ...userCreated];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch (e) {}
        return merged;
      }
    }
  } catch (e) {}
  return mockProperties;
};

export const useHostStore = create<HostState>((set, get) => ({
  properties: loadProperties(),

  addProperty: (data) => {
    const newProperty: Property = {
      ...data,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
      published: true,
    };

    set((state) => {
      const updated = [newProperty, ...state.properties];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return { properties: updated };
    });

    return newProperty;
  },

  updateProperty: (id, updates) => {
    set((state) => {
      const updated = state.properties.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return { properties: updated };
    });
  },

  deleteProperty: (id) => {
    set((state) => {
      const updated = state.properties.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return { properties: updated };
    });
  },

  togglePublish: (id) => {
    set((state) => {
      const updated = state.properties.map((p) =>
        p.id === id ? { ...p, published: !p.published } : p
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return { properties: updated };
    });
  },

  getPropertyById: (id) => {
    return get().properties.find((p) => p.id === id);
  },
}));
