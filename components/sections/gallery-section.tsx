import { getTranslations } from "next-intl/server";
import { GalleryView } from "@/components/gallery/gallery-view";
import type { GalleryPhoto } from "@/lib/gallery";

export async function GallerySection({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) return null;

  const t = await getTranslations("Gallery");

  return (
    <section id="gallery" className="relative scroll-mt-20 bg-background">
      <div className="reveal-on-scroll mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="text-pretty text-muted">{t("subtitle")}</p>
        </div>

        <GalleryView photos={photos} />
      </div>
    </section>
  );
}
