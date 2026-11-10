import type { Localized, Material, Media } from '@/lib/types';

const localized = (sq: string, mk: string, en: string): Localized => ({ sq, mk, en });
const image = (id: string, url: string, alt: string): Media => ({ id, url, alt: localized(alt, alt, alt), width: 1600, height: 1100 });

function example(id: string, category: 'tiles' | 'panels', name: string, photo: Media, color: Localized, size: string, description: Localized): Material {
  return {
    id: `demo-${id}`, slug: `demo-${id}`, name, category,
    categoryTitle: category === 'tiles' ? localized('Pllaka', 'Плочки', 'Tiles') : localized('Panele Dekoruese', 'Декоративни панели', 'Decorative Panels'),
    description, coverImage: photo, gallery: [photo, image(`${id}-detail`, category === 'tiles' ? '/images/stone.jpg' : '/images/wood.jpg', `Pamje tjetër e materialit ${name}`)],
    attributes: { finish: localized('', '', ''), size, application: localized('', '', ''), color },
    featured: false, isNew: false, active: true, isDemo: true,
  };
}

const tiles: Material[] = [
  example('travertino', 'tiles', 'Travertino', image('demo-travertino', '/images/materials-tiles-editorial.jpg', 'Pllaka me pamje travertini në një interier'), localized('Bezhë', 'Беж', 'Beige'), '120 × 60 cm', localized('Shembull i një pllake me pamje guri dhe tone të ngrohta.', 'Пример за плочка со изглед на камен и топли тонови.', 'Example tile with a stone look and warm tones.')),
  example('calacatta', 'tiles', 'Calacatta', image('demo-calacatta', '/images/stone.jpg', 'Sipërfaqe pllake me damarë të lehtë'), localized('E bardhë', 'Бела', 'White'), '120 × 120 cm', localized('Shembull i një pllake të çelët me damarë të butë.', 'Пример за светла плочка со нежни шари.', 'Example light tile with subtle veining.')),
  example('terra', 'tiles', 'Terra', image('demo-terra', '/images/tiles-hero.jpg', 'Pllaka në tone balte dhe guri'), localized('Terrakotë', 'Теракота', 'Terracotta'), '60 × 60 cm', localized('Shembull i një pllake në tone të tokës.', 'Пример за плочка во земјени тонови.', 'Example tile in earthy tones.')),
  example('marmo', 'tiles', 'Marmo', image('demo-marmo', '/images/bathroom.jpg', 'Pllaka në një ambient banjoje'), localized('Gri', 'Сива', 'Grey'), '60 × 120 cm', localized('Shembull i një pllake për një pamje të qetë dhe bashkëkohore.', 'Пример за плочка со мирен и современ изглед.', 'Example tile for a calm contemporary look.')),
];

const panels: Material[] = [
  example('linea-oak', 'panels', 'Linea Oak', image('demo-linea-oak', '/images/materials-panels-editorial.jpg', 'Panele dekoruese vertikale me pamje druri'), localized('Lis', 'Даб', 'Oak'), '280 × 60 cm', localized('Shembull paneli me vija vertikale dhe ngrohtësi druri.', 'Пример панел со вертикални линии и топлина на дрво.', 'Example panel with vertical lines and the warmth of wood.')),
  example('walnut', 'panels', 'Walnut', image('demo-walnut', '/images/wood.jpg', 'Detaj i panelit dekorues me pamje druri'), localized('Arrë', 'Орев', 'Walnut'), '260 × 60 cm', localized('Shembull paneli dekorues në ton të thellë druri.', 'Пример декоративен панел во длабок тон на дрво.', 'Example decorative panel in a deep wood tone.')),
  example('natural', 'panels', 'Natural', image('demo-natural', '/images/demo-panel-oak.jpg', 'Panele dekoruese me pamje lisi të çelët'), localized('Natyrale', 'Природна', 'Natural'), '280 × 40 cm', localized('Shembull paneli për një pamje të lehtë dhe natyrale.', 'Пример панел за лесен и природен изглед.', 'Example panel for a light, natural look.')),
  example('studio', 'panels', 'Studio', image('demo-studio', '/images/demo-panel-mineral.jpg', 'Panele dekoruese me reliev mineral'), localized('Rërë', 'Песок', 'Sand'), '240 × 60 cm', localized('Shembull paneli dekorues me reliev për një theks të ngrohtë në mur.', 'Пример декоративен панел со релјеф за топол акцент на ѕидот.', 'Example decorative relief panel for a warm wall accent.')),
];

export function demoMaterialsFor(category: string): Material[] {
  return category === 'tiles' ? tiles : panels;
}
