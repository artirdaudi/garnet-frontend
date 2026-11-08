'use client';

import { useEffect, useRef } from 'react';

export function BrandStatement({ lines, location }: { lines: string[]; location: string }) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    function update() {
      frame = 0;
      if (!element) return;
      if (reducedMotion.matches) {
        delete element.dataset.motion;
        return;
      }
      const top = element.getBoundingClientRect().top;
      const raw = Math.max(0, Math.min(1, (window.innerHeight * .88 - top) / (window.innerHeight * .62)));
      const progress = raw * raw * (3 - 2 * raw);
      element.style.setProperty('--statement-opacity', String(.72 + .28 * progress));
      element.style.setProperty('--statement-copy-y', `${24 * (1 - progress)}px`);
      element.style.setProperty('--statement-arch-y', `${-25 * (1 - progress)}px`);
      element.style.setProperty('--statement-tiles-y', `${35 * (1 - progress)}px`);
      element.dataset.motion = 'ready';
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    reducedMotion.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }, []);

  return <section ref={section} className="brand-statement wrap">
    <div className="statement-tiles" aria-hidden="true"><i /><i /><i /></div>
    <div className="statement-inner">
      <span className="statement-symbol" aria-hidden="true">＋</span>
      <h2 className="statement-title">{lines.map((line, index) => <span key={line} className={index === 1 ? 'statement-subtitle' : 'statement-heading'}>{line}</span>)}</h2>
      <span className="eyebrow statement-credit">Garnet — {location}</span>
    </div>
  </section>;
}
