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
