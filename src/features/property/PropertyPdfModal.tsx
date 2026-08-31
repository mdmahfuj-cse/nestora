import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Download,
  Printer,
  X,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Zap,
  Flame,
  Calendar,
  Building,
  User,
  Check,
  Sparkles,
  Phone,
  Mail,
  Scale,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property, Host } from '../../types';
import { formatBDT } from '../../lib/utils';
import { generatePropertyPdf, PropertyPdfOptions } from '../../lib/propertyPdfGenerator';

interface PropertyPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  host: Host;
  landmarks: Array<{ name: string; type: string; distance: string }>;
}

export const PropertyPdfModal: React.FC<PropertyPdfModalProps> = ({
  isOpen,
  onClose,
  property,
  host,
  landmarks,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const [options, setOptions] = useState<PropertyPdfOptions>({
    includeLandlordInfo: true,
    includeRentalTerms: true,
    includeNeighborhood: true,
    includeAmenities: true,
    includeVerificationSeal: true,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsGenerating(true);
    try {
      const doc = generatePropertyPdf(property, host, landmarks, options);
      const sanitizedTitle = property.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      doc.save(`Nestora_${sanitizedTitle}_Summary_Report.pdf`);

      setDownloadSuccess(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#c9996b', '#5c4f4a', '#5c766d', '#3f3531'],
      });
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate property PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    try {
      const doc = generatePropertyPdf(property, host, landmarks, options);
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    } catch (err) {
      console.error('Failed to print PDF:', err);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#ede9e6] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#5c4f4a]/20 overflow-hidden my-auto flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="bg-[#3f3531] text-white p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#c9996b] text-white flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#c9996b] uppercase tracking-wider">
                    Official Tenancy Summary
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#5c766d]/40 text-emerald-300">
                    PDF Document
                  </span>
                </div>
                <h2 id="pdf-modal-title" className="text-lg sm:text-xl font-bold font-['Outfit'] text-white">
                  Download Property Summary Report
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close summary report dialog"
              className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* Property Quick Snapshot Card */}
            <div className="bg-white rounded-2xl p-4 border border-[#5c4f4a]/15 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full sm:w-28 h-24 object-cover rounded-xl border border-stone-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#c9996b]/20 text-[#3f3531] text-[10px] font-bold">
                    {property.propertyType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-[#5c4f4a] text-[10px] font-bold">
                    {property.area}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#3f3531] truncate">{property.title}</h3>
                <p className="text-xs text-[#5c4f4a]/75 truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#c9996b] shrink-0" />
                  {property.location}
                </p>
                <div className="flex items-center gap-3 text-xs font-bold text-[#3f3531] mt-2">
                  <span className="text-[#c9996b] font-black">{formatBDT(property.price)} / mo</span>
                  <span>•</span>
                  <span>{property.bedrooms} Beds</span>
                  <span>•</span>
                  <span>{property.areaSqFt} Sq Ft</span>
                </div>
              </div>
            </div>

            {/* Customization Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5c4f4a] block">
                Include Sections in PDF:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#5c4f4a]/15 cursor-pointer hover:border-[#c9996b] transition-all text-xs font-semibold text-[#3f3531]">
                  <input
                    type="checkbox"
                    checked={options.includeRentalTerms}
                    onChange={(e) => setOptions({ ...options, includeRentalTerms: e.target.checked })}
                    className="w-4 h-4 text-[#c9996b] rounded focus:ring-[#c9996b]"
                  />
                  <span>Rental Terms & Financials</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#5c4f4a]/15 cursor-pointer hover:border-[#c9996b] transition-all text-xs font-semibold text-[#3f3531]">
                  <input
                    type="checkbox"
                    checked={options.includeNeighborhood}
                    onChange={(e) => setOptions({ ...options, includeNeighborhood: e.target.checked })}
                    className="w-4 h-4 text-[#c9996b] rounded focus:ring-[#c9996b]"
                  />
                  <span>Neighborhood & Proximity Matrix</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#5c4f4a]/15 cursor-pointer hover:border-[#c9996b] transition-all text-xs font-semibold text-[#3f3531]">
                  <input
                    type="checkbox"
                    checked={options.includeAmenities}
                    onChange={(e) => setOptions({ ...options, includeAmenities: e.target.checked })}
                    className="w-4 h-4 text-[#c9996b] rounded focus:ring-[#c9996b]"
                  />
                  <span>Dhaka Utilities (Generator, Gas, Lifts)</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#5c4f4a]/15 cursor-pointer hover:border-[#c9996b] transition-all text-xs font-semibold text-[#3f3531]">
                  <input
                    type="checkbox"
                    checked={options.includeLandlordInfo}
                    onChange={(e) => setOptions({ ...options, includeLandlordInfo: e.target.checked })}
                    className="w-4 h-4 text-[#c9996b] rounded focus:ring-[#c9996b]"
                  />
                  <span>Landlord Details & Verification Seal</span>
                </label>
              </div>
            </div>

            {/* Document Highlights Checklist */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs text-[#5c4f4a] space-y-2">
              <span className="font-bold text-[#3f3531] block">Document Contents:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                <li className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Base rent, service charge & security deposit</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Termination notice & payment schedule</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified 100% standby generator details</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Key area landmarks with walk/drive times</span>
                </li>
              </ul>
            </div>

            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PDF successfully generated and saved to your device!</span>
              </motion.div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="bg-white p-4 sm:p-6 border-t border-[#5c4f4a]/15 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Print property report"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-[#5c4f4a] hover:bg-stone-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#5c766d]" aria-hidden="true" />
              <span>Print Preview</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold text-[#5c4f4a] hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isGenerating}
                aria-label="Download PDF Property Summary Report"
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{isGenerating ? 'Generating PDF...' : 'Download PDF Report'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
