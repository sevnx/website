import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { applicationType, employmentType, projectStatus, projectType, technologyNameSchema } from '@/types/schema';
import { glob, file } from 'astro/loaders';

const classworkItem = z.union([
  z.string(),
  z.object({ name: z.string(), technologies: z.array(technologyNameSchema) }),
]);

const education = defineCollection({
  loader: glob({ base: './content/education', pattern: '*.mdx' }),
  schema: z.object({
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
  loader: glob({ base: './content/experience', pattern: '*.mdx' }),
  schema: z.object({
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
  loader: glob({ base: './content/project', pattern: '*.mdx' }),
  schema: z.object({
    name: z.string(),
    startDate: z.coerce.date(),
    endDate: z.union([z.coerce.date(), z.literal('Present')]),
    status: projectStatus,
    projectType: projectType,
    shortDescription: z.string(),
    stack: z.array(technologyNameSchema),
    tools: z.array(technologyNameSchema).optional(),
    applicationType: z.array(applicationType),
    /** 1 = most relevant on the projects page, 10 = least. */
    relevance: z.number().int().min(1).max(10),
    githubUrl: z.url().optional(),
    websiteUrl: z.url().optional(),
  }),
});

const blog = defineCollection({
	loader: glob({ base: './content/blog', pattern: '*.mdx' }),
	schema: z.object({
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
