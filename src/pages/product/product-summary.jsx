import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import Iconify from '../../components/iconify';
import { fCurrency } from '../../utils/format-currency';
import { useOrder } from '../../contexts/order-context';
import { useLocales } from '../../locales/use-locales';
import { SHIPPING } from '../../data/product';
import { trackEvent } from '../../utils/meta-pixel';

export default function ProductSummary({ product }) {
  const navigate = useNavigate();
  const { t } = useLocales();
  const { quantity, setQuantity } = useOrder();

  const total = product.price * quantity;
  const inStock = product.available > 0;
  const inc = () => setQuantity(Math.min(product.available, quantity + 1));
  const dec = () => setQuantity(Math.max(1, quantity - 1));

  const handleBuy = () => {
    trackEvent('InitiateCheckout', {
      content_ids: [product.id],
      content_name: 'DXN Spirulina',
      content_type: 'product',
      num_items: quantity,
      value: total,
      currency: product.currency,
    });
    navigate('/location');
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
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('product.subtitle')}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Rating size="small" value={product.rating} precision={0.1} readOnly />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ({product.reviews})
          </Typography>
        </Stack>

        <Box sx={{ typography: 'h2' }}>{fCurrency(product.price, product.currency)}</Box>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">{t('product.qty')}</Typography>
        <Stack direction="row" alignItems="center" spacing={0}>
          <IconButton size="small" onClick={dec} disabled={quantity <= 1}>
            <Iconify icon="eva:minus-fill" width={16} />
          </IconButton>
          <Typography variant="subtitle1" sx={{ minWidth: 32, textAlign: 'center' }}>
            {quantity}
          </Typography>
          <IconButton size="small" onClick={inc} disabled={quantity >= product.available}>
            <Iconify icon="eva:plus-fill" width={16} />
          </IconButton>
        </Stack>
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'end' }}>
        {t('product.available', { count: product.available })}
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1">{t('product.subtotal')}</Typography>
        <Typography variant="h3">{fCurrency(total, product.currency)}</Typography>
      </Stack>

      <Button
        fullWidth
        size="large"
        color="primary"
        variant="contained"
        disabled={!inStock}
        startIcon={<Iconify icon="solar:bag-check-bold" width={22} />}
        onClick={handleBuy}
        sx={{ boxShadow: (t) => t.customShadows.primary }}
      >
        {t('product.buy_now')}
      </Button>

      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ color: 'text.secondary' }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Iconify icon="solar:shield-check-bold" width={18} />
          <Typography variant="caption">{t('product.secure_checkout')}</Typography>
        </Stack>
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider' }} />
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Iconify
            icon="solar:delivery-bold"
            width={18}
            sx={{ color: quantity >= SHIPPING.freeAfterQty ? 'success.main' : 'inherit' }}
          />
          <Typography
            variant="caption"
            sx={{ color: quantity >= SHIPPING.freeAfterQty ? 'success.darker' : 'inherit', fontWeight: quantity >= SHIPPING.freeAfterQty ? 700 : 400 }}
          >
            {quantity >= SHIPPING.freeAfterQty ? t('product.free_shipping') : t('product.add_for_free_delivery')}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
