'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { locales, t, type CopyKey } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { site } from '@/data/site';
const nav: CopyKey[] = ['projects', 'archstudio', 'materials', 'showroom', 'about', 'contact'];
export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const home = pathname === `/${locale}`;
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
          href={pathname.replace(/^\/(sq|mk|en)(?=\/|$)/, `/${lang}`)}
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
        <Link className="brand" href={`/${locale}`} aria-label={`Garnet — ${t(locale, 'home')}`}>
          <Image src={site.logo} alt="Garnet" width={80} height={80} priority />
          <span>
            GARNET<small>{t(locale, 'brandLine')}</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label={t(locale, 'navigation')}>
          {nav.map((key) => (
            <Link key={key} href={`/${locale}/${key}`} aria-current={pathname.startsWith(`/${locale}/${key}`) ? 'page' : undefined}>
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
          {nav.map((key, index) => (
            <Link onClick={close} key={key} href={`/${locale}/${key}`}>
              <small>0{index + 1}</small>
              {t(locale, key)}
              <span aria-hidden="true">↗</span>
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
