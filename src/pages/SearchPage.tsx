import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Map as MapIcon,
  List,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Home,
  Check
} from 'lucide-react';
import { useSearchStore } from '../stores/useSearchStore';
import { useHostStore } from '../stores/useHostStore';
import { useMapStore } from '../stores/useMapStore';
import { PropertyCard } from '../components/shared/PropertyCard';
import { InteractiveLeafletMap } from '../features/search/InteractiveLeafletMap';
import { FilterDrawer } from '../features/search/FilterDrawer';
import { PropertyType } from '../types';

const QUICK_DHAKA_AREAS = [
  'All Dhaka',
  'Gulshan',
  'Banani',
  'Dhanmondi',
  'Bashundhara',
  'Uttara',
  'Baridhara',
  'Banani DOHS',
  'Mirpur',
  'Lalmatia',
  'Aftabnagar',
  'Nikunja',
  'Mohakhali DOHS',
];

const PROPERTY_TYPE_CHIPS: (PropertyType | 'All')[] = [
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

export const SearchPage: React.FC = () => {
  const { properties } = useHostStore();
  const { filters, setSearch, setLocation, setPropertyType, setSortBy, resetFilters, getFilteredProperties } =
    useSearchStore();
  const { hoveredPropertyId, selectedPropertyId, setHoveredPropertyId, setMapCenter } = useMapStore();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<'split' | 'list' | 'map'>('split');

  const filteredProperties = getFilteredProperties(properties);

  const activeFiltersCount =
    (filters.propertyType !== 'All' ? 1 : 0) +
    (filters.bedrooms !== 'any' ? 1 : 0) +
    (filters.bathrooms !== 'any' ? 1 : 0) +
    (filters.furnished !== 'All' ? 1 : 0) +
    (filters.minPrice > 15000 || filters.maxPrice < 400000 ? 1 : 0) +
    filters.amenities.length;

  const handleAreaChipClick = (area: string) => {
    if (area === 'All Dhaka') {
      setLocation('');
    } else {
      setLocation(area);
      // center map loosely towards Dhaka
      const matched = properties.find((p) => p.area.toLowerCase().includes(area.toLowerCase()));
      if (matched) {
        setMapCenter([matched.lat, matched.lng], 13);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col bg-[#ede9e6]">
      {/* Top Filter Bar & Search Sticky Header */}
      <div className="bg-[#ede9e6] border-b border-[#5c4f4a]/15 sticky top-20 z-30 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
          {/* Search Inputs + Sort + Filter Trigger */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Location & Keyword Search Input */}
            <div className="flex-1 w-full flex items-center bg-white rounded-full border border-[#5c4f4a]/20 px-4 py-2 shadow-xs focus-within:ring-2 focus-within:ring-[#c9996b] focus-within:border-transparent transition-all">
              <Search className="w-4 h-4 text-[#5c4f4a]/60 mr-2 shrink-0" aria-hidden="true" />
              <label htmlFor="search-input-field" className="sr-only">
                Search Dhaka rentals by area or keyword
              </label>
              <input
                id="search-input-field"
                type="text"
                role="searchbox"
                aria-label="Search Dhaka rentals by area or keyword"
                placeholder="Search Dhaka rentals by area (e.g. Gulshan, Road 11) or keyword..."
                value={filters.search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs sm:text-sm bg-transparent text-[#3f3531] focus:outline-none placeholder:text-[#5c4f4a]/50"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search input"
                  className="text-xs text-[#5c4f4a]/50 hover:text-[#5c4f4a] ml-2"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Actions (Filter Drawer, Sort By, Mobile View Toggle) */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Filter Drawer Button */}
              <button
                id="search-filter-drawer-btn"
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={filterDrawerOpen}
                aria-label={`Open property filters${activeFiltersCount > 0 ? `, ${activeFiltersCount} filters currently active` : ''}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border shadow-xs ${
                  activeFiltersCount > 0
                    ? 'bg-[#5c4f4a] text-white border-[#5c4f4a]'
                    : 'bg-white text-[#5c4f4a] border-[#5c4f4a]/20 hover:border-[#c9996b]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-[#c9996b]" aria-hidden="true" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#c9996b] text-white text-[10px] flex items-center justify-center font-bold" aria-hidden="true">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative inline-block">
                <label htmlFor="search-sort-select" className="sr-only">
                  Sort rental properties by
                </label>
                <select
                  id="search-sort-select"
                  aria-label="Sort rental properties by"
                  value={filters.sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white text-[#5c4f4a] text-xs font-semibold px-3.5 py-2.5 pr-8 rounded-full border border-[#5c4f4a]/20 hover:border-[#c9996b] focus:outline-none focus:ring-1 focus:ring-[#c9996b] shadow-xs cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest First</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#5c4f4a]/60 absolute right-2.5 top-3 pointer-events-none" aria-hidden="true" />
              </div>

              {/* Mobile View Toggle */}
              <div
                role="group"
                aria-label="Mobile view switcher"
                className="lg:hidden flex items-center bg-white p-1 rounded-full border border-[#5c4f4a]/20"
              >
                <button
                  type="button"
                  onClick={() => setMobileViewMode('list')}
                  aria-label="Switch to property list view"
                  aria-pressed={mobileViewMode === 'list'}
                  className={`p-1.5 rounded-full text-xs transition-colors ${
                    mobileViewMode === 'list'
                      ? 'bg-[#5c4f4a] text-white'
                      : 'text-[#5c4f4a] hover:bg-stone-100'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setMobileViewMode('map')}
                  aria-label="Switch to interactive map view"
                  aria-pressed={mobileViewMode === 'map'}
                  className={`p-1.5 rounded-full text-xs transition-colors ${
                    mobileViewMode === 'map'
                      ? 'bg-[#5c4f4a] text-white'
                      : 'text-[#5c4f4a] hover:bg-stone-100'
                  }`}
                  title="Map View"
                >
                  <MapIcon className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Dhaka Neighborhood & Type Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-[#5c4f4a]/20">
              <MapPin className="w-3.5 h-3.5 text-[#c9996b]" aria-hidden="true" />
              <span id="quick-area-label" className="text-[11px] font-bold text-[#5c4f4a]/75 uppercase">Area:</span>
            </div>

            <div role="group" aria-labelledby="quick-area-label" className="flex items-center gap-2 shrink-0">
              {QUICK_DHAKA_AREAS.map((area) => {
                const isActive =
                  (area === 'All Dhaka' && !filters.location) ||
                  filters.location.toLowerCase() === area.toLowerCase();

                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleAreaChipClick(area)}
                    aria-label={`Filter by area: ${area}`}
                    aria-pressed={isActive}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#5c4f4a] text-white shadow-xs'
                        : 'bg-white/80 hover:bg-white text-[#5c4f4a] border border-[#5c4f4a]/15 hover:border-[#c9996b]'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-[#5c4f4a]/20 shrink-0 mx-1" aria-hidden="true" />

            {/* Property Types */}
            <div role="group" aria-label="Quick property type filters" className="flex items-center gap-2 shrink-0">
              {PROPERTY_TYPE_CHIPS.map((type) => {
                const isSelected = filters.propertyType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPropertyType(type)}
                    aria-label={`Filter by property type: ${type}`}
                    aria-pressed={isSelected}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#c9996b] text-white shadow-xs'
                        : 'bg-white/80 hover:bg-white text-[#5c4f4a] border border-[#5c4f4a]/15'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[700px]">
          {/* Left / Top Listings Panel */}
          <div
            role="region"
            aria-label="Rental property search results"
            className={`space-y-4 lg:col-span-6 xl:col-span-7 flex flex-col ${
              mobileViewMode === 'map' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Results Header Status */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-black font-['Outfit'] text-[#3f3531]">
                  {filters.location ? `${filters.location} Rentals` : 'Dhaka Verified Rentals'}
                </h1>
                <p className="text-xs text-[#5c4f4a]/80 mt-0.5" aria-live="polite">
                  Over <span className="font-bold text-[#3f3531]">{filteredProperties.length}</span> luxury duplexes, apartments & homes found
                </p>
              </div>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  aria-label="Reset all search filters"
                  className="flex items-center gap-1 text-xs font-bold text-[#c9996b] hover:text-[#5c4f4a] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  Reset ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Property Card Grid */}
            {filteredProperties.length > 0 ? (
              <div
                role="feed"
                aria-label="Property results list"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 overflow-y-auto pr-1"
              >
                {filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    isHovered={hoveredPropertyId === prop.id}
                    isSelected={selectedPropertyId === prop.id}
                    onHover={(id) => setHoveredPropertyId(id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#5c4f4a]/15 shadow-sm space-y-4 my-auto">
                <div className="w-14 h-14 rounded-2xl bg-[#c9996b]/20 flex items-center justify-center mx-auto text-[#5c4f4a]">
                  <Home className="w-7 h-7 text-[#c9996b]" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                  No properties matched your filters
                </h3>
                <p className="text-xs text-[#5c4f4a]/75 max-w-sm mx-auto">
                  Try widening your price range, clearing specific amenities (like standby generator), or browsing all areas of Dhaka.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  aria-label="Reset all filters and view all Dhaka properties"
                  className="px-5 py-2.5 rounded-full bg-[#5c4f4a] text-white text-xs font-bold hover:bg-[#3f3531] transition-all shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Right Interactive Leaflet Map Panel */}
          <div
            className={`lg:col-span-6 xl:col-span-5 h-[500px] lg:h-[calc(100vh-180px)] sticky top-44 ${
              mobileViewMode === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            <InteractiveLeafletMap
              properties={filteredProperties}
              className="h-full"
            />
          </div>
        </div>
      </div>

      {/* Slide-in Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        allProperties={properties}
        resultsCount={filteredProperties.length}
      />
    </div>
  );
};
