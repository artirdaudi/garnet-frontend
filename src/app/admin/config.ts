export type Field = { key: string; label: string; type?: 'text' | 'number' | 'decimal' | 'textarea' | 'boolean' | 'relation' | 'json' | 'category' | 'currency'; required?: boolean; resource?: string };
export type Resource = { key: string; label: string; singular: string; fields: Field[]; group: 'content' | 'relations' | 'system' };
const f = (key: string, label: string, type: Field['type'] = 'text', required = false, resource?: string): Field => ({ key, label, type, required, resource });
const tri = (base: string, label: string, type: Field['type'] = 'text', required = false): Field[] => [
  f(base + '_sq', label + ' (shqip)', type, required),
  f(base + '_mk', label + ' (maqedonisht)', type, required),
  f(base + '_en', label + ' (anglisht)', type, required),
];
const order = f('display_order', 'Renditja', 'number');
const active = f('is_active', 'Aktiv / publikuar', 'boolean');

export const resources: Resource[] = [
  { key: 'projects', label: 'Projektet', singular: 'projekt', group: 'content', fields: [
    f('title', 'Titulli', 'text', true), f('location', 'Vendndodhja'),
    f('area_m2', 'Sipërfaqja (m²)', 'number'), f('description', 'Përshkrimi', 'textarea'),
  ] },
  { key: 'services', label: 'Shërbimet', singular: 'shërbim', group: 'content', fields: [
    f('slug', 'Slug', 'text', true), ...tri('name', 'Emri', 'text', true),
    ...tri('description', 'Përshkrimi', 'textarea'), active,
  ] },
  { key: 'materials', label: 'Materialet', singular: 'material', group: 'content', fields: [
    f('name', 'Emri', 'text', true), f('category', 'Kategoria', 'category', true),
    f('description', 'Përshkrimi', 'textarea'), f('color', 'Ngjyra'), f('dimensions', 'Dimensionet'),
    f('currency', 'Valuta', 'currency'), f('price', 'Çmimi', 'decimal'),
  ] },
  { key: 'pages', label: 'Faqet', singular: 'faqe', group: 'content', fields: [
    f('page_key', 'Çelësi i faqes', 'text', true), ...tri('title', 'Titulli'),
    ...tri('content', 'Përmbajtja', 'textarea'), active,
  ] },
  { key: 'page-sections', label: 'Seksionet e faqeve', singular: 'seksion', group: 'relations', fields: [
    f('page_id', 'Faqja', 'relation', true, 'pages'), f('section_key', 'Çelësi i seksionit', 'text', true),
    ...tri('title', 'Titulli'), ...tri('description', 'Përshkrimi', 'textarea'),
    f('media_id', 'Fotografia', 'relation', false, 'media'), active, order,
  ] },
  { key: 'project-images', label: 'Galeritë e projekteve', singular: 'fotografi', group: 'relations', fields: [
    f('project_id', 'Projekti', 'relation', true, 'projects'),
    f('cloudinary_public_id', 'Cloudinary ID', 'text', true),
    f('secure_url', 'URL', 'text', true), order,
  ] },
  { key: 'materials-images', label: 'Fotografitë e materialeve', singular: 'fotografi', group: 'relations', fields: [
    f('material_id', 'Materiali', 'relation', true, 'materials'),
    f('cloudinary_public_id', 'Cloudinary ID', 'text', true), f('secure_url', 'URL', 'text', true), order,
  ] },
  { key: 'showroom-images', label: 'Fotografitë e showroom-it', singular: 'fotografi', group: 'relations', fields: [
    f('media_id', 'Fotografia', 'relation', true, 'media'),
    ...tri('caption', 'Përshkrimi', 'textarea'), active, order,
  ] },
  { key: 'contacts', label: 'Mesazhet', singular: 'mesazh', group: 'system', fields: [
    f('status', 'Statusi'), f('name', 'Emri'), f('email', 'Email'),
    f('phone', 'Telefoni'), f('inquiry_type', 'Lloji'), f('subject', 'Subjekti'), f('message', 'Mesazhi', 'textarea'),
  ] },
  { key: 'settings', label: 'Të dhënat e biznesit', singular: 'konfigurim', group: 'system', fields: [
    f('company_name', 'Emri i kompanisë'), f('phone', 'Telefoni'), f('email', 'Email'),
    f('address', 'Adresa', 'textarea'), f('city', 'Qyteti'), f('country', 'Shteti'),
    f('latitude', 'Gjerësia gjeografike', 'number'), f('longitude', 'Gjatësia gjeografike', 'number'),
    f('instagram_url', 'Instagram'), f('facebook_url', 'Facebook'),
    f('opening_hours', 'Orari i punës (JSON)', 'json'),
  ] },
];
export const titleOf = (row: Record<string, unknown>) => String(row.title || row.title_sq || row.name_sq || row.name || row.original_filename || row.page_key || row.section_key || row.slug || row.email || `#${row.id}`);
