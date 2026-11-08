import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { getMaterials } from '@/lib/repository';
import { PageHeading, DemoNote, ContactCTA, SectionHeading } from '@/components/ui';
import { MaterialArchive } from '@/components/archives';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, t(locale, 'materials'), 'materials', t(locale, 'materialsIntro'));
}
export default async function MaterialsPage({ params }: PageParams) {
  const locale = await routeLocale(params);
  const materials = await getMaterials();
  return (
    <>
      <PageHeading
        locale={locale}
        eyebrow={t(locale, 'materials')}
        title={t(locale, 'materials')}
        description={t(locale, 'materialsIntro')}
      />
      <section className="archive material-archive wrap">
        <SectionHeading title={t(locale, 'catalogue')} />
        <DemoNote locale={locale} kind="materials" />
        <MaterialArchive materials={materials} locale={locale} />
      </section>
      <ContactCTA locale={locale} />
    </>
  );
}
