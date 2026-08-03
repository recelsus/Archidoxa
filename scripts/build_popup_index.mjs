import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

import { parse_popup_definitions } from '../src/core/popup/popup_definition.ts';

const project_root = process.cwd();
const output_path = join(project_root, '.generated', 'popup_master_index.json');

function list_markdown_files(root) {
  if (!existsSync(root)) {
    return [];
  }

  const files = [];

  for (const name of readdirSync(root)) {
    const path = join(root, name);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...list_markdown_files(path));
      continue;
    }

    if (/\.(md|mdx)$/.test(name)) {
      files.push(path);
    }
  }

  return files;
}

function to_source_type(path) {
  return path.includes(`${join('src', 'popup_definitions')}/`) ? 'definition' : 'article';
}

const markdown_files = [
  ...list_markdown_files(join(project_root, 'src', 'content')),
  ...list_markdown_files(join(project_root, 'src', 'popup_definitions')),
];

const definitions = {};
const invalid_definitions = [];

for (const file_path of markdown_files) {
  const relative_path = relative(project_root, file_path);
  const result = parse_popup_definitions({
    file_path: relative_path,
    source_type: to_source_type(relative_path),
    content: readFileSync(file_path, 'utf8'),
  });

  for (const definition of result.definitions) {
    if (definitions[definition.reference]) {
      invalid_definitions.push({
        reference: definition.reference,
        reason: 'duplicate_reference',
        source: definition.source,
      });
      continue;
    }

    definitions[definition.reference] = definition;
  }

  invalid_definitions.push(...result.invalid_definitions);
}

const index = {
  version: 1,
  generated_at: new Date().toISOString(),
  definitions,
  invalid_definitions,
};

mkdirSync(dirname(output_path), { recursive: true });
writeFileSync(output_path, `${JSON.stringify(index, null, 2)}\n`);

console.log(`Popup master index written: ${relative(project_root, output_path)}`);
console.log(`Valid definitions: ${Object.keys(definitions).length}`);

if (invalid_definitions.length > 0) {
  console.warn(`Invalid definitions skipped: ${invalid_definitions.length}`);
}
