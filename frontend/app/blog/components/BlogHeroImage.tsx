'use client';

import Image from 'next/image';

export default function BlogHeroImage({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      unoptimized
      sizes="(max-width: 990px) 100vw, 760px"
    />
  );
}
