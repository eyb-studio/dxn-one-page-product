import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// HTTPS in dev temporarily disabled. To re-enable for phone geolocation
// over LAN, install @vitejs/plugin-basic-ssl and restore the conditional
// loader from git history.
export default defineConfig(() => ({
  plugins: [react()],
  server: {
    host: true,
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
