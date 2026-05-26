import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import Iconify from '../components/iconify';
import { fCurrency } from '../utils/format-currency';
import { useOrder } from '../contexts/order-context';
import { useLocales } from '../locales/use-locales';
import { PRODUCT, SIZES } from '../data/product';
import { trackEvent } from '../utils/meta-pixel';

export default function CartPage() {
  const { t } = useLocales();
  const navigate = useNavigate();
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const {
    items,
    setItemQuantity,
    removeItem,
    totalItems,
    subtotal,
    shipping,
    total,
    address,
  } = useOrder();

  const empty = items.length === 0;

  const handleCheckout = () => {
    if (empty) return;
    trackEvent('InitiateCheckout', {
      content_ids: items.map((i) => SIZES[i.size].id),
      contents: items.map((i) => ({
        id: SIZES[i.size].id,
        quantity: i.quantity,
        item_price: SIZES[i.size].price,
      })),
      content_name: 'DXN Spirulina',
      content_type: 'product',
      num_items: totalItems,
      value: total,
      currency: PRODUCT.currency,
    });
    navigate(address ? '/review' : '/location');
  };

  return (
    <>
      <Helmet>
        <title>Cart · DXN Spirulina</title>
      </Helmet>

      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h2">{t('cart.title')}</Typography>
        {!empty ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t(totalItems === 1 ? 'cart.items_count_one' : 'cart.items_count_other', {
              count: totalItems,
            })}
          </Typography>
        ) : null}
      </Stack>

      {empty ? (
        <Card sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
          <Iconify
            icon="solar:cart-cross-bold"
            width={56}
            sx={{ color: 'text.disabled', mb: 2 }}
          />
          <Typography variant="h5" sx={{ mb: 1 }}>
            {t('cart.empty_title')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {t('cart.empty_body')}
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            startIcon={
              <Iconify
                icon={isRtl ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
                width={18}
              />
            }
          >
            {t('cart.continue_shopping')}
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={2} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
                {items.map((item) => {
                  const size = SIZES[item.size];
                  return (
                    <Stack
                      key={item.size}
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                      <Box
                        component={RouterLink}
                        to={`/${item.size}`}
                        sx={{ display: 'block', flexShrink: 0 }}
                      >
                        <Box
                          component="img"
                          src={size.images[0]}
                          alt={t(`product.size_${item.size}_name`)}
                          sx={{
                            width: 88,
                            height: 88,
                            borderRadius: 1.5,
                            objectFit: 'contain',
                            bgcolor: 'background.neutral',
                            p: 1,
                          }}
                        />
                      </Box>

                      <Stack sx={{ flexGrow: 1, minWidth: 0 }} spacing={0.5}>
                        <Typography variant="subtitle2">
                          {t(`product.size_${item.size}_name`)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {fCurrency(size.price, PRODUCT.currency)}
                          {size.shippingFee === 0
                            ? ` · ${t('product.free_delivery')}`
                            : ` · ${t('product.delivery_fee', {
                                fee: fCurrency(size.shippingFee, PRODUCT.currency),
                              })}`}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => setItemQuantity(item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="decrease"
                        >
                          <Iconify icon="eva:minus-fill" width={16} />
                        </IconButton>
                        <Typography
                          variant="subtitle2"
                          sx={{ minWidth: 32, textAlign: 'center' }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setItemQuantity(item.size, item.quantity + 1)}
                          disabled={item.quantity >= size.available}
                          aria-label="increase"
                        >
                          <Iconify icon="eva:plus-fill" width={16} />
                        </IconButton>
                      </Stack>

                      <Stack alignItems="flex-end" sx={{ minWidth: 90 }}>
                        <Typography variant="subtitle2">
                          {fCurrency(size.price * item.quantity, PRODUCT.currency)}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => removeItem(item.size)}
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={14} />}
                          sx={{ color: 'text.secondary', mt: 0.5 }}
                        >
                          {t('cart.remove')}
                        </Button>
                      </Stack>
                    </Stack>
                  );
                })}
              </Stack>
            </Card>

            <Button
              component={RouterLink}
              to="/"
              color="inherit"
              startIcon={
                <Iconify
                  icon={isRtl ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
                  width={18}
                />
              }
              sx={{ mt: 2 }}
            >
              {t('cart.continue_shopping')}
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
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
                  <Typography variant="body2">
                    {fCurrency(subtotal, PRODUCT.currency)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('review.shipping')}
                  </Typography>
                  {shipping === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{ color: 'success.darker', fontWeight: 700 }}
                    >
                      {t('review.shipping_free')}
                    </Typography>
                  ) : (
                    <Typography variant="body2">
                      {fCurrency(shipping, PRODUCT.currency)}
                    </Typography>
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
                onClick={handleCheckout}
                disabled={empty}
                startIcon={<Iconify icon="solar:bag-check-bold" width={22} />}
                sx={{ mt: 3, boxShadow: (th) => th.customShadows.primary }}
              >
                {t('cart.checkout')}
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
}
