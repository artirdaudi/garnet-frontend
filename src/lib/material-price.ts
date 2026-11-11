import type { Locale, Material } from './types';

export function materialPrice(material: Material, locale: Locale): string | null {
  if (material.price == null || !material.currency) return null;
  const value = Number(material.price);
  if (!Number.isFinite(value) || value < 0) return null;
  const formatted = new Intl.NumberFormat({ sq: 'sq-AL', mk: 'mk-MK', en: 'en-GB' }[locale], {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
  return material.currency === 'MKD' ? `${formatted} den` : `${formatted} €`;
}
