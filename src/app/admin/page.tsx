'use client';

import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react';
import Image from 'next/image';
import type { Field, Resource } from './config';
import { resources, titleOf } from './config';

type Row = Record<string, unknown> & { id: number };
type List = { items: Row[]; total: number; page: number; page_size: number };
type Stats = Record<string, number>;
type ProjectImage = Row & { project_id: number; display_order: number; secure_url: string };
type PendingPhoto = { id: string; file: File; url: string };
const isPendingPhoto = (photo: ProjectImage | PendingPhoto): photo is PendingPhoto => typeof photo.id === 'string';
const empty: List = { items: [], total: 0, page: 1, page_size: 100 };
const statusLabel: Record<string, string> = { NEW: 'I ri', READ: 'Lexuar', REPLIED: 'Përgjigjur', CLOSED: 'Mbyllur' };

async function request(path: string, init?: RequestInit) {
  const response = await fetch(`/api/admin/${path}`, { credentials: 'same-origin', cache: 'no-store', ...init });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof body.detail === 'string' ? body.detail : body.error || `Gabim ${response.status}`);
  return body;
}
const json = (method: string, data: unknown): RequestInit => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
const blank = (config: Resource) => Object.fromEntries(config.fields.map((field) => [field.key, field.type === 'boolean' ? field.key === 'is_active' : field.type === 'number' && field.key === 'display_order' ? 0 : '']));
async function allRows(resource: string): Promise<Row[]> {
  const first: List = await request(`${resource}?page=1&page_size=100`);
  const rows = [...first.items];
  for (let page = 2; rows.length < first.total; page++) {
    const next: List = await request(`${resource}?page=${page}&page_size=100`);
    rows.push(...next.items);
  }
  return rows;
}

export default function AdminPage() {
  const [auth, setAuth] = useState<'checking' | 'login' | 'ready'>('checking');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const [section, setSection] = useState('dashboard');
  const [list, setList] = useState<List>(empty);
  const [stats, setStats] = useState<Stats>({});
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [options, setOptions] = useState<Record<string, Row[]>>({});
  const [page, setPage] = useState(1);
  const [materialCategory, setMaterialCategory] = useState<'PLLAKA' | 'PANELE'>('PLLAKA');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [projectPreviews, setProjectPreviews] = useState<Record<number, ProjectImage[]>>({});
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectImagesLoading, setProjectImagesLoading] = useState(false);
  const [projectSlide, setProjectSlide] = useState<Record<number, number>>({});
  const [photoLoadState, setPhotoLoadState] = useState<Record<string, 'ready' | 'error'>>({});
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [pendingDragId, setPendingDragId] = useState<string | null>(null);
  const [photoDropId, setPhotoDropId] = useState<string | number | null>(null);
  const [siteHeroImages, setSiteHeroImages] = useState<(Row & { secure_url: string })[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<{ id: number; position: 'before' | 'after' } | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [previewImage, setPreviewImage] = useState<(Row & { secure_url: string }) | null>(null);
  const draggedRecently = useRef(false);
  const config = resources.find((item) => item.key === section);

  const loadSiteHeroImages = useCallback(async () => {
    const heroImages = await allRows('hero-images');
    setSiteHeroImages(heroImages
      .map((item) => ({ ...item, secure_url: String(item.secure_url || '') }))
      .sort((a, b) => Number((a as Row).display_order) - Number((b as Row).display_order) || a.id - b.id));
  }, []);

  const load = useCallback(async (key: string, number = 1) => {
    if ((key === 'projects' || key === 'materials')) { setProjectsLoading(true); setProjectPreviews({}); }
    try {
      if (key === 'dashboard') {
        setStats(await request('dashboard'));
      } else if (key === 'hero') {
        await loadSiteHeroImages();
      } else {
        setList(await request(`${key}?page=${number}&page_size=${(key === 'projects' || key === 'materials') ? 10 : 100}${key === 'materials' ? `&category=${materialCategory}` : ''}`));
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Lidhja me API-n dështoi.');
      if (key !== 'dashboard' && key !== 'hero') setList(empty);
    } finally { if ((key === 'projects' || key === 'materials')) setProjectsLoading(false); }
  }, [loadSiteHeroImages, materialCategory]);

  useEffect(() => {
    request('session').then(() => setAuth('ready')).catch(() => setAuth('login'));
  }, []);
  useEffect(() => {
    if (!previewImage) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setPreviewImage(null); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [previewImage]);
  useEffect(() => {
    if (!categoryOpen) return;
    const close = (event: MouseEvent) => { if (!categoryRef.current?.contains(event.target as Node)) setCategoryOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setCategoryOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', escape); };
  }, [categoryOpen]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    if (!error) return;
    const timeout = window.setTimeout(() => setError(''), 8000);
    return () => window.clearTimeout(timeout);
  }, [error]);
  useEffect(() => {
    if (auth !== 'ready') return;
    let cancelled = false;
    if (section === 'dashboard') {
      request('dashboard').then((data) => { if (!cancelled) setStats(data); }).catch((reason) => { if (!cancelled) setError(reason.message); });
    } else if (section === 'hero') {
      void Promise.resolve().then(loadSiteHeroImages).catch((reason) => { if (!cancelled) setError(reason.message); });
    } else {
      request(`${section}?page=${page}&page_size=${(section === 'projects' || section === 'materials') ? 10 : 100}${section === 'materials' ? `&category=${materialCategory}` : ''}`)
        .then((data) => { if (!cancelled) setList(data); })
        .catch((reason) => { if (!cancelled) setError(reason.message); })
        .finally(() => { if (!cancelled && (section === 'projects' || section === 'materials')) setProjectsLoading(false); });
    }
    return () => { cancelled = true; };
  }, [auth, section, page, materialCategory, loadSiteHeroImages]);
  useEffect(() => {
    if (auth !== 'ready' || (section !== 'projects' && section !== 'materials')) return;
    let cancelled = false;
    Promise.all(list.items.map(async (project) => {
      try { return [project.id, await request(`${section}/${project.id}/images`)] as const; }
      catch { return [project.id, []] as const; }
    })).then((entries) => { if (!cancelled) setProjectPreviews(Object.fromEntries(entries)); });
    return () => { cancelled = true; };
  }, [auth, section, list.items]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      await request('session', json('POST', { username, password }));
      setPassword(''); setAuth('ready');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Kyçja dështoi.'); }
    finally { setBusy(false); }
  }
  async function logout() {
    await request('session', { method: 'DELETE' }).catch(() => null);
    setAuth('login'); setDraft(null); setStats({}); setList(empty);
  }
  function navigate(key: string) {
    if (key === section && page === 1) { if ((key === 'projects' || key === 'materials')) void load(key, 1); return; }
    clearPendingPhotos(); if ((key === 'projects' || key === 'materials')) { setProjectsLoading(true); setProjectPreviews({}); } setSection(key); setPage(1); setList(empty); setDraft(null); setNotice(''); setError('');
  }
  function clearPendingPhotos() {
    pendingPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
    setPendingPhotos([]);
  }
  function closeEditor() { if (busy) return; clearPendingPhotos(); setCategoryOpen(false); setDraft(null); }
  async function edit(row?: Row) {
    if (!config) return;
    clearPendingPhotos();
    setDraft(row ? { ...row } : blank(config));
    setCategoryOpen(false);
    setProjectImages([]);
    if ((config.key === 'projects' || config.key === 'materials') && row) void loadProjectImages(row);
    const related = [...new Set(config.fields.filter((field) => field.resource).map((field) => field.resource!))];
    const entries = await Promise.all(related.map(async (key) => {
      try { const data: List = await request(`${key}?page_size=100`); return [key, data.items] as const; }
      catch { return [key, []] as const; }
    }));
    setOptions(Object.fromEntries(entries));
  }
  async function loadProjectImages(project: Row) {
    setProjectImagesLoading(true);
    try {
      const images: ProjectImage[] = await request(`${section}/${project.id}/images`);
      setProjectImages(images);
      setProjectPreviews((current) => ({ ...current, [project.id]: images }));
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Fotografitë nuk u ngarkuan.'); }
    finally { setProjectImagesLoading(false); }
  }
  function addPendingPhotos(files: FileList | null) {
    if (!files?.length) return;
    const selected = Array.from(files).filter((file) => file.type.startsWith('image/'));
    const photos = selected.map((file) => ({ id: crypto.randomUUID(), file, url: URL.createObjectURL(file) }));
    setPendingPhotos((current) => [...current, ...photos]);
  }
  function reorderPendingPhotos(fromId: string, toId: string) {
    setPendingPhotos((current) => {
      const next = [...current];
      const from = next.findIndex((photo) => photo.id === fromId);
      const to = next.findIndex((photo) => photo.id === toId);
      if (from < 0 || to < 0 || from === to) return current;
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
  }
  function fieldValue(field: Field, value: unknown) {
    if (field.type === 'boolean') return value === true;
    if (field.type === 'json') return typeof value === 'object' && value ? JSON.stringify(value, null, 2) : String(value ?? '');
    return String(value ?? '');
  }
  function updateField(field: Field, value: string | boolean) {
    setDraft((current) => current ? { ...current, [field.key]: value } : current);
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!config || !draft) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const payload: Record<string, unknown> = {};
      for (const field of config.fields) {
        if (config.key === 'contacts' && field.key !== 'status') continue;
        const value = draft[field.key];
        if (field.type === 'boolean') payload[field.key] = value === true;
        else if (field.type === 'json') payload[field.key] = value ? JSON.parse(String(value)) : null;
        else if (field.type === 'number' || field.type === 'relation') payload[field.key] = value === '' || value == null ? null : Number(value);
        else payload[field.key] = value === '' || value == null ? null : String(value);
      }
      if (!draft.id) {
        for (const field of config.fields) if (!field.required && payload[field.key] === null) delete payload[field.key];
      }
      if (config.key === 'materials' && !String(payload.name || '').trim()) throw new Error('Emri është i detyrueshëm.');
      if (config.key === 'materials' && !['PLLAKA', 'PANELE'].includes(String(payload.category))) throw new Error('Zgjidhni kategorinë.');
      if (config.key === 'projects' && !draft.id) {
        const title = String(payload.title || '').trim();
        if (!title) throw new Error('Titulli është i detyrueshëm.');
        payload.title = title;
      }
      const saved: Row = await request(draft.id ? `${config.key}/${draft.id}` : config.key, json(draft.id ? 'PATCH' : 'POST', payload));
      if ((config.key === 'projects' || config.key === 'materials')) {
        setDraft(saved);
        try {
          for (const [index, photo] of pendingPhotos.entries()) {
            const uploaded = await uploadCloudinary(photo.file);
            await registerProjectPhoto(saved.id, uploaded, projectImages.length + index);
            URL.revokeObjectURL(photo.url);
            setPendingPhotos((current) => current.filter((item) => item.id !== photo.id));
          }
        } finally { await loadProjectImages(saved); }
        setNotice(draft.id ? 'U ruajt me sukses.' : 'Të dhënat dhe fotografitë u ruajtën.');
      } else { setDraft(null); setNotice('Ndryshimet u ruajtën.'); }
      if ((config.key === 'projects' || config.key === 'materials') && !draft.id) { setPage(1); await load(config.key, 1); }
      else await load(config.key, page);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Ruajtja dështoi.'); }
    finally { setBusy(false); }
  }
  async function uploadCloudinary(image: File): Promise<Record<string, unknown>> {
    if (!image.type.startsWith('image/')) throw new Error('Zgjidhni vetëm fotografi.');
    const signed = await request('media/sign-upload', { method: 'POST' });
    const form = new FormData();
    for (const key of ['api_key', 'timestamp', 'folder', 'signature']) form.append(key, String(signed[key]));
    form.append('file', image);
    const response = await fetch(String(signed.upload_url), { method: 'POST', body: form });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || 'Ngarkimi në Cloudinary dështoi.');
    return result;
  }
  async function registerProjectPhoto(projectId: number, uploaded: Record<string, unknown>, displayOrder: number): Promise<Row> {
    return request(`${section}/${projectId}/images`, json('POST', { ...uploaded, display_order: displayOrder }));
  }
  async function uploadSiteHeroImages(files: FileList | null) {
    if (busy) return;
    const selectedFiles = files ? Array.from(files) : [];
    if (!selectedFiles.length) return;
    setBusy(true); setError('');
    try {
      for (const [index, file] of selectedFiles.entries()) {
        const uploaded = await uploadCloudinary(file);
        await request('hero-images', json('POST', { ...uploaded, display_order: siteHeroImages.length + index }));
      }
      await loadSiteHeroImages(); setNotice(`${selectedFiles.length} fotografi u ngarkuan dhe u ruajtën në hero.`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Fotografitë nuk u ruajtën.'); }
    finally { setBusy(false); }
  }
  async function removeSiteHeroImage(image: Row) {
    if (busy) return;
    if (!window.confirm('Ta largojmë këtë fotografi nga hero?')) return;
    setBusy(true); setError('');
    try { await request(`hero-images/${image.id}`, { method: 'DELETE' }); await loadSiteHeroImages(); setNotice('Fotografia u largua.'); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Fotografia nuk u largua.'); }
    finally { setBusy(false); }
  }
  function heroDropPosition(event: DragEvent<HTMLDivElement>): 'before' | 'after' {
    const rect = event.currentTarget.getBoundingClientRect();
    return window.matchMedia('(max-width: 650px)').matches
      ? (event.clientY < rect.top + rect.height / 2 ? 'before' : 'after')
      : (event.clientX < rect.left + rect.width / 2 ? 'before' : 'after');
  }
  async function reorderSiteHeroImages(fromId: number, toId: number, position: 'before' | 'after') {
    if (busy) return;
    const reordered = [...siteHeroImages];
    const from = reordered.findIndex((item) => item.id === fromId);
    if (from < 0 || fromId === toId) return;
    const [moved] = reordered.splice(from, 1);
    const target = reordered.findIndex((item) => item.id === toId);
    if (target < 0) return;
    reordered.splice(target + (position === 'after' ? 1 : 0), 0, moved);
    if (reordered.every((item, index) => item.id === siteHeroImages[index].id)) return;
    const previous = siteHeroImages; setSiteHeroImages(reordered);
    setBusy(true); setSavingOrder(true); setError(''); setNotice('');
    try { await request('hero-images/order', json('PATCH', reordered.map((item) => item.id))); setNotice('Renditja e hero-s u ruajt.'); }
    catch (reason) { setSiteHeroImages(previous); setError(reason instanceof Error ? reason.message : 'Renditja nuk u ruajt.'); }
    finally { setBusy(false); setSavingOrder(false); }
  }
  async function uploadProjectPhotos(files: FileList | null) {
    if (!files?.length || !draft?.id) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const projectId = Number(draft.id);
      for (const [index, image] of Array.from(files).entries()) {
        const uploaded = await uploadCloudinary(image);
        await registerProjectPhoto(projectId, uploaded, projectImages.length + index);
      }
      await loadProjectImages(draft as Row);
      setNotice('Fotografitë u shtuan.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Ngarkimi dështoi.'); }
    finally { setBusy(false); }
  }
  async function reorderProjectImages(fromId: number, toId: number) {
    if (!draft?.id || fromId === toId) return;
    const previous = projectImages;
    const reordered = [...previous];
    const from = reordered.findIndex((item) => item.id === fromId);
    const to = reordered.findIndex((item) => item.id === toId);
    if (from < 0 || to < 0) return;
    reordered.splice(to, 0, reordered.splice(from, 1)[0]);
    setProjectImages(reordered);
    try { await request(`${section}/${draft.id}/images/order`, json('PATCH', reordered.map((item) => item.id))); setProjectPreviews((current) => ({ ...current, [Number(draft.id)]: reordered })); setNotice('Renditja u ruajt.'); }
    catch (reason) { setProjectImages(previous); setError(reason instanceof Error ? reason.message : 'Renditja nuk u ruajt.'); }
  }
  async function removeProjectImage(image: ProjectImage) {
    if (!window.confirm('Ta largojmë këtë fotografi?')) return;
    setBusy(true); setError('');
    try { await request(`${section === 'materials' ? 'materials-images' : 'project-images'}/${image.id}`, { method: 'DELETE' }); await loadProjectImages(draft as Row); setNotice('Fotografia u largua.'); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Fotografia nuk u largua.'); }
    finally { setBusy(false); }
  }
  async function remove(row: Row) {
    if (!window.confirm(`Ta fshijmë “${titleOf(row)}”? Ky veprim nuk mund të zhbëhet.`)) return;
    setBusy(true); setError('');
    try { await request(`${section}/${row.id}`, { method: 'DELETE' }); setDraft(null); setNotice('U fshi me sukses.'); const targetPage = (section === 'projects' || section === 'materials') && list.items.length === 1 && page > 1 ? page - 1 : page; if (targetPage !== page) setPage(targetPage); await load(section, targetPage); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Fshirja dështoi.'); }
    finally { setBusy(false); }
  }
  async function upload() {
    if (!file || !file.type.startsWith('image/')) { setError('Zgjidhni një fotografi.'); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const signed = await request('media/sign-upload', { method: 'POST' });
      const form = new FormData();
      for (const key of ['api_key', 'timestamp', 'folder', 'signature']) form.append(key, String(signed[key]));
      form.append('file', file);
      const response = await fetch(signed.upload_url, { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'Ngarkimi në Cloudinary dështoi.');
      await request('media', json('POST', result));
      setFile(null); setNotice('Fotografia u ngarkua dhe u ruajt.'); await load('media', page);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Ngarkimi dështoi.'); }
    finally { setBusy(false); }
  }

  if (auth === 'checking') return <main className="admin-loading"><span className="admin-spinner" aria-hidden="true" /> Duke hapur panelin…</main>;
  if (auth === 'login') return (
    <main className="admin-login">
      <div className="admin-login-art"><Image src="/brand/garnet-logo-transparent.png" alt="Garnet — The Art of Tile" width={760} height={760} priority /></div>
      <form className="admin-login-card" onSubmit={login}>
        <p className="admin-eyebrow">PANELI I ADMINISTRIMIT</p>
        <h1>GARNET<br /><span>THE ART OF TILE</span></h1>
        <p>Kyçuni për të menaxhuar projektet dhe materialet.</p>
        <label>Përdoruesi<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
        <label>Fjalëkalimi<span className="admin-password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Fshih fjalëkalimin' : 'Shfaq fjalëkalimin'} aria-pressed={showPassword}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{showPassword && <path d="M3 3l18 18"/>}</svg></button></span></label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Duke u kyçur…' : 'Kyçu në panel'}</button>
      </form>
    </main>
  );
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><Image src="/brand/garnet-logo-transparent.png" alt="Garnet — The Art of Tile" width={190} height={190} priority /></div>
        <p className="admin-side-caption">PANELI I ADMINISTRIMIT</p>
        <nav aria-label="Administrimi">
          <button disabled={busy} className={section === 'dashboard' ? 'active' : ''} onClick={() => navigate('dashboard')}>◫ <span>Përmbledhja</span></button>
          <div className="admin-nav-divider" aria-hidden="true" />
          <button disabled={busy} className={section === 'hero' ? 'active' : ''} onClick={() => navigate('hero')}>▧ <span>Fotografitë e hero-s</span></button>
          {resources.filter((item) => item.key === 'projects' || item.key === 'materials').map((item) => <button disabled={busy} key={item.key} className={section === item.key ? 'active' : ''} onClick={() => navigate(item.key)}><span>{item.label}</span></button>)}
        </nav>
        <div className="admin-side-bottom"><a href="/" target="_blank" rel="noreferrer">Shiko faqen</a><button disabled={busy} onClick={logout}>Dil nga paneli</button></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><span>GARNET / {section === 'dashboard' ? 'PËRMBLEDHJA' : section === 'hero' ? 'FOTOGRAFITË E HERO-S' : config?.label.toUpperCase()}</span></header>
        {error && <div className="admin-alert error" role="alert">{error}</div>}
        {notice && <div className="admin-alert success" role="status">{notice}</div>}
        {section === 'dashboard' ? (
          <>
            <div className="admin-heading"><div><p className="admin-eyebrow">PËRMBLEDHJE</p><h1>Gjithçka në<br />një vend.</h1><p>Menaxhoni përmbajtjen e Garnet nga një panel i vetëm.</p></div><a href="/" target="_blank" rel="noreferrer">Shiko faqen publike</a></div>
            <div className="admin-stats">
              {[['projects','Projekte'],['materials','Materiale']].map(([key,label]) => <div key={key}><span>{label}</span><strong>{stats[key] ?? '—'}</strong></div>)}
            </div>
          </>
        ) : section === 'hero' ? (
          <>
            <div className="admin-heading"><div><p className="admin-eyebrow">FAQJA KRYESORE</p><h1>Fotografitë e hero-s</h1><p>Menaxhoni fotografitë në krye të faqes kryesore.</p></div></div>
            <section className="admin-site-hero" aria-busy={busy}>
              <h2>Fotografitë</h2>
              <p>Tërhiqni fotografitë për t&apos;i renditur. Klikoni një fotografi për ta zmadhuar.</p>
              <label className={`admin-image-picker${busy ? ' is-busy' : ''}`}>{busy ? <><span className="admin-spinner" aria-hidden="true" /> {savingOrder ? 'Duke ruajtur renditjen…' : 'Duke u ngarkuar…'}</> : '+ Shto fotografi në hero'}
                <input type="file" accept="image/*" multiple disabled={busy} onChange={(event) => { void uploadSiteHeroImages(event.target.files); event.target.value = ''; }} />
              </label>
              {savingOrder && <p className="admin-order-status" role="status"><span className="admin-spinner" aria-hidden="true" /> Duke ruajtur renditjen…</p>}
              <div className="admin-site-hero-list">{siteHeroImages.map((item, index) => <div key={item.id}
                className={`admin-hero-tile${draggingId === item.id ? ' is-dragging' : ''}${dropTarget?.id === item.id ? ` drop-${dropTarget.position}` : ''}`}
                draggable={!busy}
                role="button" tabIndex={0} aria-label={`Shiko fotografinë ${index + 1}; tërhiq për renditje`}
                onClick={() => { if (!draggedRecently.current) setPreviewImage(item); }}
                onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); setPreviewImage(item); } }}
                onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', String(item.id)); draggedRecently.current = true; setDraggingId(item.id); setDropTarget(null); }}
                onDragEnd={() => { setDraggingId(null); setDropTarget(null); window.setTimeout(() => { draggedRecently.current = false; }, 100); }}
                onDragOver={(event) => { if (draggingId == null || draggingId === item.id || busy) return; event.preventDefault(); event.dataTransfer.dropEffect = 'move'; const position = heroDropPosition(event); if (dropTarget?.id !== item.id || dropTarget.position !== position) setDropTarget({ id: item.id, position }); }}
                onDrop={(event) => { event.preventDefault(); if (draggingId != null && draggingId !== item.id) void reorderSiteHeroImages(draggingId, item.id, heroDropPosition(event)); setDraggingId(null); setDropTarget(null); }}>
                {item.secure_url && <Image src={item.secure_url} alt={`Hero ${index + 1}`} width={280} height={190} draggable={false} />}
                <span className="admin-hero-order" aria-label={`Renditja ${index + 1}`}>{index + 1}</span>
                <button className="admin-hero-remove" type="button" draggable={false} disabled={busy} aria-label={`Largo fotografinë ${index + 1}`} onClick={(event) => { event.stopPropagation(); void removeSiteHeroImage(item); }}>×</button>
              </div>)}</div>
            </section>
            {previewImage && <div className="admin-image-lightbox" role="presentation" onClick={() => setPreviewImage(null)}>
              <div className="admin-image-lightbox-content" role="dialog" aria-modal="true" aria-label="Fotografia e hero-s" onClick={(event) => event.stopPropagation()}>
                <button className="admin-image-lightbox-close" type="button" aria-label="Mbyll fotografinë" onClick={() => setPreviewImage(null)}>×</button>
                <Image src={previewImage.secure_url} alt="Fotografia e hero-s" width={1400} height={900} draggable={false} />
                <button className="admin-image-lightbox-delete" type="button" disabled={busy} onClick={() => { const image = previewImage; setPreviewImage(null); void removeSiteHeroImage(image); }}>Largo fotografinë</button>
              </div>
            </div>}
          </>
        ) : (section === 'projects' || section === 'materials') ? (
          <>
            <div className="admin-heading"><div><p className="admin-eyebrow">PËRMBAJTJA / {section === 'materials' ? 'MATERIALET' : 'PROJEKTET'}</p><h1>{section === 'materials' ? 'Materialet' : 'Projektet'}</h1><p>{projectsLoading ? `Duke ngarkuar ${section === 'materials' ? 'materialet' : 'projektet'}…` : `${list.total} ${section === 'materials' ? 'materiale' : 'projekte'} gjithsej.`}</p></div><button className="admin-primary" disabled={projectsLoading} onClick={() => void edit()}>+ Shto {section === 'materials' ? 'material' : 'projekt'}</button></div>
            {section === 'materials' && <div className="admin-material-tabs" role="tablist" aria-label="Kategoritë e materialeve">
              {([['PLLAKA', 'Pllaka'], ['PANELE', 'Panele Dekoruese']] as const).map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={materialCategory === value} onClick={() => { if (materialCategory === value) return; setProjectsLoading(true); setProjectPreviews({}); setList(empty); setPage(1); setMaterialCategory(value); }}>{label}</button>)}
            </div>}
            {projectsLoading ? <div className="admin-project-loading" role="status"><span className="admin-spinner" aria-hidden="true" /><strong>Duke ngarkuar {section === 'materials' ? 'materialet' : 'projektet'}…</strong></div> : <div className="admin-project-cards">{list.items.map((project) => {
              const photos = projectPreviews[project.id] || [];
              const slide = Math.min(projectSlide[project.id] || 0, Math.max(photos.length - 1, 0));
              const currentPhoto = photos[slide];
              const imageState = currentPhoto ? photoLoadState[currentPhoto.secure_url] : undefined;
              return <article className="admin-project-card" key={project.id} role="button" tabIndex={0} aria-label={`Hap ${section === 'materials' ? 'materialin' : 'projektin'} ${titleOf(project)}`} onClick={() => void edit(project)} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); void edit(project); } }}>
                <div className="admin-project-card-photo">
                  {projectPreviews[project.id] === undefined ? <div className="admin-project-card-placeholder" role="status"><span className="admin-spinner" aria-hidden="true" /> Duke ngarkuar fotografitë…</div> : currentPhoto ? <>
                    <Image key={currentPhoto.id} src={currentPhoto.secure_url} alt={`${titleOf(project)} — fotografia ${slide + 1}`} width={1100} height={650} className={imageState === 'ready' ? '' : 'is-loading'} onLoad={() => setPhotoLoadState((current) => ({ ...current, [currentPhoto.secure_url]: 'ready' }))} onError={() => setPhotoLoadState((current) => ({ ...current, [currentPhoto.secure_url]: 'error' }))} />
                    {imageState !== 'ready' && <div className="admin-project-photo-overlay" role="status">{imageState === 'error' ? 'Fotografia nuk u ngarkua.' : <><span className="admin-spinner" aria-hidden="true" /> Duke ngarkuar fotografinë…</>}</div>}
                  </> : <div className="admin-project-card-placeholder">Ende pa fotografi</div>}
                  {photos.length > 1 && <div className="admin-project-card-arrows">
                    <button type="button" aria-label={`Fotografia e mëparshme e ${section === 'materials' ? 'materialit' : 'projektit'} ${titleOf(project)}`} onClick={(event) => { event.stopPropagation(); setProjectSlide((current) => ({ ...current, [project.id]: (slide - 1 + photos.length) % photos.length })); }}>←</button>
                    <span>{slide + 1} / {photos.length}</span>
                    <button type="button" aria-label={`Fotografia tjetër e ${section === 'materials' ? 'materialit' : 'projektit'} ${titleOf(project)}`} onClick={(event) => { event.stopPropagation(); setProjectSlide((current) => ({ ...current, [project.id]: (slide + 1) % photos.length })); }}>→</button>
                  </div>}
                </div>
                <div className="admin-project-card-details">
                  <span><small>{section === 'materials' ? 'MATERIALI' : 'PROJEKTI'} #{project.id}</small><strong>{titleOf(project)}</strong><em>{section === 'materials' ? [project.category === 'PANELE' ? 'Panele' : 'Pllaka', project.color, project.dimensions].filter(Boolean).join(' · ') : [project.location, project.area_m2 ? `${project.area_m2} m²` : null].filter(Boolean).join(' · ')}</em></span>
                  <span aria-hidden="true">Hap {section === 'materials' ? 'materialin' : 'projektin'}</span>
                </div>
              </article>;
            })}{list.items.length === 0 && <div className="admin-empty">Ende nuk ka {section === 'materials' ? 'materiale' : 'projekte'}.</div>}</div>}
            {!projectsLoading && list.total > 0 && <div className="admin-pagination"><button disabled={page === 1 || busy} onClick={() => { setProjectsLoading(true); setProjectPreviews({}); setPage(page - 1); }}>← Më parë</button><span>Faqja {page} / {Math.ceil(list.total / 10)}</span><button disabled={page * 10 >= list.total || busy} onClick={() => { setProjectsLoading(true); setProjectPreviews({}); setPage(page + 1); }}>Më pas →</button></div>}
          </>
        ) : (
          <>
            <div className="admin-heading"><div><p className="admin-eyebrow">PËRMBAJTJA / {section.toUpperCase()}</p><h1>{config?.label}</h1><p>{list.total} regjistrime në këtë seksion.</p></div><button className="admin-primary" onClick={() => void edit()}>+ Shto {config?.singular}</button></div>
            {section === 'media' && <div className="admin-upload"><input id="admin-file" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} /><span>{file ? file.name : 'Zgjidhni një fotografi për Cloudinary.'}</span><button disabled={!file || busy} onClick={upload}>{busy ? 'Duke ngarkuar…' : 'Ngarko'}</button></div>}
            <div className="admin-table-wrap"><table><thead><tr><th>EMRI / PËRSHKRIMI</th><th>ID</th><th>STATUSI</th><th>VEPRIMET</th></tr></thead><tbody>
      {list.items.map((row) => <tr key={row.id}>
                <td><div className="admin-item">{section === 'media' && typeof row.secure_url === 'string' && <Image src={row.secure_url} alt="" width={44} height={44} /> }<div><strong>{titleOf(row)}</strong><small>{String(row.slug || row.cloudinary_public_id || row.subject || '')}</small></div></div></td>
                <td>#{row.id}</td><td>{row.is_active === true ? <span className="admin-pill live">Publikuar</span> : row.is_active === false ? <span className="admin-pill">Draft</span> : row.status ? <span className="admin-pill">{statusLabel[String(row.status)] || String(row.status)}</span> : '—'}</td>
                <td><div className="admin-actions"><button onClick={() => section === 'media' ? setDraft({ ...row }) : void edit(row)}>Ndrysho</button>{section !== 'contacts' && section !== 'settings' && <button onClick={() => void remove(row)}>Fshi</button>}</div></td>
              </tr>)}
            </tbody></table>{list.items.length === 0 && <div className="admin-empty">Ende nuk ka regjistrime këtu.</div>}</div>
            {list.total > 100 && <div className="admin-pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}>← Më parë</button><span>Faqja {page} / {Math.ceil(list.total / 100)}</span><button disabled={page * 100 >= list.total} onClick={() => setPage(page + 1)}>Më pas →</button></div>}
          </>
        )}
      </main>
      {draft && <div className="admin-modal-backdrop" onClick={closeEditor}><div className="admin-editor" onClick={(event) => event.stopPropagation()}>
        <div className="admin-editor-head"><div><p className="admin-eyebrow">{draft.id ? 'NDRYSHO' : 'SHTO'}</p><h2>{section === 'media' ? 'Fotografia' : config?.singular}</h2></div><button onClick={closeEditor} aria-label="Mbyll">×</button></div>
        <form onSubmit={section === 'media' ? async (event) => {
          event.preventDefault(); setBusy(true); setError('');
          try { await request(`media/${draft.id}`, json('PATCH', { alt_sq: draft.alt_sq || null, alt_mk: draft.alt_mk || null, alt_en: draft.alt_en || null })); setDraft(null); setNotice('U ruajt.'); await load('media', page); }
          catch (reason) { setError(reason instanceof Error ? reason.message : 'Gabim.'); } finally { setBusy(false); }
        } : save}>
          {(section === 'media' ? [{ key: 'alt_sq', label: 'Teksti alternativ (shqip)' }, { key: 'alt_mk', label: 'Teksti alternativ (maqedonisht)' }, { key: 'alt_en', label: 'Teksti alternativ (anglisht)' }] as Field[] : config?.fields || []).map((field) => (
            <label key={field.key} className={field.type === 'boolean' ? 'admin-checkbox' : ''}>{field.label}
              {field.type === 'category' ? <div className="admin-category-picker" ref={categoryRef}>
                <input type="hidden" name="category" value={String(draft.category || '')} />
                <button type="button" className={`admin-category-trigger${categoryOpen ? ' is-open' : ''}`} aria-haspopup="listbox" aria-expanded={categoryOpen} onClick={() => setCategoryOpen((open) => !open)}>
                  <span className={draft.category ? '' : 'is-placeholder'}>{draft.category === 'PLLAKA' ? 'Pllaka' : draft.category === 'PANELE' ? 'Panele Dekoruese' : 'Zgjidhni kategorinë'}</span>
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                {categoryOpen && <div className="admin-category-menu" role="listbox" aria-label="Kategoria">
                  {([['PLLAKA', 'Pllaka'], ['PANELE', 'Panele Dekoruese']] as const).map(([value, label]) => <button key={value} type="button" role="option" aria-selected={draft.category === value} className={draft.category === value ? 'is-selected' : ''} onClick={() => { updateField(field, value); setCategoryOpen(false); }}><span>{label}</span><span className="admin-category-check" aria-hidden="true">{draft.category === value ? '✓' : ''}</span></button>)}
                </div>}
              </div> :
              section === 'contacts' && field.key === 'status' ? <select value={String(draft.status || 'NEW')} onChange={(event) => updateField(field, event.target.value)}>{['NEW','READ','REPLIED','CLOSED'].map((value) => <option key={value} value={value}>{value === 'NEW' ? 'I ri' : value === 'READ' ? 'Lexuar' : value === 'REPLIED' ? 'Përgjigjur' : 'Mbyllur'}</option>)}</select> :
                section === 'contacts' ? <input value={fieldValue(field, draft[field.key]) as string} readOnly /> :
                field.type === 'boolean' ? <input type="checkbox" checked={fieldValue(field, draft[field.key]) as boolean} onChange={(event) => updateField(field, event.target.checked)} /> :
                field.type === 'relation' ? <select required={field.required} value={fieldValue(field, draft[field.key]) as string} onChange={(event) => updateField(field, event.target.value)}><option value="">— Zgjidhni —</option>{(options[field.resource!] || []).map((item) => <option key={item.id} value={item.id}>{titleOf(item)} (#{item.id})</option>)}</select> :
                field.type === 'textarea' || field.type === 'json' ? <textarea rows={field.type === 'json' ? 5 : 4} value={fieldValue(field, draft[field.key]) as string} onChange={(event) => updateField(field, event.target.value)} /> :
                <input type={field.type === 'number' ? 'number' : 'text'} step={field.type === 'number' ? 'any' : undefined} required={field.required} value={fieldValue(field, draft[field.key]) as string} onChange={(event) => updateField(field, event.target.value)} />}
            </label>
          ))}
          {(section === 'projects' || section === 'materials') && <section className="admin-project-media">
            <h3>Fotografitë e {section === 'materials' ? 'materialit' : 'projektit'}</h3>
            <label className="admin-image-picker">{busy ? <><span className="admin-spinner" aria-hidden="true" /> Duke ngarkuar…</> : '+ Shto fotografi'}
              <input type="file" accept="image/*" multiple disabled={busy} onChange={(event) => { if (draft.id) void uploadProjectPhotos(event.target.files); else addPendingPhotos(event.target.files); event.target.value = ''; }} />
            </label>
            {!draft.id && pendingPhotos.length > 0 && <p>Fotografitë do të ngarkohen kur ta ruani.</p>}
            {Boolean(draft.id) && projectImagesLoading && <div className="admin-project-photo-loading" role="status"><span className="admin-spinner" aria-hidden="true" /> Duke ngarkuar fotografitë…</div>}
            {!projectImagesLoading && <div className="admin-project-photo-grid">
              {(draft.id ? projectImages : pendingPhotos).map((photo, index) => <div key={photo.id}
                className={`admin-project-photo${photoDropId === photo.id ? ' is-drop-target' : ''}${draft.id ? draggingId === photo.id ? ' is-dragging' : '' : pendingDragId === photo.id ? ' is-dragging' : ''}`}
                draggable={!busy}
                onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', String(photo.id)); if (draft.id) setDraggingId(Number(photo.id)); else setPendingDragId(String(photo.id)); }}
                onDragOver={(event) => { event.preventDefault(); setPhotoDropId(photo.id); }}
                onDrop={(event) => { event.preventDefault(); if (draft.id && draggingId != null) void reorderProjectImages(draggingId, Number(photo.id)); if (!draft.id && pendingDragId) reorderPendingPhotos(pendingDragId, String(photo.id)); setPhotoDropId(null); setDraggingId(null); setPendingDragId(null); }}
                onDragEnd={() => { setPhotoDropId(null); setDraggingId(null); setPendingDragId(null); }}>
                <Image src={isPendingPhoto(photo) ? photo.url : photo.secure_url} alt={`Fotografia ${index + 1}`} width={260} height={190} draggable={false} unoptimized={isPendingPhoto(photo)} />
                <span className="admin-hero-order">{index + 1}</span>
                <button className="admin-hero-remove" type="button" disabled={busy} aria-label={`Largo fotografinë ${index + 1}`} onClick={() => { if (isPendingPhoto(photo)) { URL.revokeObjectURL(photo.url); setPendingPhotos((current) => current.filter((item) => item.id !== photo.id)); } else void removeProjectImage(photo); }}>×</button>
              </div>)}
            </div>}
          </section>}
          {error && <p className="admin-error" role="alert">{error}</p>}
          {notice && <p className="admin-success" role="status">{notice}</p>}
          <div className="admin-editor-actions"><button type="button" onClick={closeEditor}>Anulo</button>{(section === 'projects' || section === 'materials') && Boolean(draft.id) && <button type="button" disabled={busy} onClick={() => void remove(draft as Row)}>Fshi {section === 'materials' ? 'materialin' : 'projektin'}</button>}<button type="submit" disabled={busy}>{busy ? 'Duke ruajtur…' : draft.id ? 'Ruaj ndryshimet' : `Krijo ${section === 'materials' ? 'materialin' : 'projektin'}`}</button></div>
        </form>
      </div></div>}
    </div>
  );
}
