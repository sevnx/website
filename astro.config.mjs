// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import settings from './project.inlang/settings.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: 'https://sevnx.dev',
  integrations: [mdx()],
  i18n: {
    defaultLocale: settings.baseLocale,
    locales: settings.locales,
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      emitTsDeclarations: true,
      strategy: ['baseLocale'],
    })],
  },
  // Code blocks follow the site's Rosé Pine Dawn palette.
  markdown: { shikiConfig: { theme: 'rose-pine-dawn' } },
});
