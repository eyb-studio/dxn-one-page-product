import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { Helmet } from 'react-helmet-async';

import { PRODUCT } from '../../data/product';
import { trackEvent } from '../../utils/meta-pixel';
import ProductCarousel from './product-carousel';
import ProductSummary from './product-summary';
import ProductDescription from './product-description';

export default function ProductPage() {
  useEffect(() => {
    trackEvent('ViewContent', {
      content_ids: [PRODUCT.id],
      content_name: 'DXN Spirulina',
      content_type: 'product',
      content_category: 'Supplements',
      value: PRODUCT.price,
      currency: PRODUCT.currency,
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>DXN Spirulina · Pure plant protein, delivered</title>
      </Helmet>

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid item xs={12} md={6} lg={7}>
          <ProductCarousel images={PRODUCT.images} alt="DXN Spirulina" />
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
          <ProductSummary product={PRODUCT} />
        </Grid>

        <Grid item xs={12}>
          <ProductDescription />
        </Grid>
      </Grid>
    </>
  );
}
