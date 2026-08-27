import type { CollectionEntry } from 'astro:content';
import { localizedHref } from '@/i18n/links';
import type { Locale } from '@/i18n/locales';

/** Lower = more relevant (shown first on /projects). Range 1–10. */
export function sortProjectsByRelevance(projects: CollectionEntry<'project'>[]) {
  return [...projects].sort(
    (a, b) => a.data.relevance - b.data.relevance || a.data.name.localeCompare(b.data.name, a.data.locale),
  );
}

/** Projects open inside the portfolio's Projects tab rather than on their own page. */
export function projectHref(id: string, locale: Locale = 'en') {
  return `${localizedHref('/', locale)}?tab=projects&project=${encodeURIComponent(id)}#work`;
}
