'use client';
import { useState, type FormEvent } from 'react';
import type { Locale } from '@/lib/types';
import { t } from '@/lib/i18n';
import { submitEnquiry } from '@/lib/contact';
export function ContactForm({ locale, material }: { locale: Locale; material?: string }) {
  const [preview, setPreview] = useState(false);
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const data = new FormData(event.currentTarget);
    try {
      await submitEnquiry({
        name: String(data.get('name')),
        phone: String(data.get('phone')),
        email: String(data.get('email')),
        subject: String(data.get('subject')),
        message: String(data.get('message')),
        locale,
        material,
      });
      setPreview(true);
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <h2>{t(locale, 'enquiry')}</h2>
      {material && (
        <p className="enquiry-material">
          {t(locale, 'materials')}: {material}
        </p>
      )}
      <div className="form-fields" hidden={preview}>
        <div className="field-pair">
          <label>
            {t(locale, 'name')} *<input name="name" autoComplete="name" required maxLength={120} />
          </label>
          <label>
            {t(locale, 'phone')} <span>({t(locale, 'optional')})</span>
            <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
          </label>
        </div>
        <label>
          {t(locale, 'email')} *<input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label>
          {t(locale, 'subject')}
          <select name="subject" defaultValue={material ? 'materials' : 'architecture'}>
            {(['architecture', 'interior', 'materials', 'panels', 'other'] as const).map((key) => (
              <option key={key} value={key}>
                {t(locale, key)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t(locale, 'message')} *<textarea name="message" required rows={4} maxLength={5000} />
        </label>
        <p className="form-note">{t(locale, 'formNote')}</p>
        <button className="submit-button" type="submit" disabled={pending}>
          {pending ? '…' : t(locale, 'submit')} <span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="form-feedback" role="status" aria-live="polite">
        {preview && (
          <>
            <span className="feedback-mark" aria-hidden="true">
              ✓
            </span>
            <p>{t(locale, 'formSuccess')}</p>
            <button className="text-link" type="button" onClick={() => setPreview(false)}>
              {t(locale, 'edit')} ↗
            </button>
          </>
        )}
      </div>
    </form>
  );
}
