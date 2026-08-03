import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface PopupClientEntry {
  title?: string;
  language?: string;
  content: string;
}

export type PopupClientIndex = Record<string, PopupClientEntry>;

interface PopupMasterIndexFile {
  definitions?: Record<
    string,
    {
      title?: string;
      language?: string;
      content: string;
    }
  >;
}

export function load_popup_client_index(): PopupClientIndex {
  const index_path = join(process.cwd(), '.generated', 'popup_master_index.json');

  if (!existsSync(index_path)) {
    return {};
  }

  const index = JSON.parse(readFileSync(index_path, 'utf8')) as PopupMasterIndexFile;
  const definitions = index.definitions ?? {};

  return Object.fromEntries(
    Object.entries(definitions).map(([reference, definition]) => [
      reference,
      {
        ...(definition.title ? { title: definition.title } : {}),
        ...(definition.language ? { language: definition.language } : {}),
        content: definition.content,
      },
    ]),
  );
}
