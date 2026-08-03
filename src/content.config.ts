import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { content_sections } from './config/content_sections';
import { make_common_content_schema } from './infrastructure/astro_content/content_schema';

export const collections = Object.fromEntries(
  content_sections.map((section) => [
    section.name,
    defineCollection({
      loader: glob({
        base: `./src/content/${section.name}`,
        pattern: '**/*.{md,mdx}',
      }),
      schema: make_common_content_schema,
    }),
  ]),
);
