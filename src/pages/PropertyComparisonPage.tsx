import React from 'react';
import { motion } from 'motion/react';
import {
  Scale,
  X,
  Check,
  Minus,
  Plus,
  ArrowRight,
  ExternalLink,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Zap,
  Flame,
  ShieldCheck,
  Car,
  Wifi,
  Sparkles,
  Building,
  Trash2
} from 'lucide-react';
import { useCompareStore } from '../stores/useCompareStore';
import { useHostStore } from '../stores/useHostStore';
import { useNavigationStore } from '../stores/useNavigationStore';
import { formatBDT } from '../lib/utils';
import { Property, Amenity } from '../types';

const KEY_AMENITY_ROWS: { name: Amenity; label: string; icon: any }[] = [
  { name: 'Generator', label: '100% Standby Generator', icon: Zap },
  { name: 'Gas Pipeline', label: 'Titas Gas Pipeline', icon: Flame },
  { name: 'Lift', label: 'Passenger Elevator', icon: Building },
  { name: 'AC', label: 'Air Conditioning', icon: Sparkles },
  { name: 'Parking', label: 'Covered Car Parking', icon: Car },
  { name: 'Security', label: '24/7 Gate Guard', icon: ShieldCheck },
  { name: 'Balcony', label: 'Private Balcony', icon: Building },
  { name: 'WiFi', label: 'Optical Fiber WiFi', icon: Wifi },
];

export const PropertyComparisonPage: React.FC = () => {
  const { compareIds, removeFromCompare, clearCompare, addToCompare } = useCompareStore();
  const { properties } = useHostStore();
  const { navigate } = useNavigationStore();

  const comparedProperties = properties.filter((p) => compareIds.includes(p.id));
  const suggestedProperties = properties
    .filter((p) => !compareIds.includes(p.id))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#ede9e6] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#5c4f4a]/15">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5c4f4a] text-[#ede9e6] text-[10px] font-black uppercase tracking-wider">
                Side-by-Side Matrix
              </span>
              <span className="text-xs font-bold text-[#c9996b] flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" /> Comparing {comparedProperties.length} Properties
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#3f3531] tracking-tight">
              Dhaka Property Comparison
            </h1>
            <p className="text-xs sm:text-sm text-[#5c4f4a]/80">
              Evaluate rent rates, standby generator specs, Titas gas availability, and floor layouts side by side.
            </p>
          </div>

          {comparedProperties.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearCompare}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
              <button
                onClick={() => navigate({ name: 'search' })}
                className="px-5 py-2.5 rounded-xl bg-[#5c4f4a] hover:bg-[#3f3531] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add More from Search
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {comparedProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#5c4f4a]/15 max-w-xl mx-auto space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#ede9e6] flex items-center justify-center mx-auto text-[#c9996b]">
              <Scale className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-['Outfit'] text-[#3f3531]">
                No properties selected for comparison
              </h3>
              <p className="text-xs text-[#5c4f4a]/80 max-w-sm mx-auto">
                Click the comparison icon <Scale className="w-3 h-3 inline mx-0.5 text-[#c9996b]" /> on any property card to compare rent, amenities, and floor plans.
              </p>
            </div>

            {/* Quick suggestions to add */}
            <div className="pt-4 space-y-3">
              <span className="text-[11px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider block">
                Quick Add Top Dhaka Rentals:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedProperties.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => addToCompare(prop.id)}
                    className="p-3 rounded-2xl bg-[#ede9e6]/50 hover:bg-[#ede9e6] border border-[#5c4f4a]/15 flex items-center gap-3 cursor-pointer text-left transition-colors"
                  >
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#3f3531] truncate">{prop.title}</h4>
                      <p className="text-[11px] text-[#c9996b] font-black">{formatBDT(prop.price)}/mo</p>
                    </div>
                    <Plus className="w-4 h-4 text-[#5c4f4a] shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Main Comparison Matrix Grid */
          <div className="bg-white rounded-3xl border border-[#5c4f4a]/15 shadow-sm overflow-x-auto">
            <div className="min-w-[700px] divide-y divide-[#5c4f4a]/10">
              {/* Row 0: Property Hero & Header Cards */}
              <div className="grid grid-cols-5 p-6 gap-4 bg-stone-50/50">
                <div className="font-bold text-xs text-[#5c4f4a]/80 uppercase tracking-wider flex flex-col justify-end">
                  <span>Selected Homes</span>
                  <span className="text-[11px] font-normal text-[#5c4f4a]/60">
                    Max 4 units simultaneously
                  </span>
                </div>

                {comparedProperties.map((prop) => (
                  <div key={prop.id} className="relative space-y-3">
                    <button
                      onClick={() => removeFromCompare(prop.id)}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full bg-stone-200 hover:bg-rose-500 hover:text-white text-[#5c4f4a] shadow-xs transition-colors z-10"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-[#5c4f4a]/15 shadow-xs">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#c9996b] uppercase tracking-wider block">
                        {prop.area}
                      </span>
                      <h4 className="text-xs font-bold font-['Outfit'] text-[#3f3531] line-clamp-2">
                        {prop.title}
                      </h4>
                      <button
                        onClick={() => navigate({ name: 'property', id: prop.id })}
                        className="text-[11px] font-semibold text-[#5c766d] hover:underline flex items-center gap-1 mt-1"
                      >
                        Open Details <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: Math.max(0, 4 - comparedProperties.length) }).map((_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    onClick={() => navigate({ name: 'search' })}
                    className="border-2 border-dashed border-[#5c4f4a]/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:border-[#c9996b] hover:bg-[#ede9e6]/20 transition-all"
                  >
                    <Plus className="w-6 h-6 text-[#5c4f4a]/40" />
                    <span className="text-xs font-bold text-[#5c4f4a]/60">
                      Add Property Slot
                    </span>
                  </div>
                ))}
              </div>

              {/* Row 1: Monthly Rent (BDT) */}
              <div className="grid grid-cols-5 p-4 sm:p-5 gap-4 items-center bg-white">
                <div className="text-xs font-bold text-[#3f3531]">Monthly Rent</div>
                {comparedProperties.map((prop) => (
                  <div key={prop.id} className="text-base font-black font-['Outfit'] text-[#3f3531]">
                    {formatBDT(prop.price)}
                    <span className="text-[11px] text-[#5c4f4a]/75 font-normal"> / mo</span>
                  </div>
                ))}
              </div>

              {/* Row 2: Service Charge */}
              <div className="grid grid-cols-5 p-4 sm:p-5 gap-4 items-center bg-[#ede9e6]/20">
                <div className="text-xs font-bold text-[#5c4f4a]">Service Charge</div>
                {comparedProperties.map((prop) => (
                  <div key={prop.id} className="text-xs font-bold text-[#5c766d]">
                    {prop.serviceCharge ? `${formatBDT(prop.serviceCharge)} / mo` : 'Included in rent'}
                  </div>
                ))}
              </div>

              {/* Row 3: Security Deposit */}
              <div className="grid grid-cols-5 p-4 sm:p-5 gap-4 items-center bg-white">
                <div className="text-xs font-bold text-[#5c4f4a]">Refundable Deposit</div>
                {comparedProperties.map((prop) => (
                  <div key={prop.id} className="text-xs font-semibold text-[#3f3531]">
                    {formatBDT(prop.securityDeposit || prop.price * 2)} (2 Months)
                  </div>
                ))}
              </div>

              {/* Row 4: Space & Bedrooms */}
              <div className="grid grid-cols-5 p-4 sm:p-5 gap-4 items-center bg-[#ede9e6]/20">
                <div className="text-xs font-bold text-[#3f3531]">Bedrooms & Baths</div>
                {comparedProperties.map((prop) => (
                  <div key={prop.id} className="text-xs font-bold text-[#3f3531]">
                    {prop.bedrooms} Bed • {prop.bathrooms} Bath
                  </div>
                ))}
              </div>

              {/* Row 5: Square Footage & Price/SqFt */}
              <div className="grid grid-cols-5 p-4 sm:p-5 gap-4 items-center bg-white">
                <div className="text-xs font-bold text-[#5c4f4a]">Area (Sq Ft) & Rate</div>
                {comparedProperties.map((prop) => (
                  <div key={prop.id} className="text-xs space-y-0.5">
                    <span className="font-bold text-[#3f3531]">{prop.areaSqFt} sqft</span>
                    <span className="text-[10px] text-[#5c4f4a]/75 block">
                      ≈ ৳{Math.round(prop.price / prop.areaSqFt)} / sqft
                    </span>
                  </div>
                ))}
              </div>

              {/* Row 6: Floor & Facing */}
              <div className="grid grid-cols-5 p-4 sm:p-5 gap-4 items-center bg-[#ede9e6]/20">
                <div className="text-xs font-bold text-[#5c4f4a]">Floor & Orientation</div>
                {comparedProperties.map((prop) => (
                  <div key={prop.id} className="text-xs font-medium text-[#3f3531]">
                    {prop.floor || '5th Floor (South-Facing)'}
                  </div>
                ))}
              </div>

              {/* Row 7: Furnishing */}
              <div className="grid grid-cols-5 p-4 sm:p-5 gap-4 items-center bg-white">
                <div className="text-xs font-bold text-[#5c4f4a]">Furnishing Condition</div>
                {comparedProperties.map((prop) => (
                  <div key={prop.id}>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#c9996b]/15 text-[#3f3531]">
                      {prop.furnished}
                    </span>
                  </div>
                ))}
              </div>

              {/* SECTION: KEY UTILITIES */}
              {KEY_AMENITY_ROWS.map((amenity, idx) => (
                <div
                  key={amenity.name}
                  className={`grid grid-cols-5 p-4 sm:p-5 gap-4 items-center ${
                    idx % 2 === 0 ? 'bg-[#ede9e6]/20' : 'bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-[#3f3531] flex items-center gap-1.5">
                    <amenity.icon className="w-3.5 h-3.5 text-[#c9996b]" />
                    {amenity.label}
                  </div>
                  {comparedProperties.map((prop) => {
                    const hasIt = prop.amenities.includes(amenity.name);
                    return (
                      <div key={prop.id} className="flex items-center gap-1.5">
                        {hasIt ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                            <span>Included</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-stone-400 font-medium text-xs">
                            <Minus className="w-4 h-4 stroke-[2]" />
                            <span>Not active</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Row Final: Actions & Booking */}
              <div className="grid grid-cols-5 p-6 gap-4 items-center bg-stone-100/70">
                <div className="text-xs font-bold text-[#3f3531]">Application Action</div>
                {comparedProperties.map((prop) => (
                  <div key={prop.id} className="space-y-2">
                    <button
                      onClick={() => navigate({ name: 'property', id: prop.id })}
                      className="w-full py-2.5 rounded-xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold shadow-md transition-colors text-center block"
                    >
                      Book Tour / Apply
                    </button>
                    <button
                      onClick={() => navigate({ name: 'agreement', propertyId: prop.id })}
                      className="w-full py-1.5 rounded-lg border border-[#5c4f4a]/20 text-[10px] font-bold text-[#5c4f4a] hover:bg-white transition-colors text-center block"
                    >
                      Draft Tenancy Agreement
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
