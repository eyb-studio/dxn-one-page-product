import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import Iconify from '../components/iconify';
import { useOrder } from '../contexts/order-context';
import { useLocales } from '../locales/use-locales';
import { PRODUCT, SHIPPING } from '../data/product';
import { trackEvent } from '../utils/meta-pixel';

const STEP_ICONS = ['solar:letter-bold', 'solar:phone-calling-bold', 'solar:delivery-bold'];

export default function ThankYouPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const { t } = useLocales();
  const { trackingId, quantity, reset } = useOrder();

  useEffect(() => {
    if (!trackingId) navigate('/', { replace: true });
  }, [trackingId, navigate]);

  useEffect(() => {
    if (!trackingId) return;
    const subtotal = PRODUCT.price * quantity;
    const shipping = quantity >= SHIPPING.freeAfterQty ? 0 : SHIPPING.fee;
    trackEvent('Purchase', {
      content_ids: [PRODUCT.id],
      content_name: 'DXN Spirulina',
      content_type: 'product',
      num_items: quantity,
      value: subtotal + shipping,
      currency: PRODUCT.currency,
      order_id: trackingId,
    });
    // fire once per completed order
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingId]);

  if (!trackingId) return null;

  const handleBack = () => {
    reset();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Thank you · DXN Spirulina</title>
      </Helmet>

      <Box sx={{ maxWidth: 640, mx: 'auto', textAlign: 'center', pt: { xs: 2, md: 6 } }}>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 220 }}
        >
          <Box
            sx={{
              width: 96,
              height: 96,
              mx: 'auto',
              borderRadius: '50%',
              bgcolor: 'primary.lighter',
              color: 'primary.darker',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Iconify icon="solar:check-circle-bold" width={56} />
          </Box>
        </motion.div>

        <Typography variant="h2" sx={{ mb: 1 }}>
          {t('thank_you.title')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          {t('thank_you.subtitle')}
        </Typography>

        <Card sx={{ p: { xs: 2.5, md: 3 }, mb: 3, textAlign: 'start' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('thank_you.tracking')}
              </Typography>
              <Typography variant="h5" sx={{ letterSpacing: 1, fontFamily: 'monospace' }}>
                {trackingId}
              </Typography>
            </Stack>
            <Iconify icon="solar:bag-check-bold" width={32} sx={{ color: 'primary.main' }} />
          </Stack>
        </Card>

        <Card sx={{ p: { xs: 2.5, md: 3 }, mb: 4, textAlign: 'start' }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {t('thank_you.next_steps_title')}
          </Typography>
          <Stack spacing={2}>
            {[1, 2, 3].map((n, i) => (
              <Stack key={n} direction="row" spacing={2} alignItems="flex-start">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'background.neutral',
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon={STEP_ICONS[i]} width={20} />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', pt: 0.75 }}>
                  {t(`thank_you.step_${n}`)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Card>

        <Divider sx={{ borderStyle: 'dashed', mb: 3 }} />

        <Button
          variant="outlined"
          color="inherit"
          size="large"
          startIcon={<Iconify icon={isRtl ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'} width={20} />}
          onClick={handleBack}
        >
          {t('thank_you.back_home')}
        </Button>
      </Box>
    </>
  );
}
