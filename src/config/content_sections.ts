export interface ContentSectionDefinition {
  name: string;
  display_name: string;
  visible?: boolean;
  order?: number;
  page_size?: number;
  list_layout?: string;
  description?: string;
}

export const content_sections = [
  {
    name: 'sample',
    display_name: 'Sample',
    visible: true,
    order: 10,
    page_size: 20,
    list_layout: 'card',
    description: 'Initial sample content section.',
  },
] satisfies readonly ContentSectionDefinition[];
