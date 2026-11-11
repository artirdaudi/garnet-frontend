import { notFound } from 'next/navigation';
import { routeLocale, type DetailParams } from '@/lib/route';
import { metadata, siteUrl } from '@/lib/seo';
import { localizedPath, t, type CopyKey } from '@/lib/i18n';
import { getMaterialBySlug, getProjectsForMaterial } from '@/lib/repository';
import { Picture } from '@/components/media';
import { Gallery } from '@/components/gallery';
import { DemoNote, SectionHeading, TextLink } from '@/components/ui';
import { ProjectGrid } from '@/components/cards';
import { materialPrice } from '@/lib/material-price';
export async function generateMetadata({ params }: DetailParams) {
  const locale = await routeLocale(params);
  const { slug } = await params;
  const material = await getMaterialBySlug(slug);
  if (!material) notFound();
  const description = material.description[locale] || `${material.name} — ${material.categoryTitle?.[locale] || t(locale, material.category as CopyKey)}. ${[material.attributes.color[locale], material.attributes.size].filter(Boolean).join(', ')}. ${t(locale, 'location')}.`;
  return metadata(locale, material.name, `materials/${slug}`, description, material.coverImage.url);
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
  const productUrl = `${siteUrl}${localizedPath(locale, `materials/${slug}`)}`;
  const categoryUrl = `${siteUrl}${localizedPath(locale, `materials/category/${material.category}`)}`;
  const structuredData = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: t(locale, 'home'), item: `${siteUrl}${localizedPath(locale, '')}` },
      { '@type': 'ListItem', position: 2, name: material.categoryTitle?.[locale] || t(locale, material.category as CopyKey), item: categoryUrl },
      { '@type': 'ListItem', position: 3, name: material.name, item: productUrl },
    ] },
    { '@context': 'https://schema.org', '@type': 'Product', name: material.name, url: productUrl,
      image: [material.coverImage, ...material.gallery].map((image) => image.url),
      description: material.description[locale] || undefined,
      category: material.categoryTitle?.[locale] || t(locale, material.category as CopyKey),
      color: material.attributes.color[locale] || undefined,
      size: material.attributes.size || undefined,
      ...(material.price !== null && material.currency ? { offers: { '@type': 'Offer', price: material.price, priceCurrency: material.currency, url: productUrl } } : {}),
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <section className="material-detail wrap">
        <Picture media={material.coverImage} locale={locale} priority />
        <div className="material-detail-copy">
          <TextLink href={localizedPath(locale, 'materials')}>{t(locale, 'materials')}</TextLink>
          <p className="eyebrow">{material.categoryTitle?.[locale] || t(locale, material.category as CopyKey)}</p>
          <h1>{material.name}</h1>
          {materialPrice(material, locale) && <p className="material-detail-price">{materialPrice(material, locale)}</p>}
          <p>{material.description[locale]}</p>
          <dl className="specifications">
            {specs.map(([key, value]) => (
              <div key={key}>
                <dt>{t(locale, key)}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <TextLink href={`${localizedPath(locale, 'contact')}?material=${encodeURIComponent(material.slug)}`}>{t(locale, 'askMaterial')}</TextLink>
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
