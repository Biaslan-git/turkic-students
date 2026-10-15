"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { GalleryPhoto } from "@/lib/gallery";
import { Lightbox } from "@/components/gallery/lightbox";

export type GalleryVariant = "marquee" | "mosaic" | "combo";

const ROWS = 3;
const MOSAIC_STEP = 24; // кратно 4, 6 и 8 колонкам — последний ряд не остаётся неполным
const SECONDS_PER_TILE = 3;

function Thumb({ photo, className, onOpen }: { photo: GalleryPhoto; className: string; onOpen: () => void }) {
  const t = useTranslations("Gallery");
  const tAlt = useTranslations("Alt");
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={t("openPhoto")}
      className={`relative overflow-hidden bg-border ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.thumb}
        alt={tAlt("galleryPhoto")}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </button>
  );
}

// Три ряда миниатюр едут в разные стороны: на экране сразу десятки фото, а высота блока
// фиксированная и не зависит от их числа. Ряд дублируется, чтобы прокрутка была бесшовной.
function Marquee({ photos, onOpen }: { photos: GalleryPhoto[]; onOpen: (photo: GalleryPhoto) => void }) {
  const rows = Array.from({ length: ROWS }, (_, r) => photos.filter((_, i) => i % ROWS === r)).map((row) => {
    // Короткий ряд растягиваем повтором, иначе в ленте будут пустые места.
    const filled = [...row];
    while (filled.length > 0 && filled.length < 10) filled.push(...row);
    return filled;
  });

  return (
    <div className="flex flex-col gap-2 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      {rows.map((row, r) => (
        <div key={r} className="group overflow-hidden motion-reduce:overflow-x-auto">
          <div
            className="flex w-max gap-2 [animation:gallery-marquee_linear_infinite] group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused] motion-reduce:animate-none"
            style={{
              animationDuration: `${row.length * SECONDS_PER_TILE}s`,
              animationDirection: r % 2 === 1 ? "reverse" : "normal",
            }}
          >
            {[...row, ...row].map((photo, i) => (
              <Thumb
                key={i}
                photo={photo}
                onOpen={() => onOpen(photo)}
                className="h-24 w-32 flex-none rounded-xl sm:h-28 sm:w-40"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Mosaic({
  photos,
  onOpen,
  pageSize = MOSAIC_STEP,
}: {
  photos: GalleryPhoto[];
  onOpen: (photo: GalleryPhoto) => void;
  pageSize?: number;
}) {
  const t = useTranslations("Gallery");
  const [visible, setVisible] = useState(pageSize);
  const remaining = photos.length - visible;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="grid w-full grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8">
        {photos.slice(0, visible).map((photo, i) => (
          <Thumb key={`${photo.full}-${i}`} photo={photo} onOpen={() => onOpen(photo)} className="aspect-square rounded-lg" />
        ))}
      </div>
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + pageSize)}
          className="rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold transition-colors hover:border-accent-warm"
        >
          {t("showMore")} ({remaining})
        </button>
      )}
    </div>
  );
}

function AllPhotosOverlay({
  photos,
  onOpen,
  onClose,
}: {
  photos: GalleryPhoto[];
  onOpen: (photo: GalleryPhoto) => void;
  onClose: () => void;
}) {
  const t = useTranslations("Gallery");
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-8">
        <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between bg-background/90 px-4 py-2 backdrop-blur sm:-mx-8 sm:px-8">
          <h3 className="font-display text-xl font-bold">{t("title")}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold"
          >
            {t("close")}
          </button>
        </div>
        <Mosaic photos={photos} onOpen={onOpen} pageSize={48} />
      </div>
    </div>
  );
}

export function GalleryView({ photos, variant }: { photos: GalleryPhoto[]; variant: GalleryVariant }) {
  const t = useTranslations("Gallery");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  // Лайтбокс листает общий список, а плитки в бегущих рядах повторяются — ищем индекс по ссылке.
  const open = (photo: GalleryPhoto) => setOpenIndex(Math.max(0, photos.findIndex((p) => p.full === photo.full)));

  return (
    <>
      {variant === "mosaic" ? (
        <Mosaic photos={photos} onOpen={open} />
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div className="w-full">
            <Marquee photos={photos} onOpen={open} />
          </div>
          {variant === "combo" && (
            <button
              type="button"
              onClick={() => setAllOpen(true)}
              className="rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold transition-colors hover:border-accent-warm"
            >
              {t("allPhotos")} ({photos.length})
            </button>
          )}
        </div>
      )}

      {allOpen && <AllPhotosOverlay photos={photos} onOpen={open} onClose={() => setAllOpen(false)} />}
      {openIndex !== null && (
        <Lightbox photos={photos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
