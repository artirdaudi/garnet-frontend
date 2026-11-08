import { notFound } from 'next/navigation';
import { routeLocale, type DetailParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { getMaterials, getCategories } from '@/lib/repository';
import { PageHeading, DemoNote, ContactCTA, TextLink } from '@/components/ui';
import { Picture } from '@/components/media';
import { MaterialGrid } from '@/components/cards';
export async function generateMetadata({ params }: DetailParams) {
  const locale = await routeLocale(params);
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) notFound();
  return metadata(locale, category.title[locale], `materials/category/${slug}`, category.description[locale]);
}
export default async function CategoryPage({ params }: DetailParams) {
  const locale = await routeLocale(params);
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) notFound();
  const materials = (await getMaterials()).filter((item) => item.category === slug);
  return (
    <>
      <PageHeading
        locale={locale}
        eyebrow={t(locale, 'materials')}
        title={category.title[locale]}
        description={category.description[locale]}
      />
      <Picture media={category.image} locale={locale} className="category-cover" priority sizes="100vw" />
      <section className="related-section wrap">
        <TextLink href={`/${locale}/materials`}>{t(locale, 'allMaterials')}</TextLink>
        <DemoNote locale={locale} kind="materials" />
        {materials.length ? <MaterialGrid materials={materials} locale={locale} /> : <p className="material-empty">{{ sq: 'Ende nuk ka materiale në këtë kategori.', mk: 'Сè уште нема материјали во оваа категорија.', en: 'No materials in this category yet.' }[locale]}</p>}
      </section>
      <ContactCTA locale={locale} />
    </>
  );
}
