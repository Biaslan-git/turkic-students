import { getTranslations } from "next-intl/server";
import { GalleryView, type GalleryVariant } from "@/components/gallery/gallery-view";
import { Link } from "@/i18n/navigation";
import type { GalleryPhoto } from "@/lib/gallery";

const VARIANTS: { value: GalleryVariant; label: string }[] = [
  { value: "marquee", label: "1. Бегущая лента" },
  { value: "mosaic", label: "2. Мозаика" },
  { value: "combo", label: "3. Лента + все фото" },
];

export async function GallerySection({ photos, variant }: { photos: GalleryPhoto[]; variant: GalleryVariant }) {
  if (photos.length === 0) return null;

  const t = await getTranslations("Gallery");

  return (
    <section id="gallery" className="relative scroll-mt-20 bg-background">
      <div className="reveal-on-scroll mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
          <p className="text-pretty text-muted">{t("subtitle")}</p>
        </div>

        {/* Временный переключатель вариантов — убрать после выбора. */}
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map((v) => (
            <Link
              key={v.value}
              href={`/?gallery=${v.value}#gallery`}
              scroll={false}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                v.value === variant ? "border-accent-warm bg-accent-warm/10" : "border-border bg-background text-muted"
              }`}
            >
              {v.label}
            </Link>
          ))}
        </div>

        <GalleryView photos={photos} variant={variant} />
      </div>
    </section>
  );
}
