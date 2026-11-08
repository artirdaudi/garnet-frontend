'use client';

import Image from 'next/image';
import { useEffect, useRef, type PointerEvent } from 'react';

export function VisionArt({ alt }: { alt: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current?.closest<HTMLElement>('.vision-section');
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    section.dataset.motion = 'ready';
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.dataset.visible = 'true';
        observer.disconnect();
      }
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pieces = Array.from(element.querySelectorAll<HTMLElement>('.vision-art-piece'));
    let frame = 0;
    function update() {
      frame = 0;
      if (!element) return;
      const bounds = element.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.95 - bounds.top) / (window.innerHeight * 0.55)));
      pieces.forEach((piece, index) => {
        const reveal = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, progress * 1.3 - index * 0.15));
        const eased = reveal * reveal * (3 - 2 * reveal);
        piece.style.setProperty('--reveal', String(eased));
        piece.style.setProperty('--apart', String(1 - eased));
      });
      element.dataset.visible = String(progress > 0 && bounds.bottom > 0);
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
