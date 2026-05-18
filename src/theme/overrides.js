import { alpha } from '@mui/material/styles';
import { grey } from './palette';

export function componentsOverrides(theme) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        html: { margin: 0, padding: 0, width: '100%', height: '100%', WebkitOverflowScrolling: 'touch' },
        body: { margin: 0, padding: 0, width: '100%', height: '100%' },
        '#root': { width: '100%', height: '100%' },
        input: { '&[type=number]': { MozAppearance: 'textfield', '&::-webkit-outer-spin-button': { margin: 0, WebkitAppearance: 'none' }, '&::-webkit-inner-spin-button': { margin: 0, WebkitAppearance: 'none' } } },
        img: { maxWidth: '100%', display: 'inline-block', verticalAlign: 'bottom' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
        sizeLarge: { height: 48, paddingInline: 22 },
        sizeMedium: { height: 36 },
        sizeSmall: { height: 30 },
        containedInherit: { color: theme.palette.common.white, backgroundColor: grey[800], '&:hover': { backgroundColor: grey[700] } },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        outlined: { borderColor: alpha(grey[500], 0.16) },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          boxShadow: theme.customShadows.card,
          borderRadius: theme.shape.borderRadius * 2,
          zIndex: 0,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 2 },
        },
        notchedOutline: { borderColor: alpha(grey[500], 0.32) },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiAppBar: { defaultProps: { color: 'transparent' } },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: theme.palette.text.primary },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 48,
          padding: 0,
          opacity: 1,
          fontWeight: theme.typography.fontWeightSemiBold,
          color: theme.palette.text.secondary,
          '&.Mui-selected': { color: theme.palette.text.primary },
          '&:not(:last-of-type)': { marginRight: theme.spacing(3) },
        },
      },
    },
    MuiLink: { defaultProps: { underline: 'hover' } },
    MuiSwitch: {
      styleOverrides: {
        thumb: { boxShadow: theme.customShadows.z1 },
      },
    },
  };
}
