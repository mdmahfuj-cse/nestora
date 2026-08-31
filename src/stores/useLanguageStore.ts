import { create } from 'zustand';
import { translations, TranslationKey, Language } from '../locales/translations';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatNumber: (num: number | string) => string;
  formatCurrency: (amount: number) => string;
  formatPrice: (amount: number) => string;
}

const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export const toBengaliDigits = (input: string | number): string => {
  return String(input).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[digit] || digit);
};

// Initial language preference from localStorage if available
const getInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('nestora_lang');
    if (saved === 'en' || saved === 'bn') return saved;
  } catch (e) {
    // fallback
  }
  return 'en';
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: getInitialLanguage(),

  setLanguage: (lang: Language) => {
    try {
      localStorage.setItem('nestora_lang', lang);
    } catch (e) {
      // ignore
    }
    set({ language: lang });
  },

  toggleLanguage: () => {
    const current = get().language;
    const next: Language = current === 'en' ? 'bn' : 'en';
    try {
      localStorage.setItem('nestora_lang', next);
    } catch (e) {
      // ignore
    }
    set({ language: next });
  },

  t: (key: TranslationKey, params?: Record<string, string | number>): string => {
    const lang = get().language;
    const entry = translations[key];
    if (!entry) return String(key);

    let text: string = String(entry[lang] || entry['en'] || key);

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        const replacement =
          lang === 'bn' && typeof paramVal === 'number'
            ? toBengaliDigits(paramVal)
            : String(paramVal);
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), replacement);
      });
    }

    return text;
  },

  formatNumber: (num: number | string): string => {
    const lang = get().language;
    if (lang === 'bn') {
      return toBengaliDigits(num);
    }
    return String(num);
  },

  formatCurrency: (amount: number): string => {
    const lang = get().language;
    const formatted = amount.toLocaleString('en-IN');
    if (lang === 'bn') {
      return '৳' + toBengaliDigits(formatted);
    }
    return '৳' + formatted;
  },

  formatPrice: (amount: number): string => {
    const lang = get().language;
    const formatted = amount.toLocaleString('en-IN');
    if (lang === 'bn') {
      return '৳' + toBengaliDigits(formatted);
    }
    return '৳' + formatted;
  },
}));
