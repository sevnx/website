import type { CollectionEntry } from 'astro:content';

export function blogSlug(blog: CollectionEntry<'blog'>) {
  return blog.data.key;
}
