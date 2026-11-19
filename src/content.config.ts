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

export const collections = { albums };
