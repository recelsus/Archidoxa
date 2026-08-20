import {
  create_content_page_service,
  type ArticleTreeItem,
  type CollectionPageViewModel,
  type ContentPageService,
  type EntryPageViewModel,
  type HeaderNavigationItem,
} from './content_page_service.ts';
import {
  AstroContentRepository,
  type AstroContentEntry,
} from '../../infrastructure/astro_content/astro_content_repository.ts';

const content_page_service: ContentPageService<AstroContentEntry> = create_content_page_service({
  repository: new AstroContentRepository(),
});

export type {
  ArticleTreeItem,
  CollectionPageViewModel,
  EntryPageViewModel,
  HeaderNavigationItem,
};

export function get_header_navigation(current_section_name: string | null): Promise<HeaderNavigationItem[]> {
  return content_page_service.get_header_navigation(current_section_name);
}

export function get_article_tree_items(options: {
  current_section_name: string | null;
  current_entry_id: string | null;
}): Promise<ArticleTreeItem[]> {
  return content_page_service.get_article_tree_items(options);
}

export function get_collection_static_paths() {
  return content_page_service.get_collection_static_paths();
}

export function get_entry_static_paths() {
  return content_page_service.get_entry_static_paths();
}

export function get_collection_page(options: {
  section_name: string;
  page: number;
}): Promise<CollectionPageViewModel> {
  return content_page_service.get_collection_page(options);
}

export function get_entry_page(options: {
  section_name: string;
  entry_id: string;
}): Promise<EntryPageViewModel<AstroContentEntry>> {
  return content_page_service.get_entry_page(options);
}
