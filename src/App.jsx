import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { HelmetProvider } from 'react-helmet-async';

import './locales/i18n';
import { useLocales } from './locales/use-locales';
import ThemeProvider from './theme';
import { OrderProvider } from './contexts/order-context';
import { router } from './routes';

function AppShell() {
  const { lang } = useLocales();
  const direction = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
  }, [lang, direction]);

  return (
    <ThemeProvider direction={direction}>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <OrderProvider>
          <RouterProvider router={router} />
        </OrderProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AppShell />
    </HelmetProvider>
  );
}
