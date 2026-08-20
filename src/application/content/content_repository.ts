import type { ContentEntryLike } from './entry_view_models.ts';

export interface ContentRepository<Entry extends ContentEntryLike = ContentEntryLike> {
  list_entries(section_name: string): Promise<Entry[]>;
  get_entry(section_name: string, entry_id: string): Promise<Entry | null>;
}
