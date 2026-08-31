import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Printer,
  Download,
  Building,
  User,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldAlert,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useHostStore } from '../stores/useHostStore';
import { formatBDT } from '../lib/utils';

interface TenancyAgreementPageProps {
  propertyId?: string;
}

export const TenancyAgreementPage: React.FC<TenancyAgreementPageProps> = ({ propertyId }) => {
  const { properties } = useHostStore();
  const { navigate } = useNavigationStore();

  const selectedProp = properties.find((p) => p.id === propertyId) || properties[0];

  // Agreement Form State
  const [landlordName, setLandlordName] = useState('Al-Haj Mohammad Rafiqul Islam');
  const [landlordNID, setLandlordNID] = useState('19842691234567890');
  const [landlordPhone, setLandlordPhone] = useState('+880 1711-234567');
  const [landlordAddress, setLandlordAddress] = useState('House 42, Road 11, Block D, Banani, Dhaka-1213');

  const [tenantName, setTenantName] = useState('Tanvir Ahmed Chowdhury');
  const [tenantNID, setTenantNID] = useState('19922699876543210');
  const [tenantPhone, setTenantPhone] = useState('+880 1819-876543');
  const [tenantOccupation, setTenantOccupation] = useState('Software Engineering Lead');
  const [tenantPermanentAddress, setTenantPermanentAddress] = useState('Village: Shantinagar, Post: Comilla Sadar, Dist: Comilla');

  const [propertyTitle, setPropertyTitle] = useState(selectedProp?.title || 'Luxury 3-Bed Apartment');
  const [propertyAddress, setPropertyAddress] = useState(
    selectedProp ? `${selectedProp.location}, ${selectedProp.area}, Dhaka` : 'Flat 4B, House 18, Road 7, Gulshan-2, Dhaka-1212'
  );
  const [monthlyRent, setMonthlyRent] = useState<number>(selectedProp?.price || 120000);
  const [serviceCharge, setServiceCharge] = useState<number>(selectedProp?.serviceCharge || 8500);
  const [securityDepositMonths, setSecurityDepositMonths] = useState<number>(2);
  const [leaseDurationMonths, setLeaseDurationMonths] = useState<number>(12);
  const [commencementDate, setCommencementDate] = useState('2026-09-01');
  const [paymentDueDay, setPaymentDueDay] = useState(7);
  const [noticePeriodMonths, setNoticePeriodMonths] = useState(2);

  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const securityDepositAmount = monthlyRent * securityDepositMonths;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (printRef.current) {
      navigator.clipboard.writeText(printRef.current.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#ede9e6] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#5c4f4a]/15">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5c4f4a] text-[#ede9e6] text-[10px] font-black uppercase tracking-wider">
                Legal Document Suite
              </span>
              <span className="text-xs font-bold text-[#c9996b] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Bangladesh Standard Tenancy Agreement
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-['Outfit'] text-[#3f3531] tracking-tight">
              Residential Tenancy Agreement (ভাড়া চুক্তিপত্র)
            </h1>
            <p className="text-xs sm:text-sm text-[#5c4f4a]/80">
              Compliant with the Premises Rent Control Act, 1991 of Bangladesh. Ready for preview, signature, and printing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyText}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-[#5c4f4a]/20 text-[#3f3531] text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#5c4f4a]" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Agreement</span>
            </button>
          </div>
        </div>

        {/* Two-Column Editor & Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields Configurator (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#5c4f4a]/15 shadow-sm space-y-6">
            <h3 className="text-base font-bold font-['Outfit'] text-[#3f3531] pb-3 border-b border-stone-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#c9996b]" />
              Agreement Parameters
            </h3>

            {/* Select Property Preset */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5c4f4a]">Load Property Listing Preset</label>
              <select
                value={selectedProp?.id}
                onChange={(e) => {
                  const p = properties.find((item) => item.id === e.target.value);
                  if (p) {
                    setPropertyTitle(p.title);
                    setPropertyAddress(`${p.location}, ${p.area}, Dhaka`);
                    setMonthlyRent(p.price);
                    setServiceCharge(p.serviceCharge || 7000);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#5c4f4a]/20 text-xs font-medium text-[#3f3531] bg-white focus:ring-2 focus:ring-[#c9996b] focus:outline-none"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.area} - {formatBDT(p.price)}/mo)
                  </option>
                ))}
              </select>
            </div>

            {/* Financial Terms */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold text-[#c9996b] uppercase tracking-wider block">
                Financial Breakdown
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#5c4f4a]">Monthly Rent (৳ BDT)</label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#5c4f4a]">Service Charge (৳)</label>
                  <input
                    type="number"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#5c4f4a]">Security Deposit</label>
                  <select
                    value={securityDepositMonths}
                    onChange={(e) => setSecurityDepositMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs font-medium text-[#3f3531]"
                  >
                    <option value={1}>1 Month (৳{formatBDT(monthlyRent)})</option>
                    <option value={2}>2 Months (৳{formatBDT(monthlyRent * 2)})</option>
                    <option value={3}>3 Months (৳{formatBDT(monthlyRent * 3)})</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#5c4f4a]">Rent Due Date</label>
                  <select
                    value={paymentDueDay}
                    onChange={(e) => setPaymentDueDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs font-medium text-[#3f3531]"
                  >
                    <option value={5}>By 5th of Month</option>
                    <option value={7}>By 7th of Month</option>
                    <option value={10}>By 10th of Month</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Landlord Information */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-[#5c4f4a]/80 uppercase tracking-wider block">
                First Party (Landlord / বাড়িওয়ালা)
              </span>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Landlord Full Name"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="National ID (NID)"
                    value={landlordNID}
                    onChange={(e) => setLandlordNID(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531]"
                  />
                  <input
                    type="text"
                    placeholder="Contact Phone"
                    value={landlordPhone}
                    onChange={(e) => setLandlordPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531]"
                  />
                </div>
              </div>
            </div>

            {/* Tenant Information */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-[#5c4f4a]/80 uppercase tracking-wider block">
                Second Party (Tenant / ভাড়াটিয়া)
              </span>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Tenant Full Name"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="National ID (NID)"
                    value={tenantNID}
                    onChange={(e) => setTenantNID(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531]"
                  />
                  <input
                    type="text"
                    placeholder="Contact Phone"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Occupation"
                  value={tenantOccupation}
                  onChange={(e) => setTenantOccupation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs text-[#3f3531]"
                />
              </div>
            </div>

            {/* Lease Duration & Notice */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#5c4f4a]">Lease Term (Months)</label>
                  <input
                    type="number"
                    value={leaseDurationMonths}
                    onChange={(e) => setLeaseDurationMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#5c4f4a]">Notice Period (Months)</label>
                  <input
                    type="number"
                    value={noticePeriodMonths}
                    onChange={(e) => setNoticePeriodMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#5c4f4a]/20 text-xs font-bold text-[#3f3531]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Resolution Agreement Preview Paper (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              ref={printRef}
              className="bg-white p-8 sm:p-12 rounded-3xl border border-[#5c4f4a]/20 shadow-xl space-y-8 font-serif text-[#1c1917] leading-relaxed text-sm"
              id="printable-tenancy-agreement"
            >
              {/* Document Header */}
              <div className="text-center space-y-2 pb-6 border-b-2 border-[#1c1917]">
                <div className="text-xs font-bold uppercase tracking-widest text-[#5c4f4a]">
                  Government of the People’s Republic of Bangladesh
                </div>
                <h2 className="text-2xl font-black font-['Outfit'] tracking-tight">
                  RESIDENTIAL HOUSE RENT AGREEMENT
                </h2>
                <p className="text-xs italic text-[#5c4f4a]">
                  (বাড়ি ভাড়া চুক্তিপত্র — Under the Premises Rent Control Act, 1991)
                </p>
              </div>

              {/* Parties Intro */}
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <strong className="block text-xs uppercase tracking-wider text-[#5c4f4a]">
                    1. First Party (Landlord / মালিক):
                  </strong>
                  <p className="mt-1">
                    <strong>{landlordName}</strong>, NID No: {landlordNID}, Phone: {landlordPhone}, Resident of: {landlordAddress}. (Hereinafter referred to as the <em>"FIRST PARTY / LESSOR"</em>).
                  </p>
                </div>

                <div>
                  <strong className="block text-xs uppercase tracking-wider text-[#5c4f4a]">
                    2. Second Party (Tenant / ভাড়াটিয়া):
                  </strong>
                  <p className="mt-1">
                    <strong>{tenantName}</strong>, NID No: {tenantNID}, Phone: {tenantPhone}, Occupation: {tenantOccupation}, Permanent Address: {tenantPermanentAddress}. (Hereinafter referred to as the <em>"SECOND PARTY / LESSEE"</em>).
                  </p>
                </div>
              </div>

              {/* Premises Description */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <span className="font-bold uppercase tracking-wider text-[#3f3531]">
                  Description of Demised Premises:
                </span>
                <p>
                  <strong>{propertyTitle}</strong>, situated at {propertyAddress}. The premises is rented solely for peaceful residential dwelling of the Second Party and their immediate family members.
                </p>
              </div>

              {/* Core Clauses */}
              <div className="space-y-3 text-xs sm:text-sm">
                <h4 className="font-bold text-xs uppercase tracking-wider border-b pb-1">
                  Terms & Agreed Conditions:
                </h4>

                <ol className="list-decimal pl-5 space-y-2.5 text-xs text-[#292524]">
                  <li>
                    <strong>Monthly Rent & Service Charge:</strong> The monthly rent is fixed at{' '}
                    <strong>{formatBDT(monthlyRent)}</strong> (Bangladeshi Taka) plus building service charge of{' '}
                    <strong>{formatBDT(serviceCharge)}</strong> per month. The total monthly payment of{' '}
                    <strong>{formatBDT(monthlyRent + serviceCharge)}</strong> shall be paid by the Second Party within the <strong>{paymentDueDay}th day</strong> of each Gregorian calendar month via Bank Transfer / Cheque.
                  </li>

                  <li>
                    <strong>Advance Security Deposit:</strong> The Second Party has deposited an amount of{' '}
                    <strong>{formatBDT(securityDepositAmount)}</strong> (equivalent to {securityDepositMonths} months' rent) as an interest-free refundable security deposit. This amount will be refunded upon vacating the premises after adjusting any pending utility bills or property damages.
                  </li>

                  <li>
                    <strong>Duration & Tenancy Period:</strong> This agreement is effective from{' '}
                    <strong>{commencementDate}</strong> for an initial duration of{' '}
                    <strong>{leaseDurationMonths} Months</strong>, renewable upon mutual written consent.
                  </li>

                  <li>
                    <strong>Utilities & Standby Generator:</strong> The Second Party shall pay for their own electricity bill (DESCO/DPDC prepaid meter card) and designated share of common services. Standby generator fuel and lift servicing are included within the monthly service charge.
                  </li>

                  <li>
                    <strong>Notice Period for Vacation:</strong> Either party may terminate this agreement by providing{' '}
                    <strong>{noticePeriodMonths} (Two) Months’ advance written notice</strong> to the other party.
                  </li>

                  <li>
                    <strong>Care of Premises:</strong> The Second Party shall maintain the premises in a clean and habitable condition, and shall not carry out any structural alterations without prior written consent from the First Party.
                  </li>
                </ol>
              </div>

              {/* Signatures & Execution Section */}
              <div className="pt-8 space-y-8 border-t border-stone-200">
                <p className="text-[11px] text-stone-500 italic text-center">
                  IN WITNESS WHEREOF, the parties hereto have set their hands and signed this Agreement on this day.
                </p>

                <div className="grid grid-cols-2 gap-12 pt-6">
                  <div className="text-center space-y-1">
                    <div className="border-t border-black pt-2 font-bold text-xs">
                      Signature of First Party (Landlord)
                    </div>
                    <div className="text-[11px] text-stone-600">{landlordName}</div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="border-t border-black pt-2 font-bold text-xs">
                      Signature of Second Party (Tenant)
                    </div>
                    <div className="text-[11px] text-stone-600">{tenantName}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 pt-6 text-[11px] text-stone-600">
                  <div>
                    <span className="font-bold block text-black">Witness 1:</span>
                    <p className="border-b border-stone-300 py-1">Name: ______________________</p>
                    <p className="border-b border-stone-300 py-1">NID: _______________________</p>
                  </div>
                  <div>
                    <span className="font-bold block text-black">Witness 2:</span>
                    <p className="border-b border-stone-300 py-1">Name: ______________________</p>
                    <p className="border-b border-stone-300 py-1">NID: _______________________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
