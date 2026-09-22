import Link from 'next/link';
import type { Locale, Material, Project } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Picture } from './media';
import { Arrow } from './ui';
export function ProjectCard({ project, locale, index = 0 }: { project: Project; locale: Locale; index?: number }) {
  return (
    <Link href={`/${locale}/projects/${project.slug}`} className="project-card">
      <div className="card-image">
        <Picture media={project.coverImage} locale={locale} />
        <span className="image-action">
          {t(locale, 'viewProject')} <Arrow />
        </span>
        <span className="image-number">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="card-caption">
        <div>
          <h3>{project.title[locale]}</h3>
          <p>
            {t(locale, project.category)} <span>/</span> {project.location[locale]}
          </p>
        </div>
        <span className="card-year">
          {project.year}
          <Arrow />
        </span>
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
    <Link href={`/${locale}/materials/${material.slug}`} className={`material-card material-${material.id}`}>
      <div className="card-image">
        <Picture media={material.coverImage} locale={locale} sizes="(max-width: 700px) 90vw, 33vw" />
        {material.isNew && <span className="new-label">{t(locale, 'new')}</span>}
        <span className="image-action">
          <Arrow />
        </span>
      </div>
      <div className="card-caption">
        <div>
          <h3>{material.name}</h3>
          <p>
            {t(locale, material.category)} <span>/</span> {material.attributes.size}
          </p>
        </div>
        <Arrow />
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
