import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// HTTPS in dev is only needed so navigator.geolocation works on phones over LAN.
// @vitejs/plugin-basic-ssl is loaded lazily and only during `vite` (serve);
// production builds on Vercel/CI never need it, so it's not a hard dependency.
export default defineConfig(async ({ command }) => {
  const plugins = [react()];
  let https = false;

  if (command === 'serve') {
    try {
      const { default: basicSsl } = await import('@vitejs/plugin-basic-ssl');
      plugins.push(basicSsl());
      https = true;
    } catch {
      console.warn(
        '[vite] @vitejs/plugin-basic-ssl not installed — dev server will run on http. ' +
          'Install it (`pnpm add -D @vitejs/plugin-basic-ssl`) if you need HTTPS for geolocation.'
      );
    }
  }

  return {
    plugins,
    server: { host: true, https },
  };
});
