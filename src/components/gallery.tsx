'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import type { Locale, Media } from '@/lib/types';
import { t } from '@/lib/i18n';
import { Picture } from './media';
export function Gallery({ images, locale }: { images: Media[]; locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  function close() {
    dialog.current?.close();
    opener.current?.focus();
  }
  function show(index: number, button: HTMLButtonElement) {
    setSelected(index);
    opener.current = button;
    dialog.current?.showModal();
  }
  function step(direction: number) {
    setSelected((current) => (current + direction + images.length) % images.length);
  }
  return (
    <>
      <div className="gallery">
        {images.map((media, index) => (
          <figure key={`${media.id}-${index}`}>
            <button
              onClick={(event) => show(index, event.currentTarget)}
              aria-label={`${media.alt[locale]} — ${index + 1}/${images.length}`}
            >
              <Picture media={media} locale={locale} sizes="(max-width: 700px) 100vw, 85vw" />
              <span className="gallery-expand" aria-hidden="true">
                ↗
              </span>
            </button>
            <figcaption>
              <span>
                {String(index + 1).padStart(2, '0')} / {media.alt[locale]}
              </span>
              <span>{t(locale, 'demoPhoto')}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        onCancel={close}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1);
          if (event.key === 'ArrowLeft') step(-1);
        }}
      >
        <button className="lightbox-close" onClick={close} aria-label={t(locale, 'close')}>
          ×
        </button>
        <div className="lightbox-image">
          <Image src={images[selected].url} fill sizes="95vw" alt={images[selected].alt[locale]} />
        </div>
        <div className="lightbox-controls">
          <button
            onClick={() => step(-1)}
            aria-label={locale === 'sq' ? 'Fotografia e mëparshme' : locale === 'mk' ? 'Претходна фотографија' : 'Previous image'}
          >
            ←
          </button>
          <p aria-live="polite">
            {selected + 1} / {images.length}
          </p>
          <button
            onClick={() => step(1)}
            aria-label={locale === 'sq' ? 'Fotografia e radhës' : locale === 'mk' ? 'Следна фотографија' : 'Next image'}
          >
            →
          </button>
        </div>
      </dialog>
    </>
  );
}
