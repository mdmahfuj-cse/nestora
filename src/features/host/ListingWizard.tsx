import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building,
  MapPin,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  DollarSign,
  Plus,
  Trash2,
  ShieldCheck,
  Eye,
  Info,
  Check
} from 'lucide-react';
import { Property, PropertyType, FurnishedStatus, Amenity } from '../../types';
import { useHostStore } from '../../stores/useHostStore';
import { formatBDT } from '../../lib/utils';

interface ListingWizardProps {
  initialProperty?: Property | null;
  onComplete: () => void;
  onCancel: () => void;
}

const DHAKA_NEIGHBORHOODS: { name: string; lat: number; lng: number }[] = [
  { name: 'Gulshan-2', lat: 23.7925, lng: 90.4078 },
  { name: 'Gulshan-1', lat: 23.7808, lng: 90.4167 },
  { name: 'Banani', lat: 23.7937, lng: 90.4043 },
  { name: 'Dhanmondi', lat: 23.7461, lng: 90.3742 },
  { name: 'Baridhara Diplomatic Zone', lat: 23.7998, lng: 90.4206 },
  { name: 'Bashundhara R/A', lat: 23.8164, lng: 90.4284 },
  { name: 'Uttara Sector 3/4', lat: 23.8759, lng: 90.3795 },
  { name: 'Uttara Sector 7/11', lat: 23.8685, lng: 90.395 },
  { name: 'Mirpur DOHS', lat: 23.8342, lng: 90.3664 },
  { name: 'Mohakhali DOHS', lat: 23.7801, lng: 90.3982 },
];

const PROPERTY_TYPES: PropertyType[] = [
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

const FURNISHED_OPTIONS: FurnishedStatus[] = [
  'Furnished',
  'Semi-Furnished',
  'Unfurnished',
];

const ALL_AMENITIES: { name: Amenity; label: string; desc: string; keyUtility?: boolean }[] = [
  { name: 'Generator', label: '100% Standby Generator', desc: 'Full building backup for ACs & refrigerators', keyUtility: true },
  { name: 'Gas Pipeline', label: 'Titas Gas Pipeline', desc: 'Continuous direct municipal gas line connection', keyUtility: true },
  { name: 'Lift', label: 'Passenger Elevator', desc: 'High-speed modern passenger lift with rescue device' },
  { name: 'AC', label: 'Air Conditioning', desc: 'Inverter AC units fitted in all master bedrooms & lounge' },
  { name: 'Parking', label: 'Covered Car Parking', desc: 'Dedicated basement / ground designated slot' },
  { name: 'Security', label: '24/7 Gate Security', desc: 'Armed guards, intercom, and visitor logbook' },
  { name: 'Balcony', label: 'South-facing Veranda', desc: 'Sunlit balcony with open breeze & city views' },
  { name: 'WiFi', label: 'Optical Fiber WiFi', desc: 'High-speed gigabit optical fiber connection setup' },
  { name: 'Gym', label: 'Building Fitness Gym', desc: 'Resident-only equipped fitness center' },
  { name: 'Swimming Pool', label: 'Swimming Pool', desc: 'Rooftop or compound pool with maintenance' },
  { name: 'CCTV', label: '24/7 CCTV Surveillance', desc: 'Full perimeter, lobby, and staircase video coverage' },
  { name: 'Washing machine', label: 'In-Unit Washer', desc: 'Dedicated laundry area with drainage and water hookup' },
];

const PRESET_PHOTO_COLLECTION = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
];

export const ListingWizard: React.FC<ListingWizardProps> = ({
  initialProperty,
  onComplete,
  onCancel,
}) => {
  const { addProperty, updateProperty } = useHostStore();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [title, setTitle] = useState(initialProperty?.title || '');
  const [propertyType, setPropertyType] = useState<PropertyType>(initialProperty?.propertyType || 'Apartment');
  const [area, setArea] = useState(initialProperty?.area || 'Gulshan-2');
  const [roadLocation, setRoadLocation] = useState(initialProperty?.location || 'Road 45, Gulshan-2, Dhaka');
  const [bedrooms, setBedrooms] = useState(initialProperty?.bedrooms || 3);
  const [bathrooms, setBathrooms] = useState(initialProperty?.bathrooms || 3);
  const [areaSqFt, setAreaSqFt] = useState(initialProperty?.areaSqFt || 2400);
  const [floor, setFloor] = useState(initialProperty?.floor || '6th Floor (South Facing)');
  const [furnished, setFurnished] = useState<FurnishedStatus>(initialProperty?.furnished || 'Furnished');
  const [amenities, setAmenities] = useState<Amenity[]>(
    initialProperty?.amenities || ['Generator', 'Gas Pipeline', 'Lift', 'AC', 'Parking', 'Security', 'Balcony', 'WiFi']
  );
  const [images, setImages] = useState<string[]>(
    initialProperty?.images || [
      PRESET_PHOTO_COLLECTION[0],
      PRESET_PHOTO_COLLECTION[1],
      PRESET_PHOTO_COLLECTION[2],
      PRESET_PHOTO_COLLECTION[3],
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [price, setPrice] = useState(initialProperty?.price || 120000);
  const [serviceCharge, setServiceCharge] = useState(initialProperty?.serviceCharge || 10000);
  const [securityDeposit, setSecurityDeposit] = useState(
    initialProperty?.securityDeposit || (initialProperty?.price ? initialProperty.price * 2 : 240000)
  );
  const [availability, setAvailability] = useState(initialProperty?.availability || 'Immediate / Ready to Move');
  const [description, setDescription] = useState(
    initialProperty?.description ||
      'Spectacular residential apartment featuring modern contemporary interiors, 100% standby generator for high-load appliances, Titas gas connection, south-facing private verandas, and high security in the heart of Dhaka.'
  );

  const toggleAmenity = (name: Amenity) => {
    if (amenities.includes(name)) {
      setAmenities(amenities.filter((a) => a !== name));
    } else {
      setAmenities([...amenities, name]);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) return;
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleAreaChange = (newArea: string) => {
    setArea(newArea);
    if (!roadLocation || roadLocation.includes('Dhaka')) {
      setRoadLocation(`Near Main Avenue, ${newArea}, Dhaka`);
    }
  };

  const handleSaveListing = () => {
    const matchedCoords = DHAKA_NEIGHBORHOODS.find((n) => n.name === area) || DHAKA_NEIGHBORHOODS[0];

    const propertyPayload = {
      title,
      propertyType,
      city: 'Dhaka',
      area,
      location: roadLocation,
      lat: matchedCoords.lat + (Math.random() - 0.5) * 0.005,
      lng: matchedCoords.lng + (Math.random() - 0.5) * 0.005,
      price: Number(price),
      serviceCharge: Number(serviceCharge),
      securityDeposit: Number(securityDeposit),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqFt: Number(areaSqFt),
      floor,
      furnished,
      amenities,
      images,
      description,
      availability,
      isFeatured: false,
      hostId: initialProperty?.hostId || 'host-1',
      published: true,
    };

    if (initialProperty) {
      updateProperty(initialProperty.id, propertyPayload);
    } else {
      addProperty(propertyPayload);
    }

    onComplete();
  };

  return (
    <div className="bg-[#ede9e6] rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#5c4f4a]/20 max-w-4xl mx-auto space-y-8">
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#5c4f4a]/15">
        <div>
          <span className="text-[11px] font-bold text-[#c9996b] uppercase tracking-wider">
            Dhaka Host Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#3f3531]">
            {initialProperty ? 'Edit Dhaka Rental Listing' : 'List New Dhaka Rental'}
          </h2>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                step === s
                  ? 'bg-[#5c4f4a] text-white shadow-xs'
                  : step > s
                  ? 'bg-[#5c766d] text-white'
                  : 'bg-white text-[#5c4f4a]/60 border border-[#5c4f4a]/15'
              }`}
            >
              <span>{s}</span>
              <span className="hidden md:inline text-[10px]">
                {s === 1 && 'Basics'}
                {s === 2 && 'Amenities'}
                {s === 3 && 'Photos'}
                {s === 4 && 'Pricing'}
                {s === 5 && 'Review'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Contents */}
      <AnimatePresence mode="wait">
        {/* STEP 1: Basic Specifications */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                Property Type & Location Details
              </h3>
              <p className="text-xs text-[#5c4f4a]/75">
                Specify the structural archetype and location within Dhaka metropolitan zones.
              </p>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-1.5">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luxurious Lakeview 4BHK with Private Veranda in Gulshan-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white px-4 py-3 rounded-2xl border border-[#5c4f4a]/20 text-sm font-semibold text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
                />
              </div>

              {/* Property Type & Neighborhood */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-1.5">
                    Property Type *
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full bg-white px-4 py-3 rounded-2xl border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-1.5">
                    Dhaka Zone / Area *
                  </label>
                  <select
                    value={area}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-2xl border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
                  >
                    {DHAKA_NEIGHBORHOODS.map((n) => (
                      <option key={n.name} value={n.name}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specific Road & Address */}
              <div>
                <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-1.5">
                  Detailed Address & Road *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#c9996b] absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Road 71, House 14, Gulshan-2, Dhaka"
                    value={roadLocation}
                    onChange={(e) => setRoadLocation(e.target.value)}
                    className="w-full bg-white pl-11 pr-4 py-3 rounded-2xl border border-[#5c4f4a]/20 text-xs font-medium text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
                  />
                </div>
              </div>

              {/* Bedrooms, Bathrooms, SqFt, Floor */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#5c4f4a] uppercase tracking-wider mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5c4f4a] uppercase tracking-wider mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5c4f4a] uppercase tracking-wider mb-1">
                    Area (Sq Ft)
                  </label>
                  <input
                    type="number"
                    min={300}
                    max={10000}
                    step={50}
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(Number(e.target.value))}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5c4f4a] uppercase tracking-wider mb-1">
                    Floor Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5th Floor"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Dhaka Utilities & Amenities */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                Dhaka-Specific Utilities & Amenities
              </h3>
              <p className="text-xs text-[#5c4f4a]/75">
                Highlight essential high-demand Dhaka features (like 100% full standby generator and active Titas gas).
              </p>
            </div>

            {/* Furnishing Status */}
            <div>
              <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-2">
                Furnishing Condition
              </label>
              <div className="grid grid-cols-3 gap-3">
                {FURNISHED_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFurnished(f)}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                      furnished === f
                        ? 'bg-[#5c4f4a] text-white border-[#5c4f4a] shadow-xs'
                        : 'bg-white text-[#5c4f4a] border-[#5c4f4a]/20 hover:border-[#c9996b]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#3f3531] uppercase tracking-wider">
                Select Installed Amenities ({amenities.length} Active)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_AMENITIES.map((item) => {
                  const isChecked = amenities.includes(item.name);
                  return (
                    <div
                      key={item.name}
                      onClick={() => toggleAmenity(item.name)}
                      className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex items-start justify-between gap-3 ${
                        isChecked
                          ? 'bg-white border-[#c9996b] shadow-xs ring-1 ring-[#c9996b]/30'
                          : 'bg-white/60 border-[#5c4f4a]/15 hover:border-[#c9996b]/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#3f3531]">
                            {item.label}
                          </span>
                          {item.keyUtility && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#c9996b] text-white">
                              High Demand
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5c4f4a]/75 leading-tight">
                          {item.desc}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-[#c9996b] text-white'
                            : 'border border-[#5c4f4a]/30'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Photos Management */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                Photo Gallery Showcase
              </h3>
              <p className="text-xs text-[#5c4f4a]/75">
                Add high-resolution photography of the interiors, living areas, and building facilities.
              </p>
            </div>

            {/* Custom URL Input */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 bg-white px-4 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 bg-[#5c4f4a] hover:bg-[#3f3531] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Photo
              </button>
            </div>

            {/* Preset Image Picks */}
            <div>
              <label className="block text-[11px] font-bold text-[#5c4f4a] uppercase tracking-wider mb-2">
                Or pick from curated Dhaka architectural presets:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PRESET_PHOTO_COLLECTION.map((url, idx) => {
                  const isSelected = images.includes(url);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (isSelected && images.length > 1) {
                          setImages(images.filter((img) => img !== url));
                        } else if (!isSelected) {
                          setImages([...images, url]);
                        }
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-[#c9996b] ring-2 ring-[#c9996b]/50 scale-95'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#c9996b]/30 flex items-center justify-center text-white">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Photos Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#3f3531] uppercase tracking-wider">
                Current Photos ({images.length}) • First photo will be the main listing cover
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#5c4f4a]/20 shadow-xs group bg-stone-200"
                  >
                    <img src={img} alt={`Listing photo ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#3f3531] text-white text-[9px] font-bold shadow-xs">
                        Cover Photo
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      disabled={images.length <= 1}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-0"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Financials & Description */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                Monthly Rental Pricing & Terms (BDT)
              </h3>
              <p className="text-xs text-[#5c4f4a]/75">
                Set clear transparent rates for rent, monthly service charge, and refundable security deposit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Monthly Rent */}
              <div>
                <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-1.5">
                  Monthly Rent (৳ BDT) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs font-bold text-[#5c4f4a]">৳</span>
                  <input
                    type="number"
                    required
                    step={1000}
                    value={price}
                    onChange={(e) => {
                      const newP = Number(e.target.value);
                      setPrice(newP);
                      setSecurityDeposit(newP * 2);
                    }}
                    className="w-full bg-white pl-8 pr-4 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-sm font-black text-[#3f3531]"
                  />
                </div>
              </div>

              {/* Service Charge */}
              <div>
                <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-1.5">
                  Service Charge (৳/mo)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs font-bold text-[#5c4f4a]">৳</span>
                  <input
                    type="number"
                    step={500}
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(Number(e.target.value))}
                    className="w-full bg-white pl-8 pr-4 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-sm font-black text-[#3f3531]"
                  />
                </div>
              </div>

              {/* Security Deposit */}
              <div>
                <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-1.5">
                  Security Deposit (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs font-bold text-[#5c4f4a]">৳</span>
                  <input
                    type="number"
                    step={5000}
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full bg-white pl-8 pr-4 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-sm font-black text-[#3f3531]"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-1.5">
                Availability Status
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Immediate / Ready to Move or Available from 1st Oct"
                className="w-full bg-white px-4 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs font-semibold text-[#3f3531]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#5c4f4a] uppercase tracking-wider mb-1.5">
                Comprehensive Property Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white p-4 rounded-2xl border border-[#5c4f4a]/20 text-xs text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </motion.div>
        )}

        {/* STEP 5: Final Review & Live Preview */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                Review Listing Summary
              </h3>
              <p className="text-xs text-[#5c4f4a]/75">
                Verify the specifications below before publishing live to the Dhaka rental network.
              </p>
            </div>

            {/* Summary Preview Box */}
            <div className="bg-white rounded-3xl p-6 border border-[#5c4f4a]/20 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={images[0]}
                  alt={title}
                  className="w-full md:w-56 h-44 rounded-2xl object-cover shadow-xs shrink-0"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#c9996b]/20 text-[#3f3531] font-bold text-[10px] rounded-md">
                      {propertyType}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#5c766d]/20 text-[#3f3531] font-bold text-[10px] rounded-md">
                      {furnished}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md">
                      {availability}
                    </span>
                  </div>

                  <h4 className="text-base font-black font-['Outfit'] text-[#3f3531]">
                    {title || 'Untitled Dhaka Property'}
                  </h4>

                  <p className="text-xs text-[#5c4f4a] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c9996b]" />
                    {roadLocation}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-bold text-[#5c4f4a] pt-1">
                    <span>{bedrooms} Beds</span>
                    <span>•</span>
                    <span>{bathrooms} Baths</span>
                    <span>•</span>
                    <span>{areaSqFt} Sq Ft</span>
                    <span>•</span>
                    <span>{floor}</span>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-baseline gap-2">
                    <span className="text-xl font-black text-[#3f3531]">
                      {formatBDT(price)}
                    </span>
                    <span className="text-xs text-[#5c4f4a]/80">/ month</span>
                    {serviceCharge > 0 && (
                      <span className="text-[11px] text-[#5c766d] font-semibold">
                        (+ {formatBDT(serviceCharge)} service charge)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Dhaka Utilities Badge Matrix */}
              <div className="pt-4 border-t border-[#5c4f4a]/15">
                <label className="block text-[11px] font-bold text-[#5c4f4a] uppercase tracking-wider mb-2">
                  Verified Utilities Included ({amenities.length}):
                </label>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <span
                      key={a}
                      className="px-2.5 py-1 rounded-lg bg-[#ede9e6] text-[#3f3531] text-xs font-semibold flex items-center gap-1 border border-[#5c4f4a]/15"
                    >
                      <Check className="w-3 h-3 text-[#5c766d]" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[#5c4f4a]/15">
        <div>
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#5c4f4a]/20 bg-white hover:bg-stone-50 text-xs font-bold text-[#5c4f4a] transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#5c4f4a] hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        <div>
          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !title.trim()) return;
                setStep(step + 1);
              }}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#5c4f4a] hover:bg-[#3f3531] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveListing}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-black shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {initialProperty ? 'Update Property Listing' : 'Publish to Nestora Dhaka'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
