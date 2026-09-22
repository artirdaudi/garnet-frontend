import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/types';
import { t } from '@/lib/i18n';
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span aria-hidden="true" className="arrow">
      {diagonal ? '↗' : '↗'}
    </span>
  );
}
export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link className={`text-link ${className}`} href={href}>
      {children}
      <Arrow />
    </Link>
  );
}
export function SectionHeading({
  number,
  eyebrow,
  title,
  children,
}: {
  number?: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && (
          <p className="eyebrow">
            {number && <span>{number} / </span>}
            {eyebrow}
          </p>
        )}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function PageHeading({
  locale,
  eyebrow,
  title,
  description,
}: {
  locale: Locale;
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-heading wrap">
      <p className="eyebrow">
        Garnet <span>/ {eyebrow || t(locale, 'brandLine')}</span>
      </p>
      <h1>{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </div>
  );
}
export function DemoNote({ locale, kind = 'projects' }: { locale: Locale; kind?: 'projects' | 'materials' | 'photo' }) {
  return (
    <p className="demo-note">
      <span aria-hidden="true">○</span>{' '}
      {t(locale, kind === 'projects' ? 'demoProjects' : kind === 'materials' ? 'demoMaterials' : 'demoPhoto')}
    </p>
  );
}
export function ContactCTA({ locale }: { locale: Locale }) {
  return (
    <section className="contact-cta wrap">
      <p className="eyebrow">Garnet / {t(locale, 'contact')}</p>
      <div>
        <h2>{t(locale, 'ctaTitle')}</h2>
        <Link href={`/${locale}/contact`} className="round-link" aria-label={t(locale, 'startProject')}>
          <Arrow />
        </Link>
      </div>
      <p>{t(locale, 'ctaText')}</p>
    </section>
  );
}
