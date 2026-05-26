import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from '../utils/format-currency';
import { useLocales } from '../locales/use-locales';
import { PRODUCT } from '../data/product';

export default function ProductCard({ size }) {
  const { t } = useLocales();

  const linkTo = `/${size.key}`;
  const outOfStock = size.available <= 0;

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        transition: 'transform .15s, box-shadow .15s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (th) => th.customShadows.z16,
        },
      }}
    >
      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          position: 'absolute',
          zIndex: 9,
          top: 12,
          insetInlineEnd: 12,
        }}
      >
        {size.popular ? (
          <Box
            sx={{
              px: 0.75,
              py: 0.25,
              borderRadius: 0.75,
              typography: 'caption',
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
            }}
          >
            {t('product.label_popular')}
          </Box>
        ) : null}
        <Box
          sx={{
            px: 0.75,
            py: 0.25,
            borderRadius: 0.75,
            typography: 'caption',
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            bgcolor: 'info.main',
            color: 'info.contrastText',
          }}
        >
          {t('product.label_new')}
        </Box>
      </Stack>

      <Box
        component={RouterLink}
        to={linkTo}
        sx={{
          display: 'block',
          position: 'relative',
          aspectRatio: '1 / 1',
          bgcolor: 'background.neutral',
          textDecoration: 'none',
          opacity: outOfStock ? 0.48 : 1,
          filter: outOfStock ? 'grayscale(1)' : 'none',
        }}
      >
        <Box
          component="img"
          src={size.images[0]}
          alt={t(`product.size_${size.key}_name`)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            p: 2,
            display: 'block',
          }}
        />
      </Box>

      <Stack spacing={1.5} sx={{ p: { xs: 2, md: 2.5 } }}>
        <Link
          component={RouterLink}
          to={linkTo}
          color="inherit"
          variant="subtitle1"
          underline="none"
          sx={{ '&:hover': { color: 'primary.main' } }}
        >
          {t(`product.size_${size.key}_name`)}
        </Link>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t(`product.size_${size.key}_subtitle`)}
        </Typography>

        <Stack direction="row" alignItems="baseline" justifyContent="space-between">
          <Stack spacing={0.25}>
            <Typography variant="h5" sx={{ color: 'text.primary' }}>
              {fCurrency(size.price, PRODUCT.currency)}
            </Typography>
            {size.perDay ? (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t('product.per_day', {
                  amount: fCurrency(size.perDay, PRODUCT.currency),
                })}
              </Typography>
            ) : null}
          </Stack>
          <Typography
            variant="caption"
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
    </Card>
  );
}
