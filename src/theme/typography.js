export function pxToRem(value) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (min-width:600px)': { fontSize: pxToRem(sm) },
    '@media (min-width:900px)': { fontSize: pxToRem(md) },
    '@media (min-width:1200px)': { fontSize: pxToRem(lg) },
  };
}

export const primaryFont = 'Public Sans, sans-serif';
export const secondaryFont = 'Barlow, sans-serif';

export const typography = {
  fontFamily: primaryFont,
  fontSecondaryFamily: secondaryFont,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: { fontWeight: 800, lineHeight: 1.5, fontSize: pxToRem(24), ...responsiveFontSizes({ sm: 23, md: 27, lg: 30 }) },
  h2: { fontWeight: 800, lineHeight: 1.5, fontSize: pxToRem(24), ...responsiveFontSizes({ sm: 21, md: 25, lg: 28 }) },
  h3: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(18), ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }) },
  h4: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(18), ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }) },
  h5: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(18), ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }) },
  h6: { fontWeight: 700, lineHeight: 28 / 18, fontSize: pxToRem(17), ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }) },
  subtitle1: { fontWeight: 600, lineHeight: 1.5, fontSize: pxToRem(16) },
  subtitle2: { fontWeight: 600, lineHeight: 22 / 14, fontSize: pxToRem(14) },
  body1: { lineHeight: 1.5, fontSize: pxToRem(16) },
  body2: { lineHeight: 22 / 14, fontSize: pxToRem(14) },
  caption: { lineHeight: 1.5, fontSize: pxToRem(12) },
  overline: { fontWeight: 700, lineHeight: 1.5, fontSize: pxToRem(12), textTransform: 'uppercase' },
  button: { fontWeight: 700, lineHeight: 24 / 14, fontSize: pxToRem(14), textTransform: 'unset' },
};
