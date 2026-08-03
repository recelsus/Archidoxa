---
title: "Popup Command Reference"
description: "Multiple command annotations for checking popup and side-panel behavior."
pub_date: "2026-07-31"
status: "public"
entry_layout: "article"
tags:
  - popup
  - command
---

This popup-heavy sample gives the template several annotation targets. Use it to verify popup positioning, side-note pinning, duplicate messages, drag ordering, and syntax highlighting.

Try [search basics](popup:bash#reference.search), [content checks](popup:bash#reference.content), [static build](popup:bash#reference.build), and [clean display in side notes](popup:bash#reference.clean?side_nocomment).

<!-- @popup bash#reference.search title="Search commands" -->

```bash
rg --files src/content # list content files
rg -n "status: \"public\"" src/content # find public entries
rg -n "@popup" src/content # find popup definitions
```

<!-- @popup bash#reference.content title="Content validation" -->

```bash
npm run content:check # validate content collections
npm test # run focused tests
```

<!-- @popup bash#reference.build title="Build validation" -->

```bash
npm run build # build the static site
find dist -maxdepth 3 -type f # inspect generated files
```

<!-- @popup bash#reference.clean title="Comment-heavy example" -->

```bash
ls -la # show hidden files
pwd # print current path
date -Iseconds # print timestamp
```
