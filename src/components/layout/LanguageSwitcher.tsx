import React from 'react';
import { motion } from 'motion/react';
import { Globe, Check } from 'lucide-react';
import { useLanguageStore } from '../../stores/useLanguageStore';

interface LanguageSwitcherProps {
  variant?: 'navbar' | 'mobile' | 'pill';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { language, setLanguage, toggleLanguage } = useLanguageStore();

  if (variant === 'mobile') {
    return (
      <div
        id="mobile-language-switcher"
        className={`flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-[#5c4f4a]/15 shadow-xs ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#c9996b]/20 flex items-center justify-center text-[#5c4f4a]">
            <Globe className="w-4 h-4 text-[#c9996b]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#3f3531]">
              Language / ভাষা
            </div>
            <div className="text-[10px] text-[#5c4f4a]/75">
              {language === 'bn' ? 'বাংলা নির্বাচিত' : 'English Selected'}
            </div>
          </div>
        </div>

        <div className="flex items-center p-1 bg-[#ede9e6] rounded-xl border border-[#5c4f4a]/15">
          <button
            type="button"
            id="mobile-lang-en-btn"
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-[#5c4f4a] text-white shadow-xs'
                : 'text-[#5c4f4a] hover:text-[#3f3531]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            id="mobile-lang-bn-btn"
            onClick={() => setLanguage('bn')}
            aria-pressed={language === 'bn'}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all font-['Noto_Sans_Bengali',sans-serif] ${
              language === 'bn'
                ? 'bg-[#c9996b] text-white shadow-xs'
                : 'text-[#5c4f4a] hover:text-[#3f3531]'
            }`}
          >
            বাংলা
          </button>
        </div>
      </div>
    );
  }

  // Desktop Navbar Segmented Pill Switcher
  return (
    <div
      id="header-language-toggle"
      role="group"
      aria-label="Language selection toggle"
      className={`inline-flex items-center p-1 rounded-full bg-white/80 backdrop-blur-xs border border-[#5c4f4a]/15 shadow-xs transition-all hover:border-[#c9996b]/50 ${className}`}
    >
      <div className="pl-1.5 pr-1 text-[#5c4f4a]/70 flex items-center" title="Toggle English / বাংলা">
        <Globe className="w-3.5 h-3.5 text-[#c9996b]" aria-hidden="true" />
      </div>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          id="nav-lang-en-btn"
          onClick={() => setLanguage('en')}
          aria-pressed={language === 'en'}
          aria-label="Switch to English language"
          className={`relative px-2.5 py-1 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer ${
            language === 'en'
              ? 'text-white shadow-xs'
              : 'text-[#5c4f4a] hover:text-[#3f3531]'
          }`}
        >
          {language === 'en' && (
            <motion.div
              layoutId="active-lang-pill"
              className="absolute inset-0 bg-[#5c4f4a] rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">EN</span>
        </button>

        <button
          type="button"
          id="nav-lang-bn-btn"
          onClick={() => setLanguage('bn')}
          aria-pressed={language === 'bn'}
          aria-label="বাংলা ভাষায় পরিবর্তন করুন"
          className={`relative px-2.5 py-1 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer font-['Noto_Sans_Bengali',sans-serif] ${
            language === 'bn'
              ? 'text-white shadow-xs'
              : 'text-[#5c4f4a] hover:text-[#3f3531]'
          }`}
        >
          {language === 'bn' && (
            <motion.div
              layoutId="active-lang-pill"
              className="absolute inset-0 bg-[#c9996b] rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">বাংলা</span>
        </button>
      </div>
    </div>
  );
};
