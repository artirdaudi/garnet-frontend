import Image from 'next/image';
import Link from 'next/link';
import { t, locales, type CopyKey } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { site, team } from '@/data/site';
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="footer wrap">
      <div className="footer-top">
        <div className="footer-brand">
          <Image src={site.logo} width={84} height={84} alt="Garnet" />
          <p>{t(locale, 'brandLine')}</p>
          <p>
            {site.address}
            <br />
            {t(locale, 'location')}
          </p>
        </div>
        <div>
          <p className="eyebrow">Archstudio Garnet</p>
          {team.map((person) => (
            <p key={person.id}>
              {person.name}
              <br />
              <a href={`tel:${person.telephone}`}>{person.phone}</a>
            </p>
          ))}
        </div>
        <nav aria-label={t(locale, 'navigation')}>
          {(['projects', 'materials', 'archstudio', 'showroom', 'about', 'contact'] as CopyKey[]).map((key) => (
            <Link key={key} href={`/${locale}/${key}`}>
              {t(locale, key)}
            </Link>
          ))}
        </nav>
        <div>
          <a href={site.instagram} target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
          <div className="languages">
            {locales.map((lang) => (
              <Link href={`/${lang}`} key={lang} hrefLang={lang} aria-current={lang === locale ? 'page' : undefined}>
                {lang.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        GARNET
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Garnet</span>
        <span>
          {t(locale, 'websiteBy')} <span className="credit">AD Solutions</span>
        </span>
        <span>{t(locale, 'location')}</span>
      </div>
    </footer>
  );
}
