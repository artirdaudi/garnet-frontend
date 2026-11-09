import type { Metadata } from 'next';
import type { Locale } from './types';
import { locales, localizedPath, t } from './i18n';
// The public domain redirects the apex to www; canonical URLs must match it.
export const siteUrl = 'https://www.garnetstudio.mk';
export const indexable = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : process.env.NODE_ENV === 'production';
export function metadata(locale: Locale, title: string, path = '', description = t(locale, 'intro'), image = '/images/hero.jpg'): Metadata {
  const url = `${siteUrl}${localizedPath(locale, path)}`;
  const cleanDescription = description.trim() || `${title}. ${t(locale, 'intro')}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  return {
    title: `${title} | Garnet`,
    description: cleanDescription,
    alternates: {
      canonical: url,
      languages: Object.fromEntries([
        ...locales.map((lang) => [lang, `${siteUrl}${localizedPath(lang, path)}`]),
        ['x-default', `${siteUrl}${localizedPath('sq', path)}`],
      ]),
    },
    openGraph: {
      title: `${title} | Garnet`,
      description: cleanDescription,
      url,
      siteName: 'Garnet',
      locale: { sq: 'sq_AL', mk: 'mk_MK', en: 'en_GB' }[locale],
      alternateLocale: locales.filter((lang) => lang !== locale).map((lang) => ({ sq: 'sq_AL', mk: 'mk_MK', en: 'en_GB' })[lang]),
      type: 'website',
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: { card: 'summary_large_image', title: `${title} | Garnet`, description: cleanDescription, images: [imageUrl] },
  };
}
