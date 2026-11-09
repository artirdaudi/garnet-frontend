import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { localizedPath, t } from '@/lib/i18n';
import { images } from '@/data/media';
import { Picture } from '@/components/media';
import { PageHeading, ContactCTA, TextLink, DemoNote } from '@/components/ui';
import { StudioPreview } from '@/components/sections';
import { BrandStatement } from '@/components/brand-statement';
import { getPageContent } from '@/lib/repository';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, t(locale, 'about'), 'about', t(locale, 'aboutBody'));
}
export default async function AboutPage({ params }: PageParams) {
  const locale = await routeLocale(params);
  const content = await getPageContent('about');
  return (
    <>
      <PageHeading locale={locale} eyebrow={t(locale, 'about')} title={content?.title[locale] || t(locale, 'aboutTitle')} />
      <section className="about-intro wrap">
        <Picture media={images.living} locale={locale} priority />
        <div>
          <p className="eyebrow">Garnet / {t(locale, 'location')}</p>
          <h2>{t(locale, 'introTitle')}</h2>
          <p>{t(locale, 'intro')}</p>
          <p>{content?.content[locale] || t(locale, 'aboutBody')}</p>
          <TextLink href={localizedPath(locale, 'contact')}>{t(locale, 'contact')}</TextLink>
        </div>
      </section>
      <div className="wrap">
        <DemoNote locale={locale} kind="photo" />
      </div>
      <BrandStatement lines={t(locale, 'statement').split('\n')} location={t(locale, 'location')} />
      <StudioPreview locale={locale} />
      <ContactCTA locale={locale} />
    </>
  );
}
