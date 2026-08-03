import type { SchemaContext } from 'astro:content';
import { z } from 'astro/zod';

export function make_common_content_schema({ image }: SchemaContext) {
  return z.object({
    title: z.string(),
    description: z.string().optional(),
    pub_date: z.coerce.date(),
    updated_date: z.coerce.date().optional(),
    status: z.enum(['draft', 'public', 'hidden']).default('draft'),
    entry_layout: z.string().optional(),
    hero_image: image().optional(),
    hero_image_alt: z.string().optional(),
    tags: z.array(z.string()).default([]),
  });
}
