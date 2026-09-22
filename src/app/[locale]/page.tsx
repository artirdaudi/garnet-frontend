import Link from 'next/link';
import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { getFeaturedProjects, getMaterials, getCategories } from '@/lib/repository';
import { images } from '@/data/media';
import { Picture } from '@/components/media';
import { Arrow, ContactCTA, DemoNote, SectionHeading, TextLink } from '@/components/ui';
import { MaterialGrid, ProjectGrid } from '@/components/cards';
import { ShowroomPreview, StudioPreview } from '@/components/sections';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, t(locale, 'brandLine'));
}
export default async function Home({ params }: PageParams) {
  const locale = await routeLocale(params);
  const [projects, materials, categories] = await Promise.all([getFeaturedProjects(), getMaterials(), getCategories()]);
  const apollo = materials[0];
  return (
    <>
      <section className="hero">
        <Picture media={images.hero} locale={locale} priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-content wrap">
          <p className="eyebrow hero-eyebrow">
            Garnet <span>/</span> {t(locale, 'brandLine')}
          </p>
          <h1>{t(locale, 'heroLine')}</h1>
          <div className="hero-bottom">
            <p>{t(locale, 'heroSub')}</p>
            <TextLink href={`/${locale}/projects`}>{t(locale, 'exploreProjects')}</TextLink>
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
        <span className="hero-side">01 — GARNET</span>
      </section>
      <section id="introduction" className="intro wrap">
        <p className="eyebrow">01 / {t(locale, 'philosophy')}</p>
        <div>
          <h2>{t(locale, 'introTitle')}</h2>
          <div className="intro-bottom">
            <p>{t(locale, 'intro')}</p>
            <TextLink href={`/${locale}/about`}>{t(locale, 'about')}</TextLink>
          </div>
        </div>
      </section>
      <section className="disciplines wrap" aria-label={t(locale, 'disciplines')}>
        {[
          { key: 'architecture', image: images.architecture, href: 'projects' },
          { key: 'interior', image: images.interior, href: 'archstudio' },
          { key: 'materials', image: images.bathroom, href: 'materials' },
        ].map((discipline, index) => (
          <Link href={`/${locale}/${discipline.href}`} key={discipline.key} className="discipline">
            <Picture media={discipline.image} locale={locale} sizes="(max-width: 700px) 100vw, 33vw" />
            <div>
              <span className="eyebrow">0{index + 1}</span>
              <h3>{t(locale, discipline.key as 'architecture' | 'interior' | 'materials')}</h3>
              <Arrow />
            </div>
          </Link>
        ))}
      </section>
      <section className="selected-projects wrap">
        <SectionHeading number="02" eyebrow={t(locale, 'projects')} title={t(locale, 'selected')}>
          <TextLink href={`/${locale}/projects`}>{t(locale, 'allProjects')}</TextLink>
        </SectionHeading>
        <ProjectGrid projects={projects} locale={locale} editorial />
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
      <section className="featured-material">
        <Picture media={images.stone} locale={locale} sizes="100vw" />
        <div className="featured-material-content">
          <p className="eyebrow">{t(locale, 'featuredMaterial')}</p>
          <h2>
            {apollo.name}
            <span>60 × 120</span>
          </h2>
          <p>
            {apollo.attributes.color[locale]} / {apollo.attributes.finish[locale]}
          </p>
          <TextLink href={`/${locale}/materials/${apollo.slug}`}>{t(locale, 'viewMaterial')}</TextLink>
        </div>
      </section>
      <StudioPreview locale={locale} />
      <ShowroomPreview locale={locale} />
      <section className="new-materials wrap">
        <SectionHeading number="06" eyebrow={t(locale, 'materials')} title={t(locale, 'newMaterials')}>
          <TextLink href={`/${locale}/materials`}>{t(locale, 'catalogue')}</TextLink>
        </SectionHeading>
        <MaterialGrid materials={materials.filter((material) => material.isNew)} locale={locale} />
        <DemoNote locale={locale} kind="materials" />
      </section>
      <ContactCTA locale={locale} />
    </>
  );
}
