import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Iconify from '../components/iconify';
import { PRODUCT, SIZES } from '../data/product';
import { fCurrency } from '../utils/format-currency';
import { useOrder } from '../contexts/order-context';
import { useLocales } from '../locales/use-locales';

export default function ReviewPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t, lang } = useLocales();
  const { items, totalItems, subtotal, shipping, total, address } = useOrder();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!address) navigate('/location', { replace: true });
  }, [address, navigate]);

  useEffect(() => {
    if (totalItems === 0) navigate('/cart', { replace: true });
  }, [totalItems, navigate]);

  if (!address || totalItems === 0) return null;

  const onPlaceOrder = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: address.fullname,
          phone: address.phone,
          email: address.email,
          address: address.address,
          building: address.building,
          city: address.city,
          emirate: address.emirate,
          notes: address.notes,
          coords: address.coords,
          items,
          language: lang,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data.error === 'validation'
            ? t('review.order_invalid')
            : t('review.order_failed');
        enqueueSnackbar(msg, { variant: 'error' });
        return;
      }

      const { orderId } = await res.json();
      enqueueSnackbar(t('review.order_placed'), { variant: 'success' });
      navigate(`/thank-you?order=${encodeURIComponent(orderId)}`);
    } catch (err) {
      console.error('[review] place order failed:', err);
      enqueueSnackbar(t('review.order_failed'), { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Review order · DXN Spirulina</title>
      </Helmet>

      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h2">{t('review.title')}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('review.subtitle')}
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            <Card sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{t('review.items')}</Typography>
                <Button
                  component={Link}
                  to="/cart"
                  size="small"
                  startIcon={<Iconify icon="solar:pen-bold" width={14} />}
                >
                  {t('review.edit')}
                </Button>
              </Stack>

              <Stack spacing={2} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
                {items.map((item) => {
                  const size = SIZES[item.size];
                  return (
                    <Stack key={item.size} direction="row" spacing={2} alignItems="center">
                      <Box
                        component="img"
                        src={size.images[0]}
                        alt={t(`product.size_${item.size}_name`)}
                        sx={{
                          width: 72,
                          height: 72,
                          borderRadius: 1.5,
                          objectFit: 'contain',
                          bgcolor: 'background.neutral',
                          p: 0.5,
                        }}
                      />
                      <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2">{t('product.name')}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {t(`product.size_${item.size}_name`)}
                        </Typography>
                      </Stack>
                      <Stack alignItems="flex-end">
                        <Typography variant="subtitle2">×{item.quantity}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {fCurrency(size.price * item.quantity, PRODUCT.currency)}
                        </Typography>
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            </Card>

            <Card sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{t('review.deliver_to')}</Typography>
                <Button
                  component={Link}
                  to="/location"
                  size="small"
                  startIcon={<Iconify icon="solar:pen-bold" width={14} />}
                >
                  {t('review.edit')}
                </Button>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="subtitle2">{address.fullname}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {address.phone}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {[address.address, address.building, address.city, address.emirate].filter(Boolean).join(' · ')}
                </Typography>
                {address.notes ? (
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                    “{address.notes}”
                  </Typography>
                ) : null}
              </Stack>
            </Card>

            <Card sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {t('review.payment_method')}
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  border: (theme) => `1px solid ${theme.palette.primary.main}`,
                  bgcolor: 'primary.lighter',
                }}
              >
                <Iconify icon="solar:wad-of-money-bold" width={28} sx={{ color: 'primary.darker' }} />
                <Stack sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: 'primary.darker' }}>
                    {t('review.cod')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {t('review.cod_subtitle')}
                  </Typography>
                </Stack>
                <Iconify icon="solar:check-circle-bold" width={22} sx={{ color: 'primary.main' }} />
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ p: { xs: 2.5, md: 3 }, position: { md: 'sticky' }, top: 96 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {t('product.subtotal')}
            </Typography>

            <Stack spacing={1.5}>
              {items.map((item) => (
                <Stack key={item.size} direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t(`product.size_${item.size}_short`)} × {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {fCurrency(SIZES[item.size].price * item.quantity, PRODUCT.currency)}
                  </Typography>
                </Stack>
              ))}

              <Divider sx={{ borderStyle: 'dashed', my: 0.5 }} />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('product.subtotal')}
                </Typography>
                <Typography variant="body2">{fCurrency(subtotal, PRODUCT.currency)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('review.shipping')}
                </Typography>
                {shipping === 0 ? (
                  <Typography variant="body2" sx={{ color: 'success.darker', fontWeight: 700 }}>
                    {t('review.shipping_free')}
                  </Typography>
                ) : (
                  <Typography variant="body2">{fCurrency(shipping, PRODUCT.currency)}</Typography>
                )}
              </Stack>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed', my: 2.5 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">{t('review.total')}</Typography>
              <Typography variant="h3" sx={{ color: 'primary.darker' }}>
                {fCurrency(total, PRODUCT.currency)}
              </Typography>
            </Stack>

            <Button
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              onClick={onPlaceOrder}
              disabled={submitting}
              sx={{ mt: 3, boxShadow: (th) => th.customShadows.primary }}
              startIcon={
                submitting ? (
                  <CircularProgress size={18} thickness={5} sx={{ color: 'inherit' }} />
                ) : (
                  <Iconify icon="solar:bag-check-bold" width={22} />
                )
              }
            >
              {submitting ? t('review.placing_order') : t('review.place_order')}
            </Button>

            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 2, textAlign: 'center' }}>
              {t('review.terms')}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
