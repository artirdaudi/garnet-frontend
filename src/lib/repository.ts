import { cache } from 'react';
import { apiFetch } from './api-base';
import type { Category, Localized, Material, MaterialCategory, Media, Project, ProjectCategory } from './types';
import { images } from '@/data/media';
import { site } from '@/data/site';

type Raw = Record<string, unknown>;
type Page = { items: Raw[]; total: number };
const obj = (x: unknown): Raw => x && typeof x === 'object' ? x as Raw : {};
const str = (x: Raw, k: string) => String(x[k] ?? '');
const loc = (x: Raw, k: string): Localized => ({ sq: str(x, k + '_sq'), mk: str(x, k + '_mk') || str(x, k + '_sq'), en: str(x, k + '_en') || str(x, k + '_sq') });
const same = (x: string): Localized => ({ sq: x, mk: x, en: x });
function photo(x: unknown, fallback: Media, title = ''): Media {
  const item = obj(x);
  if (typeof item.secure_url !== 'string' || !item.secure_url.startsWith('https://res.cloudinary.com/')) return fallback;
  const alt = loc(item, 'alt');
  return { id: String(item.id), url: item.secure_url, alt: { sq: alt.sq || title, mk: alt.mk || title, en: alt.en || title }, width: Number(item.width) || 1600, height: Number(item.height) || 1000 };
}
async function read<T>(path: string): Promise<T> {
  const response = await apiFetch(path);
  if (!response.ok) throw new Error(`Garnet API ${response.status}: ${path}`);
  return response.json() as Promise<T>;
}
async function all(resource: string): Promise<Raw[]> {
  const first = await read<Page>(`/api/v1/${resource}?page=1&page_size=100`);
  const rows = [...first.items];
  for (let page = 2; rows.length < first.total; page++) {
    const next = await read<Page>(`/api/v1/${resource}?page=${page}&page_size=100`);
    if (!next.items.length) break;
    rows.push(...next.items);
  }
  return rows;
}
const projectKind = (s: string): ProjectCategory => s;
const typologyKind = (s: string): Project['use'] => {
  const value = s.toLowerCase();
  if (['banimi', 'residential'].includes(value)) return 'residential';
  if (['komercial', 'commercial'].includes(value)) return 'commercial';
  return s;
};
const materialKind = (s: string): MaterialCategory => s || 'surfaces';

function asProject(raw: Raw, detail = false): Project {
  const title = str(raw, 'title');
  const cover = photo(raw.cover_media, images.architecture, title);
  const gallery = detail && Array.isArray(raw.images) ? raw.images.map(obj) : [];
  return {
    id: String(raw.id), slug: String(raw.id), title: same(str(raw, 'title')),
    category: projectKind(''), categoryTitle: undefined, use: typologyKind(''),
    location: same(str(raw, 'location')), year: 0,
    status: same(''), area: raw.area_m2 ? `${raw.area_m2} m²` : '',
    services: [],
    description: same(str(raw, 'description')), coverImage: cover,
    gallery: gallery.map((x) => photo(x, cover, title)),
    materialIds: [],
    featured: true, displayOrder: Number(raw.id) || 0, isDemo: false,
  };
}
function asMaterial(raw: Raw, detail = false): Material {
  const isPanel = raw.category === 'PANELE';
  const name = str(raw, 'name');
  const cover = photo(raw.cover_media, isPanel ? images.wood : images.bathroom, name);
  const gallery = detail && Array.isArray(raw.images) ? raw.images.map(obj) : [];
  return {
    id: String(raw.id), slug: String(raw.id), name: str(raw, 'name'),
    price: raw.price == null ? null : String(raw.price),
    currency: raw.currency === 'MKD' || raw.currency === 'EUR' ? raw.currency : null,
    category: materialKind(isPanel ? 'panels' : 'tiles'), categoryTitle: isPanel
      ? { sq: 'Panele Dekoruese', mk: 'Декоративни панели', en: 'Decorative Panels' }
      : { sq: 'Pllaka', mk: 'Плочки', en: 'Tiles' },
    description: same(str(raw, 'description')), coverImage: cover, gallery: gallery.map((x) => photo(x, cover, name)),
    attributes: { finish: same(''), size: str(raw, 'dimensions'), application: same(''), color: same(str(raw, 'color')) },
    featured: false, isNew: false, active: true, isDemo: false,
  };
}
export const getProjects = cache(async () => {
  const rows = await all('projects');
  return rows.map((x) => asProject(x));
});
export const getProjectsPage = cache(async (page: number, pageSize = 10) => {
  const result = await read<Page>(`/api/v1/projects?page=${page}&page_size=${pageSize}`);
  return { projects: result.items.map((item) => asProject(item)), total: result.total };
});
export async function getFeaturedProjects() { return (await getProjects()).filter((x) => x.featured); }
export async function getHeroImages(): Promise<Media[]> {
  try {
    const rows = await read<unknown>('/api/v1/hero-images');
    if (!Array.isArray(rows)) return [];
    return rows.map(obj).filter((row) => typeof row.secure_url === 'string' && row.secure_url.startsWith('https://res.cloudinary.com/')).map((row) => ({
      id: String(row.id),
      url: String(row.secure_url),
      alt: { sq: 'Fotografi e Garnet', mk: 'Фотографија на Гарнет', en: 'Garnet photograph' },
      width: 1600,
      height: 1000,
    }));
  } catch {
    return [];
  }
}
export async function getProjectBySlug(slug: string) {
  const response = await apiFetch(`/api/v1/projects/${encodeURIComponent(slug)}`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error('Project API unavailable');
  return asProject(await response.json(), true);
}
export const getMaterials = cache(async () => (await all('materials')).map((x) => asMaterial(x)));
export async function getMaterialBySlug(slug: string) {
  const response = await apiFetch(`/api/v1/materials/${encodeURIComponent(slug)}`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error('Material API unavailable');
  return asMaterial(await response.json(), true);
}
export const getCategories = cache(async (): Promise<Category[]> => [
  { slug: 'tiles', title: { sq: 'Pllaka', mk: 'Плочки', en: 'Tiles' }, description: { sq: 'Shikoni përzgjedhjen e pllakave Garnet për shtëpi dhe biznese në Tetovë.', mk: 'Погледнете го изборот на плочки Garnet за домови и деловни простори во Тетово.', en: 'Explore Garnet tiles for homes and businesses in Tetovo.' }, image: { id: 'tiles-hero', url: '/images/tiles-hero.jpg', alt: { sq: 'Pllaka porcelani në tone të ngrohta', mk: 'Порцелански плочки во топли тонови', en: 'Porcelain tiles in warm tones' }, width: 1672, height: 941 } },
  { slug: 'panels', title: { sq: 'Panele Dekoruese', mk: 'Декоративни панели', en: 'Decorative Panels' }, description: { sq: 'Shikoni panelet dekoruese Garnet për mure dhe interierë në Tetovë.', mk: 'Погледнете ги декоративните панели Garnet за ѕидови и ентериери во Тетово.', en: 'Explore Garnet decorative panels for walls and interiors in Tetovo.' }, image: images.wood },
]);
export async function getMaterialsForProject(id: string): Promise<Material[]> {
  void id;
  return [];
}
export async function getProjectsForMaterial(id: string): Promise<Project[]> {
  void id;
  return [];
}
export const getSiteSettings = cache(async () => {
  const row = await read<Raw>('/api/v1/settings');
  const address = str(row, 'address') || site.address;
  const city = str(row, 'city') || 'Tetovë';
  const instagram = str(row, 'instagram_url') || site.instagram;
  const facebook = str(row, 'facebook_url') || site.facebook;
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);
  return {
    address, city, instagram, facebook, instagramHandle: instagram === site.instagram ? site.instagramHandle : '@' + instagram.split('/').filter(Boolean).at(-1),
    directions: Number.isFinite(latitude) && Number.isFinite(longitude) && row.latitude != null && row.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ' ' + city)}`,
    email: str(row, 'email'), phone: str(row, 'phone'),
  };
});
export async function getPageContent(key: string) {
  const response = await apiFetch(`/api/v1/pages/${encodeURIComponent(key)}`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error('Page content API unavailable');
  const row = await response.json() as Raw;
  return {
    title: loc(row, 'title'), content: loc(row, 'content'),
    sections: (Array.isArray(row.sections) ? row.sections : []).map((entry) => {
      const section = obj(entry);
      return { key: str(section, 'section_key'), title: loc(section, 'title'), description: loc(section, 'description'), media: section.media };
    }),
  };
}
export const getServices = cache(async () => (await read<Raw[]>('/api/v1/services')).map((row) => ({
  id: String(row.id), slug: str(row, 'slug'), name: loc(row, 'name'), description: loc(row, 'description'),
})));
export const toMedia = photo;
