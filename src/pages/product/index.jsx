import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Helmet } from 'react-helmet-async';

import { PRODUCT, SIZES } from '../../data/product';
import { trackEvent } from '../../utils/meta-pixel';
import ProductCarousel from './product-carousel';
import ProductSummary from './product-summary';
import ProductDescription from './product-description';

export default function ProductPage({ sizeKey }) {
  const size = SIZES[sizeKey];

  useEffect(() => {
    if (!size) return;
    trackEvent('ViewContent', {
      content_ids: [size.id],
      content_name: 'DXN Spirulina',
      content_type: 'product',
      content_category: 'Supplements',
      value: size.price,
      currency: PRODUCT.currency,
    });
  }, [size]);

  if (!size) return <Navigate to="/" replace />;

  return (
    <>
      <Helmet>
        <title>DXN Spirulina · {sizeKey === 'large' ? 'Large bottle' : 'Small bottle'}</title>
      </Helmet>

      <Grid
        container
        spacing={{ xs: 3, md: 5, lg: 8 }}
        sx={{ pb: { xs: 11, md: 0 } }}
      >
        <Grid item xs={12} md={6} lg={7}>
          <ProductCarousel
            key={sizeKey}
            images={size.images}
            alt={`DXN Spirulina ${sizeKey}`}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
          <ProductSummary sizeKey={sizeKey} />
        </Grid>

        <Grid item xs={12}>
          <ProductDescription />
        </Grid>
      </Grid>
    </>
  );
}
