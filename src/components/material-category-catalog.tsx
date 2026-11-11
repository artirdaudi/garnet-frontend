'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { localizedPath, t } from '@/lib/i18n';
import type { Locale, Material } from '@/lib/types';
import { LoadingPhoto } from './loading-photo';

const copy = {
  sq: { results: 'materiale', noMaterials: 'Materialet e kësaj kategorie do të shfaqen këtu së shpejti.', view: 'Shikoni detajet', ask: 'Keni nevojë për ndihmë në zgjedhje?', contact: 'Na kontaktoni', previous: 'E mëparshmja', next: 'Tjetra', page: 'Faqja', photo: 'Fotografia', color: 'Ngjyra', size: 'Dimensionet' },
  mk: { results: 'материјали', noMaterials: 'Материјалите од оваа категорија наскоро ќе се појават тука.', view: 'Погледнете детали', ask: 'Потребна ви е помош при изборот?', contact: 'Контактирајте нè', previous: 'Претходна', next: 'Следна', page: 'Страница', photo: 'Фотографија', color: 'Боја', size: 'Димензии' },
  en: { results: 'materials', noMaterials: 'Materials in this collection will appear here soon.', view: 'View details', ask: 'Need help choosing?', contact: 'Contact us', previous: 'Previous', next: 'Next', page: 'Page', photo: 'Photo', color: 'Colour', size: 'Dimensions' },
};
const demoCopy = {
  sq: { label: 'Demo', note: 'Materialet e kësaj kategorie do të shfaqen këtu së shpejti. Këta janë shembuj vetëm për të provuar pamjen e katalogut.', results: 'shembuj demo', preview: 'Parapamje e materialit', close: 'Mbyll parapamjen', disclaimer: 'Shembull për paraqitjen e faqes. Ky nuk është produkt në katalogun e Garnet.' },
  mk: { label: 'Демо', note: 'Материјалите од оваа категорија наскоро ќе се појават тука. Ова се примери само за преглед на изгледот на каталогот.', results: 'демо примери', preview: 'Преглед на материјал', close: 'Затвори преглед', disclaimer: 'Пример за изгледот на страницата. Ова не е производ во каталогот на Garnet.' },
  en: { label: 'Demo', note: 'Materials in this collection will appear here soon. These are examples to preview the catalogue layout only.', results: 'demo examples', preview: 'Material preview', close: 'Close preview', disclaimer: 'A layout example. This is not a product in the Garnet catalogue.' },
};

export function MaterialCategoryCatalog({ materials, locale, category, demoMode = false }: { materials: Material[]; locale: Locale; category: string; demoMode?: boolean }) {
  const words = copy[locale];
  const demo = demoCopy[locale];
  const dialog = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState<Material | null>(null);
  const [slides, setSlides] = useState<Record<string, number>>({});
  const [previewSlide, setPreviewSlide] = useState(0);
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(materials.length / 12));
  const visible = materials.slice((page - 1) * 12, page * 12);
  function photos(material: Material) {
    return material.gallery.length ? material.gallery : [material.coverImage];
  }
  function changeSlide(material: Material, direction: number) {
    setSlides((current) => ({ ...current, [material.id]: ((current[material.id] || 0) + direction + photos(material).length) % photos(material).length }));
  }
  function openPreview(material: Material) {
    setPreview(material);
    setPreviewSlide(slides[material.id] || 0);
    dialog.current?.showModal();
  }
  function goToPage(number: number) {
    setPage(number);
    document.getElementById('koleksioni')?.scrollIntoView({ behavior: 'smooth' });
  }
  return <section className="catalog-section" id="koleksioni" aria-label={t(locale, category === 'tiles' ? 'tiles' : 'panels')}>
    <div className="wrap">
      <div className="catalog-section-heading"><h2 className="sr-only">{t(locale, category === 'tiles' ? 'tiles' : 'panels')}</h2>{!demoMode && <span>{String(materials.length).padStart(2, '0')} / {words.results}</span>}</div>
      {demoMode && <p className="catalog-demo-note"><strong>{demo.label}</strong>{demo.note}</p>}
      {materials.length ? <div className="catalog-grid">{visible.map((material, index) => {
        const gallery = photos(material);
        const current = Math.min(slides[material.id] || 0, gallery.length - 1);
        const photo = gallery[current];
        const content = <><div className="catalog-product-image"><LoadingPhoto key={photo.url} src={photo.url} alt={photo.alt[locale] || material.name} locale={locale} sizes="(max-width: 640px) 90vw, (max-width: 960px) 45vw, 30vw" /><span className="catalog-product-index">{String((page - 1) * 12 + index + 1).padStart(2, '0')}</span>{material.isDemo && <span className="catalog-demo-badge">{demo.label}</span>}<span className="catalog-product-view">{material.isDemo ? demo.preview : words.view}</span></div><div className="catalog-product-copy"><div><p>{t(locale, category === 'tiles' ? 'tiles' : 'panels')}</p><h3>{material.name}</h3></div><span aria-hidden="true">＋</span></div>{(material.attributes.color[locale] || material.attributes.size) && <p className="catalog-product-spec">{[material.attributes.color[locale], material.attributes.size].filter(Boolean).join('  /  ')}</p>}</>;
        return <article className="catalog-product" key={material.id} style={{ animationDelay: `${Math.min(index, 8) * 65}ms` }}>
          {material.isDemo ? <button className="catalog-product-demo" type="button" onClick={() => openPreview(material)} aria-label={`${demo.preview}: ${material.name}`}>{content}</button> : <Link className="catalog-product-link" href={localizedPath(locale, `materials/${material.slug}`)}>{content}</Link>}
          {gallery.length > 1 && <div className="catalog-photo-nav" aria-label={`${words.photo} ${current + 1} / ${gallery.length}`}><button type="button" aria-label={`${words.previous} ${words.photo.toLowerCase()}`} onClick={() => changeSlide(material, -1)}>‹</button><span>{current + 1} / {gallery.length}</span><button type="button" aria-label={`${words.next} ${words.photo.toLowerCase()}`} onClick={() => changeSlide(material, 1)}>›</button></div>}
        </article>;
      })}</div> : <div className="catalog-empty catalog-empty-inventory"><p>{words.noMaterials}</p></div>}
      {pageCount > 1 && <nav className="catalog-pagination" aria-label={words.page}><button type="button" disabled={page === 1} onClick={() => goToPage(page - 1)}>{words.previous}</button><span>{words.page} {page} / {pageCount}</span><button type="button" disabled={page === pageCount} onClick={() => goToPage(page + 1)}>{words.next}</button></nav>}
      <div className="catalog-help"><p>{words.ask}</p><Link href={localizedPath(locale, 'contact')}>{words.contact}</Link></div>
    </div>
    <dialog ref={dialog} className="catalog-preview-dialog" aria-labelledby="catalog-preview-title" onClose={() => setPreview(null)} onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}>
      {preview && <div className="catalog-preview-layout"><div className="catalog-preview-image"><LoadingPhoto key={photos(preview)[previewSlide].url} src={photos(preview)[previewSlide].url} alt={photos(preview)[previewSlide].alt[locale] || preview.name} locale={locale} sizes="(max-width: 700px) 100vw, 60vw" />{photos(preview).length > 1 && <div className="catalog-preview-nav"><button type="button" aria-label={words.previous} onClick={() => setPreviewSlide((value) => (value - 1 + photos(preview).length) % photos(preview).length)}>‹</button><span>{previewSlide + 1} / {photos(preview).length}</span><button type="button" aria-label={words.next} onClick={() => setPreviewSlide((value) => (value + 1) % photos(preview).length)}>›</button></div>}</div><div className="catalog-preview-details"><button type="button" className="catalog-preview-close" aria-label={demo.close} onClick={() => dialog.current?.close()}>×</button><p className="catalog-preview-label">{demo.label} / {t(locale, category === 'tiles' ? 'tiles' : 'panels')}</p><h2 id="catalog-preview-title">{preview.name}</h2><p>{preview.description[locale]}</p><dl>{preview.attributes.color[locale] && <div><dt>{words.color}</dt><dd>{preview.attributes.color[locale]}</dd></div>}{preview.attributes.size && <div><dt>{words.size}</dt><dd>{preview.attributes.size}</dd></div>}</dl><p className="catalog-preview-disclaimer">{demo.disclaimer}</p></div></div>}
    </dialog>
  </section>;
}
