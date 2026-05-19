import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './langs/en.json';
import ar from './langs/ar.json';

export const allLangs = [
  { label: 'English', value: 'en', icon: 'flagpack:gb-nir', systemValue: 'en' },
  { label: 'العربية', value: 'ar', icon: 'flagpack:ae', systemValue: 'ar' },
];

const SUPPORTED = allLangs.map((l) => l.value);

const applyHtmlAttrs = (lng) => {
  if (typeof document === 'undefined') return;
  const resolved = SUPPORTED.includes(lng) ? lng : 'en';
  document.documentElement.lang = resolved;
  document.documentElement.dir = resolved === 'ar' ? 'rtl' : 'ltr';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translations: en },
      ar: { translations: ar },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })
  .then(() => applyHtmlAttrs(i18n.resolvedLanguage || i18n.language));

i18n.on('languageChanged', (lng) => applyHtmlAttrs(lng));

export default i18n;
