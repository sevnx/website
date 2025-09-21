import { defineCollection, z } from 'astro:content';
import { employmentType, locationType, technologyNameSchema } from '@/types/schema';

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    jobTitle: z.string(),
    logo: z.string(),
    company: z.string(),
    startDate: z.coerce.date(),
    endDate: z.union([z.coerce.date(), z.literal('Present')]),
    location: locationType,
    employmentType: employmentType,
    shortDescription: z.string(),
    technologies: z.array(technologyNameSchema),
  }),
});

export const collections = {
  experience,
};
