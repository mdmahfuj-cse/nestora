import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Building,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  Search,
  FileCheck2,
  Phone,
  Mail,
  Share2
} from 'lucide-react';
import { useWishlistStore } from '../stores/useWishlistStore';
import { useHostStore } from '../stores/useHostStore';
import { useBookingStore } from '../stores/useBookingStore';
import { useNavigationStore } from '../stores/useNavigationStore';
import { formatBDT } from '../lib/utils';
import { PropertyCard } from '../components/shared/PropertyCard';

export const SavedWishlistPage: React.FC = () => {
  const { wishlistIds, clearWishlist, toggleWishlist } = useWishlistStore();
  const { properties } = useHostStore();
  const { bookingRequests } = useBookingStore();
  const { navigate } = useNavigationStore();

  const [activeTab, setActiveTab] = useState<'wishlist' | 'applications'>('wishlist');

  const savedProperties = properties.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#ede9e6] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#5c4f4a]/15">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#c9996b] uppercase tracking-wider">
              Tenant Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#3f3531] tracking-tight">
              Saved Homes & Applications
            </h1>
            <p className="text-xs sm:text-sm text-[#5c4f4a]/80">
              Keep track of favorite properties and track the status of your rental lease applications in Dhaka.
            </p>
          </div>

          {/* Tab switchers */}
          <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-[#5c4f4a]/15 shadow-xs shrink-0">
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'wishlist'
                  ? 'bg-[#5c4f4a] text-white shadow-sm'
                  : 'text-[#5c4f4a] hover:text-[#3f3531]'
              }`}
            >
              <Heart className="w-4 h-4" />
              Saved Homes ({savedProperties.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'applications'
                  ? 'bg-[#5c4f4a] text-white shadow-sm'
                  : 'text-[#5c4f4a] hover:text-[#3f3531]'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              My Applications ({bookingRequests.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Saved Wishlist Homes */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            {savedProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#5c4f4a]/15 max-w-lg mx-auto space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#ede9e6] flex items-center justify-center mx-auto text-[#c9996b]">
                  <Heart className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                    Your wishlist is empty
                  </h3>
                  <p className="text-xs text-[#5c4f4a]/80">
                    Browse premium apartments and houses in Gulshan, Banani, Dhanmondi, and Uttara, and click the heart icon to save them for comparison.
                  </p>
                </div>
                <button
                  onClick={() => navigate({ name: 'search' })}
                  className="px-6 py-3 rounded-xl bg-[#5c4f4a] hover:bg-[#3f3531] text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Explore Dhaka Rentals
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#5c4f4a]">
                    Showing {savedProperties.length} saved properties
                  </p>
                  <button
                    onClick={clearWishlist}
                    className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Wishlist
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: My Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {bookingRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#5c4f4a]/15 max-w-lg mx-auto space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#ede9e6] flex items-center justify-center mx-auto text-[#5c766d]">
                  <FileCheck2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                    No active applications
                  </h3>
                  <p className="text-xs text-[#5c4f4a]/80">
                    When you submit a rental application or request a tour for any Dhaka property, you can track verification and host response statuses here.
                  </p>
                </div>
                <button
                  onClick={() => navigate({ name: 'search' })}
                  className="px-6 py-3 rounded-xl bg-[#5c4f4a] hover:bg-[#3f3531] text-white text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Find a Rental
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookingRequests.map((req) => {
                  const isPending = req.status === 'Pending';
                  const isApproved = req.status === 'Approved';
                  const isDeclined = req.status === 'Declined';

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-3xl p-6 border border-[#5c4f4a]/15 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#5c4f4a]/10">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.propertyImage}
                            alt={req.propertyTitle}
                            className="w-16 h-16 rounded-2xl object-cover border border-[#5c4f4a]/10 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c9996b]">
                              {req.location}
                            </span>
                            <h4 className="text-sm font-bold font-['Outfit'] text-[#3f3531]">
                              {req.propertyTitle}
                            </h4>
                            <button
                              onClick={() => navigate({ name: 'property', id: req.propertyId })}
                              className="text-[11px] font-semibold text-[#5c766d] hover:underline flex items-center gap-0.5 mt-0.5"
                            >
                              View Property <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                              isPending
                                ? 'bg-amber-100 text-amber-800'
                                : isApproved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isPending && <Clock className="w-3.5 h-3.5" />}
                            {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {isDeclined && <XCircle className="w-3.5 h-3.5" />}
                            Application {req.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#ede9e6]/40 p-4 rounded-2xl text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider block">
                            Requested Move-in
                          </span>
                          <span className="font-bold text-[#3f3531]">{req.moveInDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider block">
                            Lease Duration
                          </span>
                          <span className="font-bold text-[#3f3531]">{req.months} Months ({req.occupants} occupants)</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider block">
                            Monthly Outlay
                          </span>
                          <span className="font-bold text-[#3f3531]">{formatBDT(req.monthlyRent)} + {formatBDT(req.serviceCharge)} sc</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider block">
                            Total Contract Value
                          </span>
                          <span className="font-black text-[#c9996b]">{formatBDT(req.totalEstimated)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
