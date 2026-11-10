'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { localizedPath, t } from '@/lib/i18n';
import type { Locale, Material } from '@/lib/types';

const copy = {
  sq: { search: 'Kërkoni sipas emrit', searchLabel: 'Kërko materiale', color: 'Ngjyra', size: 'Dimensionet', allColors: 'Të gjitha ngjyrat', allSizes: 'Të gjitha dimensionet', sort: 'Renditja', latest: 'Më të rejat', az: 'Emri A–Z', za: 'Emri Z–A', results: 'materiale', clear: 'Pastro filtrat', empty: 'Nuk u gjet asnjë material për këta filtra.', noMaterials: 'Materialet e kësaj kategorie do të shfaqen këtu së shpejti.', view: 'Shikoni detajet', ask: 'Keni nevojë për ndihmë në zgjedhje?', contact: 'Na kontaktoni', previous: 'E mëparshmja', next: 'Tjetra', page: 'Faqja' },
  mk: { search: 'Пребарајте по име', searchLabel: 'Пребарајте материјали', color: 'Боја', size: 'Димензии', allColors: 'Сите бои', allSizes: 'Сите димензии', sort: 'Подреди', latest: 'Најнови', az: 'Име А–Ш', za: 'Име Ш–А', results: 'материјали', clear: 'Исчисти филтри', empty: 'Нема материјали за овие филтри.', noMaterials: 'Материјалите од оваа категорија наскоро ќе се појават тука.', view: 'Погледнете детали', ask: 'Потребна ви е помош при изборот?', contact: 'Контактирајте нè', previous: 'Претходна', next: 'Следна', page: 'Страница' },
  en: { search: 'Search by name', searchLabel: 'Search materials', color: 'Colour', size: 'Dimensions', allColors: 'All colours', allSizes: 'All dimensions', sort: 'Sort by', latest: 'Newest first', az: 'Name A–Z', za: 'Name Z–A', results: 'materials', clear: 'Clear filters', empty: 'No materials match these filters.', noMaterials: 'Materials in this collection will appear here soon.', view: 'View details', ask: 'Need help choosing?', contact: 'Contact us', previous: 'Previous', next: 'Next', page: 'Page' },
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
  const [query, setQuery] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const colors = useMemo(() => [...new Set(materials.map((item) => item.attributes.color[locale].trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, locale)), [materials, locale]);
  const sizes = useMemo(() => [...new Set(materials.map((item) => item.attributes.size.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, locale)), [materials, locale]);
  const filtered = useMemo(() => materials.filter((item) =>
    (!query || `${item.name} ${item.attributes.color[locale]} ${item.attributes.size}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale))) &&
    (!color || item.attributes.color[locale].trim() === color) && (!size || item.attributes.size.trim() === size)
  ).sort((a, b) => sort === 'az' ? a.name.localeCompare(b.name, locale) : sort === 'za' ? b.name.localeCompare(a.name, locale) : Number(b.id) - Number(a.id)), [materials, locale, query, color, size, sort]);
  const hasFilters = Boolean(query || color || size);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * 12, currentPage * 12);
  function goToPage(number: number) {
    setPage(number);
    document.getElementById('koleksioni')?.scrollIntoView({ behavior: 'smooth' });
  }
  function openPreview(material: Material) {
    setPreview(material);
    dialog.current?.showModal();
  }
  return (
    <section className="catalog-section" id="koleksioni" aria-label={t(locale, category === 'tiles' ? 'tiles' : 'panels')}>
      <div className="wrap">
        <div className="catalog-section-heading"><h2 className="sr-only">{t(locale, category === 'tiles' ? 'tiles' : 'panels')}</h2><span>{String(materials.length).padStart(2, '0')} / {demoMode ? demo.results : words.results}</span></div>
        {demoMode && <p className="catalog-demo-note"><strong>{demo.label}</strong>{demo.note}</p>}
        {materials.length > 0 && <>
          <div className="catalog-controls">
            <label className="catalog-search"><span className="sr-only">{words.searchLabel}</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.5"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.5"/></svg><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={words.search} /></label>
            {colors.length > 0 && <label className="catalog-select"><span>{words.color}</span><select value={color} onChange={(event) => { setColor(event.target.value); setPage(1); }}><option value="">{words.allColors}</option>{colors.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>}
            {sizes.length > 0 && <label className="catalog-select"><span>{words.size}</span><select value={size} onChange={(event) => { setSize(event.target.value); setPage(1); }}><option value="">{words.allSizes}</option>{sizes.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>}
            <label className="catalog-select catalog-sort"><span>{words.sort}</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}><option value="latest">{words.latest}</option><option value="az">{words.az}</option><option value="za">{words.za}</option></select></label>
          </div>
          <div className="catalog-results-line"><span role="status">{filtered.length} {words.results}</span>{hasFilters && <button type="button" onClick={() => { setQuery(''); setColor(''); setSize(''); setPage(1); }}>{words.clear}</button>}</div>
        </>}
        {filtered.length ? <div className="catalog-grid">{visible.map((material, index) => {
          const content = <>
            <div className="catalog-product-image"><Image src={material.coverImage.url} alt={material.coverImage.alt[locale] || material.name} fill sizes="(max-width: 640px) 90vw, (max-width: 960px) 45vw, 30vw" /><span className="catalog-product-index">{String((currentPage - 1) * 12 + index + 1).padStart(2, '0')}</span>{material.isDemo && <span className="catalog-demo-badge">{demo.label}</span>}<span className="catalog-product-view">{material.isDemo ? demo.preview : words.view}</span></div>
            <div className="catalog-product-copy"><div><p>{t(locale, category === 'tiles' ? 'tiles' : 'panels')}</p><h3>{material.name}</h3></div><span aria-hidden="true">＋</span></div>
            {(material.attributes.color[locale] || material.attributes.size) && <p className="catalog-product-spec">{[material.attributes.color[locale], material.attributes.size].filter(Boolean).join('  /  ')}</p>}
          </>;
          const style = { animationDelay: `${Math.min(index, 8) * 65}ms` };
          return material.isDemo ? <button className="catalog-product catalog-product-demo" type="button" key={material.id} style={style} onClick={() => openPreview(material)} aria-label={`${demo.preview}: ${material.name}`}>{content}</button> : <Link className="catalog-product" key={material.id} href={localizedPath(locale, `materials/${material.slug}`)} style={style}>{content}</Link>;
        })}</div> : <div className={`catalog-empty${materials.length ? '' : ' catalog-empty-inventory'}`}><p>{materials.length ? words.empty : words.noMaterials}</p>{hasFilters && <button type="button" onClick={() => { setQuery(''); setColor(''); setSize(''); setPage(1); }}>{words.clear}</button>}</div>}
        {pageCount > 1 && <nav className="catalog-pagination" aria-label={words.page}><button type="button" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>{words.previous}</button><span>{words.page} {currentPage} / {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => goToPage(currentPage + 1)}>{words.next}</button></nav>}
        <div className="catalog-help"><p>{words.ask}</p><Link href={localizedPath(locale, 'contact')}>{words.contact}</Link></div>
      </div>
      <dialog ref={dialog} className="catalog-preview-dialog" aria-labelledby="catalog-preview-title" onClose={() => setPreview(null)} onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }}>
        {preview && <div className="catalog-preview-layout">
          <div className="catalog-preview-image"><Image src={preview.coverImage.url} alt={preview.coverImage.alt[locale] || preview.name} fill sizes="(max-width: 700px) 100vw, 60vw" /></div>
          <div className="catalog-preview-details"><button type="button" className="catalog-preview-close" aria-label={demo.close} onClick={() => dialog.current?.close()}>×</button><p className="catalog-preview-label">{demo.label} / {t(locale, category === 'tiles' ? 'tiles' : 'panels')}</p><h2 id="catalog-preview-title">{preview.name}</h2><p>{preview.description[locale]}</p><dl>{preview.attributes.color[locale] && <div><dt>{words.color}</dt><dd>{preview.attributes.color[locale]}</dd></div>}{preview.attributes.size && <div><dt>{words.size}</dt><dd>{preview.attributes.size}</dd></div>}</dl><p className="catalog-preview-disclaimer">{demo.disclaimer}</p></div>
        </div>}
      </dialog>
    </section>
  );
}
