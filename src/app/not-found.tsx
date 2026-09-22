import { headers } from 'next/headers';
import Link from 'next/link';
import { isLocale, t } from '@/lib/i18n';
export default async function NotFound() {
  const value = (await headers()).get('x-garnet-locale') || 'sq';
  const locale = isLocale(value) ? value : 'sq';
  return (
    <main className="not-found wrap">
      <p className="eyebrow">Garnet / 404</p>
      <span className="error-number" aria-hidden="true">
        404
      </span>
      <h1>{t(locale, 'notFound')}</h1>
      <p>{t(locale, 'notFoundBody')}</p>
      <Link className="text-link" href={`/${locale}`}>
        {t(locale, 'back')} ↗
      </Link>
    </main>
  );
}
