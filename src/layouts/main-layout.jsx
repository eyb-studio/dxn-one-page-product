import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Iconify from '../components/iconify';
import LanguagePopover from '../components/language-popover';
import { trackPageView } from '../utils/meta-pixel';

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/';

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
        dir="ltr"
        sx={{
          backdropFilter: 'blur(8px)',
          bgcolor: (theme) => `rgba(255,255,255,0.72)`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }} spacing={1}>
            {showBack ? (
              <IconButton onClick={() => navigate(-1)} aria-label="back">
                <Iconify icon="eva:arrow-ios-back-fill" width={22} />
              </IconButton>
            ) : null}
            <Typography
              component={Link}
              to="/"
              variant="h6"
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

          <LanguagePopover />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}
