import type { ConfigurablePageConfig } from './page_config';

export const top_page_config: ConfigurablePageConfig = {
  heading: undefined,
  description: undefined,
  links: [],
  sections: [
    {
      kind: 'image',
      src: '/images/top-sample.svg',
      alt: 'Navigation layout sample image',
      caption: 'Optional image block. Replace this path or remove the block when it is not needed.',
    },
    {
      kind: 'content_links',
      show_all_entries_link: true,
      show_content_section_links: true,
    },
    {
      kind: 'text',
      heading: 'Scope',
      body: [
        'This project is a Markdown-first static content site foundation. React, other UI frameworks, CMS integrations, database-backed features, and authentication are outside the active scope.',
      ],
    },
    {
      kind: 'text',
      heading: 'Customize',
      body: [
        'Edit this top page config to replace the default introduction, add short guide text, or remove sections that are not useful for your site.',
      ],
    },
    // {
    //   kind: 'text',
    //   heading: 'Additional Section',
    //   body: [
    //     'Add another text block by uncommenting this sample.',
    //     'Multiple paragraphs are rendered in order.',
    //   ],
    // },
    // {
    //   kind: 'image',
    //   src: '/images/top-sample.svg',
    //   alt: 'Image description',
    //   caption: 'Optional caption.',
    // },
    // {
    //   kind: 'divider',
    // },
    // {
    //   kind: 'social_links',
    //   heading: 'Social',
    // },
  ],
};
