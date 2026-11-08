import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { team } from '@/data/site';
import { getMaterialBySlug } from '@/lib/repository';
import { getSiteSettings } from '@/lib/repository';
import { PageHeading } from '@/components/ui';
import { LocationMap } from '@/components/sections';
import { ContactForm } from '@/components/contact-form';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, t(locale, 'contact'), 'contact', t(locale, 'contactTitle').replace('\n', ' '));
}
export default async function ContactPage({ params, searchParams }: PageParams & { searchParams: Promise<{ material?: string }> }) {
  const locale = await routeLocale(params);
  const { material: slug } = await searchParams;
  const material = slug ? await getMaterialBySlug(slug) : undefined;
  const settings = await getSiteSettings();
  return (
    <>
      <PageHeading locale={locale} eyebrow={t(locale, 'contact')} title={t(locale, 'contactTitle')} />
      <section className="contact-layout wrap">
        <div className="contact-details">
          <div>
            <p className="eyebrow">Garnet</p>
            <h2>{settings.address}</h2>
            <p>{t(locale, 'location')}</p>
            <a className="text-link" href={settings.directions} target="_blank" rel="noreferrer">
              {t(locale, 'directions')} ↗
            </a>
          </div>
          <div>
            <p className="eyebrow">Archstudio Garnet</p>
            {team.map((person) => (
              <div className="contact-person" key={person.id}>
                <h3>{person.name}</h3>
                <a href={`tel:${person.telephone}`}>{person.phone} ↗</a>
              </div>
            ))}
          </div>
          <div>
            <p className="eyebrow">Instagram</p>
            <a href={settings.instagram} target="_blank" rel="noreferrer">
              {settings.instagramHandle} ↗
            </a>
          </div>
        </div>
        <ContactForm locale={locale} material={material?.name} materialId={material?.id} />
      </section>
      <div className="contact-map wrap">
        <LocationMap locale={locale} />
      </div>
    </>
  );
}
