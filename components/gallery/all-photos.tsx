"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import type { GalleryPhoto } from "@/lib/gallery";

export function AllPhotos({
  photos,
  onPick,
  onClose,
}: {
  photos: GalleryPhoto[];
  onPick: (index: number) => void;
  onClose: () => void;
}) {
  const t = useTranslations("Gallery");
  const tAlt = useTranslations("Alt");

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      // Пока поверх открыт Fancybox, Esc закрывает только его.
      if (event.key === "Escape" && !document.querySelector(".fancybox__container")) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // В портал: у секции с reveal-on-scroll есть transform, из-за него fixed считался бы от секции, а не от окна.
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={t("title")} className="fixed inset-0 z-[1000] flex flex-col bg-[#0b0b0e]">
      <div className="flex flex-none items-center justify-between gap-4 border-b border-white/10 px-5 py-3 text-white sm:px-8">
        <p className="font-display text-base font-bold">
          {t("title")} · {photos.length}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/30 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/10"
        >
          {t("close")}
        </button>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 auto-rows-[9rem] content-start gap-2 sm:auto-rows-[11rem] overflow-y-auto px-5 py-4 sm:grid-cols-3 sm:px-8 lg:grid-cols-4 xl:grid-cols-5">
        {photos.map((photo, index) => (
          <button
            key={photo.thumb}
            type="button"
            onClick={() => onPick(index)}
            aria-label={t("openPhoto")}
            className="relative h-full w-full overflow-hidden rounded-lg bg-white/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.thumb}
              alt={tAlt("galleryPhoto")}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 hover:scale-105"
            />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
