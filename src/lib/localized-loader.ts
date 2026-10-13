import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';

const metadataSchema = z.record(z.string(), z.unknown());

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
          const cover = shared.coverSrc ? { src: shared.coverSrc, alt: options.data.coverAlt } : undefined;
          return context.parseData({
            ...options,
            data: { ...shared, ...options.data, key, locale: basename(options.filePath, '.mdx'), cover },
          });
        },
      };

      // glob() returns early for an empty collection, so remove deleted files before it runs.
      function pruneDeleted() {
        for (const [id, entry] of context.store.entries()) {
          if (entry.filePath && !existsSync(new URL(entry.filePath, context.config.root))) context.store.delete(id);
        }
      }

      await loadMetadata();
      pruneDeleted();
      await mdx.load(mergedContext);

      // glob() also skips registering its own watchers when the collection starts empty, so MDX changes reload here too.
      const reloadMetadata = async (changedPath: string) => {
        const file = basename(changedPath);
        if ((file !== 'metadata.json' && !file.endsWith('.mdx')) || dirname(dirname(changedPath)) !== directory) return;
        try {
          await loadMetadata();
          pruneDeleted();
          // Do not register glob's watchers again; unchanged entries are skipped by digest.
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
