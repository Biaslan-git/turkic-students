"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { GalleryPhoto } from "@/lib/gallery";
import { Lightbox } from "@/components/gallery/lightbox";

const ROWS = 3;
const SECONDS_PER_TILE = 3;

// Три ряда миниатюр едут в разные стороны: на экране сразу десятки фото, а высота блока
// фиксированная и не зависит от их числа. Ряд дублируется, чтобы прокрутка была бесшовной.
export function GalleryView({ photos }: { photos: GalleryPhoto[] }) {
  const t = useTranslations("Gallery");
  const tAlt = useTranslations("Alt");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const rows = Array.from({ length: ROWS }, (_, r) =>
    photos.map((photo, index) => ({ photo, index })).filter((_, i) => i % ROWS === r),
  ).map((row) => {
    // Короткий ряд растягиваем повтором, иначе в ленте будут пустые места.
    const filled = [...row];
    while (filled.length > 0 && filled.length < 10) filled.push(...row);
    return filled;
  });

  return (
    <>
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
              {[...row, ...row].map(({ photo, index }, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={t("openPhoto")}
                  className="relative h-24 w-32 flex-none overflow-hidden rounded-xl bg-border sm:h-28 sm:w-40"
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
              ))}
            </div>
          </div>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox photos={photos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}
