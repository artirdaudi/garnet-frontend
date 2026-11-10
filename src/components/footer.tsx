import Image from 'next/image';
import Link from 'next/link';
import { t, localizedPath, type CopyKey } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { site, team } from '@/data/site';
import { getSiteSettings } from '@/lib/repository';
import { FooterLanguageLinks } from './footer-language-links';
export async function Footer({ locale }: { locale: Locale }) {
  const settings = await getSiteSettings();
  const navigation: { key: CopyKey; path: string }[] = [
    { key: 'projects', path: 'projects' },
    { key: 'tiles', path: 'materials/category/tiles' },
    { key: 'panels', path: 'materials/category/panels' },
    { key: 'archstudio', path: 'archstudio' },
    { key: 'contact', path: 'contact' },
  ];
  return (
    <footer className="footer wrap">
      <div className="footer-top">
        <div className="footer-brand">
          <Image src={site.logo} width={84} height={84} alt="Garnet" />
          <p>{t(locale, 'brandLine')}</p>
          <p>
            {settings.address}
            <br />
            {t(locale, 'location')}
          </p>
          <a href="mailto:info@garnetstudio.mk">info@garnetstudio.mk</a>
        </div>
        <div className="footer-team">
          <p className="eyebrow">Garnet — The Art of Tile</p>
          <p>
            Muhamed Zejneli<br />
            <a href="tel:+38970463112">+389 70 463 112</a>
          </p>
          <p>
            Yllran Beqiri<br />
            <a href="tel:+38970659569">+389 70 659 569</a>
          </p>
        </div>
        <div className="footer-team">
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
          {navigation.map(({ key, path }) => (
            <Link key={key} href={localizedPath(locale, path)}>
              {t(locale, key)}
            </Link>
          ))}
        </nav>
        <div className="footer-social">
          <a className="footer-instagram" href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5" />
              <circle cx="12" cy="12" r="4.1" />
              <circle cx="17.8" cy="6.3" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span>Instagram</span>
          </a>
          <a className="footer-facebook" href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M21 12a9 9 0 1 0-10.4 8.9v-6.3H8.3V12h2.3v-2c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .2 2 .2v2.2H15c-1.1 0-1.5.7-1.5 1.5V12H16l-.4 2.6h-2.1v6.3A9 9 0 0 0 21 12Z" />
            </svg>
            <span>Facebook</span>
          </a>
          <FooterLanguageLinks locale={locale} />
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Garnet</span>
        <span>
          {t(locale, 'websiteBy')} <a className="credit" href="https://www.adsolutions.mk" target="_blank" rel="noopener noreferrer">AD Solutions</a>
        </span>
        <span>{t(locale, 'location')}</span>
      </div>
    </footer>
  );
}
