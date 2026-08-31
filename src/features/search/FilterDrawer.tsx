import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RotateCcw, Check, SlidersHorizontal } from 'lucide-react';
import { useSearchStore } from '../../stores/useSearchStore';
import { PropertyType, FurnishedStatus, Amenity, Property } from '../../types';
import { PriceHistogramSlider } from './PriceHistogramSlider';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allProperties: Property[];
  resultsCount: number;
}

const PROPERTY_TYPES: (PropertyType | 'All')[] = [
  'All',
  'Apartment',
  'Penthouse',
  'Service Apartment',
  'Serviced Room',
  'Student Accommodation',
  'Duplex',
  'Villa',
  'House',
  'Studio',
  'Room',
];

const FURNISHED_OPTIONS: (FurnishedStatus | 'All')[] = [
  'All',
  'Furnished',
  'Semi-Furnished',
  'Unfurnished',
];

const AMENITY_OPTIONS: { name: Amenity; label: string; highlight?: boolean }[] = [
  { name: 'Generator', label: '100% Generator Standby', highlight: true },
  { name: 'Gas Pipeline', label: 'Titas Gas Pipeline', highlight: true },
  { name: 'Lift', label: 'Modern High-Speed Lift' },
  { name: 'AC', label: 'Air Conditioning installed' },
  { name: 'Parking', label: 'Covered Car Parking' },
  { name: 'Security', label: '24/7 Gate Guard Security' },
  { name: 'Balcony', label: 'South-facing Veranda / Balcony' },
  { name: 'WiFi', label: 'High-speed Optical Fiber' },
  { name: 'Gym', label: 'Building Fitness Center / Gym' },
  { name: 'Swimming Pool', label: 'Rooftop / Compound Pool' },
  { name: 'CCTV', label: '24/7 CCTV Surveillance' },
  { name: 'Washing machine', label: 'In-unit Laundry / Washer' },
];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  allProperties,
  resultsCount,
}) => {
  const {
    filters,
    setPropertyType,
    setPriceRange,
    setBedrooms,
    setBathrooms,
    setFurnished,
    toggleAmenity,
    resetFilters,
  } = useSearchStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#3f3531]/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-drawer-heading"
              className="w-screen max-w-md bg-[#ede9e6] shadow-2xl flex flex-col border-l border-[#5c4f4a]/20"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#5c4f4a]/15 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#c9996b]" aria-hidden="true" />
                  <h2 id="filter-drawer-heading" className="font-['Outfit'] text-lg font-bold text-[#3f3531]">
                    Dhaka Property Filters
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close filters drawer"
                  className="p-2 rounded-full hover:bg-stone-200 text-[#5c4f4a] transition-colors"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Scrollable Filters Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 divide-y divide-[#5c4f4a]/15">
                {/* 1. Price Histogram & Range */}
                <div className="space-y-4">
                  <PriceHistogramSlider
                    min={15000}
                    max={400000}
                    currentMin={filters.minPrice}
                    currentMax={filters.maxPrice}
                    onChange={(min, max) => setPriceRange(min, max)}
                    properties={allProperties}
                  />
                </div>

                {/* 2. Property Type */}
                <div className="pt-6 space-y-3">
                  <label id="filter-property-type-label" className="text-xs font-bold text-[#3f3531] uppercase tracking-wider block">
                    Property Type
                  </label>
                  <div
                    role="group"
                    aria-labelledby="filter-property-type-label"
                    className="grid grid-cols-3 gap-2"
                  >
                    {PROPERTY_TYPES.map((type) => {
                      const isSelected = filters.propertyType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPropertyType(type)}
                          aria-pressed={isSelected}
                          aria-label={`Filter by ${type}`}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-[#5c4f4a] text-white shadow-xs'
                              : 'bg-white text-[#5c4f4a] border border-[#5c4f4a]/20 hover:border-[#c9996b]'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Bedrooms & Bathrooms */}
                <div className="pt-6 space-y-4">
                  <div>
                    <label id="filter-bedrooms-label" className="text-xs font-bold text-[#3f3531] uppercase tracking-wider block mb-2">
                      Bedrooms
                    </label>
                    <div
                      role="group"
                      aria-labelledby="filter-bedrooms-label"
                      className="flex items-center gap-2"
                    >
                      {(['any', 1, 2, 3, 4, 5] as const).map((bed) => {
                        const isSelected = filters.bedrooms === bed;
                        return (
                          <button
                            key={bed}
                            type="button"
                            onClick={() => setBedrooms(bed)}
                            aria-pressed={isSelected}
                            aria-label={bed === 'any' ? 'Any number of bedrooms' : `${bed} or more bedrooms`}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[#c9996b] text-white shadow-xs'
                                : 'bg-white text-[#5c4f4a] border border-[#5c4f4a]/20 hover:bg-[#c9996b]/10'
                            }`}
                          >
                            {bed === 'any' ? 'Any' : `${bed}+`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label id="filter-bathrooms-label" className="text-xs font-bold text-[#3f3531] uppercase tracking-wider block mb-2">
                      Bathrooms
                    </label>
                    <div
                      role="group"
                      aria-labelledby="filter-bathrooms-label"
                      className="flex items-center gap-2"
                    >
                      {(['any', 1, 2, 3, 4] as const).map((bath) => {
                        const isSelected = filters.bathrooms === bath;
                        return (
                          <button
                            key={bath}
                            type="button"
                            onClick={() => setBathrooms(bath)}
                            aria-pressed={isSelected}
                            aria-label={bath === 'any' ? 'Any number of bathrooms' : `${bath} or more bathrooms`}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[#5c766d] text-white shadow-xs'
                                : 'bg-white text-[#5c4f4a] border border-[#5c4f4a]/20 hover:bg-[#5c766d]/10'
                            }`}
                          >
                            {bath === 'any' ? 'Any' : `${bath}+`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Furnishing Condition */}
                <div className="pt-6 space-y-3">
                  <label id="filter-furnishing-label" className="text-xs font-bold text-[#3f3531] uppercase tracking-wider block">
                    Furnishing Status
                  </label>
                  <div
                    role="group"
                    aria-labelledby="filter-furnishing-label"
                    className="grid grid-cols-2 gap-2"
                  >
                    {FURNISHED_OPTIONS.map((status) => {
                      const isSelected = filters.furnished === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setFurnished(status)}
                          aria-pressed={isSelected}
                          aria-label={`Furnishing status: ${status}`}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                            isSelected
                              ? 'bg-[#5c4f4a] text-white shadow-xs'
                              : 'bg-white text-[#5c4f4a] border border-[#5c4f4a]/20 hover:border-[#c9996b]'
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Essential Dhaka Amenities */}
                <div className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <label id="filter-amenities-label" className="text-xs font-bold text-[#3f3531] uppercase tracking-wider">
                      Essential Amenities
                    </label>
                    <span className="text-[11px] text-[#c9996b] font-bold" aria-live="polite">
                      {filters.amenities.length} Selected
                    </span>
                  </div>

                  <div
                    role="group"
                    aria-labelledby="filter-amenities-label"
                    className="space-y-2"
                  >
                    {AMENITY_OPTIONS.map((item) => {
                      const isChecked = filters.amenities.includes(item.name);
                      return (
                        <label
                          key={item.name}
                          htmlFor={`filter-amenity-${item.name}`}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition-all ${
                            isChecked
                              ? 'bg-[#c9996b]/15 border-[#c9996b] text-[#3f3531]'
                              : 'bg-white border-[#5c4f4a]/15 text-[#5c4f4a] hover:border-[#c9996b]/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            id={`filter-amenity-${item.name}`}
                            name="amenities"
                            value={item.name}
                            checked={isChecked}
                            onChange={() => toggleAmenity(item.name)}
                            aria-label={`Filter by ${item.label}${item.highlight ? ' (Key amenity)' : ''}`}
                            className="sr-only"
                          />
                          <span className="text-xs font-semibold flex items-center gap-2">
                            {item.label}
                            {item.highlight && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#c9996b] text-white">
                                Key
                              </span>
                            )}
                          </span>
                          <div
                            aria-hidden="true"
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-[#c9996b] text-white'
                                : 'border border-[#5c4f4a]/30'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-6 border-t border-[#5c4f4a]/15 bg-white/80 flex items-center gap-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  aria-label="Clear all applied filters"
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold text-[#5c4f4a] hover:bg-stone-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={`Show ${resultsCount} ${resultsCount === 1 ? 'matching home' : 'matching homes'}`}
                  className="flex-1 py-3 rounded-xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold shadow-md transition-all text-center"
                >
                  Show {resultsCount} {resultsCount === 1 ? 'Home' : 'Homes'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
