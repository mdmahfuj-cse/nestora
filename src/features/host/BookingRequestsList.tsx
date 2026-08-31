import React, { useState } from 'react';
import { BookingRequest } from '../../types';
import { useBookingStore } from '../../stores/useBookingStore';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { formatBDT } from '../../lib/utils';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Calendar,
  Users,
  MessageSquare,
  Building,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const BookingRequestsList: React.FC = () => {
  const { bookingRequests, updateBookingStatus } = useBookingStore();
  const { navigate } = useNavigationStore();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredRequests = bookingRequests.filter((req) => {
    if (filterStatus === 'All') return true;
    return req.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Pending', 'Approved', 'Declined'].map((status) => {
          const count =
            status === 'All'
              ? bookingRequests.length
              : bookingRequests.filter((b) => b.status === status).length;

          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filterStatus === status
                  ? 'bg-[#5c4f4a] text-white shadow-sm'
                  : 'bg-white text-[#5c4f4a] border border-[#5c4f4a]/15 hover:border-[#c9996b]'
              }`}
            >
              <span>{status}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  filterStatus === status
                    ? 'bg-white/20 text-white'
                    : 'bg-[#ede9e6] text-[#5c4f4a]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications Cards List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#5c4f4a]/15 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ede9e6] flex items-center justify-center mx-auto text-[#5c4f4a]">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold font-['Outfit'] text-[#3f3531]">
            No rental applications found
          </h4>
          <p className="text-xs text-[#5c4f4a]/75 max-w-sm mx-auto">
            Tenant applications and virtual tour inquiries for your Dhaka listings will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'Pending';
            const isApproved = req.status === 'Approved';
            const isDeclined = req.status === 'Declined';

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 border border-[#5c4f4a]/15 shadow-sm hover:shadow-md transition-shadow space-y-5"
              >
                {/* Top Bar: Property Snippet & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#5c4f4a]/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.propertyImage}
                      alt={req.propertyTitle}
                      className="w-14 h-14 rounded-xl object-cover border border-[#5c4f4a]/10 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c9996b]">
                        {req.location}
                      </span>
                      <h4 className="text-sm font-bold font-['Outfit'] text-[#3f3531] line-clamp-1">
                        {req.propertyTitle}
                      </h4>
                      <button
                        onClick={() => navigate({ name: 'property', id: req.propertyId })}
                        className="text-[11px] font-semibold text-[#5c766d] hover:underline flex items-center gap-0.5 mt-0.5"
                      >
                        View Listing <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        isPending
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {isPending && <Clock className="w-3.5 h-3.5" />}
                      {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isDeclined && <XCircle className="w-3.5 h-3.5" />}
                      {req.status}
                    </span>
                  </div>
                </div>

                {/* Tenant & Lease Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#ede9e6]/40 p-4 rounded-2xl border border-[#5c4f4a]/10">
                  {/* Tenant */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider">
                      Applicant Name
                    </span>
                    <p className="text-xs font-bold text-[#3f3531]">{req.userName}</p>
                    <p className="text-[11px] text-[#5c4f4a] flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#c9996b]" /> {req.userEmail}
                    </p>
                  </div>

                  {/* Phone / Contact */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider">
                      Direct Contact
                    </span>
                    <p className="text-xs font-bold text-[#3f3531] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#5c766d]" /> {req.userPhone}
                    </p>
                    <a
                      href={`https://wa.me/${req.userPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-emerald-700 hover:underline"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>

                  {/* Move-in & Duration */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider">
                      Proposed Lease
                    </span>
                    <p className="text-xs font-bold text-[#3f3531] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#c9996b]" />
                      From {req.moveInDate}
                    </p>
                    <p className="text-[11px] text-[#5c4f4a]">
                      {req.months} Months ({req.occupants} occupants)
                    </p>
                  </div>

                  {/* Estimated Contract Outlay */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider">
                      Total Estimated Value
                    </span>
                    <p className="text-sm font-black text-[#3f3531]">
                      {formatBDT(req.totalEstimated)}
                    </p>
                    <p className="text-[11px] text-[#5c766d] font-semibold">
                      ৳{req.monthlyRent.toLocaleString('en-IN')}/mo
                    </p>
                  </div>
                </div>

                {/* Tenant Statement Message */}
                {req.message && (
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-[#5c4f4a] flex items-start gap-2.5">
                    <MessageSquare className="w-4 h-4 text-[#c9996b] shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f3531]">
                        Applicant Statement:
                      </span>
                      <p className="italic">"{req.message}"</p>
                    </div>
                  </div>
                )}

                {/* Host Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-[#5c4f4a]/75">
                    Received: {new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(req.id, 'Declined')}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                        >
                          Decline Request
                        </button>
                        <button
                          onClick={() => updateBookingStatus(req.id, 'Approved')}
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#5c766d] hover:bg-[#485f57] text-white shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve Application
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <button
                        onClick={() => updateBookingStatus(req.id, 'Pending')}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-[#5c4f4a] bg-[#ede9e6] hover:bg-stone-200 transition-colors"
                      >
                        Reset to Pending
                      </button>
                    )}

                    {isDeclined && (
                      <button
                        onClick={() => updateBookingStatus(req.id, 'Pending')}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-[#5c4f4a] bg-[#ede9e6] hover:bg-stone-200 transition-colors"
                      >
                        Reopen Application
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
