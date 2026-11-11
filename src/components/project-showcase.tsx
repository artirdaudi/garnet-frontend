'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale, Media, Project } from '@/lib/types';
import { t } from '@/lib/i18n';
import { LoadingPhoto } from './loading-photo';

const labels = {
  sq: { open: 'Hap projektin', previous: 'Fotografia e mëparshme', next: 'Fotografia e radhës', close: 'Mbyll projektin', closePhoto: 'Mbyll fotografinë', enlarge: 'Zmadho fotografinë', swipe: 'Rrëshqitni për të parë fotografitë', details: 'Të dhënat e projektit' },
  mk: { open: 'Отвори проект', previous: 'Претходна фотографија', next: 'Следна фотографија', close: 'Затвори проект', closePhoto: 'Затвори фотографија', enlarge: 'Зголеми фотографија', swipe: 'Повлечете за фотографии', details: 'Детали за проектот' },
  en: { open: 'Open project', previous: 'Previous image', next: 'Next image', close: 'Close project', closePhoto: 'Close photo', enlarge: 'Enlarge photo', swipe: 'Swipe to browse images', details: 'Project details' },
};

function imagesOf(project: Project): Media[] {
  return project.gallery.length ? project.gallery : [project.coverImage];
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d={direction === 'left' ? 'M14.5 5 7.5 12l7 7' : 'm9.5 5 7 7-7 7'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function ProjectShowcase({ projects, locale, showArrows = true, archive = false }: { projects: Project[]; locale: Locale; showArrows?: boolean; archive?: boolean }) {
  const [cardImages, setCardImages] = useState<Record<string, number>>({});
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dialog = useRef<HTMLDialogElement>(null);
  const photoDialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressPhotoOpen = useRef(false);
  const cardTouch = useRef<{ x: number; y: number; id: string } | null>(null);
  const suppressOpen = useRef<string | null>(null);
  const gesture = useRef<{ distance: number; zoom: number; x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const photoTouch = useRef<{ x: number; y: number } | null>(null);
  const copy = labels[locale];

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.project-showcase .showcase-card'));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const ease = (value: number) => value * value * (3 - 2 * value);
    function update() {
      frame = 0;
      if (motion.matches) {
        cards.forEach((card) => { delete card.dataset.motion; });
        return;
      }
      cards.forEach((card) => {
        const top = (card.offsetParent as HTMLElement).getBoundingClientRect().top + card.offsetTop;
        const bottom = top + card.offsetHeight;
        const enter = ease(clamp((window.innerHeight * .88 - top) / (window.innerHeight * .58)));
        const leave = ease(clamp((bottom - window.innerHeight * .12) / (window.innerHeight * .34)));
        card.style.setProperty('--showcase-opacity', String(Math.min(1, enter * 1.4, leave)));
        card.style.setProperty('--showcase-scale', String(.88 + .12 * enter + .12 * (1 - leave)));
        card.style.setProperty('--showcase-y', `${72 * (1 - enter)}px`);
        card.style.setProperty('--showcase-fold-angle', `${88 * enter}deg`);
        card.style.setProperty('--showcase-fold-angle-negative', `${-88 * enter}deg`);
        card.style.setProperty('--showcase-fold-opacity', String(1 - enter));
        card.dataset.motion = 'ready';
      });
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
    };
  }, []);

  function stepCard(project: Project, direction: number) {
    const count = imagesOf(project).length;
    setCardImages((current) => ({ ...current, [project.id]: ((current[project.id] || 0) + direction + count) % count }));
  }

  function open(index: number, button: HTMLButtonElement) {
    opener.current = button;
    setActiveProject(index);
    setActiveImage(cardImages[projects[index].id] || 0);
    dialog.current?.showModal();
  }

  function close() {
    dialog.current?.close();
  }

  function stepModal(direction: number) {
    if (activeProject === null) return;
    const count = imagesOf(projects[activeProject]).length;
    setActiveImage((current) => (current + direction + count) % count);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }

  function openPhoto() {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    photoDialog.current?.showModal();
  }

  function closePhoto() { photoDialog.current?.close(); }

  function touchDistance(touches: React.TouchList) {
    return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  }

  const active = activeProject === null ? null : projects[activeProject];
  const activeImages = active ? imagesOf(active) : [];

  return (
    <>
      <div className={`project-showcase${archive ? ' project-showcase-archive' : ''}`}>
        {projects.map((project, projectIndex) => {
          const images = imagesOf(project);
          const imageIndex = cardImages[project.id] || 0;
          return (
            <article className="showcase-card" key={project.id}>
              <button
                className="showcase-open"
                type="button"
                onClick={(event) => {
                  if (suppressOpen.current === project.id) { suppressOpen.current = null; return; }
                  open(projectIndex, event.currentTarget);
                }}
                onTouchStart={(event) => { cardTouch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, id: project.id }; }}
                onTouchEnd={(event) => {
                  if (cardTouch.current?.id !== project.id || images.length < 2) return;
                  const dx = event.changedTouches[0].clientX - cardTouch.current.x;
                  const dy = event.changedTouches[0].clientY - cardTouch.current.y;
                  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) {
                    stepCard(project, dx < 0 ? 1 : -1);
                    suppressOpen.current = project.id;
                    window.setTimeout(() => { suppressOpen.current = null; }, 400);
                  }
                  cardTouch.current = null;
                }}
                aria-label={`${copy.open}: ${project.title[locale]}`}
              >
                <LoadingPhoto key={images[imageIndex].url} src={images[imageIndex].url} alt={images[imageIndex].alt[locale] || project.title[locale]} locale={locale} sizes="(max-width: 700px) 90vw, 65vw" />
                <span className="showcase-title">{project.title[locale]}</span>
              </button>
              {showArrows && images.length > 1 && (
                <div className="showcase-navigation" aria-label={copy.swipe}>
                  <button type="button" onClick={() => stepCard(project, -1)} aria-label={`${copy.previous}: ${project.title[locale]}`}><Chevron direction="left" /></button>
                  <button type="button" onClick={() => stepCard(project, 1)} aria-label={`${copy.next}: ${project.title[locale]}`}><Chevron direction="right" /></button>
                </div>
              )}
              <div className="showcase-fold" aria-hidden="true"><span /><span /><span /><span /></div>
            </article>
          );
        })}
      </div>
      <dialog
        ref={dialog}
        className="project-showcase-dialog"
        aria-labelledby="showcase-dialog-title"
        onClose={() => { setActiveProject(null); opener.current?.focus(); }}
        onClick={(event) => { if (event.target === dialog.current) close(); }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') stepModal(1);
          if (event.key === 'ArrowLeft') stepModal(-1);
        }}
      >
        {active && (
          <div className="showcase-dialog-layout">
            <div className="showcase-dialog-gallery">
              <button
                type="button"
                className="showcase-dialog-image"
                aria-label={copy.enlarge}
                onClick={() => {
                  if (suppressPhotoOpen.current) { suppressPhotoOpen.current = false; return; }
                  openPhoto();
                }}
                onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
                onTouchEnd={(event) => {
                  if (!touchStart.current) return;
                  const dx = event.changedTouches[0].clientX - touchStart.current.x;
                  const dy = event.changedTouches[0].clientY - touchStart.current.y;
                  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) {
                    stepModal(dx < 0 ? 1 : -1);
                    suppressPhotoOpen.current = true;
                    window.setTimeout(() => { suppressPhotoOpen.current = false; }, 400);
                  }
                  touchStart.current = null;
                }}
              >
                <LoadingPhoto key={`${active.id}-${activeImages[activeImage].url}`} src={activeImages[activeImage].url} alt={activeImages[activeImage].alt[locale] || active.title[locale]} locale={locale} sizes="(max-width: 700px) 100vw, 65vw" />
              </button>
              {activeImages.length > 1 && (showArrows ? <div className="showcase-dialog-navigation">
                <button type="button" onClick={() => stepModal(-1)} aria-label={copy.previous}><Chevron direction="left" /></button>
                <div className="showcase-dots" aria-hidden="true">{activeImages.map((image, index) => <span className={index === activeImage ? 'active' : ''} key={`${image.id}-${index}`} />)}</div>
                <button type="button" onClick={() => stepModal(1)} aria-label={copy.next}><Chevron direction="right" /></button>
              </div> : <div className="showcase-dialog-photo-pages" aria-label={copy.swipe}>
                {activeImages.map((image, index) => <button type="button" key={`${image.id}-${index}`} onClick={() => { setActiveImage(index); setZoom(1); setOffset({ x: 0, y: 0 }); }} aria-label={`${index + 1} / ${activeImages.length}`} aria-current={index === activeImage ? 'true' : undefined}>{String(index + 1).padStart(2, '0')}</button>)}
              </div>)}
              <div className="showcase-mobile-cue" aria-hidden="true"><span>{active.title[locale]}</span><span>{copy.details} ↓</span></div>
            </div>
            <div className="showcase-dialog-details">
              <button type="button" className="showcase-dialog-close" onClick={close} aria-label={copy.close}>×</button>
              <p className="eyebrow">Garnet / {t(locale, 'projects')}</p>
              <h2 id="showcase-dialog-title">{active.title[locale]}</h2>
              {(active.location[locale] || active.area) && <dl>
                {active.location[locale] && <div><dt>{t(locale, 'place')}</dt><dd>{active.location[locale]}</dd></div>}
                {active.area && <div><dt>{t(locale, 'area')}</dt><dd>{active.area}</dd></div>}
              </dl>}
              {active.description[locale] && <p className="showcase-dialog-description">{active.description[locale]}</p>}
            </div>
          </div>
        )}
      </dialog>
      <dialog ref={photoDialog} className="showcase-photo-dialog" aria-label={copy.enlarge} onClick={(event) => { if (event.target === photoDialog.current) closePhoto(); }} onKeyDown={(event) => { if (event.key === 'ArrowRight') stepModal(1); if (event.key === 'ArrowLeft') stepModal(-1); }}>
        {active && <>
          <button type="button" className="showcase-photo-close" onClick={closePhoto} aria-label={copy.closePhoto}>×</button>
          <div
            className="showcase-photo-stage"
            onDoubleClick={() => { setZoom(zoom > 1 ? 1 : 2); setOffset({ x: 0, y: 0 }); }}
            onTouchStart={(event) => {
              if (event.touches.length === 2) {
                gesture.current = { distance: touchDistance(event.touches), zoom, x: 0, y: 0, offsetX: offset.x, offsetY: offset.y };
                photoTouch.current = null;
              } else if (event.touches.length === 1) {
                gesture.current = { distance: 0, zoom, x: event.touches[0].clientX, y: event.touches[0].clientY, offsetX: offset.x, offsetY: offset.y };
                photoTouch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
              }
            }}
            onTouchMove={(event) => {
              if (!gesture.current) return;
              if (event.touches.length === 2 && gesture.current.distance > 0) {
                event.preventDefault();
                setZoom(Math.max(1, Math.min(4, gesture.current.zoom * touchDistance(event.touches) / gesture.current.distance)));
              } else if (event.touches.length === 1 && zoom > 1) {
                event.preventDefault();
                setOffset({ x: gesture.current.offsetX + event.touches[0].clientX - gesture.current.x, y: gesture.current.offsetY + event.touches[0].clientY - gesture.current.y });
              }
            }}
            onTouchEnd={(event) => {
              if (event.touches.length === 0 && photoTouch.current && zoom === 1) {
                const dx = event.changedTouches[0].clientX - photoTouch.current.x;
                const dy = event.changedTouches[0].clientY - photoTouch.current.y;
                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) stepModal(dx < 0 ? 1 : -1);
              }
              if (event.touches.length < 2) gesture.current = null;
              photoTouch.current = null;
              if (zoom <= 1) setOffset({ x: 0, y: 0 });
            }}
          >
            <LoadingPhoto key={`${active.id}-${activeImages[activeImage].url}`} src={activeImages[activeImage].url} alt={activeImages[activeImage].alt[locale] || active.title[locale]} locale={locale} sizes="100vw" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }} />
          </div>
          {showArrows && activeImages.length > 1 && <div className="showcase-photo-navigation">
            <button type="button" onClick={() => stepModal(-1)} aria-label={copy.previous}><Chevron direction="left" /></button>
            <button type="button" onClick={() => stepModal(1)} aria-label={copy.next}><Chevron direction="right" /></button>
          </div>}
        </>}
      </dialog>
    </>
  );
}
