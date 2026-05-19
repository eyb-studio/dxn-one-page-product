import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Iconify from '../components/iconify';
import OrderStatus from '../components/order-status';
import OrderSummaryCard from '../components/order-summary-card';
import { useLocales } from '../locales/use-locales';
import { useOrderLookup } from '../hooks/use-order-lookup';

const ID_RE = /^DXN-[A-Z2-9]{6}$/;

export default function TrackPage() {
  const navigate = useNavigate();
  const { t } = useLocales();
  const [params] = useSearchParams();
  const queryId = (params.get('order') || '').toUpperCase();

  const [draft, setDraft] = useState(queryId);
  const [submitted, setSubmitted] = useState(queryId);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setDraft(queryId);
    setSubmitted(queryId);
  }, [queryId]);

  const { order, error, loading } = useOrderLookup(submitted);

  const onSubmit = (e) => {
    e.preventDefault();
    const next = draft.trim().toUpperCase();
    if (!ID_RE.test(next)) {
      setValidationError(t('track.invalid_format'));
      return;
    }
    setValidationError('');
    navigate(`/track?order=${encodeURIComponent(next)}`);
    setSubmitted(next);
  };

  return (
    <>
      <Helmet>
        <title>Track order · DXN Spirulina</title>
      </Helmet>

      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h2">{t('track.title')}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('track.subtitle')}
          </Typography>
        </Stack>

        <Card sx={{ p: { xs: 2.5, md: 3 }, mb: 3 }}>
          <Stack
            component="form"
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            onSubmit={onSubmit}
          >
            <TextField
              fullWidth
              value={draft}
              onChange={(e) => setDraft(e.target.value.toUpperCase())}
              label={t('track.order_id_label')}
              placeholder="DXN-XXXXXX"
              error={!!validationError}
              helperText={validationError || t('track.order_id_helper')}
              inputProps={{ autoCapitalize: 'characters', spellCheck: 'false', dir: 'ltr' }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={18} thickness={5} sx={{ color: 'inherit' }} />
                ) : (
                  <Iconify icon="solar:magnifer-bold" width={20} />
                )
              }
              sx={{ minWidth: { sm: 140 }, height: 56 }}
            >
              {t('track.lookup')}
            </Button>
          </Stack>
        </Card>

        {loading ? (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        ) : error === 'not_found' ? (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Iconify icon="solar:question-circle-bold" width={44} sx={{ color: 'text.disabled', mb: 1 }} />
            <Typography variant="subtitle1">{t('track.not_found_title')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('track.not_found_body')}
            </Typography>
          </Card>
        ) : error ? (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Iconify icon="solar:danger-triangle-bold" width={44} sx={{ color: 'error.main', mb: 1 }} />
            <Typography variant="subtitle1">{t('track.error_title')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('track.error_body')}
            </Typography>
          </Card>
        ) : order ? (
          <Stack spacing={3}>
            <Card sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {t('thank_you.status_title')}
              </Typography>
              <OrderStatus status={order.status} />
            </Card>
            <OrderSummaryCard order={order} />
          </Stack>
        ) : null}
      </Box>
    </>
  );
}
