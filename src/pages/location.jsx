import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

const UAE_DIAL_CODE = '+971';

const toWesternDigits = (s = '') =>
  s
    .replace(/[٠-٩]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 0x30))
    .replace(/[۰-۹]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0x06f0 + 0x30));

const toLocalUAEPhone = (value = '') => {
  let digits = toWesternDigits(value).replace(/\D/g, '');
  if (digits.startsWith('00971')) digits = digits.slice(5);
  else if (digits.startsWith('971')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 9);
};

const UAE_LOCAL_MOBILE_RE = /^(50|52|54|55|56|58)\d{7}$/;

const isUAELocalMobile = (value) => UAE_LOCAL_MOBILE_RE.test(value ?? '');

// Strip invisible bidi / zero-width marks that mobile keyboards insert in
// RTL contexts — they break yup's email regex even though the user sees a
// clean string. Covers ZWSP/ZWNJ/ZWJ, LRM/RLM, LRE…RLO, LRI…PDI, BOM.
const BIDI_RE = new RegExp(
  '[\\u200B-\\u200F\\u202A-\\u202E\\u2066-\\u2069\\uFEFF]',
  'g'
);
const stripBidi = (value) =>
  typeof value === 'string' ? value.replace(BIDI_RE, '').trim() : value;

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';

import Iconify from '../components/iconify';
import { FormProvider, RHFTextField } from '../components/hook-form';
import { useOrder } from '../contexts/order-context';
import { useLocales } from '../locales/use-locales';

const DUBAI = { lat: 25.2048, lng: 55.2708 };

const createSchema = (t) =>
  yup.object().shape({
    fullname: yup.string().required('Full name is required'),
    phone: yup
      .string()
      .required(t('location.phone_required'))
      .test('uae-phone', t('location.phone_invalid'), isUAELocalMobile),
    email: yup
      .string()
      .transform(stripBidi)
      .required(t('location.email_required'))
      .email(t('location.email_invalid')),
    address: yup.string().required('Address is required'),
    building: yup.string().required('Building / Apartment is required'),
    city: yup.string().required('City is required'),
    emirate: yup.string().required('Emirate is required'),
    notes: yup.string(),
  });

function pickComponent(components, ...types) {
  for (const type of types) {
    const hit = components.find((c) => c.types.includes(type));
    if (hit) return hit.long_name;
  }
  return '';
}

export default function LocationPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLocales();
  const { address, setAddress } = useOrder();
  const [coords, setCoords] = useState(address?.coords ?? DUBAI);
  const [geocoding, setGeocoding] = useState(false);
  const [locating, setLocating] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: 'dxn-google-map',
  });

  const schema = useMemo(() => createSchema(t), [t]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: address?.fullname ?? '',
      phone: toLocalUAEPhone(address?.phone ?? ''),
      email: address?.email ?? '',
      address: address?.address ?? '',
      building: address?.building ?? '',
      city: address?.city ?? 'Dubai',
      emirate: address?.emirate ?? 'Dubai',
      notes: address?.notes ?? '',
    },
  });

  const { control, handleSubmit, setValue } = methods;

  const reverseGeocode = useCallback(
    async (point) => {
      if (!window.google?.maps?.Geocoder) return;
      setGeocoding(true);
      try {
        const geocoder = new window.google.maps.Geocoder();
        const { results } = await geocoder.geocode({ location: point });
        const place = results?.[0];
        if (!place) return;

        const street = [
          pickComponent(place.address_components, 'street_number'),
          pickComponent(place.address_components, 'route'),
        ]
          .filter(Boolean)
          .join(' ')
          .trim();

        const fallbackStreet = place.formatted_address?.split(',')[0] ?? '';
        const addressLine = street || fallbackStreet;
        const building = pickComponent(place.address_components, 'subpremise', 'premise');
        const city = pickComponent(
          place.address_components,
          'locality',
          'postal_town',
          'sublocality',
          'administrative_area_level_2'
        );
        const emirate = pickComponent(place.address_components, 'administrative_area_level_1');

        if (addressLine) setValue('address', addressLine, { shouldValidate: true });
        if (building) setValue('building', building);
        if (city) setValue('city', city, { shouldValidate: true });
        if (emirate) setValue('emirate', emirate, { shouldValidate: true });
      } catch (err) {
        const status = err?.code ?? err?.message ?? '';
        const msg = String(status).includes('REQUEST_DENIED')
          ? 'Enable the Geocoding API for your Maps key to auto-fill the address.'
          : 'Could not look up that address — fill it manually.';
        enqueueSnackbar(msg, { variant: 'warning' });
      } finally {
        setGeocoding(false);
      }
    },
    [enqueueSnackbar, setValue]
  );

  const pickLocation = useCallback(
    (point) => {
      setCoords(point);
      reverseGeocode(point);
    },
    [reverseGeocode]
  );

  const onUseCurrent = useCallback(() => {
    if (!navigator.geolocation) {
      enqueueSnackbar('Geolocation not supported in this browser', { variant: 'warning' });
      return;
    }
    if (!window.isSecureContext) {
      enqueueSnackbar(
        'Location requires HTTPS or localhost. Use the manual address fields below.',
        { variant: 'warning' }
      );
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        pickLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setLocating(false);
        const reason =
          err.code === 1
            ? 'Permission denied — allow location in browser settings.'
            : err.code === 2
            ? 'Position unavailable — try again or enter the address manually.'
            : err.code === 3
            ? 'Timed out. Try again.'
            : err.message || 'Could not get your location';
        enqueueSnackbar(reason, { variant: 'error' });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [enqueueSnackbar, pickLocation]);

  const onSubmit = handleSubmit((data) => {
    setAddress({ ...data, phone: `${UAE_DIAL_CODE}${data.phone}`, coords });
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
                  onClick={(e) => pickLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
                >
                  <MarkerF
                    position={coords}
                    draggable
                    onDragEnd={(e) => pickLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
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
                disabled={locating}
                startIcon={
                  locating ? (
                    <CircularProgress size={16} thickness={5} sx={{ color: 'text.secondary' }} />
                  ) : (
                    <Iconify icon="solar:gps-bold" width={18} />
                  )
                }
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

              {geocoding ? (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    boxShadow: (th) => th.customShadows.z8,
                  }}
                >
                  <CircularProgress size={12} thickness={6} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Looking up address…
                  </Typography>
                </Stack>
              ) : null}
            </Card>

            <Box sx={{ mt: 1.5, color: 'text.secondary', typography: 'caption' }}>
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2.5}>
                <RHFTextField name="fullname" label={t('location.fullname')} />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="tel"
                      label={t('location.phone')}
                      placeholder="50 123 4567"
                      onChange={(e) => field.onChange(toLocalUAEPhone(e.target.value))}
                      error={!!error}
                      helperText={error ? error.message : t('location.phone_helper')}
                      InputProps={{
                        [isRtl ? 'endAdornment' : 'startAdornment']: (
                          <InputAdornment
                            position={isRtl ? 'end' : 'start'}
                            sx={{ pointerEvents: 'none' }}
                          >
                            <Box component="span" dir="ltr">
                              {UAE_DIAL_CODE}
                            </Box>
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        inputMode: 'tel',
                        autoComplete: 'tel-national',
                        dir: 'ltr',
                        maxLength: 9,
                      }}
                    />
                  )}
                />
                <RHFTextField
                  name="email"
                  label={t('location.email')}
                  type="email"
                  placeholder="you@example.com"
                  helperText={t('location.email_helper')}
                  inputProps={{ inputMode: 'email', autoComplete: 'email', dir: 'ltr' }}
                />
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
                  endIcon={
                    <Iconify
                      icon={isRtl ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'}
                      width={20}
                    />
                  }
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
