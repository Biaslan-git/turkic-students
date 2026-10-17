import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RouteLinesBackdrop } from "@/components/route-lines";
import { FEEDBACK_EMAIL } from "@/lib/constants";

export function Footer({ ctaLabel, text }: { ctaLabel: string; text: string }) {
  const t = useTranslations("Footer");

  return (
    <footer className="relative overflow-hidden border-t border-border bg-tint-teal">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.1]">
        <RouteLinesBackdrop />
      </div>
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 px-5 py-12 text-center text-sm text-muted sm:px-8 md:px-12">
        <span className="font-display text-sm font-bold tracking-tight text-foreground">TURKIC STUDENTS</span>
        <p className="max-w-md">{text}</p>
        <a href="#waitlist" className="font-medium text-accent underline underline-offset-4">
          {ctaLabel}
        </a>
        <Link href="/ideas" className="text-xs text-muted underline underline-offset-2">
          {t("ideasLink")}
        </Link>
        <Link href="/opinion" className="text-xs text-muted underline underline-offset-2">
          {t("opinionLink")}
        </Link>
        <p className="text-xs">
          {t("feedback")}{" "}
          <a href={`mailto:${FEEDBACK_EMAIL}`} className="underline underline-offset-2">
            {FEEDBACK_EMAIL}
          </a>
        </p>
        <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        <p className="text-xs text-muted/70">
          {t.rich("iconsCredit", {
            link: (chunks) => (
              <a
                href="https://openmoji.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
        <p className="text-xs text-muted/70">
          {t("developedByPrefix")}{" "}
          <a
            href="https://void-tech.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Байрамкулов Биаслан
          </a>
        </p>
      </div>
    </footer>
  );
}
