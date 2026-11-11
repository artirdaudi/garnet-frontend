'use client';

import Image from 'next/image';
import { useState, type CSSProperties } from 'react';
import type { Locale } from '@/lib/types';

const messages = {
  sq: { loading: 'Po ngarkohet fotografia', error: 'Fotografia nuk u ngarkua.' },
  mk: { loading: 'Фотографијата се вчитува', error: 'Фотографијата не се вчита.' },
  en: { loading: 'Loading photo', error: 'Photo could not be loaded.' },
};

export function LoadingPhoto({ src, alt, locale, sizes, style }: { src: string; alt: string; locale: Locale; sizes: string; style?: CSSProperties }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  return <>
    <Image src={src} alt={alt} fill sizes={sizes} style={{ ...style, opacity: status === 'ready' ? 1 : 0 }} onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />
    {status !== 'ready' && <span className="photo-loading-overlay" role="status" aria-label={messages[locale][status]} aria-live="polite">
      {status === 'loading' && <span className="photo-loading-spinner" aria-hidden="true" />}
      {status === 'error' && <span>{messages[locale].error}</span>}
    </span>}
  </>;
}
