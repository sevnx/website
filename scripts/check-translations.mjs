import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { locales, baseLocale } from '../src/i18n/locales.ts';

const settings = JSON.parse(await readFile('project.inlang/settings.json', 'utf8'));
if (settings.baseLocale !== baseLocale || settings.locales.join(',') !== locales.join(',')) {
  throw new Error('Astro and Paraglide locales must agree.');
}
const messages = await Promise.all(locales.map(async (locale) => JSON.parse(await readFile(`messages/${locale}.json`, 'utf8'))));
const keys = Object.keys(messages[0]).sort().join(',');
for (const [index, dictionary] of messages.entries()) {
  if (Object.keys(dictionary).sort().join(',') !== keys) throw new Error(`Incomplete UI translations: ${locales[index]}`);
  for (const [key, value] of Object.entries(dictionary)) {
    if (typeof value === 'string' && !value.trim()) throw new Error(`Empty message: ${locales[index]}/${key}`);
  }
}
let count = 0;
const fields = { project: ['shortDescription', 'coverAlt'], experience: ['jobTitle', 'shortDescription'], education: ['degree', 'classwork', 'highlights'], blog: ['title'] };
for (const collection of Object.keys(fields)) {
  const base = `content/${collection}`;
  for (const item of await readdir(base, { withFileTypes: true })) {
    if (!item.isDirectory()) continue;
    const shared = JSON.parse(await readFile(`${base}/${item.name}/metadata.json`, 'utf8'));
    const itemLocales = collection === 'blog' ? locales.filter((locale) => existsSync(`${base}/${item.name}/${locale}.mdx`)) : locales;
    if (itemLocales.length === 0) throw new Error(`Missing content: ${base}/${item.name}`);
    for (const locale of itemLocales) {
      const path = `${base}/${item.name}/${locale}.mdx`;
      const source = await readFile(path, 'utf8');
      const match = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
      if (!match) throw new Error(`Missing frontmatter: ${path}`);
      const data = Bun.YAML.parse(match[1]);
      for (const field of Object.keys(data)) {
        if (!fields[collection].includes(field)) throw new Error(`Shared fact belongs in metadata.json: ${path}/${field}`);
      }
      if (shared.coverSrc && !data.coverAlt) throw new Error(`Missing translated cover alt: ${path}`);
      if (shared.courses && Object.keys(shared.courses).sort().join(',') !== Object.keys(data.classwork ?? {}).sort().join(',')) {
        throw new Error(`Course translations must match shared course identifiers: ${path}`);
      }
      count++;
    }
  }
}
console.log(`Validated ${locales.length} UI dictionaries and ${count} MDX translations.`);
