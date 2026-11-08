import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api-base';
const cookieName = 'garnet_admin_session';
export async function GET(request: NextRequest) {
  const token = request.cookies.get(cookieName)?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });
  try {
    const response = await apiFetch('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({ authenticated: true, user: await response.json() });
  } catch {
    return NextResponse.json({ error: 'API nuk është i disponueshëm.' }, { status: 503 });
  }
}
export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ error: 'Kërkesë e pavlefshme.' }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.username !== 'string' || typeof body.password !== 'string') return NextResponse.json({ error: 'Plotësoni përdoruesin dhe fjalëkalimin.' }, { status: 400 });
  try {
    const response = await apiFetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: body.username, password: body.password }) });
    if (!response.ok) return NextResponse.json({ error: 'Përdoruesi ose fjalëkalimi nuk është i saktë.' }, { status: 401 });
    const data = await response.json();
    if (typeof data.access_token !== 'string') throw new Error('Invalid token');
    const result = NextResponse.json({ authenticated: true });
    result.cookies.set(cookieName, data.access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/admin', maxAge: 60 * 60 * 8 });
    return result;
  } catch {
    return NextResponse.json({ error: 'Lidhja me API-n dështoi.' }, { status: 503 });
  }
}
export async function DELETE(request: NextRequest) {
  if (request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ error: 'Kërkesë e pavlefshme.' }, { status: 403 });
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(cookieName, '', { path: '/api/admin', maxAge: 0, httpOnly: true, sameSite: 'strict' });
  return response;
}
