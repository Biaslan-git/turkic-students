"use client";

import { useState } from "react";

// original — то, что написал автор; shown — перевод на язык посетителя (или тот же
// оригинал, если перевода ещё нет). Переключатель показываем, только когда они различаются.
export function TranslatedText({
  original,
  translated,
  showOriginalLabel,
  showTranslationLabel,
  className = "",
}: {
  original: string;
  translated: string;
  showOriginalLabel: string;
  showTranslationLabel: string;
  className?: string;
}) {
  const [showOriginal, setShowOriginal] = useState(false);
  const differs = translated !== original;

  return (
    <div className="flex flex-col gap-1.5">
      <p className={`whitespace-pre-line break-words ${className}`}>{showOriginal ? original : translated}</p>
      {differs && (
        <button
          type="button"
          onClick={() => setShowOriginal((v) => !v)}
          className="w-fit text-xs font-medium text-muted underline underline-offset-2"
        >
          {showOriginal ? showTranslationLabel : showOriginalLabel}
        </button>
      )}
    </div>
  );
}
