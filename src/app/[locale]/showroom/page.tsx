import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { images } from '@/data/media';
import { showroomGallery } from '@/data/site';
import { Picture } from '@/components/media';
import { Gallery } from '@/components/gallery';
import { PageHeading, DemoNote, ContactCTA } from '@/components/ui';
import { Address, LocationMap } from '@/components/sections';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, t(locale, 'showroom'), 'showroom', t(locale, 'showroomIntro'));
}
export default async function ShowroomPage({ params }: PageParams) {
  const locale = await routeLocale(params);
  return (
    <>
      <PageHeading locale={locale} eyebrow={t(locale, 'showroom')} title={t(locale, 'visit')} description={t(locale, 'showroomIntro')} />
      <Picture media={images.showroom} locale={locale} className="detail-cover" priority sizes="100vw" />
      <div className="wrap">
        <DemoNote locale={locale} kind="photo" />
      </div>
      <section className="showroom-location wrap">
        <Address locale={locale} />
        <LocationMap locale={locale} />
      </section>
      <Gallery images={showroomGallery} locale={locale} />
      <ContactCTA locale={locale} />
    </>
  );
}
