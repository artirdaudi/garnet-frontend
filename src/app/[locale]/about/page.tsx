import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { images } from '@/data/media';
import { Picture } from '@/components/media';
import { PageHeading, ContactCTA, TextLink, DemoNote } from '@/components/ui';
import { StudioPreview } from '@/components/sections';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, t(locale, 'about'), 'about', t(locale, 'aboutBody'));
}
export default async function AboutPage({ params }: PageParams) {
  const locale = await routeLocale(params);
  return (
    <>
      <PageHeading locale={locale} eyebrow={t(locale, 'about')} title={t(locale, 'aboutTitle')} />
      <section className="about-intro wrap">
        <Picture media={images.living} locale={locale} priority />
        <div>
          <p className="eyebrow">Garnet / {t(locale, 'location')}</p>
          <h2>{t(locale, 'introTitle')}</h2>
          <p>{t(locale, 'intro')}</p>
          <p>{t(locale, 'aboutBody')}</p>
          <TextLink href={`/${locale}/showroom`}>{t(locale, 'visitShowroom')}</TextLink>
        </div>
      </section>
      <div className="wrap">
        <DemoNote locale={locale} kind="photo" />
      </div>
      <section className="brand-statement wrap">
        <span className="statement-symbol" aria-hidden="true">
          ＋
        </span>
        <p>{t(locale, 'statement')}</p>
      </section>
      <StudioPreview locale={locale} />
      <ContactCTA locale={locale} />
    </>
  );
}
