import { NextResponse, type NextRequest } from 'next/server';
import { isLocale } from '@/lib/i18n';
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (request.headers.get('x-garnet-internal-rewrite') === '1') return NextResponse.next();
  if (pathname === '/sq' || pathname.startsWith('/sq/')) {
    const destination = request.nextUrl.clone();
    destination.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(destination, 308);
  }
  const headers = new Headers(request.headers);
  const segment = pathname.split('/')[1];
  headers.set('x-garnet-locale', isLocale(segment) ? segment : 'sq');
  if (pathname === '/' || ['projects', 'materials', 'archstudio', 'about', 'contact'].includes(segment)) {
    const destination = request.nextUrl.clone();
    destination.pathname = `/sq${pathname === '/' ? '' : pathname}`;
    headers.set('x-garnet-internal-rewrite', '1');
    return NextResponse.rewrite(destination, { request: { headers } });
  }
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ['/((?!api|_next|images|brand|fonts|favicon|icon|apple-icon|manifest|sitemap|robots|opengraph-image|twitter-image).*)'] };
