import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { applicationType, employmentType, projectStatus, projectType, technologyNameSchema } from '@/types/schema';
import { localizedContent } from '@/lib/localized-loader';
import { locales } from '@/i18n/locales';

const localizedFields = { key: z.string(), locale: z.enum(locales) };

const classworkItem = z.union([
  z.string(),
  z.object({ name: z.string(), technologies: z.array(technologyNameSchema) }),
]);

const education = defineCollection({
  loader: localizedContent('./content/education'),
  schema: z.object({
    ...localizedFields,
    institution: z.string(),
    degree: z.string(),
    startDate: z.coerce.date(),
    endDate: z.union([z.coerce.date(), z.literal('Present')]),
    location: z.string(),
    classwork: z.array(classworkItem).optional(),
    projects: z.array(z.string()).optional(),
    highlights: z.array(z.string()).optional(),
  }),
});

const experience = defineCollection({
  loader: localizedContent('./content/experience'),
  schema: z.object({
    ...localizedFields,
    jobTitle: z.string(),
    company: z.string(),
    startDate: z.coerce.date(),
    endDate: z.union([z.coerce.date(), z.literal('Present')]),
    location: z.string(),
    employmentType: employmentType,
    shortDescription: z.string(),
    technologies: z.array(technologyNameSchema),
  }),
});

const project = defineCollection({
  loader: localizedContent('./content/project'),
  schema: ({ image }) => z.object({
    ...localizedFields,
    name: z.string(),
    startDate: z.coerce.date(),
    endDate: z.union([z.coerce.date(), z.literal('Present')]),
    status: projectStatus,
    projectType: projectType,
    /** Shown on a single line in the projects list. */
    shortDescription: z.string().max(120),
    stack: z.array(technologyNameSchema),
    tools: z.array(technologyNameSchema).optional(),
    applicationType: z.array(applicationType),
    /** 1 = most relevant on the projects page, 10 = least. */
    relevance: z.number().int().min(1).max(10),
    githubUrl: z.url().optional(),
    websiteUrl: z.url().optional(),
    /** Original path relative to the project's MDX file, used for build-time ASCII conversion. */
    coverSrc: z.string().optional(),
    /** Validates the cover asset; without one, the header converts the main stack's icon. */
    cover: z.object({ src: image(), alt: z.string() }).optional(),
    /** Relative code share per language (GitHub's byte counts or percentages), drawn as the header's color bar. */
    languages: z.record(technologyNameSchema, z.number().positive()).optional(),
  }),
});

const blog = defineCollection({
	loader: localizedContent('./content/blog'),
	schema: z.object({
		...localizedFields,
		title: z.string(),
		publishedDate: z.coerce.date(),
	}),
});

export const collections = {
  education,
  experience,
  project,
  blog,
};
