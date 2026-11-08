import { notFound } from 'next/navigation';
import { routeLocale, type DetailParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t, type CopyKey } from '@/lib/i18n';
import { getProjectBySlug, getProjects, getMaterialsForProject } from '@/lib/repository';
import { Picture } from '@/components/media';
import { Gallery } from '@/components/gallery';
import { DemoNote, SectionHeading, TextLink } from '@/components/ui';
import { MaterialGrid } from '@/components/cards';
export async function generateMetadata({ params }: DetailParams) {
  const locale = await routeLocale(params);
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return metadata(locale, project.title[locale], `projects/${slug}`, project.description[locale], project.coverImage.url);
}
export default async function ProjectDetail({ params }: DetailParams) {
  const locale = await routeLocale(params);
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const [materials, projects] = await Promise.all([getMaterialsForProject(project.id), getProjects()]);
  const next = projects[(projects.findIndex((item) => item.id === project.id) + 1) % projects.length];
  const facts = [
    ['place', project.location[locale]],
    ['area', project.area],
  ].filter(([, value]) => Boolean(value)) as [CopyKey, string][];
  return (
    <>
      <div className="detail-heading wrap">
        <TextLink href={`/${locale}/projects`}>{t(locale, 'projects')}</TextLink>
        <h1>{project.title[locale]}</h1>
        {project.location[locale] && <p>{project.location[locale]}</p>}
      </div>
      <Picture media={project.coverImage} locale={locale} className="detail-cover" priority sizes="100vw" />
      <div className="wrap">
        <dl className="project-facts">
          {facts.map(([key, value]) => (
            <div key={key}>
              <dt>{t(locale, key)}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <DemoNote locale={locale} />
        {project.description[locale] && <section className="project-narrative">
          <p className="eyebrow">{t(locale, 'narrative')}</p>
          <p>{project.description[locale]}</p>
        </section>}
      </div>
      <Gallery images={project.gallery} locale={locale} />
      {materials.length > 0 && (
        <section className="related-section wrap">
          <SectionHeading eyebrow={t(locale, 'materials')} title={t(locale, 'materialsUsed')} />
          <MaterialGrid materials={materials} locale={locale} />
          <DemoNote locale={locale} kind="materials" />
        </section>
      )}
      {next && <section className="next-project wrap">
        <p className="eyebrow">{t(locale, 'nextProject')}</p>
        <TextLink href={`/${locale}/projects/${next.slug}`}>{next.title[locale]}</TextLink>
      </section>}
    </>
  );
}
