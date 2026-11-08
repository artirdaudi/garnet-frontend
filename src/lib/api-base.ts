export const API_BASE = (process.env.GARNET_API_URL || 'https://api.garnetstudio.mk').replace(/\/$/, '');
export function apiFetch(path: string, init?: RequestInit) {
  return fetch(`${API_BASE}${path}`, { cache: 'no-store', ...init });
}
