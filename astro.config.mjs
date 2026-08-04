import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://recelsus.github.io/Archidoxa',
  base: process.env.PUBLIC_BASE_PATH ?? '/',
  output: 'static',
});
