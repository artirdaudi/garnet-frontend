import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api-base';
type Context = { params: Promise<{ path: string[] }> };
async function forward(request: NextRequest, context: Context) {
  const token = request.cookies.get('garnet_admin_session')?.value;
  if (!token) return NextResponse.json({ error: 'Kyçuni për të vazhduar.' }, { status: 401 });
  if (request.method !== 'GET' && request.headers.get('origin') !== request.nextUrl.origin) return NextResponse.json({ error: 'Kërkesë e pavlefshme.' }, { status: 403 });
  const { path } = await context.params;
  if (!path.length || path.some((part) => !/^[a-zA-Z0-9-]+$/.test(part))) return NextResponse.json({ error: 'Rrugë e pavlefshme.' }, { status: 400 });
  try {
    const response = await apiFetch(`/api/v1/admin/${path.join('/')}${request.nextUrl.search}`, {
      method: request.method,
      headers: { Authorization: `Bearer ${token}`, ...(request.method !== 'GET' ? { 'Content-Type': request.headers.get('content-type') || 'application/json' } : {}) },
      body: request.method === 'GET' || request.method === 'DELETE' ? undefined : await request.text(),
    });
    return new NextResponse((await response.text()) || null, { status: response.status, headers: { 'Content-Type': response.headers.get('content-type') || 'application/json', 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'API nuk është i disponueshëm.' }, { status: 503 });
  }
}
export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;
