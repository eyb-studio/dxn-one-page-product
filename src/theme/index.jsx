import { useMemo } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { palette } from './palette';
import { typography } from './typography';
import { customShadows } from './custom-shadows';
import { componentsOverrides } from './overrides';

const ltrCache = createCache({ key: 'mui', stylisPlugins: [prefixer] });
const rtlCache = createCache({ key: 'mui-rtl', stylisPlugins: [prefixer, rtlPlugin] });

export default function ThemeProvider({ children, direction = 'ltr' }) {
  const theme = useMemo(() => {
    const base = createTheme({
      palette: palette(),
      typography,
      shape: { borderRadius: 8 },
      direction,
    });
    base.customShadows = customShadows();
    base.components = componentsOverrides(base);
    return base;
  }, [direction]);

  const cache = direction === 'rtl' ? rtlCache : ltrCache;

  return (
    <CacheProvider value={cache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
}
