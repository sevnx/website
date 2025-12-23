import { technologies } from '@/data/technologies';
import { z } from 'astro:content';

export const employmentType = z.union([
  z.literal('Full-time'),
  z.literal('Internship'),
  z.literal('Apprenticeship'),
  z.literal('Part-time'),
]);

export const projectType = z.union([
  z.literal('Personal'),
  z.literal('Academic'),
  z.literal('Professional'),
]);

export const applicationType = z.union([
  z.literal('Web'),
  z.literal('Desktop'),
  z.literal('Mobile'),
  z.literal('CLI'),
  z.literal('TUI'),
]);

export const technologyNames = technologies.map((technology) => technology.name);

export const technologyNameSchema = z.string().refine((name) => technologyNames.includes(name), {
  message: 'Invalid technology name',
});
