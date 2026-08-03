# reArchidoxis

Astro template.

## Init

- `src/config/site.ts`
  - Site title
  - Site description
  - Footer text
  - light/dark theme
  - SNS accounts shown on the About page
- `src/config/content_sections.ts`
  - Content sections
  - Display names for list pages
  - Entries per page
  - List layout
- `src/config/top_page.ts`
  - Top page heading
  - Top page links
  - Top page content blocks
- `src/config/about_page.ts`
  - About page heading
  - About page links
  - About page content blocks
- `src/content/sample/`
  - Sample articles
  - Article images
- `src/pages/about.astro`
  - About page content

## Config

Configure site-wide display values in `src/config/site.ts`.

```ts
export const site_config = {
  title: 'reArchidoxis',
  description: 'Markdown-first static content site foundation.',
  footer_text: 'static Astro content foundation / no client framework, CMS, or authentication',
  theme: 'dark',
  social: {
    enabled: true,
    items: [
      {
        label: 'GitHub',
        href: 'https://github.com/',
        handle: '@archidoxa',
      },
    ],
  },
};
```

Set `theme` to `light` or `dark`. \
To hide SNS links, set `social.enabled` to `false`.

## Top Page

Configure the top page in `src/config/top_page.ts`. \
The About page uses the same format from `src/config/about_page.ts`.

- `heading`: Top page heading. Uses the site title when omitted
- `description`: Top page description. Uses the site description when omitted
- `links`: Links shown under the heading. Empty by default
- `sections`: Fixed top page blocks. Change the array order to change display order

Text block:

```ts
{
  kind: 'text',
  heading: 'Scope',
  body: ['Body text'],
}
```

Content link block:

```ts
{
  kind: 'content_links',
  show_all_entries_link: true,
  show_content_section_links: true,
}
```

Image block:

```ts
{
  kind: 'image',
  src: '/images/top-sample.svg',
  alt: 'Image description',
  caption: 'Optional caption',
}
```

SNS block:

```ts
{
  kind: 'social_links',
  heading: 'Social',
}
```

The SNS block can be placed on either TOP or ABOUT. \
Displayed links come from `social` in `src/config/site.ts`.

Divider block:

```ts
{
  kind: 'divider',
}
```

## Category

Content sections are configured in `src/config/content_sections.ts`. \
The initial template uses only `sample`. \
To add your own section, create `src/content/<section-name>/` and add the same name to `content_sections`.

```ts
{
  name: 'sample',
  display_name: 'Sample',
  visible: true,
  order: 10,
  page_size: 20,
  list_layout: 'card',
  description: 'Initial sample content section.',
}
```

`name` is the directory name. If a configured section does not exist, it is ignored. \
Do not write a category name in Markdown frontmatter. \
`All` is a fixed page for browsing all entries. Other sections are displayed from the section config and content directories.

## Write

Add articles by following the Markdown files in `src/content/sample/`.

```md
---
title: "Article title"
description: "Short description used by lists and search"
pub_date: "2026-08-03"
status: "public"
tags:
  - sample
  - markdown
---

Write the article body here.
```

Common fields to edit:

- `title`: Article title
- `description`: Description used by lists, search, and card hover display
- `pub_date`: Publication date. Displayed as `yyyy/MM/dd`
- `updated_date`: Optional update date
- `status`: `public` / `draft` / `hidden`
- `tags`: Tags used by search and tag links
- `hero_image`: Image shown on cards
- `hero_image_alt`: Alternative text for the image

Articles without `hero_image` automatically receive a default thumbnail.

## Publish

Use `status` to control how entries are handled.

- `public`: Public entry
- `draft`: Draft. It is validated but hidden from public lists
- `hidden`: Hidden entry for internal notes or checks

Entries with a future `pub_date` remain hidden until that date has passed.

Because this is a static site, publication is evaluated when the site is built. A future-dated entry becomes visible after the publication date only when you rebuild and redeploy the site.

## List and Search

List pages search title, description, and tags. Full-text body search is out of scope. \
Normal search is limited to entries under the currently displayed section.

`All` searches all sections. \
To search tags only, enter a query like `#tag`. Clicking a tag on a card also opens tag search in `All`.

## Popup and Side Notes

Add a popup link in an article to show a short reference or code snippet in place.

```md
[ls description](popup:bash#command.ls)
```

Define the popup in the same article.

````md
<!-- @popup bash#command.ls title="List directory contents" -->

```bash
ls # list directory contents
```
````

`title` is optional.

IDs are expected to use the form `bash#command.ls`, or `language#group.name`. \
Deeper IDs such as `bash#command.ls.la` are not intended for use.

Add options to hide comments in the displayed snippet.

```md
[Without comments](popup:bash#command.ls?nocomment)
[Without comments in popup only](popup:bash#command.ls?popup_nocomment)
[Without comments in side notes only](popup:bash#command.ls?side_nocomment)
```

Popups can be pinned to the side notes. \
Side notes persist while moving between pages. Clicking a pinned item again removes it.

## About and SNS

Edit the About page in `src/pages/about.astro`. \
Configure SNS links with `social` in `src/config/site.ts`.

To hide SNS links:

```ts
social: {
  enabled: false,
  items: [],
}
```

To show SNS links:

```ts
social: {
  enabled: true,
  items: [
    {
      label: 'GitHub',
      href: 'https://github.com/example',
      handle: '@example',
    },
  ],
}
```

## Sample Content

`src/content/sample/` contains entries for visual and behavior checks.

- Normal articles
- Short notes
- Long-form article
- Article with a long title
- Article with a custom image
- Article with a default thumbnail
- Popup-heavy article
- draft / hidden / future-dated state examples

## Commands

After adding or editing articles, run:

```bash
npm run content:check
npm test
npm run build
```

To check the site locally:

```bash
npm run dev
```
