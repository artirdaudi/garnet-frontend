import Link from 'next/link';
import { VisionArt } from '@/components/vision-art';
import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { getFeaturedProjects, getMaterials, getCategories, getPageContent } from '@/lib/repository';
import { images } from '@/data/media';
import { Picture } from '@/components/media';
import { HeroBackground } from '@/components/hero-background';
import { Arrow, ContactCTA, DemoNote, SectionHeading, TextLink } from '@/components/ui';
import { MaterialGrid, ProjectGrid } from '@/components/cards';
import { StudioPreview } from '@/components/sections';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, t(locale, 'brandLine'));
}
export default async function Home({ params }: PageParams) {
  const locale = await routeLocale(params);
  const [projects, materials, categories, homeContent] = await Promise.all([getFeaturedProjects(), getMaterials(), getCategories(), getPageContent('home')]);
  const apollo = materials[0];
  const hero = homeContent?.sections.find((section) => section.key === 'hero');
  const introduction = homeContent?.sections.find((section) => section.key === 'introduction');
  const heroLines = (hero?.title[locale] || t(locale, 'heroLine')).split('\n');
  return (
    <>
      <section className="hero">
        <HeroBackground images={[images.hero]} locale={locale} />
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
              <Link className="hero-button hero-button-primary" href={`/${locale}/projects`}>
                {t(locale, 'viewProjects')} <Arrow />
              </Link>
              <Link className="hero-button hero-button-secondary" href={`/${locale}/contact`}>
                {t(locale, 'startProject')} <Arrow />
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
          <TextLink href={`/${locale}/about`}>{locale === 'sq' ? 'Rreth Nesh' : t(locale, 'about')}</TextLink>
        </div>

        <VisionArt alt={t(locale, 'disciplines')} />
      </section>
      <section className="selected-projects wrap">
        <SectionHeading number="02" eyebrow={t(locale, 'projects')} title={t(locale, 'selected')}>
          <TextLink href={`/${locale}/projects`}>{t(locale, 'allProjects')}</TextLink>
        </SectionHeading>
        <ProjectGrid projects={projects.slice(0, 3)} locale={locale} editorial />
        <DemoNote locale={locale} />
      </section>
      <section className="brand-statement wrap">
        <span className="statement-symbol" aria-hidden="true">
          ＋
        </span>
        <p>{t(locale, 'statement')}</p>
        <span className="eyebrow">Garnet — {t(locale, 'location')}</span>
      </section>
      <section className="materials-section wrap">
        <SectionHeading number="03" eyebrow={t(locale, 'materials')} title={t(locale, 'materialsIntro')}>
          <TextLink href={`/${locale}/materials`}>{t(locale, 'allMaterials')}</TextLink>
        </SectionHeading>
        <div className="category-list">
          {categories.map((category, index) => (
            <Link className="category-row" href={`/${locale}/materials/category/${category.slug}`} key={category.slug}>
              <span className="category-index">0{index + 1}</span>
              <Picture media={category.image} locale={locale} sizes="(max-width: 700px) 35vw, 25vw" />
              <div>
                <h3>{category.title[locale]}</h3>
                <p>{category.description[locale]}</p>
              </div>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>
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
          <TextLink href={`/${locale}/materials/${apollo.slug}`}>{t(locale, 'viewMaterial')}</TextLink>
        </div>
      </section>}
      <StudioPreview locale={locale} />
      {materials.length > 0 && <section className="new-materials wrap">
        <SectionHeading number="05" eyebrow={t(locale, 'materials')} title={t(locale, 'newMaterials')}>
          <TextLink href={`/${locale}/materials`}>{t(locale, 'catalogue')}</TextLink>
        </SectionHeading>
        <MaterialGrid materials={materials.slice(0, 3)} locale={locale} />
        <DemoNote locale={locale} kind="materials" />
      </section>}
      <ContactCTA locale={locale} />
    </>
  );
}
