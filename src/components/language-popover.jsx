import Button from '@mui/material/Button';

import { useLocales } from '../locales/use-locales';

export default function LanguagePopover() {
  const { currentLang, onChangeLang } = useLocales();

  const isAr = currentLang.value === 'ar';
  const nextLang = isAr ? 'en' : 'ar';
  const label = isAr ? 'EN' : 'العربية';

  return (
    <Button
      onClick={() => onChangeLang(nextLang)}
      size="small"
      color="inherit"
      sx={{
        minWidth: 64,
        px: 1.25,
        color: 'text.primary',
        fontWeight: 700,
        borderRadius: 1,
        border: (th) => `1px solid ${th.palette.divider}`,
      }}
      aria-label={`Switch language to ${label}`}
    >
      {label}
    </Button>
  );
}
