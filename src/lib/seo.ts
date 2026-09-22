import type { Metadata } from 'next';
import type { Locale } from './types';
import { locales, t } from './i18n';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export function metadata(locale: Locale, title: string, path = '', description = t(locale, 'intro'), image = '/images/hero.jpg'): Metadata {
  const url = `${siteUrl}/${locale}${path ? `/${path}` : ''}`;
  return {
    title: `${title} — Garnet`,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries([
        ...locales.map((lang) => [lang, `${siteUrl}/${lang}${path ? `/${path}` : ''}`]),
        ['x-default', `${siteUrl}/sq${path ? `/${path}` : ''}`],
      ]),
    },
    openGraph: {
      title: `${title} — Garnet`,
      description,
      url,
      siteName: 'Garnet',
      locale: { sq: 'sq_AL', mk: 'mk_MK', en: 'en_GB' }[locale],
      alternateLocale: locales.filter((lang) => lang !== locale).map((lang) => ({ sq: 'sq_AL', mk: 'mk_MK', en: 'en_GB' })[lang]),
      type: 'website',
      images: [{ url: image, width: 2000, height: 1333, alt: title }],
    },
    twitter: { card: 'summary_large_image', title: `${title} — Garnet`, description, images: [image] },
  };
}
