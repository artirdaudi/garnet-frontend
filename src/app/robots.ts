import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', ...(process.env.NEXT_PUBLIC_SITE_URL ? { allow: '/' } : { disallow: '/' }) },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
