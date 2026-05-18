import { useTranslation } from 'react-i18next';
import { allLangs } from './i18n';

export function useLocales() {
  const { i18n, t } = useTranslation();
  const currentLang = allLangs.find((lang) => lang.value === i18n.language) || allLangs[0];

  const onChangeLang = async (value) => {
    await i18n.changeLanguage(value);
    localStorage.setItem('i18nextLng', value);
    document.documentElement.lang = value;
    document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
  };

  return { t, currentLang, allLangs, onChangeLang, lang: i18n.language };
}
