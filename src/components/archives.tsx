'use client';
import { useState } from 'react';
import type { Locale, Material, Project } from '@/lib/types';
import { t, type CopyKey } from '@/lib/i18n';
import { MaterialGrid, ProjectGrid } from './cards';
export function ProjectArchive({ projects, locale }: { projects: Project[]; locale: Locale }) {
  const [active, setActive] = useState<string>('all');
  const filtered = projects.filter((project) => active === 'all' || project.category === active || project.use === active);
  const filters = ['all', ...new Set(projects.flatMap((project) => [project.category, project.use]).filter(Boolean))];
  const label = (filter: string) => filter === 'all' ? t(locale, 'all') : projects.find((project) => project.category === filter)?.categoryTitle?.[locale] || (['architecture', 'interior', 'residential', 'commercial'].includes(filter) ? t(locale, filter as CopyKey) : filter);
  return (
    <>
      <div className="filter-bar" aria-label={t(locale, 'projects')}>
        <div>
          {filters.map((filter) => (
            <button key={filter} aria-pressed={filter === active} onClick={() => setActive(filter)}>
              {label(filter)}
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
export function MaterialArchive({ materials, locale, initial = 'tiles' }: { materials: Material[]; locale: Locale; initial?: string }) {
  const [active, setActive] = useState<string>(initial);
  const filtered = materials.filter((material) => material.category === active);
  const filters = ['tiles', 'panels'];
  const names = {
    sq: { tiles: 'Pllaka', panels: 'Panele Dekoruese', empty: 'Ende nuk ka materiale në këtë kategori.' },
    mk: { tiles: 'Плочки', panels: 'Декоративни панели', empty: 'Сè уште нема материјали во оваа категорија.' },
    en: { tiles: 'Tiles', panels: 'Decorative Panels', empty: 'No materials in this category yet.' },
  };
  const label = (filter: string) => names[locale][filter as 'tiles' | 'panels'];
  return (
    <>
      <div className="filter-bar">
        <div>
          {filters.map((filter) => (
            <button key={filter} aria-pressed={filter === active} onClick={() => setActive(filter)}>
              {label(filter)}
            </button>
          ))}
        </div>
        <span role="status">
          {String(filtered.length).padStart(2, '0')} {t(locale, 'results')}
        </span>
      </div>
      <div className="filter-results" key={active}>
        {filtered.length ? <MaterialGrid materials={filtered} locale={locale} /> : <p className="material-empty">{names[locale].empty}</p>}
      </div>
    </>
  );
}
