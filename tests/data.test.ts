import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { copy, locales } from '../src/lib/i18n';
import { getProjects, getMaterials, getCategories, getMaterialsForProject, getProjectsForMaterial } from '../src/lib/repository';
import { submitEnquiry } from '../src/lib/contact';
test('every UI entry and public record contains all supported translations', async () => {
  for (const [key, value] of Object.entries(copy)) for (const locale of locales) assert.ok(value[locale]?.trim(), `${key}/${locale}`);
  for (const project of await getProjects()) for (const locale of locales) {
    assert.ok(project.title[locale]);
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
  for (const entity of [...projects, ...materials]) for (const image of [entity.coverImage, ...entity.gallery]) assert.ok(image.url.startsWith('https://res.cloudinary.com/') || existsSync(`public${image.url}`), image.url);
});
test('enquiry sends the backend contact contract and reports delivery only after success', async () => {
  const original = globalThis.fetch;
  let received: Record<string, unknown> | undefined;
  globalThis.fetch = async (input, init) => {
    assert.equal(input, '/api/contact');
    assert.equal(init?.method, 'POST');
    received = JSON.parse(String(init?.body));
    return new Response('{"id":1,"status":"received"}', { status: 201 });
  };
  try {
    const result = await submitEnquiry({ name: 'Demo', phone: '', email: 'demo@example.com', subject: 'materials', message: 'A sample enquiry', locale: 'en', material: 'Apollo', materialId: '42' });
    assert.deepEqual(result, { sent: true });
    assert.equal(received?.related_material_id, 42);
    assert.equal(received?.inquiry_type, 'MATERIAL');
    globalThis.fetch = async () => new Response('{"detail":"Unavailable"}', { status: 503 });
    await assert.rejects(submitEnquiry({ name: 'Demo', phone: '', email: 'demo@example.com', subject: 'architecture', message: 'A sample enquiry', locale: 'sq' }));
  } finally {
    globalThis.fetch = original;
  }
});
