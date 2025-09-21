import { technologies } from '@/data/technologies';
import { z } from 'astro:content';

export const employmentType = z.union([
  z.literal('Full-time'),
  z.literal('Internship'),
  z.literal('Apprenticeship'),
  z.literal('Part-time'),
]);

export const locationType = z.union([z.literal('Remote'), z.literal('On-site'), z.literal('Hybrid')]);

export const technologyNames = technologies.map((technology) => technology.name);

export const technologyNameSchema = z.string().refine((name) => technologyNames.includes(name), {
  message: 'Invalid technology name',
});
