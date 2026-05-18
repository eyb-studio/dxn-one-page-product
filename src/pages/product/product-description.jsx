import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { useLocales } from '../../locales/use-locales';

export default function ProductDescription({ product }) {
  const { t } = useLocales();
  const [value, setValue] = useState('description');

  return (
    <Card sx={{ p: { xs: 2.5, md: 4 }, mt: { xs: 4, md: 6 } }}>
      <Tabs
        value={value}
        onChange={(_, v) => setValue(v)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab value="description" label={t('product.description_tab')} />
        <Tab value="details" label={t('product.details_tab')} />
      </Tabs>

      {value === 'description' ? (
        <Stack spacing={2} sx={{ color: 'text.secondary' }}>
          {product.description.map((p, i) => (
            <Typography key={i} variant="body2">
              {p}
            </Typography>
          ))}
        </Stack>
      ) : (
        <Box
          component="dl"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'max-content 1fr' },
            columnGap: 4,
            rowGap: 1.5,
            m: 0,
          }}
        >
          {product.details.map((d) => (
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
