import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';
import { siteUrl } from '@/lib/seo';
import { getProjects, getMaterials, getCategories } from '@/lib/repository';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, materials, categories] = await Promise.all([getProjects(), getMaterials(), getCategories()]);
  const paths = [
    '',
    'projects',
    'materials',
    'archstudio',
    'showroom',
    'about',
    'contact',
    ...projects.map((project) => `projects/${project.slug}`),
    ...materials.map((material) => `materials/${material.slug}`),
    ...categories.map((category) => `materials/category/${category.slug}`),
  ];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path ? `/${path}` : ''}`,
      alternates: { languages: Object.fromEntries(locales.map((lang) => [lang, `${siteUrl}/${lang}${path ? `/${path}` : ''}`])) },
    })),
  );
}
