export const all_sections_name = 'all';

function to_base_path(): string {
  const raw_base_path = process.env.PUBLIC_BASE_PATH ?? '/';
  const with_leading_slash = raw_base_path.startsWith('/') ? raw_base_path : `/${raw_base_path}`;
  return with_leading_slash.endsWith('/') ? with_leading_slash : `${with_leading_slash}/`;
}

export function to_site_href(path: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(path) || path.startsWith('#')) {
    return path;
  }

  const base_path = to_base_path();
  const normalized_path = path.startsWith('/') ? path.slice(1) : path;
  return `${base_path}${normalized_path}`;
}

export function to_section_page_href(section_name: string, page: number): string {
  return to_site_href(`/${section_name}/${page}/`);
}

export function to_entry_href(section_name: string, entry_id: string): string {
  return to_site_href(`/${section_name}/${entry_id}/`);
}

export function to_tag_href(tag: string): string {
  return `${to_section_page_href(all_sections_name, 1)}?q=${encodeURIComponent(`#${tag}`)}`;
}
