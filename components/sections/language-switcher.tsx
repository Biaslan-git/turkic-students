"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { routing, LOCALE_NAMES } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleSelect(nextLocale: string) {
    setOpen(false);
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={t("languageSwitcherLabel")}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors hover:border-accent"
      >
        <span aria-hidden="true">🌐</span>
        {locale}
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("languageSwitcherLabel")}
          className="absolute right-0 z-50 mt-1.5 max-h-72 w-40 overflow-y-auto rounded-xl border border-border bg-surface p-1 text-sm shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)]"
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => handleSelect(l)}
                className={`w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent/10 ${
                  l === locale ? "font-semibold text-accent" : ""
                }`}
              >
                {LOCALE_NAMES[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
