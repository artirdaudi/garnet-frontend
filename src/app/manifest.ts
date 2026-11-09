import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Garnet — The Art of Tile',
    short_name: 'Garnet',
    description: 'Arkitekturë, dizajn interieri, pllaka dhe panele dekoruese në Tetovë.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f1eb',
    theme_color: '#5a1727',
    icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }],
  };
}
