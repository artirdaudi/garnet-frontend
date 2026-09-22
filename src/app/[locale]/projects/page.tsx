import { routeLocale, type PageParams } from '@/lib/route';
import { metadata } from '@/lib/seo';
import { t } from '@/lib/i18n';
import { getProjects } from '@/lib/repository';
import { PageHeading, DemoNote, ContactCTA } from '@/components/ui';
import { ProjectArchive } from '@/components/archives';
export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  return metadata(locale, t(locale, 'projects'), 'projects', t(locale, 'projectIntro'));
}
export default async function ProjectsPage({ params }: PageParams) {
  const locale = await routeLocale(params);
  const projects = await getProjects();
  return (
    <>
      <PageHeading locale={locale} eyebrow={t(locale, 'projects')} title={t(locale, 'projects')} description={t(locale, 'projectIntro')} />
      <section className="archive wrap">
        <DemoNote locale={locale} />
        <ProjectArchive projects={projects} locale={locale} />
      </section>
      <ContactCTA locale={locale} />
    </>
  );
}
