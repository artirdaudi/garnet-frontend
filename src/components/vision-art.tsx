'use client';

import Image from 'next/image';
import { useEffect, useRef, type PointerEvent } from 'react';

export function VisionArt({ alt }: { alt: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const section = element.closest<HTMLElement>('.vision-section');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pieces = Array.from(element.querySelectorAll<HTMLElement>('.vision-art-piece'));
    let frame = 0;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const stage = (value: number, start: number, end: number) => {
      const position = clamp((value - start) / (end - start));
      return position * position * (3 - 2 * position);
    };
    function update() {
      frame = 0;
      if (!element) return;
      const bounds = element.getBoundingClientRect();
      const progress = clamp((window.innerHeight * 0.95 - bounds.top) / (window.innerHeight * 0.55));
      pieces.forEach((piece, index) => {
        const reveal = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, progress * 1.3 - index * 0.15));
        const eased = reveal * reveal * (3 - 2 * reveal);
        piece.style.setProperty('--reveal', String(eased));
        piece.style.setProperty('--apart', String(1 - eased));
      });
      element.dataset.visible = String(progress > 0 && bounds.bottom > 0);
      if (section) {
        if (reducedMotion.matches) {
          delete section.dataset.motion;
        } else {
          const sectionTop = section.getBoundingClientRect().top;
          const copyProgress = clamp((window.innerHeight * 0.95 - sectionTop) / (window.innerHeight * 0.5));
          const label = stage(copyProgress, 0, 0.3);
          const title = stage(copyProgress, 0.12, 0.7);
          const description = stage(copyProgress, 0.4, 0.85);
          const link = stage(copyProgress, 0.65, 1);
          const art = stage(progress, 0, 0.85);
          section.style.setProperty('--vision-label-opacity', String(label));
          section.style.setProperty('--vision-label-y', `${28 * (1 - label)}px`);
          section.style.setProperty('--vision-title-clip', `${100 * (1 - title)}%`);
          section.style.setProperty('--vision-title-y', `${48 * (1 - title)}px`);
          section.style.setProperty('--vision-description-opacity', String(description));
          section.style.setProperty('--vision-description-y', `${28 * (1 - description)}px`);
          section.style.setProperty('--vision-link-opacity', String(link));
          section.style.setProperty('--vision-link-y', `${28 * (1 - link)}px`);
          section.style.setProperty('--vision-art-clip', `${100 * (1 - art)}%`);
          section.style.setProperty('--vision-art-x', `${65 * (1 - art)}px`);
          section.style.setProperty('--vision-art-scale', String(1 + 0.06 * (1 - art)));
          section.dataset.motion = 'ready';
        }
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
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

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty('--lift', '1');
    event.currentTarget.style.setProperty('--tilt-x', `${-y * 20}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${x * 26}deg`);
    event.currentTarget.style.setProperty('--shift-x', `${x * 24}px`);
    event.currentTarget.style.setProperty('--shift-y', `${y * 18}px`);
  }

  function reset() {
    for (const name of ['--tilt-x', '--tilt-y', '--shift-x', '--shift-y', '--lift']) root.current?.style.removeProperty(name);
  }

  return (
    <div ref={root} className="vision-collage vision-art" onPointerMove={move} onPointerLeave={reset}>
      <div className="vision-art-stage">
        <Image src="/images/lg.png" alt={alt} width={1672} height={941} sizes="(max-width: 700px) 100vw, 62vw" className="vision-image vision-art-base" />
        {['architecture', 'interior', 'stone'].map((piece) => (
          <div key={piece} className={`vision-art-piece vision-art-${piece}`} aria-hidden="true">
            <div className="vision-art-surface">
              <Image src="/images/lg.png" alt="" fill sizes="(max-width: 700px) 100vw, 62vw" />
              <span className="vision-art-light" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
