import { l } from '@/lib/i18n';
import type { Category } from '@/lib/types';
import { images } from './media';
export const categories: Category[] = [
  {
    slug: 'tiles',
    title: l('Pllaka qeramike & porcelani', 'Керамички и порцелански плочки', 'Ceramic & porcelain tiles'),
    description: l(
      'Ritëm, nuancë dhe qëndrueshmëri për hapësirat e përditshme.',
      'Ритам, нијанса и трајност за секојдневните простори.',
      'Rhythm, tone and durability for everyday spaces.',
    ),
    image: images.bathroom,
  },
  {
    slug: 'panels',
    title: l('Panele dekorative', 'Декоративни панели', 'Decorative panels'),
    description: l(
      'Thellësi dhe teksturë në çdo sipërfaqe vertikale.',
      'Длабочина и текстура на секоја вертикална површина.',
      'Depth and texture for every vertical surface.',
    ),
    image: images.wood,
  },
  {
    slug: 'surfaces',
    title: l('Sipërfaqe të formatit të madh', 'Површини со голем формат', 'Large format surfaces'),
    description: l(
      'Vazhdimësi vizuale. Një gjuhë e pastër materialesh.',
      'Визуелен континуитет. Чист јазик на материјали.',
      'Visual continuity. A pure material language.',
    ),
    image: images.stone,
  },
];
