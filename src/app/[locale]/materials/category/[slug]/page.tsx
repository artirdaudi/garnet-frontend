import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MaterialCategoryCatalog } from '@/components/material-category-catalog';
import { demoMaterialsFor } from '@/data/demo-materials';
import { localizedPath, t } from '@/lib/i18n';
import { getCategories, getMaterialBySlug, getMaterials } from '@/lib/repository';
import { routeLocale, type DetailParams } from '@/lib/route';
import { metadata, siteUrl } from '@/lib/seo';
import type { Locale, Material } from '@/lib/types';

const copy = {
  sq: { kicker: 'Koleksioni Garnet', lead: 'Shikoni fotografitë e secilit material dhe hapeni për të lexuar më shumë hollësi.', browse: 'Shikoni koleksionin', pieces: 'materiale në koleksion', demoPieces: 'shembuj demo' },
  mk: { kicker: 'Колекција Garnet', lead: 'Погледнете ги фотографиите на секој материјал и отворете го за повеќе детали.', browse: 'Погледнете ја колекцијата', pieces: 'материјали во колекцијата', demoPieces: 'демо примери' },
  en: { kicker: 'The Garnet collection', lead: 'Open a material to view its photographs and details.', browse: 'Browse the collection', pieces: 'materials in the collection', demoPieces: 'demo examples' },
};

async function categoryData(params: DetailParams['params']) {
  const { slug } = await params;
  if (slug !== 'tiles' && slug !== 'panels') notFound();
  const [categories, allMaterials] = await Promise.all([getCategories(), getMaterials()]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  return { category, materials: allMaterials.filter((item) => item.category === slug) };
}

export async function generateMetadata({ params }: DetailParams) {
  const locale = await routeLocale(params);
  const { category } = await categoryData(params);
  const description = `${category.description[locale]} ${copy[locale].lead}`;
  const title = { sq: `${category.title.sq} në Garnet`, mk: `${category.title.mk} во Garnet`, en: `${category.title.en} at Garnet` }[locale];
  return metadata(locale, title, `materials/category/${category.slug}`, description, category.image.url);
}

function structuredData(locale: Locale, slug: string, title: string, materials: Material[]) {
  const categoryUrl = `${siteUrl}${localizedPath(locale, `materials/category/${slug}`)}`;
  return [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: t(locale, 'home'), item: `${siteUrl}${localizedPath(locale, '')}` },
      { '@type': 'ListItem', position: 2, name: t(locale, 'materials'), item: `${siteUrl}${localizedPath(locale, 'materials')}` },
      { '@type': 'ListItem', position: 3, name: title, item: categoryUrl },
    ] },
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, url: categoryUrl, mainEntity: {
      '@type': 'ItemList', numberOfItems: materials.length, itemListElement: materials.map((material, index) => ({
        '@type': 'ListItem', position: index + 1, name: material.name, url: `${siteUrl}${localizedPath(locale, `materials/${material.slug}`)}`,
      })),
    } },
  ];
}

export default async function CategoryPage({ params }: DetailParams) {
  const locale = await routeLocale(params);
  const { category, materials } = await categoryData(params);
  const words = copy[locale];
  const heroImage = category.image;
  const demoMode = materials.length === 0;
  const detailed = demoMode ? [] : await Promise.allSettled(materials.map((item) => getMaterialBySlug(item.slug)));
  const displayMaterials = demoMode ? demoMaterialsFor(category.slug) : materials.map((item, index) => {
    const result = detailed[index];
    return result.status === 'fulfilled' && result.value ? { ...item, gallery: result.value.gallery } : item;
  });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(locale, category.slug, category.title[locale], materials)).replace(/</g, '\\u003c') }} />
      <header className={`catalog-hero catalog-hero-${category.slug}`}>
        <div className="catalog-hero-image"><Image src={heroImage.url} alt="" fill priority sizes="(max-width: 700px) 100vw, 60vw" /></div>
        <div className="catalog-hero-inner wrap">
          <nav className="catalog-breadcrumb" aria-label="Breadcrumb"><Link href={localizedPath(locale, '')}>Garnet</Link><span>/</span><Link href={localizedPath(locale, 'materials')}>{t(locale, 'materials')}</Link><span>/</span><span aria-current="page">{category.title[locale]}</span></nav>
          <p className="catalog-kicker">{words.kicker}</p>
          <h1>{category.title[locale]}</h1>
          <p className="catalog-hero-lead">{category.description[locale]}</p>
          <p className="catalog-hero-detail">{words.lead}</p>
          <a className="catalog-hero-action" href="#koleksioni">{words.browse}</a>
          <span className="catalog-hero-count">{String(displayMaterials.length).padStart(2, '0')} {demoMode ? words.demoPieces : words.pieces}</span>
        </div>
      </header>
      <MaterialCategoryCatalog materials={displayMaterials} locale={locale} category={category.slug} demoMode={demoMode} />
    </>
  );
}
