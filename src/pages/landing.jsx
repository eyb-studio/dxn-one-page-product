import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ProductCard from '../components/product-card';
import { useLocales } from '../locales/use-locales';
import { PRODUCT, SIZES, SIZE_ORDER } from '../data/product';
import { trackEvent } from '../utils/meta-pixel';

export default function LandingPage() {
  const { t } = useLocales();

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
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
          <Rating size="small" value={PRODUCT.rating} precision={0.1} readOnly />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ({PRODUCT.reviews})
          </Typography>
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
    </>
  );
}
