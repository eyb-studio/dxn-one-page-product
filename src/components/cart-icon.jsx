import { Link as RouterLink, useLocation } from 'react-router-dom';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';

import Iconify from './iconify';
import { useOrder } from '../contexts/order-context';

const HIDE_ON = new Set(['/cart', '/location', '/review', '/thank-you']);

export default function CartIcon() {
  const { totalItems } = useOrder();
  const { pathname } = useLocation();

  if (HIDE_ON.has(pathname)) return null;

  return (
    <Box
      component={RouterLink}
      to="/cart"
      aria-label="cart"
      sx={{
        position: 'fixed',
        insetInlineEnd: 0,
        top: 112,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        cursor: 'pointer',
        color: 'text.primary',
        borderStartStartRadius: 16,
        borderEndStartRadius: 16,
        bgcolor: 'background.paper',
        py: 1,
        px: 2,
        boxShadow: (th) => th.customShadows.dropdown,
        transition: 'opacity .2s',
        '&:hover': { opacity: 0.85 },
      }}
    >
      <Badge showZero badgeContent={totalItems} color="error" max={99}>
        <Iconify icon="solar:cart-3-bold" width={24} />
      </Badge>
    </Box>
  );
}
