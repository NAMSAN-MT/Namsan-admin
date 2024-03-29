import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
  },
  build: {
    outDir: 'public',
  },
  define: {
    'process.env': {
      VITE_WEBHOOK_TOKEN: process.env.VITE_WEBHOOK_TOKEN,
    },
  },
});
