import Link from 'next/link';
import type { Locale, Material, Project } from '@/lib/types';
import { localizedPath, t, type CopyKey } from '@/lib/i18n';
import { Picture } from './media';
import { materialPrice } from '@/lib/material-price';
export function ProjectCard({ project, locale, index = 0 }: { project: Project; locale: Locale; index?: number }) {
  return (
    <Link href={localizedPath(locale, `projects/${project.slug}`)} className="project-card">
      <div className="card-image">
        <Picture media={project.coverImage} locale={locale} />
        <span className="image-action">
          {t(locale, 'viewProject')}
        </span>
        <span className="image-number">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="card-caption">
        <div>
          <h3>{project.title[locale]}</h3>
          {project.location[locale] && <p>{project.location[locale]}</p>}
        </div>
        {project.year > 0 && <span className="card-year">{project.year}</span>}
      </div>
    </Link>
  );
}
export function ProjectGrid({ projects, locale, editorial = false }: { projects: Project[]; locale: Locale; editorial?: boolean }) {
  return (
    <div className={`project-grid ${editorial ? 'editorial' : ''}`}>
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} locale={locale} index={index} />
      ))}
    </div>
  );
}
export function MaterialCard({ material, locale }: { material: Material; locale: Locale }) {
  return (
    <Link href={localizedPath(locale, `materials/${material.slug}`)} className={`material-card material-${material.id}`}>
      <div className="card-image">
        <Picture media={material.coverImage} locale={locale} sizes="(max-width: 700px) 90vw, 33vw" />
        {material.isNew && <span className="new-label">{t(locale, 'new')}</span>}
      </div>
      <div className="card-caption">
        <div>
          <h3>{material.name}</h3>
          <p>
            {material.categoryTitle?.[locale] || t(locale, material.category as CopyKey)} <span>/</span> {material.attributes.size}
          </p>
          {materialPrice(material, locale) && <p className="material-card-price">{materialPrice(material, locale)}</p>}
        </div>
      </div>
    </Link>
  );
}
export function MaterialGrid({ materials, locale }: { materials: Material[]; locale: Locale }) {
  return (
    <div className="material-grid">
      {materials.map((material) => (
        <MaterialCard key={material.id} material={material} locale={locale} />
      ))}
    </div>
  );
}
