import { NextResponse, type NextRequest } from 'next/server';
import { isLocale } from '@/lib/i18n';
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const segment = request.nextUrl.pathname.split('/')[1];
  headers.set('x-garnet-locale', isLocale(segment) ? segment : 'sq');
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ['/((?!api|_next|images|brand|favicon|sitemap|robots).*)'] };
