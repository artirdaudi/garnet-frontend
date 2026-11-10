import Image from 'next/image';
import Link from 'next/link';
import { images } from '@/data/media';
import { team } from '@/data/site';
import { ScrollReveal } from '@/components/scroll-reveal';
import { localizedPath } from '@/lib/i18n';
import { getFeaturedProjects } from '@/lib/repository';
import { routeLocale, type PageParams } from '@/lib/route';
import { metadata, siteUrl } from '@/lib/seo';

const copy = {
  sq: {
    eyebrow: 'Studio arkitekture dhe dizajni interieri · Tetovë', title: 'Archstudio Garnet', lead: 'Ide të qarta, zgjidhje të menduara dhe vëmendje ndaj detajeve që i përdorni çdo ditë.', explore: 'Njihuni me studion',
    introLabel: 'Rreth studios', introTitle: 'Nga biseda e parë deri te detaji i fundit.', introOne: 'Archstudio Garnet është pjesa e Garnet që merret me arkitekturë dhe dizajn interieri. Punojmë me klientë që po ndërtojnë, po rinovojnë ose duan ta organizojnë më mirë shtëpinë apo biznesin e tyre.', introTwo: 'Nisim duke dëgjuar çfarë ju duhet, si e përdorni vendin dhe çfarë ju pëlqen. Më pas i kthejmë këto në një propozim të qartë, ku pamja dhe përdorimi i përditshëm ecin bashkë.',
    servicesLabel: 'Çfarë bëjmë', servicesTitle: 'Një ide e mirë duhet të funksionojë edhe në jetën e përditshme.', architecture: 'Arkitekturë', architectureText: 'Mendojmë organizimin e ndërtesës, qarkullimin, dritën dhe lidhjen e saj me vendin ku ndërtohet. Qëllimi është një projekt që i përgjigjet mënyrës suaj të jetesës ose punës.', interior: 'Dizajn interieri', interiorText: 'Planifikojmë ambientet e brendshme, nga ndarja dhe mobilimi te ndriçimi, ngjyrat dhe detajet. Çdo vendim duhet të ketë arsye dhe të ndihet natyrshëm kur jetoni aty.', materials: 'Materiale dhe detaje', materialsText: 'Pllakat, panelet dekoruese dhe sipërfaqet nuk i lëmë për në fund. I shohim si pjesë të projektit, që zgjedhjet të lidhen mirë me njëra-tjetrën.',
    processLabel: 'Si punojmë', processTitle: 'Bisedojmë. Propozojmë. Përsosim.', processOne: 'Së pari kuptojmë nevojat, buxhetin dhe atë që doni të arrini. Nuk ka nevojë të vini me një plan të gatshëm; mjafton të na tregoni çfarë keni në mendje.', processTwo: 'Pasi njohim kërkesën, zhvillojmë drejtimin e projektit dhe diskutojmë zgjedhjet bashkë. Ndryshimet bëhen me kohë, derisa zgjidhja të jetë e qartë për të gjithë.', processThree: 'Në vazhdim i kushtojmë kujdes detajeve që bëjnë dallimin gjatë realizimit. Ju mbajmë pjesë të vendimeve, nga pamja e përgjithshme deri te përzgjedhja e materialeve.',
    peopleLabel: 'Njerëzit pas studios', peopleTitle: 'Njihuni me arkitektët.', architect: 'Arkitekt', peopleText: 'Pas çdo projekti ka biseda, skica dhe shumë vendime të vogla. Muhamedi dhe Kushtrimi punojnë me klientët për t’i kthyer idetë në projekte të kuptueshme dhe të realizueshme.',
    workLabel: 'Punë të përzgjedhura', workTitle: 'Njihuni me punët e studios.', allWork: 'Shikoni të gjitha projektet', contactTitle: 'Keni një projekt në mendje?', contactText: 'Na tregoni çfarë po planifikoni. Biseda e parë na ndihmon të kuptojmë nga të fillojmë.', contact: 'Na kontaktoni', location: 'Tetovë, Maqedonia e Veriut',
  },
  mk: {
    eyebrow: 'Студио за архитектура и ентериер · Тетово', title: 'Archstudio Garnet', lead: 'Јасни идеи, промислени решенија и внимание на деталите што ги користите секој ден.', explore: 'Запознајте го студиото',
    introLabel: 'За студиото', introTitle: 'Од првиот разговор до последниот детаљ.', introOne: 'Archstudio Garnet е делот од Garnet посветен на архитектура и ентериер. Работиме со клиенти што градат, реновираат или сакаат подобро да го организираат својот дом или деловен простор.', introTwo: 'Почнуваме со слушање на вашите потреби, начинот на користење и она што ви се допаѓа. Потоа ги претвораме тие разговори во јасен предлог што ги поврзува изгледот и секојдневната употреба.',
    servicesLabel: 'Што работиме', servicesTitle: 'Добрата идеја треба да функционира и секој ден.', architecture: 'Архитектура', architectureText: 'Ги разгледуваме организацијата на објектот, движењето, светлината и неговата врска со локацијата.', interior: 'Ентериер', interiorText: 'Ги планираме внатрешните простории, од распоред и мебел до осветлување, бои и детали.', materials: 'Материјали и детали', materialsText: 'Плочките, декоративните панели и површините ги разгледуваме како составен дел од проектот.',
    processLabel: 'Како работиме', processTitle: 'Разговараме. Предлагаме. Усовршуваме.', processOne: 'Прво ги разбираме вашите потреби, буџетот и целта. Не мора да имате готов план.', processTwo: 'Потоа го развиваме правецот на проектот и заедно ги разгледуваме изборите.', processThree: 'На крај им посветуваме внимание на деталите важни за реализацијата и за изборот на материјали.',
    peopleLabel: 'Луѓето зад студиото', peopleTitle: 'Запознајте ги архитектите.', architect: 'Архитект', peopleText: 'Зад секој проект стојат разговори, скици и многу внимателни одлуки. Мухамед и Куштрим работат со клиентите за да ги претворат идеите во јасни проекти.',
    workLabel: 'Избрани проекти', workTitle: 'Погледнете ја работата на студиото.', allWork: 'Сите проекти', contactTitle: 'Имате проект на ум?', contactText: 'Кажете ни што планирате. Првиот разговор ни помага да одлучиме од каде да почнеме.', contact: 'Контактирајте нè', location: 'Тетово, Северна Македонија',
  },
  en: {
    eyebrow: 'Architecture and interior design studio · Tetovo', title: 'Archstudio Garnet', lead: 'Clear ideas, considered solutions and attention to the details you use every day.', explore: 'Meet the studio',
    introLabel: 'About the studio', introTitle: 'From the first conversation to the final detail.', introOne: 'Archstudio Garnet is the architecture and interior design part of Garnet. We work with people building, renovating or rethinking a home or business.', introTwo: 'We begin by listening to what you need, how you use the place and what you like. Then we turn those conversations into a clear proposal that brings appearance and daily use together.',
    servicesLabel: 'What we do', servicesTitle: 'A good idea should work in everyday life.', architecture: 'Architecture', architectureText: 'We consider the building layout, movement, daylight and connection to its surroundings.', interior: 'Interior design', interiorText: 'We plan interiors from layout and furnishings to lighting, colours and details.', materials: 'Materials and details', materialsText: 'Tiles, decorative panels and surfaces are considered as part of the project from the beginning.',
    processLabel: 'How we work', processTitle: 'Listen. Propose. Refine.', processOne: 'First we understand your needs, budget and goals. You do not need to arrive with a finished plan.', processTwo: 'We then develop the project direction and discuss the choices together.', processThree: 'We pay attention to the details that matter during implementation and material selection.',
    peopleLabel: 'The people behind the studio', peopleTitle: 'Meet the architects.', architect: 'Architect', peopleText: 'Every project involves conversations, sketches and many small decisions. Muhamed and Kushtrim work with clients to turn ideas into clear, practical plans.',
    workLabel: 'Selected work', workTitle: 'Explore the studio’s work.', allWork: 'See all projects', contactTitle: 'Have a project in mind?', contactText: 'Tell us what you are planning. The first conversation helps us find a starting point.', contact: 'Contact us', location: 'Tetovo, North Macedonia',
  },
};

export async function generateMetadata({ params }: PageParams) {
  const locale = await routeLocale(params);
  const words = copy[locale];
  return metadata(locale, words.title, 'archstudio', `${words.introOne} ${words.introTwo}`, images.architecture.url);
}

export default async function StudioPage({ params }: PageParams) {
  const locale = await routeLocale(params);
  const words = copy[locale];
  const projects = await getFeaturedProjects();
  const path = (value: string) => localizedPath(locale, value);
  const schema = { '@context': 'https://schema.org', '@type': 'AboutPage', name: words.title, description: words.introOne, url: `${siteUrl}${path('archstudio')}`, inLanguage: locale, about: { '@type': 'Organization', name: 'Archstudio Garnet', address: { '@type': 'PostalAddress', addressLocality: 'Tetovo', addressCountry: 'MK' }, employee: team.map((person) => ({ '@type': 'Person', name: person.name, jobTitle: words.architect })) } };
  return <div className="studio-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <header className="studio-page-hero"><Image src={images.architecture.url} alt={images.architecture.alt[locale]} fill priority sizes="100vw" /><div className="studio-page-hero-shade" /><div className="wrap studio-page-hero-copy"><p>{words.eyebrow}</p><h1>{words.title}</h1><span>{words.lead}</span><a href="#studio-intro">{words.explore}</a></div></header>
    <section className="studio-intro wrap" id="studio-intro"><ScrollReveal><p className="studio-kicker">{words.introLabel}</p><h2>{words.introTitle}</h2></ScrollReveal><ScrollReveal className="studio-intro-text"><p>{words.introOne}</p><p>{words.introTwo}</p></ScrollReveal></section>
    <section className="studio-page-services"><div className="wrap"><ScrollReveal><p className="studio-kicker">{words.servicesLabel}</p><h2>{words.servicesTitle}</h2></ScrollReveal><div className="studio-service-grid">{([[words.architecture, words.architectureText], [words.interior, words.interiorText], [words.materials, words.materialsText]] as const).map(([title, body], index) => <ScrollReveal className="studio-service" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></ScrollReveal>)}</div></div></section>
    <section className="studio-process wrap"><ScrollReveal className="studio-process-image"><Image src={images.interior.url} alt={images.interior.alt[locale]} fill sizes="(max-width: 760px) 100vw, 48vw" /></ScrollReveal><div><ScrollReveal><p className="studio-kicker">{words.processLabel}</p><h2>{words.processTitle}</h2></ScrollReveal><ScrollReveal className="studio-process-copy"><p>{words.processOne}</p><p>{words.processTwo}</p><p>{words.processThree}</p></ScrollReveal></div></section>
    <section className="studio-people"><div className="wrap studio-people-inner"><ScrollReveal><p className="studio-kicker">{words.peopleLabel}</p><h2>{words.peopleTitle}</h2><p>{words.peopleText}</p></ScrollReveal><div className="studio-people-list">{team.map((person) => <ScrollReveal key={person.id} className="studio-person"><span>{person.initials}</span><div><h3>{person.name}</h3><p>{words.architect}</p></div></ScrollReveal>)}</div></div></section>
    {projects.length > 0 && <section className="studio-work wrap"><ScrollReveal><p className="studio-kicker">{words.workLabel}</p><h2>{words.workTitle}</h2></ScrollReveal><div className="studio-work-grid">{projects.slice(0, 2).map((project) => <ScrollReveal key={project.id}><Link href={path(`projects/${project.slug}`)} className="studio-work-card"><Image src={project.coverImage.url} alt={project.coverImage.alt[locale] || project.title[locale]} fill sizes="(max-width: 760px) 100vw, 50vw" /><span>{project.title[locale]}</span></Link></ScrollReveal>)}</div><Link className="studio-text-link" href={path('projects')}>{words.allWork}</Link></section>}
    <section className="studio-contact"><ScrollReveal className="wrap"><p className="studio-kicker">{words.location}</p><h2>{words.contactTitle}</h2><p>{words.contactText}</p><Link href={path('contact')}>{words.contact}</Link></ScrollReveal></section>
  </div>;
}
