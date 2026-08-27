import { getRelativeLocaleUrl } from 'astro:i18n';
import { locales, type Locale } from './locales';

/** Strip only a supported locale prefix, leaving stable route and content identifiers intact. */
export function unlocalizedPath(pathname: string) {
  const [, first, ...rest] = pathname.split('/');
  return locales.some((locale) => locale === first) ? `/${rest.join('/')}` : pathname;
}

export function localizedHref(pathname: string, locale: Locale) {
  return getRelativeLocaleUrl(locale, unlocalizedPath(pathname).replace(/^\//, ''));
}
