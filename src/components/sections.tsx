import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/types';
import { t } from '@/lib/i18n';
import { images } from '@/data/media';
import { site, team } from '@/data/site';
import { Picture } from './media';
import { TextLink, DemoNote } from './ui';
export function StudioPreview({ locale }: { locale: Locale }) {
  return (
    <section className="studio-preview wrap">
      <div className="studio-visual">
        <Picture media={images.residence} locale={locale} />
        <Image className="studio-logo" src={site.studioLogo} alt="Archstudio Garnet" width={120} height={120} />
      </div>
      <div className="studio-copy">
        <p className="eyebrow">04 / Archstudio Garnet</p>
        <h2>
          {t(locale, 'architecture')}.<br />
          {t(locale, 'interior')}.
        </h2>
        <p>{t(locale, 'studioIntro')}</p>
        <div className="architect-names">
          {team.map((person) => (
            <p key={person.id}>
              {person.name}
              <span>{t(locale, 'architect')}</span>
            </p>
          ))}
        </div>
        <TextLink href={`/${locale}/archstudio`}>{t(locale, 'meetStudio')}</TextLink>
      </div>
    </section>
  );
}
export function ShowroomPreview({ locale }: { locale: Locale }) {
  return (
    <section className="showroom-preview">
      <Picture media={images.showroom} locale={locale} sizes="100vw" />
      <div className="showroom-overlay">
        <p className="eyebrow">05 / Garnet {t(locale, 'showroom')}</p>
        <h2>{t(locale, 'visit')}.</h2>
        <p>
          {site.address}
          <br />
          {t(locale, 'location')}
        </p>
        <TextLink href={`/${locale}/showroom`}>{t(locale, 'visitShowroom')}</TextLink>
      </div>
      <div className="showroom-photo-note">
        <DemoNote locale={locale} kind="photo" />
      </div>
    </section>
  );
}
export function Team({ locale }: { locale: Locale }) {
  return (
    <section className="team-section wrap">
      <p className="eyebrow">Archstudio Garnet / {t(locale, 'architects')}</p>
      <div className="team-grid">
        {team.map((person) => (
          <article className="architect" key={person.id}>
            <div className="architect-placeholder" aria-hidden="true">
              <span>{person.initials}</span>
              <i />
            </div>
            <div>
              <h3>{person.name}</h3>
              <p>{t(locale, 'architect')}</p>
              <a className="text-link" href={`tel:${person.telephone}`}>
                {person.phone} ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
export function LocationMap({ locale }: { locale: Locale }) {
  return (
    <div className="location-map">
      <div className="map-grid" aria-hidden="true">
        <span className="map-road road-one" />
        <span className="map-road road-two" />
        <span className="map-river" />
        <span className="map-street">Blagoja Toska</span>
      </div>
      <div className="map-pin">
        <span aria-hidden="true">＋</span>
        <strong>GARNET</strong>
        <p>{site.address}</p>
        <a href={site.directions} target="_blank" rel="noreferrer">
          {t(locale, 'directions')} ↗
        </a>
      </div>
      <p className="map-caption">{t(locale, 'mapNote')}</p>
    </div>
  );
}
export function Address({ locale }: { locale: Locale }) {
  return (
    <div className="address-block">
      <p className="eyebrow">Garnet / {t(locale, 'showroom')}</p>
      <h3>{site.address}</h3>
      <p>{t(locale, 'location')}</p>
      <div className="address-links">
        <a className="text-link" href={site.directions} target="_blank" rel="noreferrer">
          {t(locale, 'directions')} ↗
        </a>
        <a className="text-link" href={site.instagram} target="_blank" rel="noreferrer">
          Instagram ↗
        </a>
        <Link className="text-link" href={`/${locale}/contact`}>
          {t(locale, 'contact')} ↗
        </Link>
      </div>
    </div>
  );
}
