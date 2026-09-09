"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing, LOCALE_NAMES } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <label className="relative flex items-center">
      <span className="sr-only">{t("languageSwitcherLabel")}</span>
      <select
        aria-label={t("languageSwitcherLabel")}
        value={locale}
        onChange={handleChange}
        className="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-wide outline-none transition-colors focus:border-accent"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {LOCALE_NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
