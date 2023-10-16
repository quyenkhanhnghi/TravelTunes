import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@emotion/react', '@mui/styled-engine', '@emotion/cache'],
  },
  resolve: {
    alias: {
      '@emotion/react': require.resolve('@emotion/react'),
      '@mui/styled-engine': require.resolve('@mui/styled-engine'),
    },
  },
  build: {
    rollupOptions: {
      external: ['mapbox-gl/dist/mapbox-gl.css'],
    },
  },
});
