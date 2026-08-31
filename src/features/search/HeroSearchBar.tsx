import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, Users, SlidersHorizontal, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { useSearchStore } from '../../stores/useSearchStore';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { PropertyType } from '../../types';

export const HeroSearchBar: React.FC = () => {
  const { filters, setLocation, setPropertyType, setBedrooms, setPriceRange } = useSearchStore();
  const { navigate } = useNavigationStore();
  const { t } = useLanguageStore();

  const [locationInput, setLocationInput] = useState(filters.location || '');
  const [moveInDate, setMoveInDate] = useState('2026-09-01');
  const [guests, setGuests] = useState(2);
  const [selectedType, setSelectedType] = useState<PropertyType | 'All'>('All');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const popularLocations = ['Gulshan-2', 'Banani', 'Dhanmondi', 'Bashundhara R/A', 'Uttara', 'Baridhara', 'Mohakhali DOHS'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(locationInput);
    setPropertyType(selectedType);
    navigate({
      name: 'search',
      params: {
        location: locationInput,
        type: selectedType,
        guests: String(guests),
        moveIn: moveInDate,
      },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        role="search"
        aria-label="Search Dhaka rental properties"
        onSubmit={handleSearchSubmit}
        className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border-2 border-[#5c4f4a]/20 shadow-2xl shadow-[#5c4f4a]/15 transition-all"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {/* 1. Location Input */}
          <div className="relative">
            <div
              onClick={() => setShowLocationDropdown(true)}
              className="p-3 rounded-2xl hover:bg-stone-50 border border-[#5c4f4a]/15 cursor-pointer transition-colors"
            >
              <label htmlFor="hero-location-input" className="text-[10px] font-extrabold uppercase tracking-wider text-[#c9996b] flex items-center gap-1">
                <MapPin className="w-3 h-3" aria-hidden="true" />
                {t('hero_search_where')}
              </label>
              <input
                id="hero-location-input"
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
                aria-label={t('hero_search_where')}
                aria-autocomplete="list"
                aria-expanded={showLocationDropdown}
                placeholder={t('hero_search_where_placeholder')}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#3f3531] placeholder:text-[#5c4f4a]/40 focus:outline-none mt-0.5 truncate"
              />
            </div>

            {/* Location Dropdown */}
            {showLocationDropdown && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowLocationDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="listbox"
                  aria-label={t('hero_search_hotspots')}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl p-3 border border-[#5c4f4a]/15 shadow-xl z-30 space-y-1.5"
                >
                  <div className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase px-2">
                    {t('hero_search_hotspots')}
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                    {popularLocations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setLocationInput(loc);
                          setShowLocationDropdown(false);
                        }}
                        aria-label={`Select area: ${loc}`}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-[#c9996b] hover:text-white text-[#3f3531] transition-colors text-left"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* 2. Move-in Date */}
          <div className="p-3 rounded-2xl hover:bg-stone-50 border border-[#5c4f4a]/15 transition-colors">
            <label htmlFor="hero-movein-date" className="text-[10px] font-extrabold uppercase tracking-wider text-[#c9996b] flex items-center gap-1">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              {t('hero_search_movein')}
            </label>
            <input
              id="hero-movein-date"
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              aria-label={t('hero_search_movein')}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#3f3531] focus:outline-none mt-0.5"
            />
          </div>

          {/* 3. Occupants / Guests */}
          <div className="p-3 rounded-2xl hover:bg-stone-50 border border-[#5c4f4a]/15 transition-colors">
            <label htmlFor="hero-occupants-select" className="text-[10px] font-extrabold uppercase tracking-wider text-[#c9996b] flex items-center gap-1">
              <Users className="w-3 h-3" aria-hidden="true" />
              {t('hero_search_occupants')}
            </label>
            <select
              id="hero-occupants-select"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              aria-label={t('hero_search_occupants')}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#3f3531] focus:outline-none mt-0.5 cursor-pointer"
            >
              <option value={1}>{t('hero_search_1person')}</option>
              <option value={2}>{t('hero_search_2people')}</option>
              <option value={3}>{t('hero_search_small_fam')}</option>
              <option value={5}>{t('hero_search_large_fam')}</option>
            </select>
          </div>

          {/* 4. Search Submit Button */}
          <div className="flex items-center">
            <button
              id="hero-search-btn"
              type="submit"
              aria-label={t('hero_search_btn')}
              className="w-full h-full min-h-[52px] bg-[#c9996b] hover:bg-[#b07e4f] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#c9996b]/30 hover:shadow-xl transition-all"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>{t('hero_search_btn')}</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Pill Shortcuts */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div role="group" aria-label="Quick property type selection" className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-[#5c4f4a]/75 whitespace-nowrap">
              {t('hero_search_quick_type')}
            </span>
            {(['All', 'Apartment', 'Penthouse', 'Service Apartment', 'Student Accommodation', 'Serviced Room', 'Duplex', 'Villa', 'House', 'Studio', 'Room'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                aria-pressed={selectedType === type}
                aria-label={`Select property type: ${type}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-[#5c4f4a] text-white shadow-xs'
                    : 'bg-stone-100 text-[#5c4f4a] hover:bg-stone-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate({ name: 'search' })}
            aria-label={t('hero_search_open_map')}
            className="text-[11px] font-bold text-[#5c766d] hover:text-[#3f3531] flex items-center gap-1 whitespace-nowrap ml-auto"
          >
            <SlidersHorizontal className="w-3 h-3" aria-hidden="true" />
            {t('hero_search_open_map')}
          </button>
        </div>
      </form>
    </div>
  );
};
