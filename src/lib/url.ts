// Base-path-aware URL helper.
//
// With `base: '/hernanc'` in astro.config.mjs, Astro does NOT automatically
// prefix hand-written `href`/`src` strings. Every internal link in this
// project goes through `href()` so the site works both locally and on
// GitHub Pages — and so a future repo rename / custom domain only requires
// changing `base` in astro.config.mjs.

const BASE = import.meta.env.BASE_URL; // e.g. "/hernanc/"

/** Build an internal URL that respects the configured base path. */
export function href(path = '/'): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rest = path === '/' ? '' : `/${path.replace(/^\/+/, '')}`;
  return `${base}${rest}` || '/';
}

/** Resolve a `public/` asset to a base-aware URL. */
export function asset(path: string): string {
  return href(path);
}

/** True when the given path is the current page (for nav highlighting). */
export function isActive(currentPath: string, linkPath: string): boolean {
  const normalize = (p: string) => p.replace(/\/+$/, '') || '/';
  const current = normalize(currentPath);
  const link = normalize(href(linkPath));
  if (link === href('/')) return current === link;
  return current === link || current.startsWith(`${link}/`);
}
