import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { useTheme, alpha } from '@mui/material/styles';

import Iconify from '../../components/iconify';

const MAIN_HEIGHT = { xs: 320, sm: 420, md: 520 };
const THUMB_SIZE = 64;

export default function ProductCarousel({ images, alt }) {
  const theme = useTheme();
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 3,
          bgcolor: 'background.neutral',
          height: MAIN_HEIGHT,
          boxShadow: (t) => t.customShadows.card,
        }}
      >
        <Box
          component="img"
          src={images[index]}
          alt={alt}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.5s ease',
          }}
        />

        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            px: 1,
            py: 0.5,
            borderRadius: 999,
            bgcolor: alpha(theme.palette.common.black, 0.5),
            color: 'common.white',
            alignItems: 'center',
          }}
        >
          <IconButton size="small" onClick={prev} sx={{ color: 'inherit' }} aria-label="previous">
            <Iconify icon="eva:arrow-ios-back-fill" width={18} />
          </IconButton>
          <Box sx={{ typography: 'caption' }}>
            {index + 1} / {images.length}
          </Box>
          <IconButton size="small" onClick={next} sx={{ color: 'inherit' }} aria-label="next">
            <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
          </IconButton>
        </Stack>
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ overflowX: 'auto', pb: 1 }}>
        {images.map((src, i) => (
          <Avatar
            key={src}
            variant="rounded"
            src={src}
            onClick={() => setIndex(i)}
            sx={{
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              cursor: 'pointer',
              flexShrink: 0,
              opacity: i === index ? 1 : 0.48,
              border: i === index ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
              transition: 'opacity 0.2s, border-color 0.2s',
              '&:hover': { opacity: 1 },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
