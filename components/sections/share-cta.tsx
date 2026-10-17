"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FEEDBACK_EMAIL } from "@/lib/constants";

// url приходит с сервера (SITE_URL + локаль), чтобы ссылка в шаринге не зависела от адреса,
// с которого открыли страницу (например, от технического домена Dokploy).
export function ShareCta({ url, shareTitle }: { url: string; shareTitle: string }) {
  const t = useTranslations("ShareCta");
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url });
        return;
      }
    } catch {
      // человек закрыл диалог — ничего не делаем
      return;
    }
    await copy();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt(t("copy"), url);
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareTitle);
  const pill =
    "rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent-warm";

  return (
    <section id="share" className="relative bg-background">
      <div className="reveal-on-scroll mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20 md:px-12">
        <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-border bg-tint-coral px-6 py-10 text-center sm:px-10">
          <h2 className="text-balance font-display text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h2>
          <p className="max-w-xl text-pretty text-muted">{t("text")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={share}
              className="rounded-full bg-gradient-to-r from-accent to-[#ff8a63] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_-10px_var(--accent)] transition-transform hover:scale-[1.03]"
            >
              {t("share")}
            </button>
            <button type="button" onClick={copy} className={pill}>
              {copied ? t("copied") : t("copy")}
            </button>
            <a
              href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              WhatsApp
            </a>
            <a
              href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              Telegram
            </a>
          </div>

          <div className="mt-2 flex flex-col items-center gap-1 border-t border-border pt-6">
            <p className="font-display text-lg font-bold">{t("feedbackTitle")}</p>
            <p className="text-sm text-muted">
              {t("feedbackText")}{" "}
              <a href={`mailto:${FEEDBACK_EMAIL}`} className="font-semibold text-accent underline underline-offset-4">
                {FEEDBACK_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
