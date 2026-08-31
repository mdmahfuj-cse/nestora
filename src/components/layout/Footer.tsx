import React from 'react';
import { Building, ShieldCheck, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { useNavigationStore } from '../../stores/useNavigationStore';
import { useLanguageStore } from '../../stores/useLanguageStore';

export const Footer: React.FC = () => {
  const { navigate } = useNavigationStore();
  const { t } = useLanguageStore();

  return (
    <footer className="bg-[#5c4f4a] text-[#ede9e6] border-t border-[#5c4f4a]/30 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#ede9e6]/10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c9996b] flex items-center justify-center shadow-lg">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-['Outfit'] text-2xl font-black tracking-tight text-[#ede9e6]">
                NESTORA
              </span>
            </div>
            <p className="text-sm text-[#ede9e6]/75 max-w-sm leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="flex items-center gap-3 text-xs text-[#ede9e6]/60 pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#c9996b]" /> {t('footer_verified_badge')}
              </span>
              <span>•</span>
              <span>{t('footer_no_broker')}</span>
            </div>
          </div>

          <div>
            <h4 className="font-['Outfit'] text-sm font-bold tracking-wider text-[#c9996b] uppercase mb-4">
              {t('footer_dhaka_locations')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#ede9e6]/80">
              <li>
                <button
                  onClick={() => navigate({ name: 'search', params: { location: 'Gulshan' } })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  Gulshan 1 & 2 Penthouse
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'search', params: { location: 'Banani' } })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  Banani Road 11 Apartments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'search', params: { location: 'Dhanmondi' } })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  Dhanmondi Lakeside Flats
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'search', params: { location: 'Bashundhara' } })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  Bashundhara Modern Studios
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'search', params: { location: 'Baridhara' } })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  Baridhara Diplomatic Villas
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'search', params: { location: 'Uttara' } })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  Uttara Metro Corridor Flats
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-['Outfit'] text-sm font-bold tracking-wider text-[#c9996b] uppercase mb-4">
              {t('footer_dhaka_services')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#ede9e6]/80">
              <li>
                <button
                  onClick={() => navigate({ name: 'neighborhoods' })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  {t('nav_area_guides')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'compare' })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  {t('nav_compare')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'agreement' })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  {t('nav_lease_draft')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'wishlist' })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  {t('nav_wishlist')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ name: 'search' })}
                  className="hover:text-[#c9996b] transition-colors"
                >
                  100% Generator-Backed Homes
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-['Outfit'] text-sm font-bold tracking-wider text-[#c9996b] uppercase mb-4">
              {t('footer_for_landlords')}
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => navigate({ name: 'host-dashboard' })}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#c9996b] hover:bg-[#b07e4f] text-white text-xs font-bold transition-all shadow-md"
              >
                <span>{t('footer_host_dashboard_btn')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <div className="pt-2 text-xs text-[#ede9e6]/70 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#c9996b]" />
                  <span>+880 9612-NESTORA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#c9996b]" />
                  <span>support@nestora.bd</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#ede9e6]/50 gap-4">
          <p>{t('footer_copyright')}</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate({ name: 'home' })} className="hover:text-[#ede9e6]">{t('footer_privacy')}</button>
            <button onClick={() => navigate({ name: 'home' })} className="hover:text-[#ede9e6]">{t('footer_terms')}</button>
            <button onClick={() => navigate({ name: 'host-dashboard' })} className="hover:text-[#ede9e6]">{t('footer_landlord_guide')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
