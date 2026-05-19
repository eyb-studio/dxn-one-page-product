export const PIXEL_ID = '1394285362532308';

export function fbq(...args) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  try {
    window.fbq(...args);
  } catch {
    /* ignore — pixel must never break the app */
  }
}

export const trackEvent = (name, params) =>
  params ? fbq('track', name, params) : fbq('track', name);

export const trackPageView = () => fbq('track', 'PageView');
