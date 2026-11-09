import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { isLocale } from '@/lib/i18n';
import { indexable, siteUrl } from '@/lib/seo';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Garnet | Arkitekturë, interier, pllaka dhe panele dekoruese',
  description: 'Garnet në Tetovë: arkitekturë, dizajn interieri, pllaka dhe panele dekoruese.',
  applicationName: 'Garnet',
  robots: { index: indexable, follow: indexable },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const value = (await headers()).get('x-garnet-locale') || 'sq';
  return (
    <html lang={isLocale(value) ? value : 'sq'}>
      <body>{children}</body>
    </html>
  );
}
