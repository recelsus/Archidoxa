import { existsSync } from 'node:fs';
import { join } from 'node:path';

const content_root = join(process.cwd(), 'src', 'content');

if (!existsSync(content_root)) {
  console.error('Content root does not exist: src/content');
  process.exitCode = 1;
} else {
  console.log('Content check completed.');
}
