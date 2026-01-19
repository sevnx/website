import { defineCollection, z } from 'astro:content';
import { applicationType, employmentType, projectType, technologyNameSchema } from '@/types/schema';

const experience = defineCollection({
  type: 'content',
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
  type: 'content',
  schema: z.object({
    name: z.string(),
    startDate: z.coerce.date(),
    endDate: z.union([z.coerce.date(), z.literal('Present')]),
    projectType: projectType,
    shortDescription: z.string(),
    technologies: z.array(technologyNameSchema),
    applicationType: z.array(applicationType),
    githubUrl: z.string().url().optional(),
  }),
});

export const collections = {
  experience,
  project,
};
