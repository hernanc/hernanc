// Central site metadata. Edit values marked STUB with your real details.

export const SITE = {
  /** Wordmark shown in the header. */
  wordmark: 'HernanC',
  /** Full name for titles, RSS, structured data. */
  author: 'Hernán Calabrese',
  /** One-line role, shown under the name on the home hero. */
  role: 'Backend & Infrastructure Engineer',
  /** Used for <title> suffix and metadata. */
  title: 'Hernán Calabrese',
  /** Default meta description / RSS channel description. */
  description:
    'Notes on backend services, cloud infrastructure, and keeping software healthy in production, by Hernán Calabrese.',
  email: 'hernancalabrese@gmail.com',
};

// Primary navigation. `path` is relative, `href()` adds the base path.
export const NAV: { label: string; path: string }[] = [
  { label: 'Writing', path: '/blog' },
  { label: 'About', path: '/about' },
];

// Social / contact links shown in the footer.
// STUB: replace the placeholder handles with your real profiles.
export const SOCIALS: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/hernanc' }, // STUB
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hcalabrese' },
  { label: 'X', href: 'https://x.com/hernanc' }, // STUB
  { label: 'Email', href: 'mailto:hernancalabrese@gmail.com' },
];
