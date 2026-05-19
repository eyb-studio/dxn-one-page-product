import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useTheme, alpha } from '@mui/material/styles';

import Iconify from '../../components/iconify';

const MAIN_HEIGHT = { xs: 320, sm: 420, md: 520 };
const THUMB_SIZE = 64;

export default function ProductCarousel({ images, alt }) {
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

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
          cursor: 'zoom-in',
        }}
        onClick={() => setZoomOpen(true)}
      >
        <Box
          component="img"
          src={images[index]}
          alt={alt}
          sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: 12,
            insetInlineStart: 12,
            px: 1,
            py: 0.5,
            borderRadius: 999,
            bgcolor: alpha(theme.palette.common.black, 0.5),
            color: 'common.white',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            typography: 'caption',
            pointerEvents: 'none',
          }}
        >
          <Iconify icon="solar:magnifer-zoom-in-bold" width={14} />
          Zoom
        </Box>

        <Stack
          direction="row"
          spacing={1}
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            bottom: 12,
            insetInlineEnd: 12,
            px: 1,
            py: 0.5,
            borderRadius: 999,
            bgcolor: alpha(theme.palette.common.black, 0.5),
            color: 'common.white',
            alignItems: 'center',
          }}
        >
          <IconButton size="small" onClick={prev} sx={{ color: 'inherit' }} aria-label="previous">
            <Iconify icon={isRtl ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'} width={18} />
          </IconButton>
          <Box sx={{ typography: 'caption' }}>
            {index + 1} / {images.length}
          </Box>
          <IconButton size="small" onClick={next} sx={{ color: 'inherit' }} aria-label="next">
            <Iconify icon={isRtl ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} width={18} />
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

      <ZoomLightbox
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        images={images}
        index={index}
        onPrev={prev}
        onNext={next}
        alt={alt}
        isRtl={isRtl}
      />
    </Box>
  );
}

function ZoomLightbox({ open, onClose, images, index, onPrev, onNext, alt, isRtl }) {
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            bgcolor: 'rgba(0,0,0,0.92)',
            outline: 'none',
          }}
        >
          <TransformWrapper
            key={index}
            initialScale={1}
            minScale={1}
            maxScale={5}
            doubleClick={{ mode: 'toggle', step: 2 }}
            wheel={{ step: 0.2 }}
            pinch={{ step: 5 }}
            panning={{ velocityDisabled: true }}
            limitToBounds
            centerOnInit
          >
            <TransformComponent
              wrapperStyle={{ width: '100vw', height: '100vh' }}
              contentStyle={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={images[index]}
                alt={alt}
                draggable={false}
                sx={{
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                  objectFit: 'contain',
                  userSelect: 'none',
                }}
              />
            </TransformComponent>
          </TransformWrapper>

          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{
              position: 'fixed',
              top: 16,
              insetInlineEnd: 16,
              bgcolor: 'rgba(255,255,255,0.12)',
              color: 'common.white',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
            }}
          >
            <Iconify icon="mingcute:close-line" width={22} />
          </IconButton>

          {images.length > 1 ? (
            <>
              <IconButton
                onClick={onPrev}
                aria-label="previous"
                sx={{
                  position: 'fixed',
                  top: '50%',
                  insetInlineStart: 16,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.12)',
                  color: 'common.white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
                }}
              >
                <Iconify icon={isRtl ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'} width={22} />
              </IconButton>
              <IconButton
                onClick={onNext}
                aria-label="next"
                sx={{
                  position: 'fixed',
                  top: '50%',
                  insetInlineEnd: 16,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.12)',
                  color: 'common.white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
                }}
              >
                <Iconify icon={isRtl ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} width={22} />
              </IconButton>
            </>
          ) : null}

          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.12)',
              color: 'common.white',
              typography: 'caption',
            }}
          >
            {index + 1} / {images.length} · pinch / scroll to zoom · drag to pan
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
