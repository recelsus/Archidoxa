---
title: "Authoring Workflow"
description: "A sample guide that shows how an article can move from outline to publication."
pub_date: "2026-07-29"
status: "public"
entry_layout: "article"
category: "authoring"
tags:
  - markdown
  - workflow
---

This sample article describes a simple writing workflow for a static knowledge site. It is meant to be replaced with your own editorial process, but it gives the template enough structure to demonstrate headings, paragraphs, lists, and code blocks.

Start with a small outline. A useful outline names the reader, the expected outcome, and the minimum supporting detail. This keeps the first draft focused and makes later review faster.

Next, write the first version in Markdown. The frontmatter controls title, description, publication state, tags, category, and layout. The body should stay readable even when side panels are visible.

Before publishing, run the basic checks used by this template:

```bash
npm run content:check # validate content collections
npm test # run focused tests
npm run build # generate the static site
```

After the checks pass, read the page in the browser. Look at the card list, article page, search result, tag behavior, and navigation tree. A static site can still have a careful editorial workflow when each step is small and repeatable.
