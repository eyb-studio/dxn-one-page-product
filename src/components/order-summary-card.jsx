import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useLocales } from '../locales/use-locales';
import { fCurrency } from '../utils/format-currency';

export default function OrderSummaryCard({ order }) {
  const { t } = useLocales();

  const addressLine = [order.address?.line, order.address?.building, order.address?.city, order.address?.emirate]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card sx={{ p: { xs: 2.5, md: 3 }, textAlign: 'start' }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('thank_you.tracking')}
            </Typography>
            <Typography
              variant="h5"
              sx={{ letterSpacing: 1, fontFamily: 'monospace', mt: 0.25 }}
            >
              {order.orderId}
            </Typography>
          </Box>
          {order.createdAt ? (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {new Date(order.createdAt).toLocaleString()}
            </Typography>
          ) : null}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2">{t('product.name')}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ×{order.quantity}
            </Typography>
          </Box>
          <Typography variant="subtitle2">{fCurrency(order.subtotal, order.currency)}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('review.shipping')}
          </Typography>
          {order.shipping === 0 ? (
            <Typography variant="body2" sx={{ color: 'success.darker', fontWeight: 700 }}>
              {t('review.shipping_free')}
            </Typography>
          ) : (
            <Typography variant="body2">{fCurrency(order.shipping, order.currency)}</Typography>
          )}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">{t('review.total')}</Typography>
          <Typography variant="h4" sx={{ color: 'primary.darker' }}>
            {fCurrency(order.total, order.currency)}
          </Typography>
        </Stack>

        {addressLine ? (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('review.deliver_to')}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
                {order.name} · {order.phone}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {addressLine}
              </Typography>
            </Box>
          </>
        ) : null}
      </Stack>
    </Card>
  );
}
