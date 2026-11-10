'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function ScrollReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.classList.add('scroll-reveal-ready');
    const observer = new IntersectionObserver(([entry]) => {
      element.classList.toggle('scroll-reveal-visible', entry.isIntersecting);
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    observer.observe(element);
    return () => { observer.disconnect(); element.classList.remove('scroll-reveal-ready', 'scroll-reveal-visible'); };
  }, []);
  return <div ref={ref} className={`scroll-reveal ${className}`.trim()}>{children}</div>;
}
