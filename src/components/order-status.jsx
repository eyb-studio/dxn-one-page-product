import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import Iconify from './iconify';
import { useLocales } from '../locales/use-locales';

const STEPS = [
  { key: 'pending', icon: 'solar:document-add-bold', color: 'info' },
  { key: 'confirmed', icon: 'solar:phone-calling-bold', color: 'warning' },
  { key: 'dispatched', icon: 'solar:delivery-bold', color: 'secondary' },
  { key: 'delivered', icon: 'solar:check-circle-bold', color: 'success' },
];

export default function OrderStatus({ status = 'pending' }) {
  const { t } = useLocales();

  if (status === 'cancelled') {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 1.5,
          bgcolor: 'error.lighter',
          color: 'error.darker',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Iconify icon="solar:close-circle-bold" width={22} />
        <Typography variant="subtitle2">{t('order_status.cancelled')}</Typography>
      </Box>
    );
  }

  const currentIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.key === status)
  );

  return (
    <Stack spacing={2.5}>
      {STEPS.map((step, i) => {
        const reached = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <Stack key={step.key} direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: (th) =>
                  reached
                    ? alpha(th.palette[step.color].main, isCurrent ? 0.24 : 0.16)
                    : 'background.neutral',
                color: reached ? `${step.color}.darker` : 'text.disabled',
                border: (th) =>
                  isCurrent ? `2px solid ${th.palette[step.color].main}` : '2px solid transparent',
              }}
            >
              <Iconify icon={step.icon} width={20} />
            </Box>
            <Stack spacing={0.25} sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: reached ? 'text.primary' : 'text.disabled' }}
              >
                {t(`order_status.${step.key}`)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {t(`order_status.${step.key}_desc`)}
              </Typography>
            </Stack>
            {isCurrent ? (
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.75,
                  typography: 'caption',
                  fontWeight: 700,
                  bgcolor: (th) => alpha(th.palette[step.color].main, 0.16),
                  color: `${step.color}.darker`,
                }}
              >
                {t('order_status.now')}
              </Box>
            ) : null}
          </Stack>
        );
      })}
    </Stack>
  );
}
