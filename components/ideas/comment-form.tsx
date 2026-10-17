"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitIdeaComment, type IdeaFormState } from "@/app/idea-actions";
import { Select, type SelectOption } from "@/components/ui/select";
import { inputClass } from "@/components/ideas/idea-form";

const initialState: IdeaFormState = { status: "idle" };

export function CommentForm({ ideaId, countries }: { ideaId: string; countries: SelectOption[] }) {
  const t = useTranslations("Ideas");
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [notice, setNotice] = useState(false);

  // Успех: форма сворачивается обратно в «Ответить», на несколько секунд показываем подтверждение.
  const [state, action, pending] = useActionState(async (prev: IdeaFormState, formData: FormData) => {
    const result = await submitIdeaComment(prev, formData);
    if (result.status === "success") {
      setOpen(false);
      setCountry("");
      setNotice(true);
      setTimeout(() => setNotice(false), 8000);
    }
    return result;
  }, initialState);

  if (!open) {
    return (
      <div className="flex flex-col gap-2">
        {notice && (
          <p role="status" className="text-sm text-accent-warm">
            {t("replySent")}
          </p>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-fit text-sm font-semibold text-accent-warm underline underline-offset-4"
        >
          {t("reply")}
        </button>
      </div>
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
        <Select
          value={country}
          onChange={setCountry}
          options={countries}
          placeholder={t("countryPlaceholder")}
          searchable={false}
          inputClassName="rounded-xl px-4 py-2.5 text-sm focus:border-accent-warm focus:ring-accent-warm/25"
        />
        <input type="hidden" name="country" value={country} />
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

      <p className="text-xs text-muted">{t("guidelines")}</p>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || !country}
          className="rounded-full bg-accent-warm px-5 py-2 text-sm font-semibold text-accent-ink disabled:opacity-60"
        >
          {pending ? t("sending") : t("send")}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-muted underline underline-offset-2"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
