import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building,
  Plus,
  TrendingUp,
  FileCheck2,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Flame,
  CheckCircle2,
  MapPin,
  Calendar
} from 'lucide-react';
import { useHostStore } from '../stores/useHostStore';
import { useBookingStore } from '../stores/useBookingStore';
import { useNavigationStore } from '../stores/useNavigationStore';
import { HostStats } from '../features/host/HostStats';
import { ListingWizard } from '../features/host/ListingWizard';
import { PropertyManagementTable } from '../features/host/PropertyManagementTable';
import { BookingRequestsList } from '../features/host/BookingRequestsList';
import { Property } from '../types';
import { formatBDT } from '../lib/utils';

export const HostDashboardPage: React.FC = () => {
  const { properties } = useHostStore();
  const { bookingRequests } = useBookingStore();
  const { currentRoute, navigate } = useNavigationStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'inquiries' | 'wizard'>('overview');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const handleStartAdd = () => {
    setEditingProperty(null);
    setActiveTab('wizard');
  };

  const handleStartEdit = (prop: Property) => {
    setEditingProperty(prop);
    setActiveTab('wizard');
  };

  const handleWizardComplete = () => {
    setEditingProperty(null);
    setActiveTab('properties');
  };

  const handleWizardCancel = () => {
    setEditingProperty(null);
    setActiveTab('properties');
  };

  return (
    <div className="min-h-screen bg-[#ede9e6] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Dashboard Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#5c4f4a]/15">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5c4f4a] text-[#ede9e6] text-[10px] font-black uppercase tracking-wider">
                Dhaka Host Central
              </span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Host Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#3f3531] tracking-tight">
              Host Portfolio & Operations
            </h1>
            <p className="text-xs sm:text-sm text-[#5c4f4a]/80">
              Manage your residential rentals, review tenant applications, and monitor occupancy across Dhaka.
            </p>
          </div>

          {/* New Listing Action Button */}
          {activeTab !== 'wizard' && (
            <button
              onClick={handleStartAdd}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-black shadow-lg hover:shadow-xl transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              List New Dhaka Property
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        {activeTab !== 'wizard' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#5c4f4a]/10">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-[#5c4f4a] text-white shadow-sm'
                  : 'bg-white text-[#5c4f4a] hover:bg-stone-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Portfolio Overview
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'properties'
                  ? 'bg-[#5c4f4a] text-white shadow-sm'
                  : 'bg-white text-[#5c4f4a] hover:bg-stone-100'
              }`}
            >
              <Building className="w-4 h-4" />
              Manage Dhaka Listings
              <span className="px-1.5 py-0.2 rounded-full bg-black/10 text-[10px]">
                {properties.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'inquiries'
                  ? 'bg-[#5c4f4a] text-white shadow-sm'
                  : 'bg-white text-[#5c4f4a] hover:bg-stone-100'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              Tenant Applications & Leads
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-900 text-[10px]">
                {bookingRequests.length}
              </span>
            </button>
          </div>
        )}

        {/* Tab Views */}
        <AnimatePresence mode="wait">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Host Quick Key Performance Indicators */}
              <HostStats properties={properties} bookings={bookingRequests} />

              {/* Dhaka Rental Market Insights Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Dhaka Market Yield Benchmark */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#5c4f4a]/15 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#c9996b] uppercase tracking-wider">
                        Dhaka Rental Benchmarks
                      </span>
                      <h3 className="text-lg font-black font-['Outfit'] text-[#3f3531]">
                        Neighborhood Yield & Demand Index (2026)
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-[#5c766d]/15 text-[#5c766d] text-xs font-bold rounded-full">
                      Live City Trends
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        area: 'Gulshan-2 & Diplomatic Zone',
                        avgRent: '৳140,000 - ৳250,000',
                        demand: 'High Expat & Executive Demand',
                        powerFactor: '100% Generator + Titas Gas essential',
                      },
                      {
                        area: 'Banani (Blocks C, D, E)',
                        avgRent: '৳85,000 - ৳160,000',
                        demand: 'Tech & Media Professionals',
                        powerFactor: 'Dedicated Lift & Rooftop terrace',
                      },
                      {
                        area: 'Dhanmondi (R/A & Lake Area)',
                        avgRent: '৳65,000 - ৳120,000',
                        demand: 'Long-term Family Leases',
                        powerFactor: 'Near Top English Medium Schools',
                      },
                      {
                        area: 'Bashundhara R/A (Blocks A-I)',
                        avgRent: '৳45,000 - ৳85,000',
                        demand: 'Doctors, Faculty & Corporate Staff',
                        powerFactor: 'Near Evercare & Independent Univ',
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#ede9e6]/40 p-4 rounded-2xl border border-[#5c4f4a]/10 space-y-1.5"
                      >
                        <h4 className="text-xs font-bold text-[#3f3531]">{item.area}</h4>
                        <p className="text-sm font-black text-[#c9996b]">{item.avgRent}</p>
                        <p className="text-[11px] text-[#5c4f4a] font-medium">{item.demand}</p>
                        <p className="text-[10px] text-[#5c766d] font-semibold flex items-center gap-1 pt-1">
                          <Zap className="w-3 h-3" /> {item.powerFactor}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 1 Col: Quick Operations Checklist */}
                <div className="bg-[#5c4f4a] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c9996b]">
                      Host Checklist
                    </span>
                    <h3 className="text-xl font-bold font-['Outfit'] leading-tight">
                      Maximizing Dhaka Tenant Conversion
                    </h3>
                    <ul className="space-y-3 text-xs text-stone-200">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c9996b] shrink-0 mt-0.5" />
                        <span>Specify standby generator KVA capacity in amenity notes.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c9996b] shrink-0 mt-0.5" />
                        <span>Clarify whether Titas gas or cylinder backup is active.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c9996b] shrink-0 mt-0.5" />
                        <span>Respond to tenant virtual tour requests within 2 hours.</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleStartAdd}
                    className="w-full py-3 rounded-2xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Next Listing
                  </button>
                </div>
              </div>

              {/* Recent Applications Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                    Recent Tenant Inquiries & Applications
                  </h3>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs font-bold text-[#c9996b] hover:underline flex items-center gap-1"
                  >
                    View All Inquiries <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <BookingRequestsList />
              </div>
            </motion.div>
          )}

          {/* TAB 2: MANAGE PROPERTIES */}
          {activeTab === 'properties' && (
            <motion.div
              key="properties"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <PropertyManagementTable
                onAddNew={handleStartAdd}
                onEdit={handleStartEdit}
              />
            </motion.div>
          )}

          {/* TAB 3: TENANT INQUIRIES & APPLICATIONS */}
          {activeTab === 'inquiries' && (
            <motion.div
              key="inquiries"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <BookingRequestsList />
            </motion.div>
          )}

          {/* TAB 4: LISTING CREATION / EDIT WIZARD */}
          {activeTab === 'wizard' && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <ListingWizard
                initialProperty={editingProperty}
                onComplete={handleWizardComplete}
                onCancel={handleWizardCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
