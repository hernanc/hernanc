// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages note:
// This project repo is `hernanc/hernanc`, so Pages serves the site under
// https://hernanc.github.io/hernanc — hence `base: '/hernanc'`.
// If you rename the repo to `hernanc.github.io` or attach a custom domain,
// set `base: '/'` (and update `site`). Every internal link goes through the
// `href()` helper in src/lib/url.ts, so those two values are all that change.
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
