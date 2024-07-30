import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    proxy: {
      '/socket': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
      '/graphql': {
        target: 'http://localhost:4001', // GraphQL endpoint
        changeOrigin: true,
      },
    },
  },
});
