import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, Bed, Bath, Maximize2, ShieldCheck, Sparkles, ChevronLeft, ChevronRight, Eye, Scale, Compass } from 'lucide-react';
import { Property } from '../../types';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useCompareStore } from '../../stores/useCompareStore';
import { useMapStore } from '../../stores/useMapStore';
import { useLanguageStore } from '../../stores/useLanguageStore';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
  onHover?: (id: string | null) => void;
  isSelected?: boolean;
  isHovered?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  compact = false,
  onHover,
  isSelected = false,
  isHovered = false,
}) => {
  const { navigate } = useNavigationStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { isInCompare, toggleCompare } = useCompareStore();
  const { setSelectedPropertyId, setMapCenter } = useMapStore();
  const { t, formatPrice, formatNumber } = useLanguageStore();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const isSaved = isWishlisted(property.id);
  const isCompared = isInCompare(property.id);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleCardClick = () => {
    setSelectedPropertyId(property.id);
    setMapCenter([property.lat, property.lng], 15);
    navigate({ name: 'property', id: property.id });
  };

  return (
    <motion.div
      id={`property-card-${property.id}`}
      role="article"
      tabIndex={0}
      aria-label={`${property.title}, ${property.propertyType} in ${property.area}, ${formatPrice(property.price)} ${t('card_month')}, ${formatNumber(property.bedrooms)} ${t('card_beds')}, ${formatNumber(property.bathrooms)} ${t('card_baths')}, rated ${formatNumber(property.rating)} out of 5 stars`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if ((e.target as HTMLElement).tagName !== 'BUTTON') {
            e.preventDefault();
            handleCardClick();
          }
        }
      }}
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9996b] ${
        isSelected
          ? 'border-[#5c4f4a] ring-2 ring-[#c9996b] shadow-xl'
          : isHovered
          ? 'border-[#c9996b] shadow-lg scale-[1.01]'
          : 'border-[#5c4f4a]/15 shadow-sm hover:shadow-md hover:border-[#c9996b]/60'
      }`}
    >
      {/* Image Carousel / Preview */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={property.images[currentImageIdx] || property.images[0]}
          alt={`Photo of ${property.title} in ${property.area}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top Right Action Icons: Compare + Wishlist */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          <button
            id={`compare-btn-${property.id}`}
            type="button"
            aria-pressed={isCompared}
            aria-label={isCompared ? `Remove ${property.title} from comparison` : `Add ${property.title} to comparison`}
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(property.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md shadow-md transition-all ${
              isCompared
                ? 'bg-[#5c4f4a] text-[#ede9e6] ring-2 ring-[#c9996b]'
                : 'bg-white/80 hover:bg-white text-[#5c4f4a]'
            }`}
            title={isCompared ? 'Remove from Comparison' : 'Add to Compare'}
          >
            <Scale className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <button
            id={`wishlist-btn-${property.id}`}
            type="button"
            aria-pressed={isSaved}
            aria-label={isSaved ? `Remove ${property.title} from saved wishlist` : `Save ${property.title} to wishlist`}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(property.id);
            }}
            className="p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-[#5c4f4a] hover:text-red-500 shadow-md transition-all"
            title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart
              aria-hidden="true"
              className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                isSaved ? 'fill-red-500 text-red-500' : 'text-[#5c4f4a]'
              }`}
            />
          </button>
        </div>

        {/* Featured / Furnished Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {property.isFeatured && (
            <span className="px-2.5 py-1 rounded-md bg-[#5c4f4a] text-[#ede9e6] text-[10px] font-bold tracking-wide uppercase shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#c9996b]" aria-hidden="true" />
              Featured
            </span>
          )}
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[#3f3531] text-[10px] font-bold tracking-tight shadow-xs">
              {property.furnished}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#3f3531]/90 backdrop-blur-xs text-[#c9996b] text-[10px] font-bold tracking-tight shadow-xs flex items-center gap-1">
              <Compass className="w-2.5 h-2.5 animate-spin-slow" aria-hidden="true" />
              360° Tour
            </span>
          </div>
        </div>

        {/* Image Carousel Controls on Hover */}
        {property.images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label={`View previous image for ${property.title}`}
              className="p-1.5 rounded-full bg-white/90 text-[#5c4f4a] hover:bg-white shadow-md transition-all"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label={`View next image for ${property.title}`}
              className="p-1.5 rounded-full bg-white/90 text-[#5c4f4a] hover:bg-white shadow-md transition-all"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Carousel Indicator Dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1" aria-hidden="true">
            {property.images.slice(0, 5).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Details Content */}
      <div className="p-4 space-y-2">
        {/* Rating & Area */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#c9996b] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {property.area}
          </span>
          <div className="flex items-center gap-1 text-[#3f3531] font-bold">
            <span className="text-[#c9996b]">★</span>
            <span>{formatNumber(property.rating.toFixed(2))}</span>
            <span className="text-[#5c4f4a]/60 text-[11px]">({formatNumber(property.reviewCount)})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-['Outfit'] font-bold text-base text-[#3f3531] line-clamp-1 group-hover:text-[#c9996b] transition-colors">
          {property.title}
        </h3>

        {/* Specs: Bed, Bath, Sq Ft */}
        <div className="flex items-center gap-3 text-xs text-[#5c4f4a]/85 pt-1 border-t border-stone-100">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-[#5c766d]" />
            {formatNumber(property.bedrooms)} {property.bedrooms === 1 ? 'Bed' : t('card_beds')}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-[#5c766d]" />
            {formatNumber(property.bathrooms)} {t('card_baths')}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-[#5c766d]" />
            {formatNumber(property.areaSqFt)} {t('card_sqft')}
          </span>
        </div>

        {/* Price & Rent Details */}
        <div className="flex items-baseline justify-between pt-2">
          <div>
            <span className="text-lg font-extrabold font-['Outfit'] text-[#3f3531]">
              {formatPrice(property.price)}
            </span>
            <span className="text-xs text-[#5c4f4a]/75 font-medium"> {t('card_month')}</span>
          </div>
          <span className="text-[11px] font-semibold text-[#5c766d] bg-[#5c766d]/10 px-2 py-0.5 rounded">
            {property.availability}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
