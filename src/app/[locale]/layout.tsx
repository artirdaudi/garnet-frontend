import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className="public-site">
      <Header locale={locale} />
      <main id="main">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
