import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Building,
  TrendingUp,
  ShieldCheck,
  Zap,
  Flame,
  Train,
  GraduationCap,
  Utensils,
  Search,
  ArrowRight,
  Sparkles,
  Heart,
  CheckCircle2
} from 'lucide-react';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useHostStore } from '../stores/useHostStore';
import { useSearchStore } from '../stores/useSearchStore';
import { formatBDT } from '../lib/utils';

interface NeighborhoodData {
  id: string;
  name: string;
  tagline: string;
  heroImage: string;
  avgRentRange: string;
  vibe: string;
  highlights: string[];
  metroAccess: string;
  securityRating: string;
  powerReliability: string;
  diningAndLifestyle: string[];
  schoolsAndHospitals: string[];
}

const DHAKA_NEIGHBORHOODS: NeighborhoodData[] = [
  {
    id: 'Gulshan-2',
    name: 'Gulshan-2 & Diplomatic Zone',
    tagline: 'Dhaka’s premier diplomatic, corporate, and high-security enclave',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    avgRentRange: '৳140,000 – ৳300,000 / mo',
    vibe: 'Cosmopolitan, tranquil, diplomatic security, elite living',
    highlights: [
      'Gulshan Lake Park & Walking Tracks',
      'Unimart, Chef’s Table Courtside & The Westin',
      'American Club & European Embassies',
      '100% Standby Heavy Generator backup standard',
    ],
    metroAccess: '10 mins to Mohakhali / Tejgaon Expressways',
    securityRating: '99% (CCTV, Police Checkpoints & Armed Compound Guards)',
    powerReliability: '100% Dedicated Auto-Generator Backup & Continuous Titas Gas',
    diningAndLifestyle: ['The Westin Dhaka', 'Izumi Japanese', 'Chef’s Table', 'Gloria Jean’s', 'Gulshan Lake Park'],
    schoolsAndHospitals: ['American Standard School', 'Scholastica Senior', 'United Hospital Gulshan', 'Praava Health'],
  },
  {
    id: 'Banani',
    name: 'Banani (Blocks C, D, E & F)',
    tagline: 'Vibrant urban center for young professionals, tech founders, and food connoisseurs',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    avgRentRange: '৳85,000 – ৳180,000 / mo',
    vibe: 'Energetic, culinary hub, stylish duplexes, walkable blocks',
    highlights: [
      'Banani Road 11 Dining & Fashion Strip',
      'Kemal Ataturk Avenue Business District',
      'Modern High-Rise Duplexes & Rooftop Terraces',
      'High-speed optical fiber connectivity',
    ],
    metroAccess: '5 mins to Banani Railway Station & Airport Highway',
    securityRating: '95% (Active Society Patrol & Guarded Gates)',
    powerReliability: 'Building Generators Standard with High-Speed Passenger Lifts',
    diningAndLifestyle: ['Road 11 Cafe District', 'Baton Rouge', 'Coffee World', 'Herfy Banani', 'Banani Club'],
    schoolsAndHospitals: ['South Breeze School', 'Canadian International', 'Evercare Consultation', 'Apollo Clinic'],
  },
  {
    id: 'Dhanmondi',
    name: 'Dhanmondi (R/A & Lake Area)',
    tagline: 'Dhaka’s historic cultural and educational hub with picturesque lakefronts',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    avgRentRange: '৳60,000 – ৳135,000 / mo',
    vibe: 'Lush greenery, family-centric, lake walkways, cultural arts',
    highlights: [
      'Dhanmondi Lake & Rabindra Sarobar Cultural Stage',
      'Top English-medium schools (Mastermind, Sunnydale)',
      'Medical district with specialized diagnostic centers',
      'Spacious traditional family floor layouts',
    ],
    metroAccess: 'Close to Farmgate & Karwan Bazar Metro Stations',
    securityRating: '92% (Dhanmondi Society Patrol & Intercom Buildings)',
    powerReliability: 'Standard Standby Generator Backup & Titas Gas Pipelines',
    diningAndLifestyle: ['Rabindra Sarobar', 'Satmasjid Road Restaurants', 'Drik Gallery', 'Shimanto Square'],
    schoolsAndHospitals: ['Mastermind School', 'Sunnydale', 'Labaid Specialized Hospital', 'Ibn Sina Hospital'],
  },
  {
    id: 'Bashundhara R/A',
    name: 'Bashundhara Residential Area',
    tagline: 'Planned modern township with wide avenues, universities, and Evercare Hospital',
    heroImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    avgRentRange: '৳45,000 – ৳95,000 / mo',
    vibe: 'Spacious, clean, suburban calm, educational campus zone',
    highlights: [
      'Jamuna Future Park (South Asia’s largest mall)',
      'Evercare Hospital & Independent University (IUB)',
      'Wide multi-lane paved roads & underground utilities',
      'Modern newly constructed apartment complexes',
    ],
    metroAccess: 'Direct access to Kuril Flyover & 300 Feet Express Highway',
    securityRating: '97% (Bashundhara Security Gates & Vehicle Scanners)',
    powerReliability: 'Private Substation Grid with Building Backup Systems',
    diningAndLifestyle: ['Jamuna Future Park', '300ft Food Strip', 'North End Coffee Roasters', 'Meena Bazaar'],
    schoolsAndHospitals: ['Evercare Hospital Dhaka', 'North South University', 'IUB', 'International School Dhaka (ISD)'],
  },
  {
    id: 'Baridhara Diplomatic Zone',
    name: 'Baridhara Diplomatic Zone',
    tagline: 'Ultra-exclusive, peaceful diplomatic enclave with gated access',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    avgRentRange: '৳180,000 – ৳450,000 / mo',
    vibe: 'Ultra-quiet, zero commercial traffic, high international security',
    highlights: [
      'Baridhara Lake Park & Jogging Promenade',
      'Exclusive Embassy Residencies & High Commissions',
      'Spacious 3,000+ sq ft luxury single-floor units',
      'Strict guarded checkpoint entry gates',
    ],
    metroAccess: 'Immediate link to Pragati Sarani & Diplomatic Corridors',
    securityRating: '100% (Diplomatic Security Division & Military Patrols)',
    powerReliability: '100% Commercial Grade Generators + Multi-stage Water Filtration',
    diningAndLifestyle: ['Baridhara Lake Park', 'Baridhara Club', 'Diplomatic Enclave Cafes'],
    schoolsAndHospitals: ['American International School Dhaka (AISD)', 'United Hospital', 'Diplomatic Clinics'],
  },
  {
    id: 'Uttara Sector 3/4',
    name: 'Uttara Model Town (Sectors 1–14)',
    tagline: 'Rapid transit-connected planned modern city next to Dhaka International Airport',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    avgRentRange: '৳40,000 – ৳90,000 / mo',
    vibe: 'Connected, transit-oriented, community parks, sector planning',
    highlights: [
      'Dhaka Metro Rail (MRT Line 6) Stations at Sectors 3, 11, 14',
      '10 minutes to Hazrat Shahjalal International Airport',
      'Lush sector parks and community playgrounds in every sector',
      'Affordable luxury rentals with modern elevators',
    ],
    metroAccess: 'Direct MRT Line 6 Metro Stations (15 mins to Farmgate/Motijheel)',
    securityRating: '90% (Sector Welfare Associations & Guarded Checkpoints)',
    powerReliability: 'High-density standby generators and Titas gas connections',
    diningAndLifestyle: ['Uttara Club', 'Sector 3 Jashimuddin Road Eateries', 'North Tower Mall', 'Zamzam Tower'],
    schoolsAndHospitals: ['Scholastica Uttara', 'Uttara Crescent Hospital', 'Kuwait Bangladesh Friendship Hospital'],
  },
];

export const NeighborhoodGuidePage: React.FC = () => {
  const { navigate } = useNavigationStore();
  const { properties } = useHostStore();
  const { setLocation } = useSearchStore();
  const [selectedAreaId, setSelectedAreaId] = useState<string>('Gulshan-2');

  const activeNeighborhood =
    DHAKA_NEIGHBORHOODS.find((n) => n.id === selectedAreaId) ||
    DHAKA_NEIGHBORHOODS[0];

  const matchingPropertiesCount = properties.filter((p) =>
    p.area.toLowerCase().includes(activeNeighborhood.id.toLowerCase().split(' ')[0])
  ).length;

  const handleExploreRentals = (areaName: string) => {
    setLocation(areaName);
    navigate({ name: 'search', params: { location: areaName } });
  };

  return (
    <div className="min-h-screen bg-[#ede9e6] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Banner */}
        <div className="space-y-2 pb-6 border-b border-[#5c4f4a]/15">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#5c4f4a] text-[#ede9e6] text-[10px] font-black uppercase tracking-wider">
              Dhaka Living Guide
            </span>
            <span className="text-xs font-bold text-[#c9996b] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Neighborhood Intelligence Hub
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-[#3f3531] tracking-tight">
            Dhaka Neighborhood Guide
          </h1>
          <p className="text-xs sm:text-sm text-[#5c4f4a]/80 max-w-2xl">
            Compare rental yields, metro rail connectivity, standby generator infrastructure, and lifestyle amenities across Dhaka's premier residential sectors.
          </p>
        </div>

        {/* Neighborhood Selector Strip */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {DHAKA_NEIGHBORHOODS.map((hood) => (
            <button
              key={hood.id}
              onClick={() => setSelectedAreaId(hood.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                selectedAreaId === hood.id
                  ? 'bg-[#5c4f4a] text-white shadow-md scale-100'
                  : 'bg-white text-[#5c4f4a] border border-[#5c4f4a]/15 hover:border-[#c9996b]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#c9996b]" />
              <span>{hood.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Neighborhood Deep Dive Showcase */}
        <motion.div
          key={activeNeighborhood.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border border-[#5c4f4a]/20 shadow-lg overflow-hidden space-y-8"
        >
          {/* Hero Banner with Overlay */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
            <img
              src={activeNeighborhood.heroImage}
              alt={activeNeighborhood.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-[#c9996b] text-white text-xs font-bold uppercase tracking-wider">
                  {activeNeighborhood.vibe}
                </span>
                <span className="px-3 py-1 rounded-md bg-white/20 backdrop-blur-md text-white text-xs font-bold">
                  {activeNeighborhood.avgRentRange}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-['Outfit']">
                {activeNeighborhood.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 max-w-xl">
                {activeNeighborhood.tagline}
              </p>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Average Rent */}
            <div className="bg-[#ede9e6]/50 p-5 rounded-2xl border border-[#5c4f4a]/10 space-y-1">
              <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#c9996b]" />
                Average Monthly Rent
              </span>
              <p className="text-base font-black text-[#3f3531]">
                {activeNeighborhood.avgRentRange}
              </p>
            </div>

            {/* Metro & Commute */}
            <div className="bg-[#ede9e6]/50 p-5 rounded-2xl border border-[#5c4f4a]/10 space-y-1">
              <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider flex items-center gap-1">
                <Train className="w-3.5 h-3.5 text-[#5c766d]" />
                Commute & Metro
              </span>
              <p className="text-xs font-bold text-[#3f3531] leading-tight">
                {activeNeighborhood.metroAccess}
              </p>
            </div>

            {/* Safety & Security */}
            <div className="bg-[#ede9e6]/50 p-5 rounded-2xl border border-[#5c4f4a]/10 space-y-1">
              <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Security Assessment
              </span>
              <p className="text-xs font-bold text-[#3f3531] leading-tight">
                {activeNeighborhood.securityRating}
              </p>
            </div>

            {/* Generator & Utilities */}
            <div className="bg-[#ede9e6]/50 p-5 rounded-2xl border border-[#5c4f4a]/10 space-y-1">
              <span className="text-[10px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                Power & Utility Standby
              </span>
              <p className="text-xs font-bold text-[#3f3531] leading-tight">
                {activeNeighborhood.powerReliability}
              </p>
            </div>
          </div>

          {/* Two-Column Deep Breakdown */}
          <div className="px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Neighborhood Highlights & Lifestyle */}
            <div className="space-y-4">
              <h3 className="text-base font-bold font-['Outfit'] text-[#3f3531] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c9996b]" />
                Key Highlights & Living Perks
              </h3>
              <ul className="space-y-2.5">
                {activeNeighborhood.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#5c4f4a] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#5c766d] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#5c4f4a]/75 uppercase tracking-wider block mb-2">
                  Top Dining & Lifestyle Spots:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeNeighborhood.diningAndLifestyle.map((spot, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#ede9e6] text-[#3f3531] text-[11px] font-semibold flex items-center gap-1"
                    >
                      <Utensils className="w-3 h-3 text-[#c9996b]" />
                      {spot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Schools & Hospitals & Direct Search Action */}
            <div className="space-y-4 bg-[#ede9e6]/30 p-6 rounded-3xl border border-[#5c4f4a]/10 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-base font-bold font-['Outfit'] text-[#3f3531] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#5c766d]" />
                  Renowned Schools & Medical Facilities
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeNeighborhood.schoolsAndHospitals.map((item, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white text-[#3f3531] text-[11px] font-semibold shadow-xs border border-[#5c4f4a]/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#5c4f4a]/15 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#3f3531]">
                    Available Nestora Listings:
                  </span>
                  <span className="font-extrabold text-[#c9996b]">
                    {matchingPropertiesCount} Verified Properties
                  </span>
                </div>

                <button
                  onClick={() => handleExploreRentals(activeNeighborhood.id)}
                  className="w-full py-3.5 rounded-2xl bg-[#5c4f4a] hover:bg-[#3f3531] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  Explore All {activeNeighborhood.name} Rentals
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6"></div>
        </motion.div>
      </div>
    </div>
  );
};
