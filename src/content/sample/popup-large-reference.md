---
title: "Popup Large Reference"
description: "Large popup definitions for popup size, syntax, and side-note scrolling checks."
pub_date: "2026-07-28"
status: "public"
entry_layout: "article"
category: "reference"
tags:
  - popup
  - scroll
---

This article contains larger popup definitions. It is useful for checking max height, side-panel scrolling, syntax highlighting, and comment stripping.

Open the [directory scan example](popup:bash#workflow.scan), [archive example](popup:bash#workflow.archive), and [inspection example without comments in the popup](popup:bash#workflow.inspect?popup_nocomment). Pin them to the side panel to check long-note behavior.

<!-- @popup bash#workflow.scan title="Directory scan workflow" -->

```bash
set -euo pipefail # fail fast for missing variables and failed commands
root="${1:-.}" # default to current directory when no argument is passed
find "$root" -maxdepth 3 -type f # collect a shallow file list
find "$root" -maxdepth 3 -type d # collect a shallow directory list
du -sh "$root" # show total size for quick inspection
printf 'scan complete for %s\n' "$root" # report completion
```

<!-- @popup bash#workflow.archive title="Archive workflow" -->

```bash
set -euo pipefail # stop when an archive step fails
source_dir="${1:?source directory is required}" # require an explicit source
archive_name="${2:-content-snapshot.tar.gz}" # use a default archive name
tar --exclude='node_modules' --exclude='dist' -czf "$archive_name" "$source_dir" # create compressed archive
sha256sum "$archive_name" > "$archive_name.sha256" # write checksum beside archive
ls -lh "$archive_name" "$archive_name.sha256" # show generated files
```

<!-- @popup bash#workflow.inspect title="Inspection workflow" -->

```bash
set -euo pipefail # make inspection failures visible
target="${1:-src}" # inspect src by default
rg --files "$target" # list source files quickly
rg -n "TODO|FIXME|@popup" "$target" # inspect annotations and known work markers
npm run content:check # validate content collections
npm test # run focused tests
npm run build # verify static generation
```
