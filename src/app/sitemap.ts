import type { MetadataRoute } from 'next';
import { locales, localizedPath } from '@/lib/i18n';
import { siteUrl } from '@/lib/seo';
import { getProjects, getMaterials, getCategories } from '@/lib/repository';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, materials, categories] = await Promise.all([getProjects(), getMaterials(), getCategories()]);
  const paths = [
    '',
    'projects',
    ...Array.from({ length: Math.max(0, Math.ceil(projects.length / 10) - 1) }, (_, index) => `projects?page=${index + 2}`),
    'materials',
    'archstudio',
    'about',
    'contact',
    ...projects.map((project) => `projects/${project.slug}`),
    ...materials.map((material) => `materials/${material.slug}`),
    ...categories.map((category) => `materials/category/${category.slug}`),
  ];
  return [...new Set(paths)].flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}${localizedPath(locale, path)}`,
      alternates: { languages: Object.fromEntries([...locales.map((lang) => [lang, `${siteUrl}${localizedPath(lang, path)}`]), ['x-default', `${siteUrl}${localizedPath('sq', path)}`]]) },
      changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
      priority: path === '' ? 1 : path.startsWith('projects/') || path.startsWith('materials/') ? 0.7 : 0.8,
    })),
  );
}
