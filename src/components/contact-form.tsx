'use client';

import { type FormEvent } from 'react';
import type { Locale } from '@/lib/types';

const copy = {
  sq: { title: 'Na shkruani drejtpërdrejt.', lead: 'Shkruani emrin dhe mesazhin. WhatsApp hapet me tekstin gati për t’ia dërguar Muhamedit.', name: 'Emri', message: 'Mesazhi', send: 'Vazhdoni në WhatsApp', hello: 'Përshëndetje, jam', regarding: 'Po ju shkruaj për materialin' },
  mk: { title: 'Пишете ни директно.', lead: 'Внесете го вашето име и порака. WhatsApp ќе се отвори со подготвена порака за Мухамед.', name: 'Име', message: 'Порака', send: 'Продолжете на WhatsApp', hello: 'Здраво, јас сум', regarding: 'Ви пишувам за материјалот' },
  en: { title: 'Write to us directly.', lead: 'Enter your name and message. WhatsApp opens with a message ready to send to Muhamed.', name: 'Name', message: 'Message', send: 'Continue to WhatsApp', hello: 'Hello, my name is', regarding: 'I am writing about the material' },
};

export function ContactForm({ locale, material }: { locale: Locale; material?: string; materialId?: string }) {
  const words = copy[locale];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !message) return;
    const text = `${words.hello} ${name}.\n${material ? `${words.regarding} ${material}.\n` : ''}\n${message}`;
    window.open(`https://wa.me/38970463112?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }
  return <form className="contact-form contact-whatsapp-form" onSubmit={submit}>
    <h2>{words.title}</h2><p>{words.lead}</p>
    {material && <p className="enquiry-material">{material}</p>}
    <label>{words.name}<input name="name" autoComplete="name" required maxLength={120} /></label>
    <label>{words.message}<textarea name="message" required rows={5} maxLength={3000} /></label>
    <button className="submit-button" type="submit"><span aria-hidden="true">◉</span>{words.send}</button>
  </form>;
}
