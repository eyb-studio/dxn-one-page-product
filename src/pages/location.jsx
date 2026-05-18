import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';

import Iconify from '../components/iconify';
import { FormProvider, RHFTextField } from '../components/hook-form';
import { useOrder } from '../contexts/order-context';
import { useLocales } from '../locales/use-locales';

const DUBAI = { lat: 25.2048, lng: 55.2708 };

const schema = yup.object().shape({
  fullname: yup.string().required('Full name is required'),
  phone: yup.string().min(7, 'Phone is too short').required('Phone is required'),
  address: yup.string().required('Address is required'),
  building: yup.string(),
  city: yup.string().required('City is required'),
  emirate: yup.string().required('Emirate is required'),
  notes: yup.string(),
});

export default function LocationPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLocales();
  const { address, setAddress } = useOrder();
  const [coords, setCoords] = useState(address?.coords ?? DUBAI);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: 'dxn-google-map',
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: address?.fullname ?? '',
      phone: address?.phone ?? '',
      address: address?.address ?? '',
      building: address?.building ?? '',
      city: address?.city ?? 'Dubai',
      emirate: address?.emirate ?? 'Dubai',
      notes: address?.notes ?? '',
    },
  });

  const { handleSubmit } = methods;

  const onUseCurrent = useCallback(() => {
    if (!navigator.geolocation) {
      enqueueSnackbar('Geolocation not supported in this browser', { variant: 'warning' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => enqueueSnackbar('Could not get your location', { variant: 'error' })
    );
  }, [enqueueSnackbar]);

  const onSubmit = handleSubmit((data) => {
    setAddress({ ...data, coords });
    navigate('/review');
  });

  const mapContainer = useMemo(() => ({ width: '100%', height: '100%' }), []);

  return (
    <>
      <Helmet>
        <title>Delivery details · DXN Spirulina</title>
      </Helmet>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h2">{t('location.title')}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('location.subtitle')}
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: { xs: 300, md: 480 }, overflow: 'hidden', position: 'relative' }}>
              {apiKey && isLoaded && !loadError ? (
                <GoogleMap
                  mapContainerStyle={mapContainer}
                  center={coords}
                  zoom={13}
                  options={{ disableDefaultUI: true, zoomControl: true, clickableIcons: false }}
                  onClick={(e) => setCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                >
                  <Marker
                    position={coords}
                    draggable
                    onDragEnd={(e) => setCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                  />
                </GoogleMap>
              ) : (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  sx={{ height: '100%', p: 4, textAlign: 'center', bgcolor: 'background.neutral' }}
                >
                  <Iconify icon="solar:map-point-bold" width={48} sx={{ color: 'text.disabled' }} />
                  <Typography variant="subtitle1">Map unavailable</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env.local</code>. You can still fill the address manually below.
                  </Typography>
                </Stack>
              )}

              <Button
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="solar:gps-bold" width={18} />}
                onClick={onUseCurrent}
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  boxShadow: (th) => th.customShadows.z8,
                  '&:hover': { bgcolor: 'background.paper' },
                }}
              >
                {t('location.use_my_location')}
              </Button>
            </Card>

            <Box sx={{ mt: 1.5, color: 'text.secondary', typography: 'caption' }}>
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2.5}>
                <RHFTextField name="fullname" label={t('location.fullname')} />
                <RHFTextField name="phone" label={t('location.phone')} type="tel" />
                <RHFTextField name="address" label={t('location.address_line')} />
                <RHFTextField name="building" label={t('location.building')} />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <RHFTextField name="city" label={t('location.city')} />
                  <RHFTextField name="emirate" label={t('location.emirate')} />
                </Stack>
                <RHFTextField name="notes" label={t('location.notes')} multiline rows={2} />

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={20} />}
                  sx={{ boxShadow: (th) => th.customShadows.primary }}
                >
                  {t('location.continue')}
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
