import React from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  Home, 
  LayoutGrid, 
  Maximize, 
  Castle, 
  UserCheck, 
  ShieldCheck, 
  Map, 
  Zap, 
  ArrowRight, 
  Star, 
  Award, 
  Clock, 
  CheckCircle2,
  Sparkles,
  Crown,
  Hotel,
  GraduationCap,
  BedDouble
} from 'lucide-react';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { useSearchStore } from '../../stores/useSearchStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { mockHosts } from '../../data/mockData';
import { PropertyType } from '../../types';

export const PropertyTypesSection: React.FC = () => {
  const { navigate } = useNavigationStore();
  const { setPropertyType } = useSearchStore();
  const { t, formatNumber } = useLanguageStore();

  const types: { label: PropertyType; count: string; icon: React.ReactNode; desc: string; image: string }[] = [
    {
      label: 'Apartment',
      count: `${formatNumber(140)}+ ${t('nav_properties')}`,
      icon: <Building className="w-5 h-5 text-[#c9996b]" />,
      desc: '2BHK & 3BHK modern family flats with lift & standby generators',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Penthouse',
      count: `${formatNumber(25)}+ ${t('nav_properties')}`,
      icon: <Crown className="w-5 h-5 text-[#c9996b]" />,
      desc: 'Top-floor sky residences with panoramic views & private landscaped terraces',
      image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Service Apartment',
      count: `${formatNumber(32)}+ ${t('nav_properties')}`,
      icon: <Hotel className="w-5 h-5 text-[#c9996b]" />,
      desc: 'Fully serviced executive suites with daily housekeeping & concierge support',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Student Accommodation',
      count: `${formatNumber(45)}+ ${t('nav_properties')}`,
      icon: <GraduationCap className="w-5 h-5 text-[#c9996b]" />,
      desc: 'Campus-adjacent student housing with study desks & high-speed WiFi',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Serviced Room',
      count: `${formatNumber(55)}+ ${t('nav_properties')}`,
      icon: <BedDouble className="w-5 h-5 text-[#c9996b]" />,
      desc: 'Managed private en-suites with laundry, cleaning, and utilities included',
      image: 'https://images.unsplash.com/photo-1595526114136-1e649033878b?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Duplex',
      count: `${formatNumber(35)}+ ${t('nav_properties')}`,
      icon: <Castle className="w-5 h-5 text-[#c9996b]" />,
      desc: 'Multi-level penthouses with double height lounges & sky terraces',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Villa',
      count: `${formatNumber(18)}+ ${t('nav_properties')}`,
      icon: <Home className="w-5 h-5 text-[#c9996b]" />,
      desc: 'Stand-alone luxury residences with private lawns & diplomatic security',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'House',
      count: `${formatNumber(24)}+ ${t('nav_properties')}`,
      icon: <Maximize className="w-5 h-5 text-[#c9996b]" />,
      desc: 'Independent multi-storey townhomes and gated community residences',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Studio',
      count: `${formatNumber(48)}+ ${t('nav_properties')}`,
      icon: <LayoutGrid className="w-5 h-5 text-[#c9996b]" />,
      desc: 'Compact smart apartments near universities & corporate hubs',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Room',
      count: `${formatNumber(60)}+ ${t('nav_properties')}`,
      icon: <UserCheck className="w-5 h-5 text-[#c9996b]" />,
      desc: 'Furnished master bedrooms with attached baths in shared flats',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleSelectType = (type: PropertyType) => {
    setPropertyType(type);
    navigate({ name: 'search', params: { type } });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold text-[#c9996b] uppercase tracking-wider">
            Tailored Living Spaces
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-[#3f3531] mt-1">
            Browse Rentals by Property Type
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#5c4f4a]/75 max-w-md">
          From compact furnished studios for remote professionals to diplomatic lakeside duplexes in Gulshan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {types.map((tItem) => (
          <motion.div
            key={tItem.label}
            whileHover={{ y: -5 }}
            onClick={() => handleSelectType(tItem.label)}
            className="group relative rounded-3xl overflow-hidden bg-white border border-[#5c4f4a]/15 shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col"
          >
            <div className="relative h-44 w-full overflow-hidden bg-stone-100">
              <img
                src={tItem.image}
                alt={tItem.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-2 rounded-xl shadow-md">
                {tItem.icon}
              </div>
              <span className="absolute bottom-3 left-3 text-xs font-bold text-white bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                {tItem.count}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-['Outfit'] text-[#3f3531] group-hover:text-[#c9996b] transition-colors">
                  {tItem.label}
                </h3>
                <p className="text-xs text-[#5c4f4a]/80 mt-1.5 leading-relaxed">
                  {tItem.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#c9996b]">
                <span>Explore {tItem.label}s</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Interactive Map Discovery',
      desc: 'Filter by neighborhood, price threshold, gas pipeline, and standby generators across Dhaka on a high-precision live map.',
      icon: <Map className="w-6 h-6 text-[#ede9e6]" />,
    },
    {
      num: '02',
      title: '3D Spatial & Video Tours',
      desc: 'Inspect architectural floor plans, natural daylight angles, and room spatial depth without wasting hours in Dhaka traffic.',
      icon: <Zap className="w-6 h-6 text-[#ede9e6]" />,
    },
    {
      num: '03',
      title: 'Verified Direct Landlords',
      desc: 'Transparent pricing with itemized service charges, security deposits, and direct lease requests without hidden broker markups.',
      icon: <ShieldCheck className="w-6 h-6 text-[#ede9e6]" />,
    },
  ];

  return (
    <section className="bg-[#5c4f4a] text-[#ede9e6] py-16 sm:py-20 my-12 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12 border border-[#5c4f4a]/40 shadow-2xl relative overflow-hidden">
      {/* Background Accent Graphics */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#c9996b]/10 blur-3xl" />
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#5c766d]/20 blur-3xl" />

      <div className="max-w-5xl mx-auto text-center space-y-4 mb-14 relative z-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[#c9996b]">
          Streamlined Dhaka Renting
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-white">
          How NESTORA Simplifies Your Move
        </h2>
        <p className="text-sm text-[#ede9e6]/80 max-w-xl mx-auto leading-relaxed">
          Say goodbye to misleading newspaper ads, unreliable brokers, and unverified properties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-white/5 backdrop-blur-xs p-6 rounded-2xl border border-white/10 hover:border-[#c9996b]/50 transition-all space-y-4 text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#c9996b] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <span className="font-['Outfit'] text-3xl font-black text-[#ede9e6]/20 group-hover:text-[#c9996b]/50 transition-colors">
                {step.num}
              </span>
            </div>
            <h3 className="text-lg font-bold font-['Outfit'] text-white">
              {step.title}
            </h3>
            <p className="text-xs text-[#ede9e6]/75 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const WhyNestoraSection: React.FC = () => {
  const perks = [
    {
      title: 'Dedicated Dhaka Filter Stack',
      desc: 'Filter specifically for 100% full power generator backup, Titas gas supply, lift capacity, and basement parking.',
    },
    {
      title: 'Cinematic Visual Galleries',
      desc: 'Every home features multi-angle photography, high-resolution full-screen lightbox viewing, and verified spatial floor layouts.',
    },
    {
      title: 'Transparent Pricing Breakdown',
      desc: 'Dynamic live calculators that factor in monthly rent, building service charges, and security deposits upfront.',
    },
    {
      title: 'Direct Landlord & Host Connection',
      desc: 'Submit rental applications and corporate inquiry requests directly to certified property managers.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Image Collage */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#5c4f4a]/20 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
              alt="Premium Living Room"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3f3531]/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c9996b]">
                Excellence Standard
              </span>
              <h3 className="text-xl font-bold font-['Outfit'] mt-1">
                Curated exclusively for Dhaka’s high-growth neighborhoods.
              </h3>
            </div>
          </div>

          {/* Floating Trust Card */}
          <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-4 rounded-2xl shadow-xl border border-[#5c4f4a]/15 max-w-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#5c766d]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Identity & Ownership</span>
            </div>
            <p className="text-[11px] text-[#5c4f4a]/75">
              100% legal deed checks and background verified hosts before listing activation.
            </p>
          </div>
        </div>

        {/* Right Column: Perks */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-[#c9996b] uppercase tracking-wider">
              Why Home Seekers Prefer Us
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-[#3f3531] mt-1">
              Engineered for the Modern Bangladeshi Lifestyle
            </h2>
            <p className="text-xs sm:text-sm text-[#5c4f4a]/75 mt-2 leading-relaxed">
              We eliminated the chaos of traditional Dhaka house hunting by delivering a clean, map-synchronized platform with real-time availability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {perks.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-[#5c4f4a]/15 shadow-xs space-y-1.5"
              >
                <div className="w-2 h-2 rounded-full bg-[#c9996b]" />
                <h4 className="text-sm font-bold font-['Outfit'] text-[#3f3531]">
                  {p.title}
                </h4>
                <p className="text-[11px] text-[#5c4f4a]/75 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const FeaturedHostsSection: React.FC = () => {
  const { navigate } = useNavigationStore();
  const { formatNumber } = useLanguageStore();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-[#c9996b] uppercase tracking-wider">
            Certified Superhosts
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-[#3f3531] mt-1">
            Meet Our Top Rated Landlords
          </h2>
        </div>
        <button
          onClick={() => navigate({ name: 'host-dashboard' })}
          className="text-xs font-bold text-[#5c766d] hover:text-[#3f3531] flex items-center gap-1"
        >
          Become a Host <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockHosts.map((host) => (
          <div
            key={host.id}
            className="bg-white rounded-3xl p-5 border border-[#5c4f4a]/15 shadow-sm hover:shadow-lg transition-all space-y-4 text-center group"
          >
            <div className="relative w-20 h-20 mx-auto">
              <img
                src={host.photo}
                alt={host.name}
                className="w-full h-full rounded-full object-cover border-2 border-[#c9996b] group-hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#5c766d] text-white p-1 rounded-full shadow-xs" title="Verified Host">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="font-['Outfit'] font-bold text-base text-[#3f3531]">
                {host.name}
              </h3>
              <p className="text-[11px] text-[#5c4f4a]/75 mt-0.5 line-clamp-2">
                {host.bio}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-around text-xs text-[#5c4f4a]">
              <div>
                <div className="font-extrabold text-[#3f3531] flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 text-[#c9996b] fill-[#c9996b]" />
                  <span>{formatNumber(host.rating)}</span>
                </div>
                <span className="text-[10px] text-[#5c4f4a]/60 font-semibold">{formatNumber(host.reviewCount)} reviews</span>
              </div>
              <div className="h-6 w-px bg-stone-200" />
              <div>
                <div className="font-extrabold text-[#3f3531]">
                  {formatNumber(host.propertiesCount)}
                </div>
                <span className="text-[10px] text-[#5c4f4a]/60 font-semibold">Properties</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const FinalCTASection: React.FC = () => {
  const { navigate } = useNavigationStore();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#5c4f4a] via-[#3f3531] to-[#5c766d] p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#ede9e6]">
            <Sparkles className="w-3.5 h-3.5 text-[#c9996b]" />
            <span>Ready to Find Your Next Home?</span>
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Outfit'] tracking-tight leading-tight">
            Explore Dhaka’s Best Properties on the Live Interactive Map
          </h2>

          <p className="text-sm sm:text-base text-[#ede9e6]/80 leading-relaxed">
            Browse verified listings in Gulshan, Banani, Dhanmondi, and Uttara. Instant filter synchronization, transparent rent calculations, and zero broker hassle.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate({ name: 'search' })}
              className="px-8 py-3.5 rounded-2xl bg-[#c9996b] hover:bg-[#b07e4f] text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-[#c9996b]/30 transition-all hover:scale-105"
            >
              <Map className="w-4 h-4" />
              <span>Launch Discovery Map</span>
            </button>
            <button
              onClick={() => navigate({ name: 'host-dashboard' })}
              className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition-all"
            >
              <span>List Your Property</span>
            </button>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:block opacity-20 bg-[radial-gradient(#c9996b_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>
    </section>
  );
};
