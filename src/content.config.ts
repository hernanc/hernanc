import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts. Markdown files live in src/content/blog/<slug>.md and are
// authored either by hand or generated from GitHub issues by the
// publish-from-issue workflow (see scripts/issue-to-post.mjs).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Publication date, shown on every post.
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      // Optional hero image, optimized by Astro. Path is relative to the
      // markdown file, e.g. "../../assets/posts/<slug>/cover.jpg".
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      // GitHub issue number this post was generated from, when applicable.
      issue: z.number().optional(),
    }),
});

export const collections = { blog };
