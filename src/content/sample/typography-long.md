---
title: "Typography Long Form"
description: "A longer article for checking reading rhythm, line length, and scroll behavior."
pub_date: "2026-07-30"
status: "public"
entry_layout: "article"
hero_image: "./images/typography.svg"
hero_image_alt: "Long form typography thumbnail"
category: "reading"
tags:
  - typography
  - longform
---

Long form pages need a different kind of balance from short reference notes. The title, metadata, body text, and code blocks should create a stable reading flow without making the surrounding panels feel detached from the article.

The left tree is useful only when it remains predictable. When a reader is inside one section, the tree should focus on that section. A global view is still useful, but it should be an explicit mode rather than the default behavior on every page.

The right side panel has a different role. It accumulates selected notes from annotations, so it can become denser than the article itself. This page can be used with popup-heavy pages to verify that pinned notes remain usable after several items are added.

Paragraph spacing should avoid large decorative gaps. The site is closer to a reference reader than a marketing page, so density should support repeated reading and quick scanning.

```bash
npm run build # generate static output
npm run preview # inspect the generated site
```

When the page is scrolled, the article column should be the main visual anchor. The tree and notes should provide context without competing with the text.

The final section repeats enough prose to make scrolling meaningful. It should be possible to keep reading while the side panel contains pinned code snippets, and the overall contrast should remain comfortable in both themes.
