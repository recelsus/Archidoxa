---
title: "Code and Popup Options"
description: "A sample page for command snippets, popups, side notes, and comment display options."
pub_date: "2026-08-02"
updated_date: "2026-08-03"
status: "public"
hero_image: "./images/popup-reference.svg"
hero_image_alt: "Popup reference interface thumbnail"
tags:
  - popup
  - code
---

This sample shows how a link can open a popup definition and how the same definition can be pinned to the side panel.

Open [`ls` with comments](popup:bash#command.list), then open [`ls` without comments in the popup only](popup:bash#command.list?popup_nocomment). Pin [`ls` without comments in the side panel only](popup:bash#command.list?side_nocomment) to compare display options.

The page also includes a normal code block with a copy button.

```bash
pwd # print current directory
ls -la # show hidden files
```

<!-- @popup bash#command.list title="List files" -->

```bash
ls -la # show hidden files
pwd # print current directory
```
