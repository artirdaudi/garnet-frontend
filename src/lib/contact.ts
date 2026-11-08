import type { ContactSubmission } from './types';
export async function submitEnquiry(input: ContactSubmission): Promise<{ sent: true }> {
  const inquiry_type = input.subject === 'interior' ? 'INTERIOR_DESIGN' : input.material || input.subject === 'materials' || input.subject === 'panels' ? 'MATERIAL' : input.subject === 'architecture' ? 'ARCHITECTURE' : 'GENERAL';
  const response = await fetch('/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: input.name.trim(), phone: input.phone.trim() || null, email: input.email.trim(),
      inquiry_type, subject: input.material ? `Material: ${input.material}` : input.subject,
      message: input.message.trim(), related_material_id: input.materialId ? Number(input.materialId) : null,
    }),
  });
  if (!response.ok) throw new Error('Dërgimi dështoi. Ju lutemi provoni përsëri.');
  return { sent: true };
}
