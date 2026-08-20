import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

import type { ContentRepository } from '../../application/content/content_repository.ts';

export type AstroContentEntry = CollectionEntry<string>;

export class AstroContentRepository implements ContentRepository<AstroContentEntry> {
  async list_entries(section_name: string): Promise<AstroContentEntry[]> {
    try {
      return await getCollection(section_name);
    } catch {
      return [];
    }
  }

  async get_entry(section_name: string, entry_id: string): Promise<AstroContentEntry | null> {
    return (await getEntry(section_name, entry_id)) ?? null;
  }
}
