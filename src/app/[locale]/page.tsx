import Link from 'next/link';
import { VisionArt } from '@/components/vision-art';
import { routeLocale, type PageParams } from '@/lib/route';
import { metadata, siteUrl } from '@/lib/seo';
import { localizedPath, t } from '@/lib/i18n';
import { getFeaturedProjects, getMaterials, getPageContent, getProjectBySlug, getHeroImages } from '@/lib/repository';
import { images } from '@/data/media';
import { Picture } from '@/components/media';
import { HeroBackground } from '@/components/hero-background';
import { ContactCTA, DemoNote, SectionHeading, TextLink } from '@/components/ui';
import { MaterialGrid } from '@/components/cards';
import { ProjectShowcase } from '@/components/project-showcase';
import { BrandStatement } from '@/components/brand-statement';
import { MaterialsShowcase } from '@/components/materials-showcase';
import { StudioPreview } from '@/components/sections';
import { site } from '@/data/site';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, t(locale, 'brandLine'));
}
export default async function Home({ params }: PageParams) {
  const locale = await routeLocale(params);
  const [projects, materials, homeContent, heroImages] = await Promise.all([getFeaturedProjects(), getMaterials(), getPageContent('home'), getHeroImages()]);
  const featured = projects.slice(0, 4);
  const projectDetails = await Promise.allSettled(featured.map((project) => getProjectBySlug(project.slug)));
  const showcaseProjects = featured.map((project, index) => projectDetails[index].status === 'fulfilled' ? projectDetails[index].value || project : project);
  const apollo = materials[0];
  const hero = homeContent?.sections.find((section) => section.key === 'hero');
  const introduction = homeContent?.sections.find((section) => section.key === 'introduction');
  const heroLines = (hero?.title[locale] || t(locale, 'heroLine')).split('\n');
  const statementLines = t(locale, 'materialsStatement').split('\n');
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Garnet', url: siteUrl, inLanguage: ['sq', 'mk', 'en'] },
          { '@type': 'HomeAndConstructionBusiness', '@id': `${siteUrl}/#business`, name: 'Garnet', url: siteUrl, image: `${siteUrl}${site.logo}`, logo: `${siteUrl}${site.logo}`, address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: 'Tetovë', addressCountry: 'MK' }, sameAs: [site.instagram, site.facebook] },
        ],
      }).replace(/</g, '\\u003c') }} />
      <section className="hero">
        <HeroBackground images={heroImages.length ? heroImages : [images.hero]} locale={locale} />
        <div className="hero-shade" />
        <div className="hero-content wrap">
          <p className="eyebrow hero-eyebrow">
            Garnet <span>/</span> {t(locale, 'brandLine')}
          </p>
          <h1 aria-label={heroLines.join(' ')}>
            {heroLines.map((line, index) => (
              <span className="hero-title-line" key={index}>
                {line}
              </span>
            ))}
          </h1>
          <div className="hero-bottom">
            <p>{hero?.description[locale] || t(locale, 'heroSub')}</p>
            <div className="hero-actions">
              <Link className="hero-button hero-button-primary" href={localizedPath(locale, 'projects')}>
                {t(locale, 'viewProjects')}
              </Link>
              <Link className="hero-button hero-button-secondary" href={localizedPath(locale, 'contact')}>
                {t(locale, 'startProject')}
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-foot wrap">
          <a href="#introduction">
            <span className="scroll-line" />
            {t(locale, 'scroll')}
          </a>
          <span>
            {t(locale, 'location')} <span className="small-dot" />
          </span>
        </div>
      </section>
      <section id="introduction" className="vision-section wrap">
        <div className="vision-copy">
          <p className="eyebrow">{t(locale, 'philosophy')}</p>
          <h2>{introduction?.title[locale] || t(locale, 'introTitle')}</h2>
          <p className="vision-description">{introduction?.description[locale] || t(locale, 'intro')}</p>
          <TextLink href={localizedPath(locale, 'about')}>{locale === 'sq' ? 'Rreth Nesh' : t(locale, 'about')}</TextLink>
        </div>

        <VisionArt alt={t(locale, 'disciplines')} />
      </section>
      <section className="selected-projects wrap">
        <SectionHeading eyebrow={t(locale, 'projects')} title={t(locale, 'selected')}>
          <Link className="showcase-all-link" href={localizedPath(locale, 'projects')}>{t(locale, 'allProjects')}</Link>
        </SectionHeading>
        <ProjectShowcase projects={showcaseProjects} locale={locale} />
        <DemoNote locale={locale} />
      </section>
      <BrandStatement lines={statementLines} location={t(locale, 'location')} />
      <MaterialsShowcase locale={locale} />
      {apollo && <section className="featured-material">
        <Picture media={apollo.coverImage} locale={locale} sizes="100vw" />
        <div className="featured-material-content">
          <p className="eyebrow">{t(locale, 'featuredMaterial')}</p>
          <h2>
            {apollo.name}
            {apollo.attributes.size && <span>{apollo.attributes.size}</span>}
          </h2>
          {(apollo.attributes.color[locale] || apollo.attributes.finish[locale]) && <p>
            {[apollo.attributes.color[locale], apollo.attributes.finish[locale]].filter(Boolean).join(' / ')}
          </p>}
          <TextLink href={localizedPath(locale, `materials/${apollo.slug}`)}>{t(locale, 'viewMaterial')}</TextLink>
        </div>
      </section>}
      <StudioPreview locale={locale} />
      {materials.length > 0 && <section className="new-materials wrap">
        <SectionHeading number="05" eyebrow={t(locale, 'materials')} title={t(locale, 'newMaterials')}>
          <TextLink href={localizedPath(locale, 'materials')}>{t(locale, 'catalogue')}</TextLink>
        </SectionHeading>
        <MaterialGrid materials={materials.slice(0, 3)} locale={locale} />
        <DemoNote locale={locale} kind="materials" />
      </section>}
      <ContactCTA locale={locale} />
    </>
  );
}
