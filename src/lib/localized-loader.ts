import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';

const metadataSchema = z.record(z.string(), z.unknown());
const courseTechnologiesSchema = z.record(z.string(), z.array(z.string()));
const courseNamesSchema = z.record(z.string(), z.string());

/** Keep Astro's MDX rendering and asset handling, merging each item's shared facts before validation. */
export function localizedContent(base: string): Loader {
  const mdx = glob({ base, pattern: '*/*.mdx' });

  return {
    name: 'localized-mdx',
    async load(context) {
      const directory = resolve(fileURLToPath(context.config.root), base);
      const metadata = new Map<string, Record<string, unknown>>();

      async function loadMetadata() {
        metadata.clear();
        for (const item of await readdir(directory, { withFileTypes: true })) {
          if (!item.isDirectory()) continue;
          const raw: unknown = JSON.parse(await readFile(join(directory, item.name, 'metadata.json'), 'utf8'));
          metadata.set(item.name, metadataSchema.parse(raw));
        }
      }

      const mergedContext = {
        ...context,
        // Shared metadata must invalidate the cached MDX entries even when their prose has not changed.
        generateDigest: (data: Record<string, unknown> | string) =>
          context.generateDigest({ data, metadata: [...metadata.entries()] }),
        parseData: async <T extends Record<string, unknown>>(options: { id: string; data: T; filePath?: string }) => {
          if (!options.filePath) throw new Error(`Missing file path for ${options.id}`);
          const key = basename(dirname(options.filePath));
          const shared = metadata.get(key);
          if (!shared) throw new Error(`Missing metadata for ${key}`);
          const { coverAlt, classwork: courseNames } = options.data;
          const cover = shared.coverSrc ? { src: shared.coverSrc, alt: coverAlt } : undefined;
          const classwork = shared.courses
            ? Object.entries(courseTechnologiesSchema.parse(shared.courses)).map(([course, technologies]) => {
                const name = courseNamesSchema.parse(courseNames)[course];
                if (!name) throw new Error(`Missing course translation: ${key}/${course}`);
                return { name, technologies };
              })
            : undefined;
          return context.parseData({
            ...options,
            data: { ...shared, ...options.data, key, locale: basename(options.filePath, '.mdx'), cover, classwork },
          });
        },
      };

      await loadMetadata();
      // glob() returns early for an empty collection, so remove deleted files before it runs.
      for (const [id, entry] of context.store.entries()) {
        if (entry.filePath && !existsSync(new URL(entry.filePath, context.config.root))) context.store.delete(id);
      }
      await mdx.load(mergedContext);

      const reloadMetadata = async (changedPath: string) => {
        if (basename(changedPath) !== 'metadata.json' || dirname(dirname(changedPath)) !== directory) return;
        try {
          await loadMetadata();
          // The original glob loader already owns MDX watchers. Do not register them again.
          await mdx.load({ ...mergedContext, watcher: undefined });
          context.logger.info(`Reloaded shared metadata from ${changedPath}`);
        } catch (error) {
          context.logger.error(`Failed to reload ${changedPath}: ${String(error)}`);
        }
      };
      context.watcher?.on('change', reloadMetadata);
      context.watcher?.on('add', reloadMetadata);
      context.watcher?.on('unlink', reloadMetadata);
    },
  };
}
