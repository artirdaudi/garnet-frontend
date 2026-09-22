import { notFound } from 'next/navigation';
import { isLocale } from './i18n';
export type PageParams = { params: Promise<{ locale: string }> };
export type DetailParams = { params: Promise<{ locale: string; slug: string }> };
export async function routeLocale(params: PageParams['params']) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
