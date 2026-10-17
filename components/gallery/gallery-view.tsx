"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { GalleryPhoto } from "@/lib/gallery";
import { AllPhotos } from "@/components/gallery/all-photos";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

// Три ряда миниатюр едут в разные стороны: на экране сразу десятки фото, а высота блока
// фиксированная и не зависит от их числа. Ряд дублируется, чтобы прокрутка была бесшовной.
const ROWS = 3;
const SECONDS_PER_TILE = 3;
const STOP_SMOOTHING_MS = 250; // за это время лента почти полностью тормозит/разгоняется

type Tile = { photo: GalleryPhoto; index: number };

// animation-play-state: paused останавливает ленту мгновенно. Поэтому скоростью управляем
// через playbackRate анимации и плавно подтягиваем её к 0 (наведение/касание) или к 1.
function MarqueeRow({
  row,
  reverse,
  eager,
  onOpen,
  onWarm,
}: {
  row: Tile[];
  reverse: boolean;
  eager: boolean;
  onOpen: (index: number, thumb: HTMLImageElement | null) => void;
  onWarm: (index: number) => void;
}) {
  const t = useTranslations("Gallery");
  const tAlt = useTranslations("Alt");
  const trackRef = useRef<HTMLDivElement>(null);
  const target = useRef(1);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function setTarget(value: number) {
    target.current = value;
    cancelAnimationFrame(frame.current);

    let last = performance.now();
    const step = (now: number) => {
      const animation = trackRef.current?.getAnimations()[0];
      if (!animation) return; // prefers-reduced-motion: анимации нет
      const dt = now - last;
      last = now;
      const diff = target.current - animation.playbackRate;
      if (Math.abs(diff) < 0.01) {
        animation.playbackRate = target.current;
        return;
      }
      // Зажимаем в [0, 1]: после долгого кадра значение не должно уходить за 0 и крутить ленту назад.
      animation.playbackRate = Math.min(1, Math.max(0, animation.playbackRate + diff * (1 - Math.exp(-dt / (STOP_SMOOTHING_MS / 3)))));
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }

  return (
    <div
      className="overflow-hidden motion-reduce:overflow-x-auto"
      onPointerEnter={() => setTarget(0)}
      onPointerLeave={() => setTarget(1)}
      onPointerCancel={() => setTarget(1)}
    >
      <div
        ref={trackRef}
        className="flex w-max gap-2 [animation:gallery-marquee_linear_infinite] motion-reduce:animate-none"
        style={{
          animationDuration: `${row.length * SECONDS_PER_TILE}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[...row, ...row].map(({ photo, index }, i) => (
          <button
            key={i}
            type="button"
            onPointerDown={() => onWarm(index)}
            onClick={(e) => onOpen(index, e.currentTarget.querySelector("img"))}
            aria-label={t("openPhoto")}
            className="relative h-24 w-32 flex-none overflow-hidden rounded-xl bg-border sm:h-28 sm:w-40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.thumb}
              alt={tAlt("galleryPhoto")}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function GalleryView({ photos }: { photos: GalleryPhoto[] }) {
  const t = useTranslations("Gallery");
  const containerRef = useRef<HTMLDivElement>(null);
  const [eager, setEager] = useState(false);
  const [allOpen, setAllOpen] = useState(false);

  // Нативный loading="lazy" начинает грузить плитку, только когда она почти на экране, а лента
  // постоянно подвозит новые — получаются серые пустые плитки. Поэтому, когда до галереи
  // остаётся пара экранов, просим браузер грузить все миниатюры сразу: HTTP/2 тянет их
  // параллельно (десятки КБ каждая), и к моменту прокрутки лента уже полная.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEager(true);
          observer.disconnect();
        }
      },
      { rootMargin: "2000px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Телефону хватает 800px — вдвое легче, открывается заметно быстрее.
  function sourceOf(photo: GalleryPhoto) {
    return window.innerWidth * window.devicePixelRatio <= 900 ? photo.medium : photo.large;
  }

  // К моменту клика (pointerdown → click проходит ~100 мс) крупный кадр уже качается.
  function warm(index: number) {
    const photo = photos[index];
    if (photo) new Image().src = sourceOf(photo);
  }

  // Fancybox подгружаем только при первом клике — на первый показ страницы его код не нужен.
  async function openFancybox(startIndex: number, thumbEl?: HTMLImageElement | null) {
    const { Fancybox } = await import("@fancyapps/ui/dist/fancybox/");
    Fancybox.show(
      photos.map((photo, i) => ({
        src: sourceOf(photo),
        thumbSrc: photo.thumb,
        type: "image" as const,
        ...(i === startIndex && thumbEl ? { thumbEl } : {}),
      })),
      {
        startIndex,
        l10n: { CLOSE: t("close"), NEXT: t("next"), PREV: t("prev") },
        Carousel: { Lazyload: { preload: 2 } },
      },
    );
  }

  const rows = Array.from({ length: ROWS }, (_, r) =>
    photos.map((photo, index) => ({ photo, index })).filter((_, i) => i % ROWS === r),
  ).map((row) => {
    // Короткий ряд растягиваем повтором, иначе в ленте будут пустые места.
    const filled = [...row];
    while (filled.length > 0 && filled.length < 10) filled.push(...row);
    return filled;
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div ref={containerRef} className="flex w-full flex-col gap-2 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {rows.map((row, r) => (
          <MarqueeRow key={r} row={row} reverse={r % 2 === 1} eager={eager} onOpen={openFancybox} onWarm={warm} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setAllOpen(true)}
        className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
      >
        {t("openAll")} · {photos.length}
      </button>
      {allOpen && (
        <AllPhotos photos={photos} onPick={(index) => openFancybox(index)} onClose={() => setAllOpen(false)} />
      )}
    </div>
  );
}
