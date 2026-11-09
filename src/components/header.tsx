'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { locales, localizedPath, t, type CopyKey } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { site } from '@/data/site';
const nav: { key: CopyKey; path: string }[] = [
  { key: 'projects', path: 'projects' },
  { key: 'tiles', path: 'materials/category/tiles' },
  { key: 'panels', path: 'materials/category/panels' },
  { key: 'archstudio', path: 'archstudio' },
  { key: 'contact', path: 'contact' },
];
export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const home = pathname === localizedPath(locale);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.current?.close();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    toggle.current?.focus();
  };
  const languages = (
    <div className="languages" aria-label={t(locale, 'language')}>
      {locales.map((lang) => (
        <Link
          key={lang}
          href={localizedPath(lang, pathname.replace(/^\/(sq|mk|en)(?=\/|$)/, '').replace(/^\//, ''))}
          hrefLang={lang}
          lang={lang}
          aria-current={lang === locale ? 'page' : undefined}
          onClick={close}
        >
          {lang.toUpperCase()}
        </Link>
      ))}
    </div>
  );
  return (
    <>
      <a className="skip-link" href="#main">
        {t(locale, 'skip')}
      </a>
      <header className={`header ${scrolled || !home ? 'solid' : ''}`}>
        <a className="brand" href={localizedPath(locale)} aria-label={`Garnet — ${t(locale, 'home')}`} onClick={(event) => { if (home) { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'instant' }); } }}>
          <Image className="brand-logo-mark" src={site.logo} alt="" width={1254} height={1254} priority />
          <span className="brand-logo-lettering" aria-hidden="true"><Image src="/brand/garnet-logo-transparent.png" alt="" width={1254} height={1254} priority /></span>
        </a>
        <nav className="desktop-nav" aria-label={t(locale, 'navigation')}>
          {nav.map(({ key, path }) => (
            <Link key={key} href={localizedPath(locale, path)} aria-current={pathname === localizedPath(locale, path) || pathname.startsWith(`${localizedPath(locale, path)}/`) ? 'page' : undefined}>
              {t(locale, key)}
            </Link>
          ))}
        </nav>
        <div className="desktop-languages">{languages}</div>
        <button ref={toggle} className="menu-toggle" onClick={() => setOpen(true)} aria-label={t(locale, 'menu')} aria-expanded={open}>
          <span />
          <span />
        </button>
      </header>
      <dialog ref={dialog} className="mobile-menu" onCancel={() => setOpen(false)}>
        <div className="mobile-menu-top">
          <span>GARNET</span>
          <button onClick={close} aria-label={t(locale, 'close')}>
            ×
          </button>
        </div>
        <nav aria-label={t(locale, 'navigation')}>
          {nav.map(({ key, path }, index) => (
            <Link onClick={close} key={key} href={localizedPath(locale, path)}>
              <small>0{index + 1}</small>
              {t(locale, key)}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu-bottom">
          {languages}
          <p>
            {site.address}
            <br />
            {t(locale, 'location')}
          </p>
        </div>
      </dialog>
    </>
  );
}
