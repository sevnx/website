import { defineCollection, z } from 'astro:content';
import { applicationType, employmentType, projectStatus, projectType, technologyNameSchema } from '@/types/schema';

const classworkItem = z.union([
  z.string(),
  z.object({ name: z.string(), technologies: z.array(technologyNameSchema) }),
]);

const education = defineCollection({
  type: 'content',
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
    status: projectStatus,
    projectType: projectType,
    shortDescription: z.string(),
    stack: z.array(technologyNameSchema),
    tools: z.array(technologyNameSchema).optional(),
    applicationType: z.array(applicationType),
    githubUrl: z.string().url().optional(),
    websiteUrl: z.string().url().optional(),
  }),
});

export const collections = {
  education,
  experience,
  project,
};
