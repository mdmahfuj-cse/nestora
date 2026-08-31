import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Heart,
  Home,
  Building,
  Menu,
  X,
  MapPin,
  Sparkles,
  Scale,
  Compass,
  FileText
} from 'lucide-react';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useCompareStore } from '../../stores/useCompareStore';
import { useSearchStore } from '../../stores/useSearchStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { currentRoute, navigate } = useNavigationStore();
  const { wishlistIds } = useWishlistStore();
  const { compareIds } = useCompareStore();
  const { filters, setLocation } = useSearchStore();
  const { t, formatNumber } = useLanguageStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [locationInput, setLocationInput] = useState(filters.location);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(locationInput);
    navigate({ name: 'search', params: { location: locationInput } });
    setQuickSearchOpen(false);
  };

  const isSearchPage = currentRoute.name === 'search';

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#ede9e6]/90 backdrop-blur-md border-b border-[#5c4f4a]/10 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <div className="flex items-center gap-6 xl:gap-8">
              <button
                id="brand-logo-btn"
                onClick={() => navigate({ name: 'home' })}
                className="flex items-center gap-3 text-left group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5c4f4a] flex items-center justify-center shadow-md shadow-[#5c4f4a]/20 group-hover:bg-[#c9996b] transition-colors duration-300">
                  <Building className="w-5 h-5 text-[#ede9e6]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-['Outfit'] text-2xl font-black tracking-tight text-[#3f3531]">
                      NESTORA
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#c9996b]/20 text-[#5c4f4a] border border-[#c9996b]/30">
                      BD
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5c4f4a]/75 font-medium -mt-0.5 tracking-tight">
                    {t('nav_brand_sub')}
                  </p>
                </div>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1 bg-[#ede9e6] p-1 rounded-full border border-[#5c4f4a]/15 shadow-inner">
                <button
                  id="nav-explore-btn"
                  onClick={() => navigate({ name: 'home' })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    currentRoute.name === 'home'
                      ? 'bg-[#5c4f4a] text-white shadow-sm'
                      : 'text-[#5c4f4a] hover:text-[#3f3531] hover:bg-[#c9996b]/15'
                  }`}
                >
                  {t('nav_discover')}
                </button>
                <button
                  id="nav-search-btn"
                  onClick={() => navigate({ name: 'search' })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1 transition-all ${
                    currentRoute.name === 'search'
                      ? 'bg-[#5c4f4a] text-white shadow-sm'
                      : 'text-[#5c4f4a] hover:text-[#3f3531] hover:bg-[#c9996b]/15'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  {t('nav_map_rentals')}
                </button>
                <button
                  id="nav-neighborhoods-btn"
                  onClick={() => navigate({ name: 'neighborhoods' })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1 transition-all ${
                    currentRoute.name === 'neighborhoods'
                      ? 'bg-[#5c4f4a] text-white shadow-sm'
                      : 'text-[#5c4f4a] hover:text-[#3f3531] hover:bg-[#c9996b]/15'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  {t('nav_area_guides')}
                </button>
                <button
                  id="nav-compare-btn"
                  onClick={() => navigate({ name: 'compare' })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all relative ${
                    currentRoute.name === 'compare'
                      ? 'bg-[#5c4f4a] text-white shadow-sm'
                      : 'text-[#5c4f4a] hover:text-[#3f3531] hover:bg-[#c9996b]/15'
                  }`}
                >
                  <Scale className="w-3 h-3" />
                  {t('nav_compare')}
                  {compareIds.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#c9996b] text-white text-[9px] font-bold flex items-center justify-center">
                      {formatNumber(compareIds.length)}
                    </span>
                  )}
                </button>
                <button
                  id="nav-agreement-btn"
                  onClick={() => navigate({ name: 'agreement' })}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1 transition-all ${
                    currentRoute.name === 'agreement'
                      ? 'bg-[#5c4f4a] text-white shadow-sm'
                      : 'text-[#5c4f4a] hover:text-[#3f3531] hover:bg-[#c9996b]/15'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  {t('nav_lease_draft')}
                </button>
              </nav>
            </div>

            {/* Middle Floating Search Pill (Hidden on Search page to save room) */}
            {!isSearchPage && (
              <div className="hidden xl:flex items-center">
                <button
                  id="navbar-search-pill"
                  onClick={() => setQuickSearchOpen(true)}
                  className="flex items-center gap-3 bg-white/95 px-4 py-2 rounded-full border border-[#5c4f4a]/15 shadow-sm hover:shadow-md hover:border-[#c9996b] transition-all group"
                >
                  <span className="text-xs font-bold text-[#5c4f4a] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c9996b]" />
                    {filters.location || t('nav_search_anywhere')}
                  </span>
                  <span className="h-4 w-px bg-[#5c4f4a]/20" />
                  <span className="text-xs font-medium text-[#5c4f4a]/80">
                    {t('nav_search_any_price')}
                  </span>
                  <span className="h-4 w-px bg-[#5c4f4a]/20" />
                  <div className="w-6 h-6 rounded-full bg-[#c9996b] group-hover:bg-[#5c4f4a] flex items-center justify-center text-white transition-colors ml-1">
                    <Search className="w-3 h-3" />
                  </div>
                </button>
              </div>
            )}

            {/* Right Action Icons, Language Switcher & Host CTA */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Language Switcher Toggle in Navigation Header */}
              <LanguageSwitcher variant="navbar" />

              {/* Wishlist Button */}
              <button
                id="navbar-wishlist-btn"
                onClick={() => navigate({ name: 'wishlist' })}
                className="relative p-2.5 rounded-full bg-white/70 hover:bg-white text-[#5c4f4a] hover:text-[#c9996b] border border-[#5c4f4a]/15 transition-all shadow-xs"
                title={t('nav_wishlist')}
                aria-label={t('nav_wishlist')}
              >
                <Heart className="w-4 h-4" />
                {wishlistIds.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-[#c9996b] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                  >
                    {formatNumber(wishlistIds.length)}
                  </motion.span>
                )}
              </button>

              {/* Host Dashboard Link */}
              <button
                id="navbar-host-btn"
                onClick={() => navigate({ name: 'host-dashboard' })}
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                  currentRoute.name === 'host-dashboard'
                    ? 'bg-[#5c766d] text-white shadow-md'
                    : 'bg-[#5c4f4a] text-white hover:bg-[#3f3531] shadow-xs'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-[#ede9e6]" />
                <span>{t('nav_host_portal')}</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-xl bg-white/70 text-[#5c4f4a] lg:hidden border border-[#5c4f4a]/15"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-[#5c4f4a]/10 bg-[#ede9e6] px-4 py-4 space-y-2 overflow-hidden shadow-xl"
            >
              {/* Language Switcher in Mobile Drawer */}
              <LanguageSwitcher variant="mobile" />

              <button
                onClick={() => {
                  navigate({ name: 'home' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/80 text-xs font-bold text-[#3f3531] border border-[#5c4f4a]/10"
              >
                <Home className="w-4 h-4 text-[#c9996b]" />
                {t('nav_mobile_home')}
              </button>
              <button
                onClick={() => {
                  navigate({ name: 'search' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/80 text-xs font-bold text-[#3f3531] border border-[#5c4f4a]/10"
              >
                <MapPin className="w-4 h-4 text-[#5c766d]" />
                {t('nav_mobile_map')}
              </button>
              <button
                onClick={() => {
                  navigate({ name: 'neighborhoods' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/80 text-xs font-bold text-[#3f3531] border border-[#5c4f4a]/10"
              >
                <Compass className="w-4 h-4 text-[#c9996b]" />
                {t('nav_mobile_guides')}
              </button>
              <button
                onClick={() => {
                  navigate({ name: 'compare' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/80 text-xs font-bold text-[#3f3531] border border-[#5c4f4a]/10"
              >
                <div className="flex items-center gap-3">
                  <Scale className="w-4 h-4 text-[#5c4f4a]" />
                  {t('nav_mobile_compare')}
                </div>
                {compareIds.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#c9996b] text-white text-[10px] font-bold">
                    {formatNumber(compareIds.length)}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  navigate({ name: 'agreement' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/80 text-xs font-bold text-[#3f3531] border border-[#5c4f4a]/10"
              >
                <FileText className="w-4 h-4 text-[#5c766d]" />
                {t('nav_mobile_agreement')}
              </button>
              <button
                onClick={() => {
                  navigate({ name: 'wishlist' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/80 text-xs font-bold text-[#3f3531] border border-[#5c4f4a]/10"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-[#c9996b]" />
                  {t('nav_mobile_wishlist')}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#c9996b]/20 text-[#5c4f4a] text-xs font-bold">
                  {formatNumber(wishlistIds.length)}
                </span>
              </button>
              <button
                onClick={() => {
                  navigate({ name: 'host-dashboard' });
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#5c4f4a] text-white text-xs font-bold shadow-sm"
              >
                <Building className="w-4 h-4 text-[#ede9e6]" />
                {t('nav_mobile_host')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Quick Search Modal */}
      <AnimatePresence>
        {quickSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5c4f4a]/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-[#ede9e6] rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-[#5c4f4a]/20"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#5c4f4a]/15">
                <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                  {t('search_modal_title')}
                </h3>
                <button
                  onClick={() => setQuickSearchOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#5c4f4a]/10 text-[#5c4f4a]"
                  aria-label="Close search dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleQuickSearchSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-2">
                    {t('search_modal_label')}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#c9996b] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder={t('search_modal_placeholder')}
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      className="w-full bg-white pl-10 pr-4 py-3 rounded-xl border border-[#5c4f4a]/20 focus:outline-none focus:ring-2 focus:ring-[#c9996b] text-sm text-[#3f3531]"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#5c4f4a]/75">
                    {t('search_modal_popular')}
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Gulshan-2', 'Banani', 'Dhanmondi', 'Bashundhara R/A', 'Uttara', 'Baridhara'].map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => setLocationInput(area)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#c9996b] hover:text-white text-[#5c4f4a] border border-[#5c4f4a]/15 transition-colors"
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#5c4f4a]/15">
                  <button
                    type="button"
                    onClick={() => setQuickSearchOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5c4f4a] hover:bg-black/5"
                  >
                    {t('search_modal_cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#c9996b] hover:bg-[#b07e4f] text-white flex items-center gap-2 shadow-md transition-all"
                  >
                    <Search className="w-4 h-4" />
                    {t('search_modal_explore')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
