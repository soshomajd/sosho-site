import Image from "next/image";

import { blogCardImage } from "@/app/image-variants";

/**
 * Article cover inside a card. Phones get the small WebP when it exists; larger screens keep the original.
 * The parent must be a positioned box with a fixed aspect ratio (the image fills it).
 */
export default function BlogCardCover({
  src,
  alt,
  sizes,
  priority = false,
  className = "object-cover",
}: {
  src: string;
  alt: string;
  sizes: string;
  /** First card of a page: load eagerly and preload the variant the screen will actually use. */
  priority?: boolean;
  className?: string;
}) {
  const card = blogCardImage(src);
  return (
    <>
      {priority ? (
        <>
          <link rel="preload" as="image" href={card ?? src} media="(max-width: 767px)" fetchPriority="high" />
          <link rel="preload" as="image" href={src} media="(min-width: 768px)" fetchPriority="high" />
        </>
      ) : null}
      <picture>
        {card ? <source media="(max-width: 767px)" srcSet={card} type="image/webp" /> : null}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : "lazy"}
          className={className}
        />
      </picture>
    </>
  );
}
