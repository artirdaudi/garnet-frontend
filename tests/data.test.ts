import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { copy, locales } from '../src/lib/i18n';
import { getProjects, getMaterials, getCategories, getMaterialsForProject, getProjectsForMaterial } from '../src/lib/repository';
import { submitEnquiry } from '../src/lib/contact';
test('every UI entry and public record contains all supported translations', async () => {
  for (const [key, value] of Object.entries(copy)) for (const locale of locales) assert.ok(value[locale]?.trim(), `${key}/${locale}`);
  for (const project of await getProjects()) for (const locale of locales) {
    assert.ok(project.title[locale] && project.description[locale] && project.coverImage.alt[locale]);
  }
});
test('catalogue relationships are valid and bidirectional', async () => {
  const projects = await getProjects(); const materials = await getMaterials(); const categories = await getCategories();
  assert.equal(new Set(projects.map(item => item.slug)).size, projects.length);
  assert.equal(new Set(materials.map(item => item.slug)).size, materials.length);
  for (const project of projects) {
    const related = await getMaterialsForProject(project.id);
    assert.equal(related.length, project.materialIds.length, `Dangling material on ${project.slug}`);
    for (const material of related) assert.ok((await getProjectsForMaterial(material.id)).some(item => item.id === project.id));
  }
  for (const material of materials) assert.ok(categories.some(category => category.slug === material.category));
  for (const entity of [...projects, ...materials]) for (const image of [entity.coverImage, ...entity.gallery]) assert.ok(existsSync(`public${image.url}`), image.url);
});
test('enquiry preview explicitly never reports delivery', async () => {
  const result = await submitEnquiry({ name: 'Demo', phone: '', email: 'demo@example.com', subject: 'architecture', message: 'A sample enquiry', locale: 'en' });
  assert.deepEqual(result, { mode: 'demo', sent: false });
  await assert.rejects(submitEnquiry({ name: '', phone: '', email: '', subject: '', message: '', locale: 'sq' }));
});
