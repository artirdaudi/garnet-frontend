import Image from 'next/image';
import type { Locale, Media } from '@/lib/types';
export function Picture({
  media,
  locale,
  className = '',
  priority = false,
  sizes = '(max-width: 700px) 100vw, 60vw',
}: {
  media: Media;
  locale: Locale;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`picture ${className}`}>
      <Image src={media.url} alt={media.alt[locale]} fill sizes={sizes} priority={priority} />
    </div>
  );
}
