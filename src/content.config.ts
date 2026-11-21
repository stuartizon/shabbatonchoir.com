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
      // The title in Hebrew, where the cover has one.
      hebrewName: z.string().optional(),
      year: z.number().int(),
      cover: image(),
      description: z.string().optional(),
      spotify: z.url(),
      apple: z.url(),
      amazon: z.url(),
    }),
});

// The body text of the Home, History and Leadership pages, one Markdown
// file each in src/content/pages. Front matter sets the page heading and the
// meta description search results show.
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string(),
  }),
});

// The Leadership page's people, one Markdown file each in
// src/content/leaders, with their bio as the body. The page lists them by
// order. Without a portrait, a placeholder shows until one arrives.
const leaders = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/leaders' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      order: z.number().int(),
      portrait: image().optional(),
    }),
});

export const collections = { albums, pages, leaders };
