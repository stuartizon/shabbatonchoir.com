import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One YAML file per album in src/content/albums, with its cover image
// beside it. The Music page lists them newest first.
const albums = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/albums' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      year: z.number().int(),
      cover: image(),
      description: z.string().optional(),
      spotify: z.url(),
      apple: z.url(),
      amazon: z.url(),
    }),
});

// The body text of the Home, History and Leadership pages, one Markdown
// file each in src/content/pages. Front matter sets the page heading, and
// will set the meta description once pages have their own (#15).
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { albums, pages };
