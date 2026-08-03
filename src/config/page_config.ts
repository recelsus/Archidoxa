export interface ConfigurablePageConfig {
  heading?: string;
  description?: string;
  links: PageLink[];
  sections: PageSection[];
}

export interface PageLink {
  label: string;
  href: string;
}

export type PageSection =
  | PageTextSection
  | PageContentLinksSection
  | PageImageSection
  | PageDividerSection
  | PageSocialLinksSection;

export interface PageTextSection {
  kind: 'text';
  heading?: string;
  body: string[];
}

export interface PageContentLinksSection {
  kind: 'content_links';
  show_all_entries_link: boolean;
  show_content_section_links: boolean;
}

export interface PageImageSection {
  kind: 'image';
  src: string;
  alt: string;
  caption?: string;
  href?: string;
}

export interface PageDividerSection {
  kind: 'divider';
}

export interface PageSocialLinksSection {
  kind: 'social_links';
  heading?: string;
}
