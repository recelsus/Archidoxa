import { layout_defaults, list_layout_registry } from '../../config/layouts.ts';
import { resolve_layout } from '../../core/resolve_layout.ts';
import { to_entry_href, to_tag_href } from '../../core/routes.ts';

export interface ContentEntryData {
  title: string;
  description?: string;
  pub_date: Date;
  updated_date?: Date;
  hero_image?: ContentImage;
  hero_image_alt?: string;
  tags: string[];
}

export interface ContentImage {
  src: string;
  width: number;
  height: number;
}

export interface ContentEntryLike {
  id: string;
  data: ContentEntryData;
}

export interface EntryListItemViewModel {
  title: string;
  description: string | null;
  href: string;
  published_at: string;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
  } | null;
  tags: Array<{
    label: string;
    href: string;
  }>;
}

export interface EntryDetailViewModel {
  title: string;
  description: string | null;
  published_at: string;
  source: {
    section_name: string;
    entry_id: string;
  };
}

export function to_entry_list_item_view_model(
  section_name: string,
  entry: ContentEntryLike,
): EntryListItemViewModel {
  return {
    title: entry.data.title,
    description: entry.data.description ?? null,
    href: to_entry_href(section_name, entry.id),
    published_at: entry.data.pub_date.toISOString(),
    image: entry.data.hero_image
      ? {
          src: entry.data.hero_image.src,
          width: entry.data.hero_image.width,
          height: entry.data.hero_image.height,
          alt: entry.data.hero_image_alt ?? '',
        }
      : null,
    tags: entry.data.tags.map((tag) => ({
      label: tag,
      href: to_tag_href(tag),
    })),
  };
}

export function to_entry_detail_view_model(
  section_name: string,
  entry: ContentEntryLike,
): EntryDetailViewModel {
  return {
    title: entry.data.title,
    description: entry.data.description ?? null,
    published_at: entry.data.pub_date.toISOString(),
    source: {
      section_name,
      entry_id: entry.id,
    },
  };
}

export function resolve_list_layout_name(requested_layout: string | null | undefined): string {
  return resolve_layout(requested_layout, layout_defaults.list_layout, list_layout_registry).resolved_layout;
}
