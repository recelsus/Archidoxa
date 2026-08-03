export const all_sections_name = 'all';

export function to_section_page_href(section_name: string, page: number): string {
  return `/${section_name}/${page}/`;
}

export function to_entry_href(section_name: string, entry_id: string): string {
  return `/${section_name}/${entry_id}/`;
}

export function to_tag_href(tag: string): string {
  return `${to_section_page_href(all_sections_name, 1)}?q=${encodeURIComponent(`#${tag}`)}`;
}
