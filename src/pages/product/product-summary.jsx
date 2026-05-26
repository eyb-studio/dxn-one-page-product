import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import Iconify from '../../components/iconify';
import { fCurrency } from '../../utils/format-currency';
import { useOrder } from '../../contexts/order-context';
import { useLocales } from '../../locales/use-locales';
import { PRODUCT, SIZES } from '../../data/product';
import { trackEvent } from '../../utils/meta-pixel';

export default function ProductSummary({ sizeKey }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLocales();
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const { items, addItem, address } = useOrder();

  const size = SIZES[sizeKey];
  const otherKey = sizeKey === 'large' ? 'small' : 'large';
  const inStock = size.available > 0;
  const inCartLine = items.find((i) => i.size === sizeKey);
  const inCartQty = inCartLine?.quantity ?? 0;

  const [quantity, setQuantity] = useState(1);
  const inc = () => setQuantity((q) => Math.min(size.available, q + 1));
  const dec = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAdd = () => {
    addItem(sizeKey, quantity);
    trackEvent('AddToCart', {
      content_ids: [size.id],
      content_name: 'DXN Spirulina',
      content_type: 'product',
      num_items: quantity,
      value: size.price * quantity,
      currency: PRODUCT.currency,
    });
    enqueueSnackbar(t('product.added_to_cart'), {
      variant: 'success',
      action: () => (
        <Button color="inherit" size="small" onClick={() => navigate('/cart')}>
          {t('product.go_to_cart')}
        </Button>
      ),
    });
  };

  const handleOrderNow = () => {
    addItem(sizeKey, quantity);
    trackEvent('AddToCart', {
      content_ids: [size.id],
      content_name: 'DXN Spirulina',
      content_type: 'product',
      num_items: quantity,
      value: size.price * quantity,
      currency: PRODUCT.currency,
    });
    trackEvent('InitiateCheckout', {
      content_ids: [size.id],
      contents: [{ id: size.id, quantity, item_price: size.price }],
      content_name: 'DXN Spirulina',
      content_type: 'product',
      num_items: quantity,
      value: size.price * quantity,
      currency: PRODUCT.currency,
    });
    navigate(address ? '/review' : '/location');
  };

  return (
    <Stack spacing={3} sx={{ pt: { xs: 0, md: 1 } }}>
      <Stack spacing={2} alignItems="flex-start">
        <Stack direction="row" spacing={1}>
          <Box
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 0.75,
              typography: 'overline',
              fontSize: 11,
              bgcolor: 'info.lighter',
              color: 'info.darker',
            }}
          >
            {t('product.label_new')}
          </Box>
          <Box
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 0.75,
              typography: 'overline',
              fontSize: 11,
              bgcolor: inStock ? 'success.lighter' : 'error.lighter',
              color: inStock ? 'success.darker' : 'error.darker',
            }}
          >
            {inStock ? t('product.label_in_stock') : t('product.label_out_of_stock')}
          </Box>
        </Stack>

        <Typography variant="h1">{t('product.name')}</Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
          {t(`product.size_${sizeKey}_name`)}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t(`product.size_${sizeKey}_subtitle`)}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Rating size="small" value={PRODUCT.rating} precision={0.1} readOnly />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ({PRODUCT.reviews})
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="baseline" spacing={1.5}>
          <Typography variant="h2">{fCurrency(size.price, PRODUCT.currency)}</Typography>
          <Typography
            variant="body2"
            sx={{
              color: size.shippingFee === 0 ? 'success.darker' : 'text.secondary',
              fontWeight: size.shippingFee === 0 ? 700 : 500,
            }}
          >
            {size.shippingFee === 0
              ? t('product.free_delivery')
              : t('product.delivery_fee', {
                  fee: fCurrency(size.shippingFee, PRODUCT.currency),
                })}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">{t('product.qty')}</Typography>
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
          <IconButton size="small" onClick={dec} disabled={quantity <= 1}>
            <Iconify icon="eva:minus-fill" width={16} />
          </IconButton>
          <Typography variant="subtitle1" sx={{ minWidth: 32, textAlign: 'center' }}>
            {quantity}
          </Typography>
          <IconButton
            size="small"
            onClick={inc}
            disabled={quantity >= size.available}
          >
            <Iconify icon="eva:plus-fill" width={16} />
          </IconButton>
        </Stack>
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'end' }}>
        {t('product.available', { count: size.available })}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          disabled={!inStock}
          startIcon={<Iconify icon="solar:bag-check-bold" width={22} />}
          onClick={handleOrderNow}
          sx={{ boxShadow: (th) => th.customShadows.primary }}
        >
          {t('product.order_now')}
        </Button>
        <Button
          fullWidth
          size="large"
          color="primary"
          variant="outlined"
          disabled={!inStock}
          startIcon={<Iconify icon="solar:cart-plus-bold" width={22} />}
          onClick={handleAdd}
        >
          {t('product.add_to_cart')}
        </Button>
      </Stack>

      {inCartQty > 0 ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: 'success.lighter',
            color: 'success.darker',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Iconify icon="solar:cart-check-bold" width={18} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t('product.in_cart')}: {inCartQty}
            </Typography>
          </Stack>
          <Button
            component={RouterLink}
            to="/cart"
            size="small"
            color="inherit"
            endIcon={
              <Iconify
                icon={isRtl ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'}
                width={16}
              />
            }
          >
            {t('product.go_to_cart')}
          </Button>
        </Stack>
      ) : null}

      <Stack spacing={0.5} alignItems="center">
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t('product.switch_size_cta')}
        </Typography>
        <Link
          component={RouterLink}
          to={`/${otherKey}`}
          underline="hover"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            fontWeight: 600,
          }}
        >
          {t(`product.switch_to_${otherKey}`)}
          <Iconify
            icon={isRtl ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'}
            width={16}
          />
        </Link>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ color: 'text.secondary' }}
      >
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Iconify icon="solar:shield-check-bold" width={18} />
          <Typography variant="caption">{t('product.secure_checkout')}</Typography>
        </Stack>
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider' }} />
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Iconify icon="solar:wad-of-money-bold" width={18} />
          <Typography variant="caption">{t('product.cta_cod_badge')}</Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          insetInline: 0,
          bottom: 0,
          zIndex: 1100,
          px: 2,
          py: 1.25,
          bgcolor: (th) => `rgba(255,255,255,${th.palette.mode === 'dark' ? 0.92 : 0.96})`,
          backdropFilter: 'blur(8px)',
          borderTop: (th) => `1px solid ${th.palette.divider}`,
          alignItems: 'center',
          gap: 1.5,
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)',
        }}
      >
        <Stack sx={{ flexShrink: 0 }}>
          <Typography variant="subtitle1" sx={{ lineHeight: 1.1 }}>
            {fCurrency(size.price, PRODUCT.currency)}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {size.shippingFee === 0
              ? t('product.free_delivery')
              : t('product.delivery_fee', {
                  fee: fCurrency(size.shippingFee, PRODUCT.currency),
                })}
          </Typography>
        </Stack>
        <Button
          fullWidth
          size="large"
          color="primary"
          variant="contained"
          disabled={!inStock}
          onClick={handleOrderNow}
          startIcon={<Iconify icon="solar:bag-check-bold" width={20} />}
          sx={{ boxShadow: (th) => th.customShadows.primary, ml: 'auto' }}
        >
          {t('product.order_now')}
        </Button>
      </Box>
    </Stack>
  );
}
