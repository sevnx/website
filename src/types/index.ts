import { z } from 'astro:content';

export type LocationType = 'Remote' | 'On-site' | 'Hybrid';

export type EmploymentType = 'Full-time' | 'Apprenticeship';

/** A Rosé Pine palette color, resolved by the active WebTUI theme. */
export type PaletteColor = 'love' | 'gold' | 'rose' | 'pine' | 'foam' | 'iris' | 'subtle';

export interface Technology {
  name: string;
  logo: string;
  color: PaletteColor;
}
