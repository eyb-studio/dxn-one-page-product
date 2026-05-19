import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import Iconify from '../components/iconify';
import LanguagePopover from '../components/language-popover';
import { trackPageView } from '../utils/meta-pixel';
import { useLocales } from '../locales/use-locales';

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocales();
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const showBack = location.pathname !== '/';
  const isTrackPage = location.pathname === '/track';

  const firstPathRef = useRef(location.pathname);
  useEffect(() => {
    if (location.pathname === firstPathRef.current) return; // initial PageView already fired by base pixel
    trackPageView();
  }, [location.pathname]);

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: 'blur(8px)',
          bgcolor: () => `rgba(255,255,255,0.72)`,
          borderBottom: (th) => `1px solid ${th.palette.divider}`,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }} spacing={1}>
            {showBack ? (
              <IconButton onClick={() => navigate(-1)} aria-label="back">
                <Iconify
                  icon={isRtl ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
                  width={22}
                />
              </IconButton>
            ) : null}
            <Typography
              component={Link}
              to="/"
              variant="h6"
              dir="ltr"
              sx={{
                textDecoration: 'none',
                color: 'text.primary',
                letterSpacing: 0.5,
                fontWeight: 800,
              }}
            >
              DXN&nbsp;<Box component="span" sx={{ color: 'primary.main' }}>Spirulina</Box>
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            {!isTrackPage ? (
              <Button
                component={Link}
                to="/track"
                size="small"
                color="inherit"
                startIcon={<Iconify icon="solar:box-bold" width={18} />}
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  textTransform: 'none',
                  display: { xs: 'none', sm: 'inline-flex' },
                }}
              >
                {t('nav.track_order')}
              </Button>
            ) : null}
            {!isTrackPage ? (
              <IconButton
                component={Link}
                to="/track"
                size="small"
                aria-label={t('nav.track_order')}
                sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: 'text.primary' }}
              >
                <Iconify icon="solar:box-bold" width={20} />
              </IconButton>
            ) : null}
            <LanguagePopover />
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}
