import { z } from 'astro:content';

export type LocationType = 'Remote' | 'On-site' | 'Hybrid';

export type EmploymentType = 'Full-time' | 'Internship' | 'Apprenticeship' | 'Part-time';

export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export interface Technology {
  name: string;
  nerdFontLogo: string;
  color: Color;
}
