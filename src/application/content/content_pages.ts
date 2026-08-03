import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

import { pagination_config } from '@/config/pagination';
import { make_pagination, type PaginationViewModel } from '@/core/pagination';
import { is_public_entry } from '@/core/publication';
import { all_sections_name, to_entry_href, to_section_page_href } from '@/core/routes';
import { get_section_definition, get_visible_sections } from './content_sections';
import {
  resolve_list_layout_name,
  to_entry_detail_view_model,
  to_entry_list_item_view_model,
  type EntryDetailViewModel,
  type EntryListItemViewModel,
} from './entry_view_models';

export interface HeaderNavigationItem {
  label: string;
  href: string;
  section_name: string;
  current: boolean;
}

export interface ArticleTreeItem {
  title: string;
  href: string;
  section_name: string;
  section_label: string;
  description: string | null;
  published_at: string;
  tags: string[];
  current: boolean;
}

export interface CollectionPageViewModel {
  section: {
    name: string;
    display_name: string;
    description: string | null;
  };
  resolved_list_layout: string;
  entries: EntryListItemViewModel[];
  search_entries: EntryListItemViewModel[];
  pagination: PaginationViewModel;
}

export interface EntryPageViewModel {
  entry: EntryDetailViewModel;
  content_entry: AnyCollectionEntry;
}

type AnyCollectionEntry = CollectionEntry<string>;

const build_time = new Date();

function sort_public_entries(entries: AnyCollectionEntry[]): AnyCollectionEntry[] {
  return entries
    .filter((entry) => is_public_entry(entry.data, build_time))
    .sort((left, right) => right.data.pub_date.getTime() - left.data.pub_date.getTime());
}

async function get_section_entries(section_name: string): Promise<AnyCollectionEntry[]> {
  try {
    return await getCollection(section_name);
  } catch {
    return [];
  }
}

async function get_public_entries_for_section(section_name: string): Promise<AnyCollectionEntry[]> {
  return sort_public_entries(await get_section_entries(section_name));
}

async function get_all_public_entries(): Promise<Array<{ section_name: string; entry: AnyCollectionEntry }>> {
  const entries: Array<{ section_name: string; entry: AnyCollectionEntry }> = [];

  for (const section of get_visible_sections()) {
    const section_entries = await get_public_entries_for_section(section.name);
    section_entries.forEach((entry) => {
      entries.push({ section_name: section.name, entry });
    });
  }

  return entries.sort((left, right) => right.entry.data.pub_date.getTime() - left.entry.data.pub_date.getTime());
}

export async function get_header_navigation(current_section_name: string | null): Promise<HeaderNavigationItem[]> {
  const items = await Promise.all(
    get_visible_sections().map(async (section) => {
      const entries = await get_public_entries_for_section(section.name);

      if (entries.length === 0) {
        return null;
      }

      return {
        label: section.display_name,
        href: to_section_page_href(section.name, 1),
        section_name: section.name,
        current: current_section_name === section.name,
      };
    }),
  );

  const section_items = items.filter((item): item is HeaderNavigationItem => item !== null);
  return [
    {
      label: 'All',
      href: to_section_page_href(all_sections_name, 1),
      section_name: all_sections_name,
      current: current_section_name === all_sections_name,
    },
    ...section_items,
  ];
}

export async function get_article_tree_items(options: {
  current_section_name: string | null;
  current_entry_id: string | null;
}): Promise<ArticleTreeItem[]> {
  const items: ArticleTreeItem[] = [];

  for (const section of get_visible_sections().filter((section) => {
    return options.current_section_name === all_sections_name || options.current_section_name === section.name;
  })) {
    const entries = await get_public_entries_for_section(section.name);

    entries.forEach((entry) => {
      items.push({
        title: entry.data.title,
        href: to_entry_href(section.name, entry.id),
        section_name: section.name,
        section_label: section.display_name,
        description: entry.data.description ?? null,
        published_at: entry.data.pub_date.toISOString(),
        tags: entry.data.tags,
        current: options.current_section_name === section.name && options.current_entry_id === entry.id,
      });
    });
  }

  return items;
}

export async function get_collection_static_paths() {
  const paths = [];
  const all_entries = await get_all_public_entries();
  const all_total_pages = Math.max(1, Math.ceil(all_entries.length / pagination_config.page_size));

  for (let page = 1; page <= all_total_pages; page += 1) {
    paths.push({
      params: {
        section: all_sections_name,
        page: String(page),
      },
    });
  }

  for (const section of get_visible_sections()) {
    const entries = await get_public_entries_for_section(section.name);
    const page_size = section.page_size ?? pagination_config.page_size;
    const total_pages = Math.max(1, Math.ceil(entries.length / page_size));

    for (let page = 1; page <= total_pages; page += 1) {
      paths.push({
        params: {
          section: section.name,
          page: String(page),
        },
      });
    }
  }

  return paths;
}

export async function get_entry_static_paths() {
  const paths = [];

  for (const section of get_visible_sections()) {
    const entries = await get_public_entries_for_section(section.name);

    for (const entry of entries) {
      paths.push({
        params: {
          section: section.name,
          slug: entry.id,
        },
      });
    }
  }

  return paths;
}

export async function get_collection_page(options: {
  section_name: string;
  page: number;
}): Promise<CollectionPageViewModel> {
  if (options.section_name === all_sections_name) {
    const page_size = pagination_config.page_size;
    const entries = await get_all_public_entries();
    const pagination = make_pagination({
      current_page: options.page,
      total_items: entries.length,
      page_size,
      sibling_count: pagination_config.sibling_count,
      make_href: (page) => to_section_page_href(all_sections_name, page),
    });
    const page_start = (pagination.current_page - 1) * page_size;
    const page_entries = entries.slice(page_start, page_start + page_size);

    return {
      section: {
        name: all_sections_name,
        display_name: 'All',
        description: 'All public entries across visible content sections.',
      },
      resolved_list_layout: resolve_list_layout_name('compact'),
      entries: page_entries.map(({ section_name, entry }) => to_entry_list_item_view_model(section_name, entry)),
      search_entries: entries.map(({ section_name, entry }) => to_entry_list_item_view_model(section_name, entry)),
      pagination,
    };
  }

  const section = get_section_definition(options.section_name);

  if (section === null || section.visible === false) {
    throw new Error(`Unknown content section: ${options.section_name}`);
  }

  const page_size = section.page_size ?? pagination_config.page_size;
  const entries = await get_public_entries_for_section(section.name);
  const pagination = make_pagination({
    current_page: options.page,
    total_items: entries.length,
    page_size,
    sibling_count: pagination_config.sibling_count,
    make_href: (page) => to_section_page_href(section.name, page),
  });
  const page_start = (pagination.current_page - 1) * page_size;
  const page_entries = entries.slice(page_start, page_start + page_size);

  return {
    section: {
      name: section.name,
      display_name: section.display_name,
      description: section.description ?? null,
    },
    resolved_list_layout: resolve_list_layout_name(section.list_layout),
    entries: page_entries.map((entry) => to_entry_list_item_view_model(section.name, entry)),
    search_entries: entries.map((entry) => to_entry_list_item_view_model(section.name, entry)),
    pagination,
  };
}

export async function get_entry_page(options: {
  section_name: string;
  entry_id: string;
}): Promise<EntryPageViewModel> {
  const section = get_section_definition(options.section_name);

  if (section === null || section.visible === false) {
    throw new Error(`Unknown content section: ${options.section_name}`);
  }

  const entry = await getEntry(section.name, options.entry_id);

  if (entry === undefined || !is_public_entry(entry.data, build_time)) {
    throw new Error(`Unknown public entry: ${options.section_name}/${options.entry_id}`);
  }

  return {
    entry: to_entry_detail_view_model(section.name, entry),
    content_entry: entry,
  };
}
