import { defineCollection, z } from 'astro:content';
import { employmentType, technologyNameSchema } from '@/types/schema';

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    jobTitle: z.string(),
    logo: z.string(),
    company: z.string(),
    startDate: z.coerce.date(),
    endDate: z.union([z.coerce.date(), z.literal('Present')]),
    location: z.string(),
    employmentType: employmentType,
    shortDescription: z.string(),
    technologies: z.array(technologyNameSchema),
  }),
});

export const collections = {
  experience,
};
