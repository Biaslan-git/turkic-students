"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitIdeaComment, type IdeaFormState } from "@/app/idea-actions";
import type { SelectOption } from "@/components/ui/select";
import { inputClass } from "@/components/ideas/idea-form";

const initialState: IdeaFormState = { status: "idle" };

export function CommentForm({ ideaId, countries }: { ideaId: string; countries: SelectOption[] }) {
  const t = useTranslations("Ideas");
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(submitIdeaComment, initialState);

  if (state.status === "success") {
    return <p className="text-sm text-accent-warm">{t("replySent")}</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-fit text-sm font-semibold text-accent-warm underline underline-offset-4"
      >
        {t("reply")}
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2.5 rounded-xl border border-border bg-background p-3">
      <input type="hidden" name="ideaId" value={ideaId} />
      <textarea
        name="text"
        rows={2}
        required
        minLength={2}
        maxLength={1000}
        placeholder={t("replyPlaceholder")}
        aria-label={t("replyPlaceholder")}
        className={`${inputClass} resize-none py-2.5 text-sm`}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <select
          name="country"
          required
          defaultValue=""
          aria-label={t("countryLabel")}
          className={`${inputClass} py-2.5 text-sm`}
        >
          <option value="" disabled>
            {t("countryPlaceholder")}
          </option>
          {countries.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          name="authorName"
          type="text"
          maxLength={80}
          placeholder={`${t("nameLabel")} ${t("optional")}`}
          aria-label={t("nameLabel")}
          className={`${inputClass} py-2.5 text-sm`}
        />
      </div>

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent-warm px-5 py-2 text-sm font-semibold text-accent-ink disabled:opacity-60"
        >
          {pending ? t("sending") : t("send")}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted underline underline-offset-2">
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
