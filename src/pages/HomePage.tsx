import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Building, MapPin } from 'lucide-react';
import { HeroSearchBar } from '../features/search/HeroSearchBar';
import { ThreeDRoomPreview } from '../components/shared/ThreeDRoomPreview';
import { PropertyCard } from '../components/shared/PropertyCard';
import { 
  PropertyTypesSection, 
  HowItWorksSection, 
  WhyNestoraSection, 
  FeaturedHostsSection, 
  FinalCTASection 
} from '../features/home/HomeSections';
import { mockProperties, mockPopularAreas } from '../data/mockData';
import { useNavigationStore } from '../stores/useNavigationStore';
import { useSearchStore } from '../stores/useSearchStore';
import { useLanguageStore } from '../stores/useLanguageStore';

export const HomePage: React.FC = () => {
  const { navigate } = useNavigationStore();
  const { setLocation } = useSearchStore();
  const { t, formatNumber } = useLanguageStore();

  const featuredProperties = mockProperties.filter((p) => p.isFeatured).slice(0, 6);
  const recommendedProperties = mockProperties.filter((p) => !p.isFeatured).slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* 1. Hero Section with 3D Spatial Room View */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#c9996b]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-[#5c766d]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c9996b]/20 border border-[#c9996b]/30 text-[#5c4f4a] text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#c9996b]" />
                <span>{t('hero_badge')}</span>
              </div>

              <h1 className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#3f3531] tracking-tight leading-[1.08]">
                {t('hero_title_1')} <br />
                <span className="text-[#c9996b] underline decoration-[#5c766d]/40 decoration-wavy">
                  {t('hero_title_2')}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#5c4f4a]/85 max-w-lg leading-relaxed">
                {t('hero_desc')}
              </p>

              {/* Quick Hero Highlights */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-bold text-[#5c4f4a]">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#5c4f4a]/15 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-[#5c766d]" />
                  <span>{t('hero_verified_landlords')}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-[#5c4f4a]/15 shadow-xs">
                  <Building className="w-4 h-4 text-[#c9996b]" />
                  <span>{t('hero_generator_gas')}</span>
                </div>
              </div>
            </motion.div>

            {/* Right 3D Spatial Room View */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-6 flex justify-center"
            >
              <ThreeDRoomPreview />
            </motion.div>
          </div>

          {/* Integrated Search Bar Pill underneath */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-12 sm:mt-16"
          >
            <HeroSearchBar />
          </motion.div>
        </div>
      </section>

      {/* 2. Popular Dhaka Neighborhoods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-[#c9996b] uppercase tracking-wider">
              {t('home_hotspots_tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-[#3f3531] mt-0.5">
              {t('home_hotspots_title')}
            </h2>
          </div>
          <button
            onClick={() => navigate({ name: 'search' })}
            className="text-xs font-bold text-[#5c766d] hover:text-[#3f3531] flex items-center gap-1"
          >
            {t('home_hotspots_explore')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {mockPopularAreas.map((area) => (
            <button
              key={area.name}
              onClick={() => {
                setLocation(area.name);
                navigate({ name: 'search', params: { location: area.name } });
              }}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] border border-[#5c4f4a]/15 shadow-sm hover:shadow-xl transition-all duration-300 text-left focus:outline-none"
            >
              <img
                src={area.image}
                alt={area.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="text-sm font-bold font-['Outfit'] group-hover:text-[#c9996b] transition-colors">
                  {area.name}
                </h3>
                <p className="text-[10px] text-stone-200">{formatNumber(area.count)} {t('home_available')}</p>
                <p className="text-[9px] text-[#ede9e6]/70 mt-0.5">{area.avgPrice}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Dhaka Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#c9996b] uppercase tracking-wider">
              {t('home_featured_tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-[#3f3531] mt-0.5">
              {t('home_featured_title')}
            </h2>
          </div>
          <button
            onClick={() => navigate({ name: 'search' })}
            className="text-xs font-bold text-[#c9996b] hover:text-[#5c4f4a] flex items-center gap-1"
          >
            {t('home_view_map')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* 4. Browse by Property Type */}
      <PropertyTypesSection />

      {/* 5. Recommended Rentals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#c9996b] uppercase tracking-wider">
              {t('home_recommended_tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-[#3f3531] mt-0.5">
              {t('home_recommended_title')}
            </h2>
          </div>
          <button
            onClick={() => navigate({ name: 'search' })}
            className="text-xs font-bold text-[#5c766d] hover:text-[#3f3531] flex items-center gap-1"
          >
            {t('home_see_all')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {recommendedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* 6. How It Works */}
      <HowItWorksSection />

      {/* 7. Why NESTORA */}
      <WhyNestoraSection />

      {/* 8. Featured Hosts */}
      <FeaturedHostsSection />

      {/* 9. Final CTA */}
      <FinalCTASection />
    </div>
  );
};
