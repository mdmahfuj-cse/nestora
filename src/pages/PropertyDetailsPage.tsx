import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Star,
  Share2,
  Heart,
  ShieldCheck,
  Zap,
  Flame,
  Check,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Maximize2,
  BedDouble,
  Bath,
  Maximize,
  Layers,
  Sparkles,
  Award,
  Phone,
  Mail,
  Clock,
  Compass,
  Building,
  Wifi,
  Car,
  Tv,
  Eye,
  Coffee,
  Trees,
  Train,
  ShoppingBag,
  ExternalLink,
  Scale,
  FileText,
  Download,
  Printer
} from 'lucide-react';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useHostStore } from '../stores/useHostStore';
import { useWishlistStore } from '../stores/useWishlistStore';
import { useCompareStore } from '../stores/useCompareStore';
import { mockHosts } from '../data/mockData';
import { formatBDT } from '../lib/utils';
import { BookingCard } from '../features/property/BookingCard';
import { PhotoGalleryModal } from '../features/property/PhotoGalleryModal';
import { PropertyPdfModal } from '../features/property/PropertyPdfModal';
import { PropertyCard } from '../components/shared/PropertyCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { DirectMessageModal } from '../features/property/DirectMessageModal';
import { VirtualTourInlineCard } from '../components/virtualTour/VirtualTourInlineCard';
import { VirtualTourModal } from '../components/virtualTour/VirtualTourModal';
import { getVirtualTourForProperty } from '../data/virtualTourData';

// Leaflet pin icon for details view
const propertyDetailIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="w-10 h-10 rounded-full bg-[#c9996b] text-white border-2 border-white shadow-xl flex items-center justify-center animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <div class="w-3 h-3 bg-[#c9996b] rotate-45 mx-auto -mt-2"></div>
    </div>
  `,
  className: 'custom-property-detail-pin',
  iconSize: [40, 44],
  iconAnchor: [20, 44],
  popupAnchor: [0, -44],
});

export const PropertyDetailsPage: React.FC = () => {
  const { currentRoute, navigate } = useNavigationStore();
  const { properties, getPropertyById } = useHostStore();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { isInCompare, toggleCompare } = useCompareStore();

  const propertyId = currentRoute.name === 'property' ? currentRoute.id : '';
  const property = getPropertyById(propertyId) || properties[0];

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [messageHostOpen, setMessageHostOpen] = useState(false);

  const virtualTour = property ? getVirtualTourForProperty(property) : null;
  const host = mockHosts.find((h) => h.id === property?.hostId) || mockHosts[0];
  const wishlisted = property ? isWishlisted(property.id) : false;
  const compared = property ? isInCompare(property.id) : false;

  // Nearby landmarks based on area
  const getNearbyLandmarks = (area: string) => {
    if (area.toLowerCase().includes('gulshan')) {
      return [
        { name: 'Gulshan Lake Park', type: 'Park', distance: '250 meters (3 min walk)', icon: Trees },
        { name: 'Unimart Flagship & Chef’s Table', type: 'Dining & Grocery', distance: '600 meters (5 min)', icon: ShoppingBag },
        { name: 'American Club / Diplomatic Zone', type: 'Security Zone', distance: '1.2 km (4 min drive)', icon: ShieldCheck },
        { name: 'Gulshan 2 Circle & Cafes', type: 'Lifestyle', distance: '400 meters', icon: Coffee },
      ];
    }
    if (area.toLowerCase().includes('banani')) {
      return [
        { name: 'Banani Road 11 Restaurant Hub', type: 'Dining', distance: '150 meters (2 min walk)', icon: Coffee },
        { name: 'Kamal Ataturk Avenue Metro Feed', type: 'Transit', distance: '800 meters', icon: Train },
        { name: 'Banani Lake Walkway', type: 'Recreation', distance: '400 meters', icon: Trees },
        { name: 'Pran Center & Supermarkets', type: 'Shopping', distance: '300 meters', icon: ShoppingBag },
      ];
    }
    if (area.toLowerCase().includes('dhanmondi')) {
      return [
        { name: 'Dhanmondi Lake & Rabindra Sarobar', type: 'Lake & Culture', distance: '300 meters (4 min walk)', icon: Trees },
        { name: 'Shimanto Square & Road 27 Cafes', type: 'Shopping & Dining', distance: '500 meters', icon: ShoppingBag },
        { name: 'Mastermind / Scholastica Campuses', type: 'Education', distance: '700 meters', icon: Building },
        { name: 'Anam Rangs Plaza', type: 'Market', distance: '600 meters', icon: Coffee },
      ];
    }
    return [
      { name: 'Dhaka MRT Line 6 Metro Station', type: 'Transit', distance: '500 meters (6 min walk)', icon: Train },
      { name: 'Jamuna Future Park / Local Mall', type: 'Shopping', distance: '1.5 km (5 min drive)', icon: ShoppingBag },
      { name: 'Central Community Park & Lake', type: 'Park', distance: '400 meters', icon: Trees },
      { name: 'Main Commercial Avenue & Pharmacy', type: 'Essentials', distance: '200 meters', icon: Coffee },
    ];
  };

  const landmarks = getNearbyLandmarks(property?.area || '');
  const similarProperties = properties
    .filter((p) => p.id !== property?.id && (p.area === property?.area || p.propertyType === property?.propertyType))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const openGalleryAt = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-['Outfit'] text-[#3f3531]">Property Not Found</h2>
        <button
          onClick={() => navigate({ name: 'search' })}
          className="mt-4 px-6 py-2.5 bg-[#5c4f4a] text-white text-xs font-bold rounded-full"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ede9e6] pb-20">
      {/* Top Breadcrumbs & Action Bar */}
      <div className="bg-[#ede9e6] border-b border-[#5c4f4a]/15 sticky top-20 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5c4f4a]/75 truncate">
            <button
              onClick={() => navigate({ name: 'home' })}
              className="hover:text-[#3f3531] transition-colors"
            >
              Dhaka
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              onClick={() => navigate({ name: 'search', params: { location: property.area } })}
              className="hover:text-[#3f3531] transition-colors truncate"
            >
              {property.area}
            </button>
            <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
            <span className="text-[#3f3531] font-bold truncate hidden sm:inline">
              {property.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleCompare(property.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-xs transition-colors ${
                compared
                  ? 'bg-[#5c4f4a] border-[#5c4f4a] text-white'
                  : 'bg-white border-[#5c4f4a]/20 text-[#5c4f4a] hover:bg-stone-50'
              }`}
              title={compared ? 'Remove from Compare' : 'Add to Compare'}
            >
              <Scale className="w-3.5 h-3.5 text-[#c9996b]" />
              <span>{compared ? 'Comparing' : 'Compare'}</span>
            </button>

            <button
              id="property-top-pdf-btn"
              onClick={() => setPdfModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c9996b]/10 hover:bg-[#c9996b]/20 border border-[#c9996b]/30 rounded-full text-xs font-bold text-[#3f3531] transition-colors shadow-xs"
              title="Download PDF Property Summary Report"
            >
              <Download className="w-3.5 h-3.5 text-[#c9996b]" />
              <span className="hidden sm:inline">PDF Report</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={() => navigate({ name: 'agreement', propertyId: property.id })}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#5c4f4a]/20 text-xs font-semibold text-[#5c4f4a] hover:bg-stone-50 transition-colors shadow-xs"
              title="Generate Residential Tenancy Agreement"
            >
              <FileText className="w-3.5 h-3.5 text-[#5c766d]" />
              <span>Tenancy Draft</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-[#5c4f4a]/20 text-xs font-semibold text-[#5c4f4a] hover:bg-stone-50 transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(property.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-xs transition-colors ${
                wishlisted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-[#5c4f4a]/20 text-[#5c4f4a] hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{wishlisted ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Title Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#c9996b]/20 text-[#3f3531] border border-[#c9996b]/30">
              {property.propertyType}
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#5c766d]/20 text-[#3f3531] border border-[#5c766d]/30">
              {property.furnished}
            </span>
            {property.isFeatured && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#3f3531] text-white">
                Featured Dhaka Luxury
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Outfit'] text-[#3f3531] tracking-tight">
            {property.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5c4f4a]">
            <div className="flex items-center gap-1 text-[#3f3531] font-bold">
              <Star className="w-4 h-4 fill-[#c9996b] text-[#c9996b]" />
              <span>{property.rating}</span>
              <span className="text-[#5c4f4a]/75 font-normal underline cursor-pointer">
                ({property.reviewCount} verified reviews)
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#c9996b]" />
              <span>{property.location}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1 text-[#5c766d]">
              <ShieldCheck className="w-4 h-4" />
              <span>Nestora Verified Dhaka Property</span>
            </div>
          </div>
        </div>

        {/* Multi-Photo Grid (Hero + 4 Thumbnails) */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#5c4f4a]/15 grid grid-cols-1 md:grid-cols-4 gap-2 bg-stone-900">
          {/* Main Hero Photo (Spans 2 columns on desktop) */}
          <div
            onClick={() => openGalleryAt(0)}
            className="md:col-span-2 relative aspect-[4/3] md:aspect-auto md:h-[480px] overflow-hidden cursor-pointer group"
          >
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Right 2x2 Grid */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-[480px]">
            {property.images.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                onClick={() => openGalleryAt(idx + 1)}
                className="relative overflow-hidden cursor-pointer group h-full bg-stone-800"
              >
                <img
                  src={img}
                  alt={`${property.title} preview ${idx + 2}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>

          {/* Floating Action Buttons on Photo Grid */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
            <button
              id="property-details-360-tour-btn"
              onClick={() => setVirtualTourOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#3f3531]/95 hover:bg-[#2d2421] text-white text-xs font-bold shadow-xl border border-white/20 backdrop-blur-md transition-all hover:scale-105 cursor-pointer ring-2 ring-[#c9996b]/50"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9996b] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c9996b]" />
              </span>
              <Compass className="w-4 h-4 text-[#c9996b] animate-spin-slow" />
              <span>360° Virtual Tour</span>
            </button>

            <button
              id="property-details-view-photos-btn"
              onClick={() => openGalleryAt(0)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/95 hover:bg-white text-[#3f3531] text-xs font-bold shadow-lg border border-[#5c4f4a]/20 backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 text-[#c9996b]" />
              <span className="hidden sm:inline">Show all {property.images.length} photos</span>
              <span className="sm:hidden">{property.images.length} Photos</span>
            </button>
          </div>
        </div>

        {/* Core Specs Quick Bar */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#5c4f4a]/15 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9996b]/15 flex items-center justify-center text-[#c9996b]">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#5c4f4a]/75 font-semibold">Bedrooms</p>
              <p className="text-sm font-black text-[#3f3531]">{property.bedrooms} Bed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5c766d]/15 flex items-center justify-center text-[#5c766d]">
              <Bath className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#5c4f4a]/75 font-semibold">Bathrooms</p>
              <p className="text-sm font-black text-[#3f3531]">{property.bathrooms} Attached</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5c4f4a]/15 flex items-center justify-center text-[#5c4f4a]">
              <Maximize className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#5c4f4a]/75 font-semibold">Floor Area</p>
              <p className="text-sm font-black text-[#3f3531]">{property.areaSqFt} Sq Ft</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c9996b]/15 flex items-center justify-center text-[#c9996b]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#5c4f4a]/75 font-semibold">Floor Level</p>
              <p className="text-sm font-black text-[#3f3531]">{property.floor || '5th Floor'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5c766d]/15 flex items-center justify-center text-[#5c766d]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#5c4f4a]/75 font-semibold">Generator Backup</p>
              <p className="text-sm font-black text-emerald-700">100% Full Load</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5c4f4a]/15 flex items-center justify-center text-[#5c4f4a]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#5c4f4a]/75 font-semibold">Cooking Gas</p>
              <p className="text-sm font-black text-[#3f3531]">Titas Pipeline</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid (Left Info + Right Sticky Booking Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column Details */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-10">
            {/* Host Profile Ribbon */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#5c4f4a]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={host.photo}
                    alt={host.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#c9996b]"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#c9996b] text-white p-1 rounded-full shadow-xs">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-['Outfit'] text-[#3f3531]">
                      Hosted by {host.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#5c766d]/15 text-[#5c766d]">
                      Superhost
                    </span>
                  </div>
                  <p className="text-xs text-[#5c4f4a]/75 mt-0.5">
                    Hosting on Nestora since {host.joinedYear} • {host.propertiesCount} active Dhaka rentals
                  </p>
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#5c4f4a] mt-2">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#c9996b] text-[#c9996b]" />
                      {host.rating} ({host.reviewCount} reviews)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#5c766d]">
                      <Clock className="w-3.5 h-3.5" />
                      Responds {host.responseTime}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMessageHostOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#5c4f4a] hover:bg-[#3f3531] text-white text-xs font-bold transition-all shadow-xs shrink-0 text-center"
              >
                Contact Landlord
              </button>
            </div>

            {/* Property Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#5c4f4a]/15 space-y-4">
              <h2 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                About This Rental
              </h2>
              <div
                className={`text-xs sm:text-sm text-[#5c4f4a] leading-relaxed space-y-3 ${
                  !isDescExpanded ? 'line-clamp-4' : ''
                }`}
              >
                <p>{property.description}</p>
                <p>
                  Located in the elite enclave of {property.area}, this home offers an unparalleled blend of convenience and modern lifestyle. The building is equipped with top-tier Japanese passenger elevators, 24/7 armed gate security, high-capacity silent standby generator delivering full power backup for all AC units and heavy appliances, and uninterrupted Titas Gas connection.
                </p>
                <p>
                  The floor plan features an expansive dining area, south-facing sunlit verandas with unobstructed views, modern modular kitchen with granite countertops, and ensuite bathrooms fitted with imported Grohe & Kohler fixtures.
                </p>
              </div>

              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="text-xs font-bold text-[#c9996b] hover:text-[#5c4f4a] flex items-center gap-1 pt-1"
              >
                <span>{isDescExpanded ? 'Show less' : 'Read full description'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isDescExpanded ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            </div>

            {/* 360° Virtual Tour & Room Inspector */}
            <VirtualTourInlineCard property={property} />

            {/* Essential Dhaka Amenities Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#5c4f4a]/15 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#5c766d]" />
                  <h2 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                    Verified Dhaka Amenities & Utilities
                  </h2>
                </div>
                <p className="text-xs text-[#5c4f4a]/75 mt-1">
                  Physically inspected and verified by the Nestora Dhaka field engineering team.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="p-3.5 rounded-2xl bg-[#ede9e6]/50 border border-[#5c4f4a]/15 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#5c4f4a]/20 flex items-center justify-center text-[#c9996b]">
                        {amenity === 'Generator' && <Zap className="w-4 h-4 text-amber-600" />}
                        {amenity === 'Gas Pipeline' && <Flame className="w-4 h-4 text-orange-600" />}
                        {amenity === 'Lift' && <Building className="w-4 h-4" />}
                        {amenity === 'AC' && <Zap className="w-4 h-4 text-blue-500" />}
                        {amenity === 'Parking' && <Car className="w-4 h-4" />}
                        {amenity === 'Security' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                        {amenity === 'Balcony' && <Eye className="w-4 h-4" />}
                        {amenity === 'WiFi' && <Wifi className="w-4 h-4 text-indigo-500" />}
                        {amenity === 'Gym' && <Sparkles className="w-4 h-4 text-rose-500" />}
                        {amenity === 'Swimming Pool' && <Sparkles className="w-4 h-4 text-cyan-600" />}
                        {amenity === 'CCTV' && <Eye className="w-4 h-4 text-purple-600" />}
                        {amenity === 'Washing machine' && <Tv className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#3f3531] block">
                          {amenity}
                        </span>
                        <span className="text-[10px] text-[#5c766d] font-semibold">
                          {amenity === 'Generator'
                            ? '100% Full Building Standby'
                            : amenity === 'Gas Pipeline'
                            ? 'Titas Direct Line Connection'
                            : 'Inspected & Active'}
                        </span>
                      </div>
                    </div>

                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Terms & Official Summary (PDF) Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#5c4f4a]/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#c9996b]" />
                    <h2 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                      Rental Terms & Tenancy Policies
                    </h2>
                  </div>
                  <p className="text-xs text-[#5c4f4a]/75 mt-1">
                    Transparent financial schedule and standard tenancy policies for {property.area}.
                  </p>
                </div>

                <button
                  id="property-section-pdf-btn"
                  type="button"
                  onClick={() => setPdfModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Summary</span>
                </button>
              </div>

              {/* 4 Financial & Lease Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#ede9e6]/50 border border-[#5c4f4a]/15 space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#5c4f4a]/75">
                    Monthly Base Rent
                  </p>
                  <p className="text-base font-black font-['Outfit'] text-[#3f3531]">
                    {formatBDT(property.price)}
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium">Due by 5th-7th of month</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#ede9e6]/50 border border-[#5c4f4a]/15 space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#5c4f4a]/75">
                    Building Service Charge
                  </p>
                  <p className="text-base font-black font-['Outfit'] text-[#3f3531]">
                    {property.serviceCharge ? `${formatBDT(property.serviceCharge)}/mo` : 'Included in Rent'}
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium">Lifts, generator fuel & guards</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#ede9e6]/50 border border-[#5c4f4a]/15 space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#5c4f4a]/75">
                    Security Deposit
                  </p>
                  <p className="text-base font-black font-['Outfit'] text-[#3f3531]">
                    {formatBDT(property.securityDeposit || property.price * 2)}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-bold">100% Refundable on move-out</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#ede9e6]/50 border border-[#5c4f4a]/15 space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#5c4f4a]/75">
                    Lease Duration
                  </p>
                  <p className="text-base font-black font-['Outfit'] text-[#3f3531]">
                    12 Months (Standard)
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium">2 Months written notice</p>
                </div>
              </div>

              {/* Tenancy & Utility Provisions */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-[#5c4f4a] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#3f3531]">
                  <ShieldCheck className="w-4 h-4 text-[#5c766d]" />
                  <span>Standard Tenancy Provisions & Utilities:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Electricity billed via dedicated prepaid smart meter (DESCO/DPDC)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>WASA water supply and deep tube-well reserve covered via society</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Titas gas pipeline active; no monthly LPG cylinder handling required</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Compliant with the Premises Rent Control Act, 1991 of Bangladesh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Neighborhood & Nearby Hotspots */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#5c4f4a]/15 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#c9996b]" />
                  <h2 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                    Dhaka Neighborhood & Proximity
                  </h2>
                </div>
                <p className="text-xs text-[#5c4f4a]/75 mt-1">
                  Prime positioning in {property.area} with swift connectivity to business centers and embassies.
                </p>
              </div>

              {/* Landmarks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {landmarks.map((place, idx) => {
                  const Icon = place.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#ede9e6]/40 border border-[#5c4f4a]/15 flex items-center gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#5c4f4a] shadow-xs">
                        <Icon className="w-5 h-5 text-[#c9996b]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#3f3531]">{place.name}</p>
                        <p className="text-[11px] text-[#5c766d] font-semibold">{place.distance}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Mini Leaflet Map */}
              <div className="h-64 rounded-2xl overflow-hidden border border-[#5c4f4a]/20 shadow-inner relative">
                <MapContainer
                  center={[property.lat, property.lng]}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={[property.lat, property.lng]} icon={propertyDetailIcon}>
                    <Popup>
                      <div className="text-center p-1">
                        <p className="font-bold text-xs font-['Outfit']">{property.title}</p>
                        <p className="text-[10px] text-stone-500">{property.location}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* Ratings & Guest Reviews */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#5c4f4a]/15 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#5c4f4a]/15 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#c9996b]/20 flex items-center justify-center text-[#3f3531] font-black text-2xl font-['Outfit']">
                    {property.rating}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                      Tenant Ratings & Reviews
                    </h2>
                    <p className="text-xs text-[#5c4f4a]/75">
                      Based on {property.reviews.length} authentic residential tenancy reviews
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-[#c9996b] text-[#c9996b]" />
                  ))}
                </div>
              </div>

              {/* Review Category Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-[#5c4f4a]/15 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-[#3f3531] mb-1">
                    <span>Cleanliness</span>
                    <span>4.9</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#c9996b] h-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#3f3531] mb-1">
                    <span>Accuracy</span>
                    <span>5.0</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#c9996b] h-full w-[100%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#3f3531] mb-1">
                    <span>Communication</span>
                    <span>4.9</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#c9996b] h-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#3f3531] mb-1">
                    <span>Location</span>
                    <span>5.0</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#c9996b] h-full w-[100%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#3f3531] mb-1">
                    <span>Generator Reliability</span>
                    <span>5.0</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-[100%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-[#3f3531] mb-1">
                    <span>Value for Rent</span>
                    <span>4.8</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#c9996b] h-full w-[96%]" />
                  </div>
                </div>
              </div>

              {/* Individual Reviews List */}
              <div className="space-y-6">
                {property.reviews.map((rev) => (
                  <div key={rev.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-10 h-10 rounded-full object-cover border border-[#5c4f4a]/20"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#3f3531]">{rev.author}</p>
                          <p className="text-[10px] text-[#5c4f4a]/60">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= Math.round(rev.rating || 5)
                                ? 'fill-[#c9996b] text-[#c9996b]'
                                : 'fill-stone-200 text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5c4f4a] leading-relaxed pl-13">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Sticky Booking & Tour Card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <BookingCard
              property={property}
              host={host}
              onDownloadPdf={() => setPdfModalOpen(true)}
            />
          </div>
        </div>

        {/* Similar Dhaka Rentals Carousel / Grid */}
        {similarProperties.length > 0 && (
          <div className="pt-10 border-t border-[#5c4f4a]/20 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-['Outfit'] text-[#3f3531]">
                  Similar Homes in {property.area}
                </h2>
                <p className="text-xs text-[#5c4f4a]/75 mt-0.5">
                  Explore other high-demand rentals verified nearby
                </p>
              </div>

              <button
                onClick={() => navigate({ name: 'search', params: { location: property.area } })}
                className="text-xs font-bold text-[#c9996b] hover:text-[#5c4f4a] flex items-center gap-1"
              >
                <span>View all in {property.area}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Photo Gallery Modal */}
      <PhotoGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={property.images}
        initialIndex={galleryIndex}
        title={property.title}
      />

      {/* Direct Host Message Modal */}
      <DirectMessageModal
        isOpen={messageHostOpen}
        onClose={() => setMessageHostOpen(false)}
        property={property}
        host={host}
      />

      {/* 360° Virtual Tour Fullscreen Modal */}
      {virtualTour && (
        <VirtualTourModal
          isOpen={virtualTourOpen}
          onClose={() => setVirtualTourOpen(false)}
          tour={virtualTour}
          property={property}
        />
      )}

      {/* Property PDF Summary Report Modal */}
      <PropertyPdfModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        property={property}
        host={host}
        landmarks={landmarks}
      />
    </div>
  );
};
