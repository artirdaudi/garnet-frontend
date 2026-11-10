'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, localizedPath } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export function FooterLanguageLinks({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const path = pathname.replace(/^\/(sq|mk|en)(?=\/|$)/, '').replace(/^\//, '');
  return <div className="languages">
    {locales.map((lang) => <Link href={localizedPath(lang, path)} key={lang} hrefLang={lang} lang={lang} aria-current={lang === locale ? 'page' : undefined}>{lang.toUpperCase()}</Link>)}
  </div>;
}
