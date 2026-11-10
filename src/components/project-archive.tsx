import Link from 'next/link';
import { localizedPath, t } from '@/lib/i18n';
import type { Locale, Project } from '@/lib/types';
import { ProjectShowcase } from './project-showcase';

const words = {
  sq: { page: 'Faqja', of: 'nga', previous: 'E mëparshmja', next: 'Tjetra', empty: 'Projektet do të shfaqen këtu së shpejti.' },
  mk: { page: 'Страница', of: 'од', previous: 'Претходна', next: 'Следна', empty: 'Проектите наскоро ќе се појават тука.' },
  en: { page: 'Page', of: 'of', previous: 'Previous', next: 'Next', empty: 'Projects will appear here soon.' },
};

export function projectPageHref(locale: Locale, page: number) {
  const base = localizedPath(locale, 'projects');
  return page === 1 ? base : `${base}?page=${page}`;
}

export function ProjectArchive({ projects, locale, page, total }: { projects: Project[]; locale: Locale; page: number; total: number }) {
  const totalPages = Math.max(1, Math.ceil(total / 10));
  const copy = words[locale];
  const visiblePages = Array.from(new Set([1, page - 1, page, page + 1, totalPages])).filter((number) => number >= 1 && number <= totalPages).sort((a, b) => a - b);
  return (
    <section className="projects-archive" aria-label={t(locale, 'projects')}>
      <div className="projects-archive-inner wrap">
        <div className="projects-archive-intro">
          <p>{t(locale, 'allProjects')}</p>
          <span>{copy.page} {page} {copy.of} {totalPages}</span>
        </div>
        {projects.length ? <ProjectShowcase projects={projects} locale={locale} archive /> : <p className="projects-archive-empty">{copy.empty}</p>}
        <nav className="projects-pagination" aria-label={`${t(locale, 'projects')} — ${copy.page}`}>
          {page > 1 ? <Link href={projectPageHref(locale, page - 1)} rel="prev">{copy.previous}</Link> : <span className="disabled" aria-disabled="true">{copy.previous}</span>}
          <div className="projects-pagination-pages">
            {visiblePages.map((number, index) => (
              <span key={number} className="projects-pagination-entry">
                {index > 0 && number - visiblePages[index - 1] > 1 && <span className="projects-pagination-ellipsis" aria-hidden="true">…</span>}
                <Link href={projectPageHref(locale, number)} aria-current={number === page ? 'page' : undefined} aria-label={`${copy.page} ${number}`}>{number}</Link>
              </span>
            ))}
          </div>
          {page < totalPages ? <Link href={projectPageHref(locale, page + 1)} rel="next">{copy.next}</Link> : <span className="disabled" aria-disabled="true">{copy.next}</span>}
        </nav>
      </div>
    </section>
  );
}
