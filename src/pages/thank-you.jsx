import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import Iconify from '../components/iconify';
import OrderStatus from '../components/order-status';
import OrderSummaryCard from '../components/order-summary-card';
import { useOrder } from '../contexts/order-context';
import { useLocales } from '../locales/use-locales';
import { trackEvent } from '../utils/meta-pixel';
import { useOrderLookup } from '../hooks/use-order-lookup';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const { t } = useLocales();
  const { reset } = useOrder();
  const [params] = useSearchParams();
  const orderId = params.get('order') || '';

  const { order, error, loading } = useOrderLookup(orderId);
  const [purchaseFired, setPurchaseFired] = useState(false);

  useEffect(() => {
    if (!order || purchaseFired) return;
    setPurchaseFired(true);
    trackEvent('Purchase', {
      content_ids: ['dxn-spirulina-500'],
      content_name: 'DXN Spirulina',
      content_type: 'product',
      num_items: order.quantity,
      value: order.total,
      currency: order.currency,
      order_id: order.orderId,
    });
    reset();
  }, [order, purchaseFired, reset]);

  if (!orderId) {
    navigate('/', { replace: true });
    return null;
  }

  const handleBack = () => {
    reset();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Thank you · DXN Spirulina</title>
      </Helmet>

      <Box sx={{ maxWidth: 720, mx: 'auto', pt: { xs: 1, md: 4 } }}>
        {loading ? (
          <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('thank_you.loading')}
            </Typography>
          </Stack>
        ) : error ? (
          <Card sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
            <Iconify icon="solar:danger-triangle-bold" width={48} sx={{ color: 'error.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              {t('thank_you.not_found_title')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              {t('thank_you.not_found_body')}
            </Typography>
            <Stack direction="row" spacing={1.5} justifyContent="center">
              <Button component={Link} to="/track" variant="outlined">
                {t('track.title')}
              </Button>
              <Button component={Link} to="/" variant="contained" color="primary">
                {t('thank_you.back_home')}
              </Button>
            </Stack>
          </Card>
        ) : order ? (
          <Stack spacing={3}>
            <Stack alignItems="center" spacing={2} sx={{ textAlign: 'center' }}>
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 220 }}
              >
                <Box
                  sx={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    bgcolor: 'primary.lighter',
                    color: 'primary.darker',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Iconify icon="solar:check-circle-bold" width={52} />
                </Box>
              </motion.div>

              <Typography variant="h2">{t('thank_you.title')}</Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 520 }}>
                {t('thank_you.subtitle')}
              </Typography>
            </Stack>

            <OrderSummaryCard order={order} />

            <Card sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {t('thank_you.status_title')}
              </Typography>
              <OrderStatus status={order.status} />
            </Card>

            <Stack direction="row" spacing={1.5} justifyContent="center">
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={handleBack}
                startIcon={
                  <Iconify
                    icon={isRtl ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
                    width={20}
                  />
                }
              >
                {t('thank_you.back_home')}
              </Button>
            </Stack>
          </Stack>
        ) : null}
      </Box>
    </>
  );
}
