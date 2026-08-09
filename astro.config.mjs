import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    mode: 'directory',
    functionDirectory: './functions',
  }),
  vite: {
    define: {
      CESIUM_BASE_URL: JSON.stringify('/cesium'),
    },
  },
});
