import Image from "next/image";
import { getTranslations } from "next-intl/server";

export async function GallerySection({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  const [t, tAlt] = await Promise.all([getTranslations("Gallery"), getTranslations("Alt")]);

  return (
    <section id="gallery" className="relative scroll-mt-20 bg-background">
      <div className="reveal-on-scroll mx-auto flex max-w-5xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-pretty text-muted">{t("subtitle")}</p>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
          {photos.map((src) => (
            <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-border">
              <Image
                src={src}
                alt={tAlt("galleryPhoto")}
                fill
                loading="lazy"
                sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
