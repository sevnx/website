export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];
export const baseLocale = 'en';

export const languageNames = { en: 'English', fr: 'Français' };

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'fr';
}

export function pageLocale(value: unknown): Locale {
  if (value === undefined) return baseLocale;
  if (isLocale(value)) return value;
  throw new Error(`Unsupported locale: ${String(value)}`);
}
