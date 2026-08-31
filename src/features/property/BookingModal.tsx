import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Calendar, Users, ShieldCheck, Clock } from 'lucide-react';
import { Property } from '../../types';
import { useBookingStore } from '../../stores/useBookingStore';
import { formatBDT } from '../../lib/utils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  moveInDate: string;
  months: number;
  occupants: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  property,
  moveInDate,
  months,
  occupants,
}) => {
  const { addBookingRequest } = useBookingStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const rentTotal = property.price * months;
  const serviceChargeTotal = (property.serviceCharge || 0) * months;
  const securityDeposit = property.securityDeposit || property.price * 2;
  const grandTotal = rentTotal + serviceChargeTotal + securityDeposit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    addBookingRequest({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.images[0],
      location: property.location,
      monthlyRent: property.price,
      serviceCharge: property.serviceCharge || 0,
      moveInDate,
      months,
      occupants,
      totalEstimated: grandTotal,
      userName: name,
      userPhone: phone,
      userEmail: email,
      message,
    });

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="bg-[#ede9e6] rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl border border-[#5c4f4a]/20 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#5c4f4a]/15">
            <div>
              <span className="text-[11px] font-bold text-[#c9996b] uppercase tracking-wider">
                Dhaka Rental Application
              </span>
              <h3 className="text-xl font-black font-['Outfit'] text-[#3f3531]">
                {isSubmitted ? 'Application Submitted!' : 'Confirm Rental Booking'}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-stone-200 text-[#5c4f4a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Property Summary Strip */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-[#5c4f4a]/15">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#3f3531] truncate">
                    {property.title}
                  </h4>
                  <p className="text-[11px] text-[#5c4f4a]/75 mt-0.5">{property.location}</p>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-[#5c766d] mt-1">
                    <span>{formatBDT(property.price)}/mo</span>
                    <span>•</span>
                    <span>{months} {months === 1 ? 'Month' : 'Months'} Lease</span>
                  </div>
                </div>
              </div>

              {/* Price Calculation Review */}
              <div className="bg-white/80 p-4 rounded-2xl border border-[#5c4f4a]/15 space-y-2 text-xs">
                <div className="flex justify-between text-[#5c4f4a]">
                  <span>Monthly Rent ({formatBDT(property.price)} × {months} mos)</span>
                  <span className="font-semibold text-[#3f3531]">{formatBDT(rentTotal)}</span>
                </div>
                {property.serviceCharge ? (
                  <div className="flex justify-between text-[#5c4f4a]">
                    <span>Service Charge ({formatBDT(property.serviceCharge)} × {months} mos)</span>
                    <span className="font-semibold text-[#3f3531]">{formatBDT(serviceChargeTotal)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-[#5c4f4a]">
                  <span>Refundable Security Deposit</span>
                  <span className="font-semibold text-[#3f3531]">{formatBDT(securityDeposit)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-[#3f3531]">
                  <span>Total Estimated Outlay</span>
                  <span className="text-[#c9996b]">{formatBDT(grandTotal)}</span>
                </div>
              </div>

              {/* Applicant Form Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#3f3531] uppercase tracking-wider">
                  Tenant Contact Information
                </h4>

                <div>
                  <label className="block text-xs font-bold text-[#5c4f4a] mb-1.5">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asif Mahmud"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white px-4 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c4f4a] mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1712-000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white px-4 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c4f4a] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="asif.mahmud@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white px-4 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c4f4a] mb-1.5">
                    Message to Landlord / Host (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell the host about your profession, family size, or move-in requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white px-4 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex items-center gap-2 p-3 bg-[#5c766d]/10 rounded-xl text-[11px] text-[#5c766d] font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Zero advance booking commission. The landlord will review and contact you directly within 2 hours.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#5c4f4a]/15">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#5c4f4a] hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold shadow-md transition-all"
                >
                  Send Rental Request
                </button>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold font-['Outfit'] text-[#3f3531]">
                Your Request Was Dispatched!
              </h4>
              <p className="text-xs text-[#5c4f4a]/85 max-w-md mx-auto leading-relaxed">
                We have notified the host of <span className="font-bold text-[#3f3531]">{property.title}</span>. You can track all active applications in your Saved portal.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-full bg-[#5c4f4a] text-white text-xs font-bold hover:bg-[#3f3531] shadow-md transition-all"
                >
                  Back to Property
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
