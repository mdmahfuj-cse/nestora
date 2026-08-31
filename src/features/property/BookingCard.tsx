import React, { useState } from 'react';
import { Property, Host } from '../../types';
import { formatBDT } from '../../lib/utils';
import {
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Video,
  Info,
  Clock,
  Phone,
  CheckCircle2,
  Download,
  FileText
} from 'lucide-react';
import { BookingModal } from './BookingModal';
import { DirectMessageModal } from './DirectMessageModal';

interface BookingCardProps {
  property: Property;
  host: Host;
  onDownloadPdf?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ property, host, onDownloadPdf }) => {
  const [months, setMonths] = useState<number>(12);
  const [occupants, setOccupants] = useState<number>(2);
  const [moveInDate, setMoveInDate] = useState<string>(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [tourScheduled, setTourScheduled] = useState(false);

  const rentTotal = property.price * months;
  const serviceChargeMonthly = property.serviceCharge || 0;
  const serviceChargeTotal = serviceChargeMonthly * months;
  const securityDeposit = property.securityDeposit || property.price * 2;
  const grandTotal = rentTotal + serviceChargeTotal + securityDeposit;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#5c4f4a]/15 space-y-6 sticky top-24">
      {/* Price Header */}
      <div className="flex items-baseline justify-between border-b border-[#5c4f4a]/15 pb-4">
        <div>
          <span className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#3f3531]">
            {formatBDT(property.price)}
          </span>
          <span className="text-xs font-semibold text-[#5c4f4a]/75 ml-1">/ month</span>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" />
            {property.availability}
          </span>
        </div>
      </div>

      {/* Input Controls Panel */}
      <div className="rounded-2xl border border-[#5c4f4a]/20 overflow-hidden divide-y divide-[#5c4f4a]/15 bg-[#ede9e6]/40">
        {/* Move-in Date */}
        <div className="p-3">
          <label className="block text-[10px] font-bold text-[#5c4f4a] uppercase tracking-wider mb-1">
            Target Move-in Date
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#c9996b]" />
            <input
              type="date"
              value={moveInDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#3f3531] focus:outline-none w-full cursor-pointer"
            />
          </div>
        </div>

        {/* Lease Duration & Occupants */}
        <div className="grid grid-cols-2 divide-x divide-[#5c4f4a]/15">
          <div className="p-3">
            <label className="block text-[10px] font-bold text-[#5c4f4a] uppercase tracking-wider mb-1">
              Lease Duration
            </label>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-[#3f3531] focus:outline-none w-full cursor-pointer"
            >
              <option value={1}>1 Month (Flexible)</option>
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months (Standard)</option>
              <option value={24}>24 Months (Long Term)</option>
            </select>
          </div>

          <div className="p-3">
            <label className="block text-[10px] font-bold text-[#5c4f4a] uppercase tracking-wider mb-1">
              Occupants
            </label>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#3f3531]">
                {occupants} {occupants === 1 ? 'Person' : 'People'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setOccupants(Math.max(1, occupants - 1))}
                  className="w-5 h-5 rounded-md bg-white border border-stone-300 text-xs font-bold flex items-center justify-center hover:bg-stone-100"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setOccupants(Math.min(8, occupants + 1))}
                  className="w-5 h-5 rounded-md bg-white border border-stone-300 text-xs font-bold flex items-center justify-center hover:bg-stone-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2.5">
        <button
          id="booking-card-apply-btn"
          onClick={() => setIsBookingModalOpen(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#c9996b] hover:bg-[#b07e4f] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Apply for Rental</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setTourScheduled(true);
              setTimeout(() => setTourScheduled(false), 4000);
            }}
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              tourScheduled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white hover:bg-stone-50 text-[#3f3531] border-[#5c4f4a]/20'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#5c766d]" />
            <span>{tourScheduled ? 'Tour Booked!' : 'Schedule Tour'}</span>
          </button>

          <button
            onClick={() => setIsMessageModalOpen(true)}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531] flex items-center justify-center gap-1.5 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#c9996b]" />
            <span>Message Host</span>
          </button>
        </div>
      </div>

      {/* Transparent Cost Breakdown */}
      <div className="space-y-2 pt-2 border-t border-[#5c4f4a]/15 text-xs">
        <div className="flex justify-between text-[#5c4f4a]">
          <span className="underline decoration-dotted underline-offset-2">
            Monthly Rent ({formatBDT(property.price)} × {months} mos)
          </span>
          <span className="font-semibold text-[#3f3531]">{formatBDT(rentTotal)}</span>
        </div>

        {serviceChargeMonthly > 0 ? (
          <div className="flex justify-between text-[#5c4f4a]">
            <span className="underline decoration-dotted underline-offset-2">
              Building Service Charge ({formatBDT(serviceChargeMonthly)}/mo)
            </span>
            <span className="font-semibold text-[#3f3531]">{formatBDT(serviceChargeTotal)}</span>
          </div>
        ) : (
          <div className="flex justify-between text-[#5c4f4a]">
            <span>Building Service Charge</span>
            <span className="font-bold text-emerald-700">Included in Rent</span>
          </div>
        )}

        <div className="flex justify-between text-[#5c4f4a]">
          <span className="flex items-center gap-1">
            Refundable Security Deposit
            <span className="text-[10px] text-stone-400 font-normal">({(securityDeposit / property.price).toFixed(0)} mos)</span>
          </span>
          <span className="font-semibold text-[#3f3531]">{formatBDT(securityDeposit)}</span>
        </div>

        <div className="pt-3 border-t border-stone-200 flex justify-between font-bold text-sm text-[#3f3531]">
          <span>Total Lease Commitment</span>
          <span className="text-[#c9996b] font-black text-base">{formatBDT(grandTotal)}</span>
        </div>
      </div>

      {/* Trust & Guarantee Box */}
      <div className="bg-[#ede9e6] p-3.5 rounded-2xl border border-[#5c4f4a]/15 flex items-start gap-2.5 text-[11px] text-[#5c4f4a]">
        <ShieldCheck className="w-4 h-4 text-[#5c766d] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-[#3f3531]">Nestora Dhaka Rental Guarantee</p>
          <p className="text-[10px] text-[#5c4f4a]/80 mt-0.5">
            100% verified lease agreement, registered generator standby verification, and direct escrow deposit options.
          </p>
        </div>
      </div>

      {/* PDF Summary Report Download Button */}
      {onDownloadPdf && (
        <button
          id="booking-card-download-pdf-btn"
          type="button"
          onClick={onDownloadPdf}
          className="w-full py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-[#ede9e6] border border-[#5c4f4a]/20 text-[#3f3531] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-[#c9996b]" />
          <span>Download PDF Property Summary</span>
        </button>
      )}

      {/* Modals */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        property={property}
        moveInDate={moveInDate}
        months={months}
        occupants={occupants}
      />

      <DirectMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        property={property}
        host={host}
      />
    </div>
  );
};
