import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './langs/en.json';
import ar from './langs/ar.json';

export const allLangs = [
  { label: 'English', value: 'en', icon: 'flagpack:gb-nir', systemValue: 'en' },
  { label: 'العربية', value: 'ar', icon: 'flagpack:ae', systemValue: 'ar' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translations: en },
      ar: { translations: ar },
    },
    lng: localStorage.getItem('i18nextLng') || 'en',
    fallbackLng: 'en',
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: { escapeValue: false },
  });

export default i18n;
