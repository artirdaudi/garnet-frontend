import type { ContactSubmission } from './types';
// No network request and no persistence. Replace with a FastAPI POST when available.
export async function submitEnquiry(input: ContactSubmission): Promise<{ mode: 'demo'; sent: false }> {
  if (!input.name.trim() || !input.email.trim() || !input.message.trim()) throw new Error('Invalid enquiry');
  return { mode: 'demo', sent: false };
}
