// Converts a GitHub issue into a Markdown blog post.
//
// Used by .github/workflows/publish-from-issue.yml. The issue JSON is passed
// in via the ISSUE_PAYLOAD env var (`toJSON(github.event.issue)`). The script:
//   1. parses the "New blog post" issue form,
//   2. downloads any embedded images into src/assets/posts/<slug>/,
//   3. writes src/content/blog/<slug>.md with proper front matter.
//
// Run locally for testing:
//   ISSUE_PAYLOAD='{"title":"Test","body":"### Summary\n\nHi\n\n### Article\n\nBody","number":1,"labels":[]}' \
//     node scripts/issue-to-post.mjs

import { appendFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const CONTENT_DIR = 'src/content/blog';
const ASSETS_ROOT = 'src/assets/posts';
const CONTROL_LABELS = new Set(['publish', 'draft']);

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

/** Turn arbitrary text into a URL-safe slug. */
function slugify(text) {
  const slug = text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
  return slug || 'post';
}

/** Ensure the slug is unique within the content directory. */
async function uniqueSlug(base) {
  let existing = [];
  try {
    existing = await readdir(CONTENT_DIR);
  } catch {
    /* directory may not exist yet */
  }
  const taken = new Set(existing.map((f) => f.replace(/\.md$/, '')));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** Quote a string safely for YAML front matter. */
function yaml(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/** Parse a GitHub issue-form body into a { heading: value } map. */
function parseForm(body) {
  const sections = {};
  for (const chunk of body.split(/^### +/m)) {
    const nl = chunk.indexOf('\n');
    if (nl === -1) continue;
    const heading = chunk.slice(0, nl).trim().toLowerCase();
    const value = chunk.slice(nl + 1).trim();
    if (heading) sections[heading] = value === '_No response_' ? '' : value;
  }
  return sections;
}

function extFromContentType(type) {
  const map = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  };
  return map[(type || '').split(';')[0].trim().toLowerCase()];
}

/** Download a remote image into the post's asset folder; return its filename. */
async function downloadImage(url, slug, index, token) {
  const headers = { 'user-agent': 'hernanc-blog-bot' };
  if (token && /githubusercontent\.com|github\.com/.test(url)) {
    headers.authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, { headers, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);

  const ext =
    extFromContentType(res.headers.get('content-type')) ||
    (url.match(/\.(png|jpe?g|gif|webp|svg|avif)(?:\?|$)/i)?.[1] ?? 'png')
      .toLowerCase()
      .replace('jpeg', 'jpg');

  const dir = join(ASSETS_ROOT, slug);
  await mkdir(dir, { recursive: true });
  const filename = `image-${index}.${ext}`;
  await writeFile(join(dir, filename), Buffer.from(await res.arrayBuffer()));
  return filename;
}

/**
 * Download every image referenced in the body and rewrite the references to
 * local, relative paths so Astro can optimize them. Failed downloads keep
 * their original remote URL so the post still renders.
 */
async function localizeImages(body, slug, token) {
  const pattern = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  const matches = [...body.matchAll(pattern)];
  let result = body;
  let index = 1;

  for (const [, alt, url] of matches) {
    try {
      const filename = await downloadImage(url, slug, index, token);
      const local = `../../assets/posts/${slug}/${filename}`;
      result = result.replace(`![${alt}](${url})`, `![${alt}](${local})`);
      console.log(`  ↓ image ${index}: ${url} → ${local}`);
      index++;
    } catch (err) {
      console.warn(`  ! kept remote image (${err.message})`);
    }
  }
  return result;
}

async function main() {
  const raw = process.env.ISSUE_PAYLOAD;
  if (!raw) fail('ISSUE_PAYLOAD env var is not set.');

  let issue;
  try {
    issue = JSON.parse(raw);
  } catch {
    fail('ISSUE_PAYLOAD is not valid JSON.');
  }

  const title = (issue.title || '').trim();
  if (!title) fail('Issue has no title.');

  const body = (issue.body || '').replace(/\r\n/g, '\n');
  const hasForm = /^### /m.test(body);

  let description = '';
  let article = '';
  let formTags = '';

  if (hasForm) {
    const form = parseForm(body);
    description = form['summary'] || form['description'] || '';
    article = form['article'] || form['body'] || form['content'] || '';
    formTags = form['tags'] || '';
  } else {
    // Free-form issue: first non-empty line is the summary, body is the post.
    const lines = body.split('\n').map((l) => l.trim());
    description = lines.find(Boolean) || title;
    article = body.trim();
  }

  if (!article.trim()) fail('No article body found in the issue.');
  if (!description.trim()) description = title;

  // Tags: issue labels (minus control labels) plus any from the Tags field.
  const labelTags = (issue.labels || [])
    .map((l) => (typeof l === 'string' ? l : l.name))
    .filter((name) => name && !CONTROL_LABELS.has(name.toLowerCase()));
  const fieldTags = formTags
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
  const tags = [...new Set([...labelTags, ...fieldTags])];

  const slug = await uniqueSlug(slugify(title));
  const token = process.env.GITHUB_TOKEN;
  article = await localizeImages(article, slug, token);

  const pubDate = new Date().toISOString().slice(0, 10);

  const frontMatter = [
    '---',
    `title: ${yaml(title)}`,
    `description: ${yaml(description.replace(/\s+/g, ' ').trim())}`,
    `pubDate: ${pubDate}`,
    `tags: [${tags.map(yaml).join(', ')}]`,
    'draft: false',
    `issue: ${Number(issue.number) || 0}`,
    '---',
    '',
  ].join('\n');

  await mkdir(CONTENT_DIR, { recursive: true });
  const file = join(CONTENT_DIR, `${slug}.md`);
  await writeFile(file, `${frontMatter}\n${article.trim()}\n`);
  console.log(`✓ wrote ${file}`);

  // Expose values to later workflow steps.
  if (process.env.GITHUB_OUTPUT) {
    const safeTitle = title.replace(/\n/g, ' ');
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `slug=${slug}\ntitle=${safeTitle}\n`,
    );
  }
}

main().catch((err) => fail(err.stack || String(err)));
