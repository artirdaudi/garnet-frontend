import Image from 'next/image';
import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { images } from '@/data/media';
import { site } from '@/data/site';
import { getFeaturedProjects, getServices } from '@/lib/repository';
import { Picture } from '@/components/media';
import { PageHeading, ContactCTA, SectionHeading, DemoNote, TextLink } from '@/components/ui';
import { Team } from '@/components/sections';
import { ProjectGrid } from '@/components/cards';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, 'Archstudio Garnet', 'archstudio', t(locale, 'studioIntro'));
}
export default async function StudioPage({ params }: PageParams) {
  const locale = await routeLocale(params);
  const [projects, services] = await Promise.all([getFeaturedProjects(), getServices()]);
  return (
    <>
      <PageHeading locale={locale} eyebrow="Archstudio" title={'Archstudio\nGarnet.'} description={t(locale, 'studioIntro')} />
      <div className="studio-banner">
        <Picture media={images.interior} locale={locale} priority sizes="100vw" />
        <Image src={site.studioLogo} className="studio-logo" alt="Archstudio Garnet" width={150} height={150} />
      </div>
      <section className="services wrap">
        <p className="eyebrow">{t(locale, 'services')}</p>
        <div>
          {(services.length ? services : (['architecture', 'interior', 'concept', 'visualization', 'development'] as const).map((key) => ({ id: key, name: { sq: t('sq', key), mk: t('mk', key), en: t('en', key) } }))).map((service, index) => (
            <div className="service-row" key={service.id}>
              <span>0{index + 1}</span>
              <h2>{service.name[locale]}</h2>
            </div>
          ))}
        </div>
      </section>
      <Team locale={locale} />
      <section className="related-section wrap">
        <SectionHeading title={t(locale, 'selected')}>
          <TextLink href={`/${locale}/projects`}>{t(locale, 'allProjects')}</TextLink>
        </SectionHeading>
        <ProjectGrid projects={projects.slice(0, 2)} locale={locale} />
        <DemoNote locale={locale} />
      </section>
      <ContactCTA locale={locale} />
    </>
  );
}
