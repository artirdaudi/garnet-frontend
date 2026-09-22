'use client';
import { useState } from 'react';
import type { Locale, Material, Project } from '@/lib/types';
import { t, type CopyKey } from '@/lib/i18n';
import { MaterialGrid, ProjectGrid } from './cards';
export function ProjectArchive({ projects, locale }: { projects: Project[]; locale: Locale }) {
  const [active, setActive] = useState<CopyKey>('all');
  const filtered = projects.filter((project) => active === 'all' || project.category === active || project.use === active);
  return (
    <>
      <div className="filter-bar" aria-label={t(locale, 'projects')}>
        <div>
          {(['all', 'architecture', 'interior', 'residential', 'commercial'] as const).map((filter) => (
            <button key={filter} aria-pressed={filter === active} onClick={() => setActive(filter)}>
              {t(locale, filter)}
              <sup>{projects.filter((project) => filter === 'all' || project.category === filter || project.use === filter).length}</sup>
            </button>
          ))}
        </div>
        <span role="status">
          {String(filtered.length).padStart(2, '0')} {t(locale, 'results')}
        </span>
      </div>
      <div className="filter-results" key={active}>
        <ProjectGrid projects={filtered} locale={locale} />
      </div>
    </>
  );
}
export function MaterialArchive({ materials, locale, initial = 'all' }: { materials: Material[]; locale: Locale; initial?: CopyKey }) {
  const [active, setActive] = useState<CopyKey>(initial);
  const filtered = materials.filter((material) => active === 'all' || material.category === active);
  return (
    <>
      <div className="filter-bar">
        <div>
          {(['all', 'tiles', 'panels', 'surfaces'] as const).map((filter) => (
            <button key={filter} aria-pressed={filter === active} onClick={() => setActive(filter)}>
              {t(locale, filter)}
            </button>
          ))}
        </div>
        <span role="status">
          {String(filtered.length).padStart(2, '0')} {t(locale, 'results')}
        </span>
      </div>
      <div className="filter-results" key={active}>
        <MaterialGrid materials={filtered} locale={locale} />
      </div>
    </>
  );
}
