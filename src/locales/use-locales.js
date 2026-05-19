import { useTranslation } from 'react-i18next';
import { allLangs } from './i18n';

export function useLocales() {
  const { i18n, t } = useTranslation();
  const active = i18n.resolvedLanguage || i18n.language;
  const currentLang = allLangs.find((lang) => lang.value === active) || allLangs[0];

  const onChangeLang = (value) => i18n.changeLanguage(value);

  return { t, currentLang, allLangs, onChangeLang, lang: active };
}
