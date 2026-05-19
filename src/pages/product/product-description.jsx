import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import Iconify from '../../components/iconify';
import { useLocales } from '../../locales/use-locales';
import { useOrder } from '../../contexts/order-context';
import { PRODUCT } from '../../data/product';
import { trackEvent } from '../../utils/meta-pixel';

export default function ProductDescription() {
  const { t } = useLocales();
  const [value, setValue] = useState('description');

  const blog = t('product.blog', { returnObjects: true });
  const details = t('product.details', { returnObjects: true });

  return (
    <Card sx={{ mt: { xs: 4, md: 6 } }}>
      <Tabs
        value={value}
        onChange={(_, v) => setValue(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
      >
        <Tab value="description" label={t('product.description_tab')} />
        <Tab value="details" label={t('product.details_tab')} />
      </Tabs>

      {value === 'description' ? (
        <BlogContent blog={blog} />
      ) : (
        <Box
          component="dl"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'max-content 1fr' },
            columnGap: 4,
            rowGap: 1.5,
            m: 0,
            p: { xs: 2, md: 3 },
          }}
        >
          {details.map((d) => (
            <Box key={d.label} sx={{ display: 'contents' }}>
              <Box component="dt" sx={{ color: 'text.secondary', typography: 'body2' }}>
                {d.label}
              </Box>
              <Box component="dd" sx={{ m: 0, typography: 'subtitle2' }}>
                {d.value}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
}

function BlogContent({ blog }) {
  const navigate = useNavigate();
  const { t } = useLocales();
  const { quantity } = useOrder();

  const handleCta = () => {
    trackEvent('InitiateCheckout', {
      content_ids: [PRODUCT.id],
      content_name: 'DXN Spirulina',
      content_type: 'product',
      num_items: quantity,
      value: PRODUCT.price * quantity,
      currency: PRODUCT.currency,
    });
    navigate('/location');
  };

  return (
    <Stack spacing={{ xs: 5, md: 7 }} sx={{ p: { xs: 2.5, md: 5 } }}>
      {/* HERO */}
      <Stack spacing={2}>
        <Typography
          variant="overline"
          sx={{ color: 'primary.main', letterSpacing: 1.5 }}
        >
          {blog.hero_eyebrow}
        </Typography>
        <Typography variant="h3" sx={{ lineHeight: 1.25 }}>
          {blog.hero_title}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
          {blog.hero_body}
        </Typography>
      </Stack>

      {/* PROOF STATS STRIP */}
      <Grid container spacing={2}>
        {blog.stats.map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Stack
              spacing={0.5}
              alignItems="center"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.neutral',
                height: '100%',
                textAlign: 'center',
              }}
            >
              <Typography variant="h3" sx={{ color: 'primary.darker' }}>
                {s.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {s.label}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>

      {/* BENEFITS GRID */}
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4">{blog.benefits_title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            {blog.benefits_intro}
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          {blog.benefits.map((b) => (
            <Grid item xs={12} sm={6} key={b.title}>
              <Stack
                spacing={1.25}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: 'background.neutral',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (th) => alpha(th.palette.primary.main, 0.12),
                    color: 'primary.darker',
                  }}
                >
                  <Iconify icon={b.icon} width={24} />
                </Box>
                <Typography variant="subtitle1">{b.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {b.body}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Stack>

      {/* WHAT YOU'LL FEEL */}
      <Stack spacing={3}>
        <Box
          component="img"
          src="/dxn-2.jpg"
          alt="DXN Spirulina daily ritual"
          sx={{
            width: '100%',
            maxHeight: { xs: 240, md: 360 },
            objectFit: 'cover',
            borderRadius: 2,
            boxShadow: (t) => t.customShadows.card,
          }}
        />
        <Typography variant="h4">{blog.feelings_title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
          {blog.feelings_intro}
        </Typography>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {blog.feelings.map((f) => (
            <Stack key={f.title} direction="row" spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: (th) => alpha(th.palette.success.main, 0.14),
                  color: 'success.darker',
                  flexShrink: 0,
                }}
              >
                <Iconify icon={f.icon} width={20} />
              </Box>
              <Stack spacing={0.25}>
                <Typography variant="subtitle2">{f.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {f.body}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* CULTIVATION STORY */}
      <Stack spacing={3}>
        <Box
          component="img"
          src="/dxn-3.webp"
          alt="DXN Spirulina cultivation"
          sx={{
            width: '100%',
            maxHeight: { xs: 240, md: 360 },
            objectFit: 'cover',
            borderRadius: 2,
            boxShadow: (t) => t.customShadows.card,
          }}
        />
        <Stack spacing={1}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 1.5 }}>
            {blog.cultivation_eyebrow}
          </Typography>
          <Typography variant="h4">{blog.cultivation_title}</Typography>
        </Stack>
        <Stack spacing={2}>
          {blog.cultivation_body.map((p, i) => (
            <Typography key={i} variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.9 }}>
              {p}
            </Typography>
          ))}
        </Stack>
      </Stack>

      {/* PURITY CALLOUT */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          bgcolor: 'primary.lighter',
          border: (th) => `1px solid ${alpha(th.palette.primary.main, 0.2)}`,
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Iconify icon="solar:leaf-bold" width={28} sx={{ color: 'primary.darker' }} />
            <Typography variant="h5" sx={{ color: 'primary.darker' }}>
              {blog.purity_title}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            {blog.purity_intro}
          </Typography>
          <Grid container spacing={1.5} sx={{ mt: 1 }}>
            {blog.purity.map((p) => (
              <Grid item xs={12} sm={6} key={p}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Iconify icon="solar:check-circle-bold" width={20} sx={{ color: 'success.main' }} />
                  <Typography variant="body2">{p}</Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
            {blog.certifications.map((c) => (
              <Box
                key={c}
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 0.75,
                  typography: 'caption',
                  fontWeight: 700,
                  bgcolor: 'common.white',
                  color: 'primary.darker',
                  border: (th) => `1px solid ${alpha(th.palette.primary.main, 0.24)}`,
                }}
              >
                {c}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* HOW TO TAKE IT */}
      <Stack spacing={3}>
        <Typography variant="h4">{blog.usage_title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
          {blog.usage_intro}
        </Typography>
        <Grid container spacing={2}>
          {blog.usage_steps.map((s, i) => (
            <Grid item xs={12} md={4} key={s.title}>
              <Stack
                spacing={1.5}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  height: '100%',
                  border: (th) => `1px solid ${th.palette.divider}`,
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ color: 'primary.main', letterSpacing: 1.5 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Typography variant="subtitle1">{s.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                  {s.body}
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Stack>

      {/* TESTIMONIAL */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          bgcolor: 'background.neutral',
          position: 'relative',
        }}
      >
        <Iconify
          icon="solar:quote-up-square-bold"
          width={40}
          sx={{ color: 'primary.main', mb: 1 }}
        />
        <Typography variant="h6" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
          {blog.testimonial_quote}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Iconify key={i} icon="solar:star-bold" width={18} sx={{ color: 'warning.main' }} />
          ))}
        </Stack>
        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          {blog.testimonial_author}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {blog.testimonial_meta}
        </Typography>
      </Box>

      {/* CLOSING CTA */}
      <Box
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 2,
          textAlign: 'center',
          background: (th) =>
            `linear-gradient(135deg, ${alpha(th.palette.primary.main, 0.12)} 0%, ${alpha(
              th.palette.primary.main,
              0.04
            )} 100%)`,
          border: (th) => `1px solid ${alpha(th.palette.primary.main, 0.2)}`,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Iconify
            icon="solar:medal-ribbon-star-bold"
            width={40}
            sx={{ color: 'primary.main' }}
          />
          <Typography variant="h4">{blog.closing_title}</Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', lineHeight: 1.8, maxWidth: 600 }}
          >
            {blog.closing_body}
          </Typography>

          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={handleCta}
            startIcon={<Iconify icon="solar:bag-check-bold" width={22} />}
            sx={{
              mt: 1,
              px: 5,
              py: 1.5,
              fontSize: 16,
              boxShadow: (th) => th.customShadows.primary,
            }}
          >
            {t('product.cta_order_now')}
          </Button>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 3 }}
            alignItems="center"
            justifyContent="center"
            sx={{ color: 'text.secondary', mt: 1 }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Iconify icon="solar:shield-check-bold" width={18} />
              <Typography variant="caption">{t('product.secure_checkout')}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Iconify icon="solar:delivery-bold" width={18} />
              <Typography variant="caption">{t('product.free_shipping')}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Iconify icon="solar:wad-of-money-bold" width={18} />
              <Typography variant="caption">{t('product.cta_cod_badge')}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
