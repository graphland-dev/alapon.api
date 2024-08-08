import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

// const manifestForPlugin: Partial<VitePWAOptions> = {
//   registerType: 'prompt',
//   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
//   manifest: {
//     name: 'Weather Ups',
//     short_name: 'Weathe Ups',
//     description: 'An app that can show weather forecast for your city.',
//     theme_color: '#171717',
//     background_color: '#e8ebf2',
//     display: 'standalone',
//     scope: '/',
//     start_url: '/',
//     orientation: 'portrait',
//   },
// };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // plugins: [react(), VitePWA()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
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
