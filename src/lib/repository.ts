import { projects } from '@/data/projects';
import { materials } from '@/data/materials';
import { categories } from '@/data/categories';
// Async boundary: replace these implementations with validated FastAPI responses.
export async function getProjects() {
  return [...projects].sort((a, b) => a.displayOrder - b.displayOrder);
}
export async function getFeaturedProjects() {
  return (await getProjects()).filter((project) => project.featured);
}
export async function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
export async function getMaterials() {
  return materials.filter((material) => material.active);
}
export async function getMaterialBySlug(slug: string) {
  return (await getMaterials()).find((material) => material.slug === slug);
}
export async function getCategories() {
  return categories;
}
export async function getMaterialsForProject(id: string) {
  const project = projects.find((item) => item.id === id);
  return (await getMaterials()).filter((item) => project?.materialIds.includes(item.id));
}
export async function getProjectsForMaterial(id: string) {
  return (await getProjects()).filter((project) => project.materialIds.includes(id));
}
