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

    function update() {
      frame = 0;
      if (!root) return;
      if (reducedMotion.matches) {
        delete root.dataset.motion;
        return;
      }
      const { top, bottom } = root.getBoundingClientRect();
      const height = window.innerHeight;
      const entering = clamp((height * .92 - top) / (height * .56));
      const leaving = clamp((bottom - height * .08) / (height * .46));
      root.style.setProperty('--studio-visibility', String(Math.min(entering, leaving)));
      root.style.setProperty('--studio-offset', `${42 * (1 - entering) - 42 * (1 - leaving)}px`);
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
