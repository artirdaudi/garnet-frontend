import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/lib/types';
import { localizedPath, t } from '@/lib/i18n';
export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link className={`text-link ${className}`} href={href}>
      {children}
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
  void locale; void kind;
  return null;
}
export function ContactCTA({ locale }: { locale: Locale }) {
  return (
    <section className="contact-cta wrap">
      <div>
        <h2>{t(locale, 'ctaTitle')}</h2>
        <Link href={localizedPath(locale, 'contact')} className="contact-action">{t(locale, 'contact')}</Link>
      </div>
      <p>{t(locale, 'ctaText')}</p>
    </section>
  );
}
