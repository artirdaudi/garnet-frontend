import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ProjectArchive } from '@/components/project-archive';
import { ContactCTA } from '@/components/ui';
import { t } from '@/lib/i18n';
import { getProjectBySlug, getProjectsPage } from '@/lib/repository';
import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';

type ProjectsPageProps = PageParams & { searchParams: Promise<{ page?: string | string[] }> };

function pageNumber(raw: string | string[] | undefined) {
  if (raw === undefined) return 1;
  if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw)) notFound();
  const page = Number(raw);
  if (!Number.isSafeInteger(page)) notFound();
  return page;
}

async function projectListing(props: ProjectsPageProps) {
  const locale = await routeLocale(props.params);
  const page = pageNumber((await props.searchParams).page);
  const listing = await getProjectsPage(page);
  if (page > Math.max(1, Math.ceil(listing.total / 10))) notFound();
  return { locale, page, ...listing };
}

export async function generateMetadata(props: ProjectsPageProps) {
  const { locale, page, projects } = await projectListing(props);
  const pageLabel = { sq: 'Faqja', mk: 'Страница', en: 'Page' }[locale];
  const title = page > 1 ? `${t(locale, 'projects')} — ${pageLabel} ${page}` : t(locale, 'projects');
  return metadata(locale, title, page > 1 ? `projects?page=${page}` : 'projects', t(locale, 'projectIntro'), projects[0]?.coverImage.url);
}

export default async function ProjectsPage(props: ProjectsPageProps) {
  const { locale, page, projects, total } = await projectListing(props);
  const cover = projects[0]?.coverImage;
  const details = await Promise.allSettled(projects.map((project) => getProjectBySlug(project.slug)));
  const showcaseProjects = projects.map((project, index) => details[index].status === 'fulfilled' ? details[index].value || project : project);
  return (
    <>
      <header className="projects-hero">
        {cover && <div className="projects-hero-photo"><Image src={cover.url} alt="" fill sizes="(max-width: 700px) 100vw, 55vw" priority /></div>}
        <div className="projects-hero-content wrap">
          <p className="projects-hero-kicker">Garnet <span>/</span> {t(locale, 'projects')}</p>
          <h1>{t(locale, 'projects')}</h1>
          <p className="projects-hero-description">{t(locale, 'projectIntro')}</p>
          <p className="projects-hero-count">{String(total).padStart(2, '0')} {t(locale, 'projects').toLowerCase()}</p>
        </div>
      </header>
      <ProjectArchive projects={showcaseProjects} locale={locale} page={page} total={total} />
      <ContactCTA locale={locale} />
    </>
  );
}
