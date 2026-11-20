import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.shabbatonchoir.com',
  build: {
    // Write /music as music.html rather than music/index.html, so the URLs
    // stay exactly as they were on Next (no trailing-slash redirects).
    format: 'file',
  },
  trailingSlash: 'never',
  // Lists every page at its www address in /sitemap-index.xml (#19).
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // Keep quotes and apostrophes exactly as the client wrote them, rather
    // than turning straight quotes into curly ones.
    smartypants: false,
  },
});
