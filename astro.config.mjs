// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages note:
// TEMPORARY — `base` is '/hernanc' so the site previews as a project site at
// https://hernanc.github.io/hernanc while the repo is still named
// `hernanc/hernanc`. After the repo is renamed to `hernanc.github.io` (a user
// site served at the apex https://hernanc.github.io), set `base` back to '/'.
// Internal links go through the `href()` helper in src/lib/url.ts.
export default defineConfig({
  site: 'https://hernanc.github.io',
  base: '/hernanc',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-default' },
      wrap: true,
    },
  },
});
