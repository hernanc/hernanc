# HernanC

A personal technical blog for **Hernán Calabrese** — articles on software
engineering, applied AI, and the craft of building reliable systems.

Built with [Astro](https://astro.build), deployed to GitHub Pages, and authored
entirely from **GitHub issues**.

## Stack

- **Astro 5** — static site, near-zero JavaScript
- **Markdown** content collections with **Shiki** syntax highlighting
- Light / dark theme, RSS feed, sitemap
- Self-hosted fonts (Inter, Newsreader, JetBrains Mono)

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build → dist/
npm run preview  # serve the built site locally
npm run check    # type + content schema checks
```

## Writing a post

Posts are written as **GitHub issues**, not files.

1. Open a new issue using the **“New blog post”** template.
2. The issue **title** becomes the post title; fill in the **Summary** and
   **Article** fields. Paste images directly into the Article field.
3. Add the **`publish`** label to the issue.

A GitHub Action ([`publish-from-issue.yml`](.github/workflows/publish-from-issue.yml))
then:

- converts the issue into `src/content/blog/<slug>.md`,
- downloads embedded images into `src/assets/posts/<slug>/`,
- commits the post to `main`, comments on the issue, and closes it.

Committing to `main` triggers [`deploy.yml`](.github/workflows/deploy.yml), which
builds and publishes the site. You can also still add posts by hand — just drop
a Markdown file in `src/content/blog/`.

### One-time GitHub setup

- **Settings → Pages → Source:** set to **GitHub Actions**.
- Create a repository label named **`publish`** (used to trigger publishing).
- Merge this branch into `main` — both workflows are wired to `main`.

## Deployment

This is the `hernanc.github.io` GitHub Pages **user site**, served at the apex
`https://hernanc.github.io`. The `site` and `base` values in
[`astro.config.mjs`](astro.config.mjs) are the only place URLs are configured;
every internal link goes through the `href()` helper in `src/lib/url.ts`.

- **Custom domain** — add `public/CNAME` containing the domain and point
  `site` at it in `astro.config.mjs`. No link edits are needed.

## Stubs to personalize

This site ships with clearly-marked placeholder content:

- **Bio** — `src/pages/index.astro` and `src/pages/about.astro` (look for
  `STUB` comments and the *Selected work* list).
- **Social links** — `src/consts.ts` (`SOCIALS`).
- **Sample posts** — the three files in `src/content/blog/`.
- **Open Graph image / favicon** — `public/og.svg`, `public/favicon.svg`.

## Project structure

```
src/
  components/   UI building blocks (Header, Footer, PostCard, …)
  content/blog/ Markdown posts
  layouts/      Page + post layouts
  pages/        Routes (home, /blog, /about, RSS, 404)
  lib/          Helpers (base-path URLs, post queries)
  styles/       global.css — the design system
scripts/
  issue-to-post.mjs   Issue → Markdown conversion
.github/
  workflows/    deploy + publish-from-issue
  ISSUE_TEMPLATE/  the "New blog post" form
```
