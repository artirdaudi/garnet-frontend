import Link from 'next/link';
import { ContactForm } from '@/components/contact-form';
import { ScrollReveal } from '@/components/scroll-reveal';
import { site, team } from '@/data/site';
import { getMaterialBySlug, getSiteSettings } from '@/lib/repository';
import { routeLocale, type PageParams } from '@/lib/route';
import { localizedPath } from '@/lib/i18n';
import { metadata, siteUrl } from '@/lib/seo';

const copy = {
  sq: { eyebrow: 'Kontakt · Garnet Tetovë', title: 'Le të flasim.', lead: 'Për një projekt, pllaka, panele dekoruese apo një pyetje të thjeshtë — na gjeni këtu.', visit: 'Na vizitoni', address: 'Blagoja Toska 19A, Tetovë, Maqedonia e Veriut', directions: 'Hapeni në Google Maps', call: 'Na telefononi', muhamed: 'Muhamed Zejneli', yllran: 'Yllran Beqiri', social: 'Na ndiqni', message: 'Dërgoni mesazh', mapTitle: 'Gjeni Garnet në Tetovë', hours: 'Për të planifikuar një vizitë, na telefononi ose na shkruani.' },
  mk: { eyebrow: 'Контакт · Garnet Тетово', title: 'Да разговараме.', lead: 'За проект, плочки, декоративни панели или едноставно прашање — најдете нè тука.', visit: 'Посетете нè', address: 'Благоја Тоска 19А, Тетово, Северна Македонија', directions: 'Отворете во Google Maps', call: 'Јавете ни се', muhamed: 'Мухамед Зејнели', yllran: 'Илран Беќири', social: 'Следете нè', message: 'Испратете порака', mapTitle: 'Најдете го Garnet во Тетово', hours: 'За да планирате посета, јавете ни се или пишете ни.' },
  en: { eyebrow: 'Contact · Garnet Tetovo', title: 'Let’s talk.', lead: 'For a project, tiles, decorative panels or a simple question, you can reach us here.', visit: 'Visit us', address: 'Blagoja Toska 19A, Tetovo, North Macedonia', directions: 'Open in Google Maps', call: 'Call us', muhamed: 'Muhamed Zejneli', yllran: 'Yllran Beqiri', social: 'Follow us', message: 'Send a message', mapTitle: 'Find Garnet in Tetovo', hours: 'To plan a visit, call or message us.' },
};

function InstagramIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>; }
function FacebookIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M13.6 21v-8.1h2.7l.4-3.2h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.2h2.8V21h3.4Z"/></svg>; }

export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  const words = copy[locale];
  return metadata(locale, `${words.title} Kontakt`, 'contact', `${words.lead} ${words.address}`);
}

export default async function ContactPage({ params, searchParams }: PageParams & { searchParams: Promise<{ material?: string }> }) {
  const locale = await routeLocale(params);
  const words = copy[locale];
  const { material: slug } = await searchParams;
  const [material, settings] = await Promise.all([slug ? getMaterialBySlug(slug) : undefined, getSiteSettings()]);
  const instagram = settings.instagram || site.instagram;
  const facebook = settings.facebook || site.facebook;
  const schema = { '@context': 'https://schema.org', '@type': 'ContactPage', name: words.title, url: `${siteUrl}${localizedPath(locale, 'contact')}`, description: words.lead, inLanguage: locale, mainEntity: { '@type': 'LocalBusiness', name: 'Garnet', address: { '@type': 'PostalAddress', streetAddress: settings.address, addressLocality: settings.city, addressCountry: 'MK' }, telephone: team[0].telephone, sameAs: [instagram, facebook] } };
  return <div className="contact-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <section className="contact-page-main wrap"><ScrollReveal className="contact-page-details"><div className="contact-block"><p className="studio-kicker">{words.visit}</p><h1>{words.address}</h1></div><div className="contact-block"><p className="studio-kicker">{words.call}</p><div className="contact-phone"><span>{words.muhamed}</span><a href={`tel:${team[0].telephone}`}>{team[0].phone}</a></div><div className="contact-phone"><span>Kushtrim Bexheti</span><a href={`tel:${team[1].telephone}`}>{team[1].phone}</a></div><div className="contact-phone"><span>{words.yllran}</span><a href="tel:+38970659569">+389 70 659 569</a></div></div><div className="contact-block"><p className="studio-kicker">{words.social}</p><div className="contact-social"><a href={instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon /><span>{settings.instagramHandle || site.instagramHandle}</span></a><a href={facebook} target="_blank" rel="noopener noreferrer"><FacebookIcon /><span>Garnet Tetovo</span></a></div></div></ScrollReveal><ScrollReveal className="contact-page-form"><ContactForm locale={locale} material={material?.name} /></ScrollReveal></section>
    <section className="contact-page-map wrap"><ScrollReveal><div><p className="studio-kicker">Garnet · Tetovë</p><h2>{words.mapTitle}</h2><a href={settings.directions} target="_blank" rel="noopener noreferrer">{words.directions}</a></div><iframe title={words.mapTitle} src={`https://www.google.com/maps?q=${encodeURIComponent(`${settings.address}, ${settings.city}, North Macedonia`)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></ScrollReveal></section>
    <div className="contact-page-back wrap"><Link href={localizedPath(locale, '')}>Garnet</Link></div>
  </div>;
}
