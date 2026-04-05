import type { CollectionEntry } from 'astro:content';

/** Lower = more relevant (shown first on /projects). Range 1–10. */
export function sortProjectsByRelevance(projects: CollectionEntry<'project'>[]) {
  return [...projects].sort(
    (a, b) => a.data.relevance - b.data.relevance || a.data.name.localeCompare(b.data.name),
  );
}
