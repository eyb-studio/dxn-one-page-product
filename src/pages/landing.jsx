import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Iconify from '../components/iconify';
import ProductCard from '../components/product-card';
import { useLocales } from '../locales/use-locales';
import { PRODUCT, SIZES, SIZE_ORDER } from '../data/product';
import { trackEvent } from '../utils/meta-pixel';

export default function LandingPage() {
  const { t } = useLocales();
  const testimonials = t('product.testimonials', { returnObjects: true });

  useEffect(() => {
    trackEvent('ViewContent', {
      content_ids: SIZE_ORDER.map((k) => SIZES[k].id),
      content_name: 'DXN Spirulina',
      content_type: 'product_group',
      content_category: 'Supplements',
      value: SIZES[PRODUCT.defaultSize].price,
      currency: PRODUCT.currency,
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>DXN Spirulina · Shop</title>
      </Helmet>

      <Stack spacing={1} sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h2">{t('product.name')}</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 640 }}>
          {t('product.subtitle')}
        </Typography>
        <Stack
          direction="row"
          flexWrap="wrap"
          alignItems="center"
          rowGap={0.5}
          columnGap={1.5}
          sx={{ mt: 0.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating size="small" value={PRODUCT.rating} precision={0.1} readOnly />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ({PRODUCT.reviews})
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify
              icon="solar:wad-of-money-bold"
              width={14}
              sx={{ color: 'success.main' }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('product.trust_cod')}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Iconify
              icon="solar:delivery-bold"
              width={14}
              sx={{ color: 'success.main' }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {t('product.trust_delivery')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Box
        gap={{ xs: 2, md: 3 }}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
        }}
      >
        {SIZE_ORDER.map((key) => (
          <ProductCard key={key} size={SIZES[key]} />
        ))}
      </Box>

      {Array.isArray(testimonials) && testimonials.length > 0 ? (
        <Box sx={{ mt: { xs: 4, md: 6 } }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {t('product.testimonials_title')}
          </Typography>
          <Box
            gap={{ xs: 2, md: 3 }}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {testimonials.map((tm, idx) => (
              <Card key={idx} sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={1.5}>
                  <Rating size="small" value={5} readOnly />
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    “{tm.quote}”
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify
                      icon="solar:verified-check-bold"
                      width={16}
                      sx={{ color: 'success.main' }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {tm.name}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Box>
        </Box>
      ) : null}
    </>
  );
}
