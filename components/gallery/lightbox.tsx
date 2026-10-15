"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { GalleryPhoto } from "@/lib/gallery";

export function Lightbox({
  photos,
  index,
  onChange,
  onClose,
}: {
  photos: GalleryPhoto[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const t = useTranslations("Gallery");
  const tAlt = useTranslations("Alt");
  const count = photos.length;
  const prev = () => onChange((index - 1 + count) % count);
  const next = () => onChange((index + 1) % count);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onChange((index - 1 + count) % count);
      else if (e.key === "ArrowRight") onChange((index + 1) % count);
    }
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [index, count, onChange, onClose]);

  const buttonClass =
    "absolute flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white backdrop-blur transition-colors hover:bg-white/30";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[index].full}
        alt={tAlt("galleryPhoto")}
        className="max-h-[85vh] max-w-full rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button type="button" aria-label={t("close")} onClick={onClose} className={`${buttonClass} right-4 top-4`}>
        ×
      </button>
      <button
        type="button"
        aria-label={t("prev")}
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className={`${buttonClass} left-3 top-1/2 -translate-y-1/2`}
      >
        ‹
      </button>
      <button
        type="button"
        aria-label={t("next")}
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className={`${buttonClass} right-3 top-1/2 -translate-y-1/2`}
      >
        ›
      </button>
      <span className="absolute bottom-4 text-sm text-white/70">
        {index + 1} / {count}
      </span>
    </div>
  );
}
