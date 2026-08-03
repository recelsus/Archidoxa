export interface SiteConfig {
  title: string;
  description: string;
  footer_text: string;
  theme: SiteTheme;
  social: SocialConfig;
}

export type SiteTheme = 'light' | 'dark';

export interface SocialConfig {
  enabled: boolean;
  items: SocialLinkConfig[];
}

export interface SocialLinkConfig {
  label: string;
  href: string;
  handle?: string;
}

export const site_config: SiteConfig = {
  title: 'Archidoxa',
  description: 'Markdown-first static content site foundation.',
  footer_text: 'static Astro content foundation',
  theme: 'light',
  social: {
    enabled: true,
    items: [
      {
        label: 'GitHub',
        href: 'https://github.com/',
        handle: '@archidoxa',
      },
      {
        label: 'X',
        href: 'https://x.com/',
        handle: '@archidoxa',
      },
      {
        label: 'Bluesky',
        href: 'https://bsky.app/',
        handle: '@archidoxa.bsky.social',
      },
    ],
  },
};
