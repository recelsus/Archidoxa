import { site_config } from './site';
import type { ConfigurablePageConfig } from './page_config';

export const about_page_config: ConfigurablePageConfig = {
  heading: 'About',
  description: 'About this content site foundation.',
  links: [],
  sections: [
    {
      kind: 'text',
      body: [
        `${site_config.title} is a Markdown-first static content site foundation built with Astro.`,
        'External UI frameworks, CMS integrations, and authentication are outside the project scope.',
      ],
    },
    {
      kind: 'image',
      src: '/images/top-sample.svg',
      alt: 'Navigation layout sample image',
      caption: 'Optional image block. Replace this path or remove the block when it is not needed.',
    },
    {
      kind: 'divider',
    },
    {
      kind: 'social_links',
      heading: 'Social',
    },
    // {
    //   kind: 'image',
    //   src: '/images/top-sample.svg',
    //   alt: 'Image description',
    //   caption: 'Optional caption.',
    // },
    // {
    //   kind: 'text',
    //   heading: 'Additional Section',
    //   body: [
    //     'Add another text block by uncommenting this sample.',
    //   ],
    // },
    // {
    //   kind: 'divider',
    // },
    // {
    //   kind: 'content_links',
    //   show_all_entries_link: true,
    //   show_content_section_links: true,
    // },
  ],
};
