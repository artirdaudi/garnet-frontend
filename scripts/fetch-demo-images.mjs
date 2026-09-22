// Temporary editorial imagery, centrally sourced and cached locally for a dependable demo.
import { mkdir, writeFile } from 'node:fs/promises';
export const sources = {
  hero: 'photo-1600210492486-724fe5c67fb0',
  residence: 'photo-1600607687920-4e2a09cf159d',
  interior: 'photo-1600210491892-03d54c0aaf87',
  kitchen: 'photo-1600585154340-be6161a56a0c',
  architecture: 'photo-1600585154526-990dced4db0d',
  bathroom: 'photo-1620626011761-996317b8d101',
  detail: 'photo-1600566753086-00f18fb6b3ea',
  showroom: 'photo-1600607687939-ce8a6c25118c',
  stone: 'photo-1675934722871-521b9b7e906b',
  living: 'photo-1600047509807-ba8f99d2cdde',
  wood: 'photo-1675528030748-d463ab87e8d5',
  facade: 'photo-1600607688969-a5bfcd646154',
};
await mkdir('public/images', { recursive: true });
await Promise.all(
  Object.entries(sources).map(async ([name, id]) => {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=85`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${name}: ${response.status}`);
    await writeFile(`public/images/${name}.jpg`, Buffer.from(await response.arrayBuffer()));
    console.log(`Saved ${name}`);
  }),
);
