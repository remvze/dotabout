import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

export default defineConfig({
  adapter: vercel(),
  integrations: [react(), sitemap()],
  output: 'server',
  site: 'https://dotabout.me',
});
