import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { isLocale } from '@/lib/i18n';
import { siteUrl } from '@/lib/seo';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Garnet — Architecture · Interiors · Surfaces',
  description: 'Garnet, Tetovo. Architecture, interior design and carefully selected surfaces.',
  robots: process.env.NEXT_PUBLIC_SITE_URL ? { index: true, follow: true } : { index: false, follow: false },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const value = (await headers()).get('x-garnet-locale') || 'sq';
  return (
    <html lang={isLocale(value) ? value : 'sq'}>
      <body>{children}</body>
    </html>
  );
}
