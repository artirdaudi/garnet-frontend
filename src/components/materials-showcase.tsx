'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { Locale } from '@/lib/types';
import { localizedPath } from '@/lib/i18n';

const content = {
  sq: {
    title: 'Detaji i duhur ndryshon gjithçka.',
    intro: 'Për shtëpinë apo biznesin tuaj, zgjedhja e duhur nis me atë që ju pëlqen. Shihni koleksionet tona dhe gjeni atë që i shkon idesë suaj.',
    tilesTag: 'Për sallone, kuzhina, dhoma gjumi dhe më shumë',
    tilesTitle: 'Pllaka',
    tilesText: 'Nga tonet e qeta te modelet që bien në sy — zgjedhja e duhur nis këtu.',
    tilesAction: 'Shihni pllakat',
    tilesAlt: 'Pllaka me pamje guri në një banjo bashkëkohore',
    panelsTag: 'Një pamje e re për muret',
    panelsTitle: 'Panele Dekoruese',
    panelsText: 'Shtoni ngrohtësi, ritëm dhe një detaj që e bën ambientin të veçantë.',
    panelsAction: 'Shihni panelet',
    panelsAlt: 'Panele dekoruese druri në një dhomë ndenjjeje',
    closing: 'Nuk jeni të sigurt çfarë të zgjidhni?',
    contact: 'Na kontaktoni',
  },
  mk: {
    title: 'Вистинскиот детал менува сè.',
    intro: 'За вашиот дом или бизнис, вистинскиот избор започнува со она што ви се допаѓа. Погледнете ги нашите колекции и најдете го она што одговара на вашата идеја.',
    tilesTag: 'За дневни соби, кујни, спални и повеќе',
    tilesTitle: 'Плочки',
    tilesText: 'Од мирни тонови до впечатливи дезени — вистинскиот избор започнува тука.',
    tilesAction: 'Откријте ги плочките',
    tilesAlt: 'Плочки со изглед на камен во современа бања',
    panelsTag: 'Нов изглед за ѕидовите',
    panelsTitle: 'Декоративни панели',
    panelsText: 'Додајте топлина, ритам и детаљ што го прави ентериерот посебен.',
    panelsAction: 'Откријте ги панелите',
    panelsAlt: 'Декоративни дрвени панели во дневна соба',
    closing: 'Не сте сигурни што да изберете?',
    contact: 'Разговарајте со нас',
  },
  en: {
    title: 'The right detail changes everything.',
    intro: 'For your home or business, the right choice starts with what you love. Browse our collections and find what suits your idea.',
    tilesTag: 'For living rooms, kitchens, bedrooms and more',
    tilesTitle: 'Tiles',
    tilesText: 'From quiet tones to striking patterns, the right choice starts here.',
    tilesAction: 'Explore tiles',
    tilesAlt: 'Stone-look tiles in a contemporary bathroom',
    panelsTag: 'A new look for your walls',
    panelsTitle: 'Decorative Panels',
    panelsText: 'Add warmth, rhythm and a detail that makes a room memorable.',
    panelsAction: 'Explore panels',
    panelsAlt: 'Decorative wood panels in a living room',
    closing: 'Not sure what to choose?',
    contact: 'Talk to us',
  },
};

export function MaterialsShowcase({ locale }: { locale: Locale }) {
  const section = useRef<HTMLElement>(null);
  const copy = content[locale];

  useEffect(() => {
    const root = section.current;
    if (!root || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.dataset.motion = 'ready';
    const targets = root.querySelectorAll<HTMLElement>('[data-material-reveal]');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.visible = 'true';
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const cards = [
    { key: 'tiles', image: '/images/materials-tiles-editorial.jpg', alt: copy.tilesAlt, tag: copy.tilesTag, title: copy.tilesTitle, text: copy.tilesText, action: copy.tilesAction },
    { key: 'panels', image: '/images/materials-panels-editorial.jpg', alt: copy.panelsAlt, tag: copy.panelsTag, title: copy.panelsTitle, text: copy.panelsText, action: copy.panelsAction },
  ];

  return <section ref={section} className="materials-showcase materials-section wrap" aria-labelledby="materials-showcase-title">
    <div className="materials-showcase-heading" data-material-reveal>
      <div className="materials-showcase-heading-copy">
        <h2 id="materials-showcase-title">{copy.title}</h2>
      </div>
      <div className="materials-showcase-heading-side">
        <p>{copy.intro}</p>
      </div>
    </div>
    <div className="materials-showcase-grid">
      {cards.map((card) => <Link key={card.key} href={localizedPath(locale, `materials/category/${card.key}`)} className={`materials-showcase-card materials-showcase-card-${card.key}`} data-material-reveal>
        <div className="materials-showcase-image">
          <Image src={card.image} alt={card.alt} fill sizes="(max-width: 760px) 100vw, 55vw" />
        </div>
        <div className="materials-showcase-overlay" />
        <div className="materials-showcase-card-content">
          <span className="materials-showcase-tag">{card.tag}</span>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          <span className="materials-showcase-card-action">{card.action}</span>
        </div>
      </Link>)}
    </div>
    <div className="materials-showcase-footer" data-material-reveal>
      <span>{copy.closing}</span>
      <Link href={localizedPath(locale, 'contact')}>{copy.contact}</Link>
    </div>
  </section>;
}
