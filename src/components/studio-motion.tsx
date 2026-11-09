'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function StudioMotion({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    let frame = 0;

    function progressFor(element: Element) {
      const { top, bottom } = element.getBoundingClientRect();
      const height = window.innerHeight;
      const entering = clamp((height * .9 - top) / (height * .58));
      const leaving = clamp((bottom - height * .08) / (height * .42));
      return Math.min(entering, leaving);
    }

    function update() {
      frame = 0;
      if (!root) return;
      if (reducedMotion.matches) {
        delete root.dataset.motion;
        return;
      }
      const visual = root.querySelector('.studio-visual');
      const copy = root.querySelector('.studio-copy');
      if (!visual || !copy) return;
      const visualProgress = progressFor(visual);
      const copyProgress = progressFor(copy);
      root.style.setProperty('--studio-visual-progress', String(visualProgress));
      root.style.setProperty('--studio-copy-progress', String(copyProgress));
      root.style.setProperty('--studio-visual-mask', `${42 * (1 - visualProgress)}%`);
      root.style.setProperty('--studio-visual-shift', `${65 * (1 - visualProgress)}px`);
      root.style.setProperty('--studio-copy-shift', `${70 * (1 - copyProgress)}px`);
      root.style.setProperty('--studio-rule-width', `${100 * copyProgress}%`);
      root.dataset.motion = 'ready';
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

  return <section ref={section} className="studio-preview wrap">{children}</section>;
}
