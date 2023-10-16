import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@mui/styled-engine',
      '@emotion/cache',
      '@mui/system',
    ],
  },
  resolve: {
    alias: {
      '@emotion/react': '@emotion/react',
      '@mui/styled-engine': '@mui/styled-engine',
    },
  },
  build: {
    rollupOptions: {
      external: ['mapbox-gl/dist/mapbox-gl.css'],
    },
  },
});
