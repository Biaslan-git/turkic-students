import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/sections/language-switcher";

export function Header({ ctaLabel }: { ctaLabel: string }) {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md sm:gap-4 sm:px-8 sm:py-5 md:px-12">
      <span className="flex min-w-0 items-center gap-1.5 font-display text-sm font-bold tracking-tight sm:gap-2 sm:text-lg">
        <Image
          src="/turksoy-logo.svg"
          alt={t("logoAlt")}
          width={28}
          height={28}
          className="h-6 w-6 shrink-0 sm:h-7 sm:w-7"
        />
        <span className="truncate">
          TÜRKSOY<span className="hidden sm:inline"> STUDENTS</span>
        </span>
      </span>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <LanguageSwitcher />
        <a
          href="#waitlist"
          className="whitespace-nowrap rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_-8px_var(--accent)] transition-transform hover:scale-[1.04] sm:px-4 sm:py-2 sm:text-sm"
        >
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
