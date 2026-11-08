'use client';

import { useEffect, useState } from 'react';
import type { Locale, Media } from '@/lib/types';
import { Picture } from './media';

export function HeroBackground({ images, locale }: { images: Media[]; locale: Locale }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % images.length), 6000);
    return () => window.clearInterval(timer);
  }, [images.length]);
  return <div className="hero-backgrounds">{images.map((media, index) =>
    <div key={media.id + '-' + index} className={index === active ? 'hero-background active' : 'hero-background'} aria-hidden={index !== active}>
      <Picture media={media} locale={locale} priority={index === 0} sizes="100vw" />
    </div>)}</div>;
}
