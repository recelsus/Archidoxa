import { content_sections, type ContentSectionDefinition } from '../../config/content_sections.ts';

export function get_configured_sections(): readonly ContentSectionDefinition[] {
  return [...content_sections].sort(
    (left, right) => (left.order ?? 0) - (right.order ?? 0) || left.name.localeCompare(right.name),
  );
}

export function get_visible_sections(): readonly ContentSectionDefinition[] {
  return get_configured_sections().filter((section) => section.visible !== false);
}

export function get_section_definition(section_name: string): ContentSectionDefinition | null {
  return content_sections.find((section) => section.name === section_name) ?? null;
}
