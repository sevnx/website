import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n/locales';

export function blogSlug(blog: CollectionEntry<'blog'>) {
  return blog.data.key;
}

const newestFirst = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
  b.data.publishedDate.getTime() - a.data.publishedDate.getTime();

/** Posts written in `locale`, then English posts that have no translation yet, each newest first. */
export async function localizedPosts(locale: Locale) {
  const blogs = await getCollection('blog');
  const translated = blogs.filter((blog) => blog.data.locale === locale).sort(newestFirst);
  const translatedSlugs = new Set(translated.map(blogSlug));
  const englishOnly =
    locale === 'en'
      ? []
      : blogs.filter((blog) => blog.data.locale === 'en' && !translatedSlugs.has(blogSlug(blog))).sort(newestFirst);
  return { translated, englishOnly };
}
