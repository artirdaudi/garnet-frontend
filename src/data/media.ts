import { l } from '@/lib/i18n';
import type { Media } from '@/lib/types';
function media(id: string, sq: string, mk: string, en: string, source: string): Media {
  return {
    id,
    url: `/images/${id}.jpg`,
    alt: l(sq, mk, en),
    width: 2000,
    height: 1333,
    source: `https://images.unsplash.com/photo-${source}`,
  };
}
export const images = {
  hero: media(
    'hero',
    'Interier bashkëkohor me tone të ngrohta dhe dritë natyrale',
    'Современ ентериер со топли тонови и природна светлина',
    'Contemporary interior with warm tones and natural light',
    '1600210492486-724fe5c67fb0',
  ),
  residence: media(
    'residence',
    'Hapësirë banimi me materiale natyrore',
    'Станбен простор со природни материјали',
    'Residential space with natural materials',
    '1600607687920-4e2a09cf159d',
  ),
  interior: media(
    'interior',
    'Dhomë ndenjjeje me kompozim të qetë',
    'Дневна соба со мирна композиција',
    'Living room with a quiet composition',
    '1600210491892-03d54c0aaf87',
  ),
  kitchen: media(
    'kitchen',
    'Kuzhinë moderne me sipërfaqe të çelëta',
    'Модерна кујна со светли површини',
    'Modern kitchen with pale surfaces',
    '1600585154340-be6161a56a0c',
  ),
  architecture: media(
    'architecture',
    'Arkitekturë banimi me hapje të mëdha',
    'Станбена архитектура со големи отвори',
    'Residential architecture with generous openings',
    '1600585154526-990dced4db0d',
  ),
  bathroom: media(
    'bathroom',
    'Sipërfaqe dhe detaje të një banjoje bashkëkohore',
    'Површини и детали во современа бања',
    'Surfaces and details in a contemporary bathroom',
    '1620626011761-996317b8d101',
  ),
  detail: media(
    'detail',
    'Materiale dhe detaje të një interieri',
    'Материјали и детали во ентериер',
    'Materials and details in an interior',
    '1600566753086-00f18fb6b3ea',
  ),
  showroom: media(
    'showroom',
    'Hapësirë ilustruese me sipërfaqe dhe materiale',
    'Илустративен простор со површини и материјали',
    'Illustrative space with surfaces and materials',
    '1600607687939-ce8a6c25118c',
  ),
  stone: media(
    'stone',
    'Teksturë guri me damarë natyrorë',
    'Камена текстура со природни жили',
    'Stone texture with natural veining',
    '1675934722871-521b9b7e906b',
  ),
  living: media(
    'living',
    'Hapësirë e hapur banimi me dritë natyrale',
    'Отворен станбен простор со природна светлина',
    'Open residential space with natural light',
    '1600047509807-ba8f99d2cdde',
  ),
  wood: media(
    'wood',
    'Teksturë druri me tone të ngrohta',
    'Дрвена текстура со топли тонови',
    'Wood texture in warm tones',
    '1675528030748-d463ab87e8d5',
  ),
  facade: media(
    'facade',
    'Forma dhe detaje arkitekturore të banimit',
    'Форми и архитектонски детали на дом',
    'Residential forms and architectural details',
    '1600607688969-a5bfcd646154',
  ),
};
