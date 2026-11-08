import { notFound } from 'next/navigation';
import { routeLocale, type DetailParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t, type CopyKey } from '@/lib/i18n';
import { getMaterialBySlug, getProjectsForMaterial } from '@/lib/repository';
import { Picture } from '@/components/media';
import { Gallery } from '@/components/gallery';
import { DemoNote, SectionHeading, TextLink } from '@/components/ui';
import { ProjectGrid } from '@/components/cards';
export async function generateMetadata({ params }: DetailParams) {
  const locale = await routeLocale(params);
  const { slug } = await params;
  const material = await getMaterialBySlug(slug);
  if (!material) notFound();
  return metadata(locale, material.name, `materials/${slug}`, material.description[locale], material.coverImage.url);
}
export default async function MaterialDetail({ params }: DetailParams) {
  const locale = await routeLocale(params);
  const { slug } = await params;
  const material = await getMaterialBySlug(slug);
  if (!material) notFound();
  const projects = await getProjectsForMaterial(material.id);
  const specs = [
    ['category', material.categoryTitle?.[locale] || t(locale, material.category as CopyKey)],
    ['finish', material.attributes.finish[locale]],
    ['size', material.attributes.size],
    ['application', material.attributes.application[locale]],
    ['color', material.attributes.color[locale]],
  ].filter(([, value]) => Boolean(value)) as [CopyKey, string][];
  return (
    <>
      <section className="material-detail wrap">
        <Picture media={material.coverImage} locale={locale} priority />
        <div className="material-detail-copy">
          <TextLink href={`/${locale}/materials`}>{t(locale, 'materials')}</TextLink>
          <p className="eyebrow">{material.categoryTitle?.[locale] || t(locale, material.category as CopyKey)}</p>
          <h1>{material.name}</h1>
          <p>{material.description[locale]}</p>
          <dl className="specifications">
            {specs.map(([key, value]) => (
              <div key={key}>
                <dt>{t(locale, key)}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <TextLink href={`/${locale}/contact?material=${encodeURIComponent(material.slug)}`}>{t(locale, 'askMaterial')}</TextLink>
          <DemoNote locale={locale} kind="materials" />
        </div>
      </section>
      <Gallery images={material.gallery} locale={locale} />
      {projects.length > 0 && (
        <section className="related-section wrap">
          <SectionHeading eyebrow={t(locale, 'projects')} title={t(locale, 'featuredIn')} />
          <ProjectGrid projects={projects} locale={locale} />
          <DemoNote locale={locale} />
        </section>
      )}
    </>
  );
}
