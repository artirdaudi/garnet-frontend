import Link from 'next/link';
import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { getMaterials, getCategories } from '@/lib/repository';
import { PageHeading, DemoNote, ContactCTA, Arrow, SectionHeading } from '@/components/ui';
import { Picture } from '@/components/media';
import { MaterialArchive } from '@/components/archives';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, t(locale, 'materials'), 'materials', t(locale, 'materialsIntro'));
}
export default async function MaterialsPage({ params }: PageParams) {
  const locale = await routeLocale(params);
  const [materials, categories] = await Promise.all([getMaterials(), getCategories()]);
  return (
    <>
      <PageHeading
        locale={locale}
        eyebrow={t(locale, 'materials')}
        title={t(locale, 'materials')}
        description={t(locale, 'materialsIntro')}
      />
      <section className="material-categories wrap">
        {categories.map((category, index) => (
          <Link key={category.slug} href={`/${locale}/materials/category/${category.slug}`}>
            <Picture media={category.image} locale={locale} priority={index === 0} />
            <div>
              <span className="eyebrow">0{index + 1}</span>
              <h2>{category.title[locale]}</h2>
              <Arrow />
            </div>
          </Link>
        ))}
      </section>
      <section className="archive material-archive wrap">
        <SectionHeading title={t(locale, 'catalogue')} />
        <DemoNote locale={locale} kind="materials" />
        <MaterialArchive materials={materials} locale={locale} />
      </section>
      <ContactCTA locale={locale} />
    </>
  );
}
