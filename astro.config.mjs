// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages note:
// This is the `hernanc.github.io` user site, served at the apex
// https://hernanc.github.io — hence `base: '/'`.
// For a custom domain, add `public/CNAME` and point `site` at the domain.
// Internal links go through the `href()` helper in src/lib/url.ts, so `site`
// and `base` are the only values that ever need to change.
export default defineConfig({
  site: 'https://hernanc.github.io',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-default' },
      wrap: true,
    },
  },
});
