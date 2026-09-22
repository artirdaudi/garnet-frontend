export const locales = ['sq', 'mk', 'en'] as const;
export type Locale = (typeof locales)[number];
export type Localized = Record<Locale, string>;
export type ProjectCategory = 'architecture' | 'interior';
export type MaterialCategory = 'tiles' | 'panels' | 'surfaces';
export interface Media {
  id: string;
  url: string;
  alt: Localized;
  width: number;
  height: number;
  source?: string;
}
export interface Project {
  id: string;
  slug: string;
  title: Localized;
  category: ProjectCategory;
  use: 'residential' | 'commercial';
  location: Localized;
  year: number;
  status: Localized;
  area: string;
  services: Localized[];
  description: Localized;
  coverImage: Media;
  gallery: Media[];
  materialIds: string[];
  featured: boolean;
  displayOrder: number;
  isDemo: boolean;
}
export interface Material {
  id: string;
  slug: string;
  name: string;
  category: MaterialCategory;
  description: Localized;
  coverImage: Media;
  gallery: Media[];
  attributes: { finish: Localized; size: string; application: Localized; color: Localized };
  featured: boolean;
  isNew: boolean;
  active: boolean;
  isDemo: boolean;
}
export interface Category {
  slug: MaterialCategory;
  title: Localized;
  description: Localized;
  image: Media;
}
export interface Architect {
  id: string;
  name: string;
  phone: string;
  telephone: string;
  initials: string;
}
export interface ContactSubmission {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  locale: Locale;
  material?: string;
}
