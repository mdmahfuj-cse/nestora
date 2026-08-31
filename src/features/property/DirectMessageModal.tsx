import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Phone, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { Property, Host } from '../../types';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  host: Host;
}

export const DirectMessageModal: React.FC<DirectMessageModalProps> = ({
  isOpen,
  onClose,
  property,
  host,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [message, setMessage] = useState(
    `Hello ${host.name}, I am interested in renting your property "${property.title}" in ${property.area}. Could we arrange a viewing?`
  );
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !message) return;
    setIsSent(true);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(
      `Hello ${host.name}! I found your rental "${property.title}" on Nestora Dhaka. Is it currently available for viewing?`
    );
    window.open(`https://wa.me/${host.phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="bg-[#ede9e6] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-[#5c4f4a]/20"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#5c4f4a]/15">
            <div className="flex items-center gap-3">
              <img
                src={host.photo}
                alt={host.name}
                className="w-10 h-10 rounded-full object-cover border border-[#5c4f4a]/20"
              />
              <div>
                <h3 className="text-base font-bold font-['Outfit'] text-[#3f3531]">
                  Contact {host.name}
                </h3>
                <p className="text-[11px] text-[#5c766d] font-medium">
                  {host.responseTime} response time • {host.responseRate} rate
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSent(false);
                onClose();
              }}
              className="p-2 rounded-full hover:bg-stone-200 text-[#5c4f4a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSent ? (
            <div className="mt-5 space-y-5">
              {/* Quick WhatsApp Action */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Instant WhatsApp Chat</span>
                </div>
                <button
                  onClick={handleWhatsApp}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-xs transition-colors"
                >
                  Open WhatsApp
                </button>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#5c4f4a]/15"></div>
                <span className="flex-shrink mx-3 text-[11px] text-[#5c4f4a]/60 font-semibold uppercase tracking-wider">
                  or send in-app message
                </span>
                <div className="flex-grow border-t border-[#5c4f4a]/15"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c4f4a] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c4f4a] mb-1">
                    Your Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 1..."
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c4f4a] mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white p-3 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531] focus:ring-2 focus:ring-[#c9996b] focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#5c4f4a] hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#5c4f4a] hover:bg-[#3f3531] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold font-['Outfit'] text-[#3f3531]">
                Message Delivered to {host.name}
              </h4>
              <p className="text-xs text-[#5c4f4a]/80 max-w-sm mx-auto">
                {host.name} typically responds within {host.responseTime.toLowerCase()}. You will receive a direct notification.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => {
                    setIsSent(false);
                    onClose();
                  }}
                  className="px-6 py-2 rounded-full bg-[#c9996b] text-white text-xs font-bold hover:bg-[#b07e4f]"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
