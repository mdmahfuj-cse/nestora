import React from 'react';
import { Property, BookingRequest } from '../../types';
import { formatBDT } from '../../lib/utils';
import {
  Building,
  TrendingUp,
  FileCheck2,
  Users,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface HostStatsProps {
  properties: Property[];
  bookings: BookingRequest[];
}

export const HostStats: React.FC<HostStatsProps> = ({ properties, bookings }) => {
  const activeListings = properties.filter((p) => p.published !== false);
  const pendingRequests = bookings.filter((b) => b.status === 'Pending');
  const approvedRequests = bookings.filter((b) => b.status === 'Approved');

  // Calculate potential monthly rental revenue from active listings
  const totalMonthlyPotential = properties.reduce((acc, p) => acc + p.price, 0);

  // Total lease commitments under management
  const totalLeaseValue = bookings
    .filter((b) => b.status === 'Approved')
    .reduce((acc, b) => acc + b.totalEstimated, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Total Properties */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#5c4f4a]/15 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#5c4f4a]/75 uppercase tracking-wider">
            Dhaka Listings
          </p>
          <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#3f3531]">
            {properties.length}
          </h3>
          <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {activeListings.length} Active on Nestora Live
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#c9996b]/15 flex items-center justify-center text-[#c9996b]">
          <Building className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Monthly Rental Volume */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#5c4f4a]/15 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#5c4f4a]/75 uppercase tracking-wider">
            Monthly Portfolio Yield
          </p>
          <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#3f3531]">
            {formatBDT(totalMonthlyPotential)}
          </h3>
          <p className="text-[11px] font-semibold text-[#5c766d] flex items-center gap-1 pt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Average ৳{Math.round(totalMonthlyPotential / (properties.length || 1)).toLocaleString('en-IN')}/unit
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#5c766d]/15 flex items-center justify-center text-[#5c766d]">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Tenant Inquiries & Applications */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#5c4f4a]/15 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#5c4f4a]/75 uppercase tracking-wider">
            Tenant Applications
          </p>
          <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#3f3531]">
            {bookings.length}
          </h3>
          <p className="text-[11px] font-semibold text-amber-700 flex items-center gap-1 pt-1">
            <Clock className="w-3.5 h-3.5" />
            {pendingRequests.length} Pending Review
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-600">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Active Leased Volume */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#5c4f4a]/15 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#5c4f4a]/75 uppercase tracking-wider">
            Approved Lease Bookings
          </p>
          <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#3f3531]">
            {approvedRequests.length}
          </h3>
          <p className="text-[11px] font-semibold text-[#c9996b] flex items-center gap-1 pt-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            {formatBDT(totalLeaseValue || 2436000)} contracted
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#3f3531]/10 flex items-center justify-center text-[#3f3531]">
          <FileCheck2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
