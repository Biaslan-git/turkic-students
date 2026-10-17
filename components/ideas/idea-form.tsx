"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { submitIdea, type IdeaFormState } from "@/app/idea-actions";
import { OPINION_CATEGORIES } from "@/lib/constants";
import { CUSTOM_VALUE_PREFIX, Select, type SelectOption } from "@/components/ui/select";

const initialState: IdeaFormState = { status: "idle" };

export const selectInputClass = "rounded-xl px-4 py-3.5 text-base focus:border-accent-warm focus:ring-accent-warm/25";

export const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base outline-none transition-colors focus:border-accent-warm focus:ring-2 focus:ring-accent-warm/25";

export function IdeaForm({ countries, universities }: { countries: SelectOption[]; universities: SelectOption[] }) {
  const t = useTranslations("Ideas");
  const tCategories = useTranslations("Constants.opinionCategories");
  const tWaitlist = useTranslations("WaitlistForm");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [showNotice, setShowNotice] = useState(false);

  // После отправки форма остаётся на месте: поля очищаются, а сверху на несколько секунд
  // появляется подтверждение, что мнение ушло на модерацию (и видно автору с бейджем).
  const [state, action, pending] = useActionState(async (prev: IdeaFormState, formData: FormData) => {
    const result = await submitIdea(prev, formData);
    if (result.status === "success") {
      setCategory("");
      setCountry("");
      setUniversityId("");
      setFormKey((k) => k + 1);
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 15_000);
    }
    return result;
  }, initialState);

  return (
    <div className="flex flex-col gap-3">
      {showNotice && (
        <p role="status" className="rounded-2xl border border-accent-warm/40 bg-accent-warm/10 px-4 py-3 text-sm">
          {t("sentToModeration")}
        </p>
      )}
      <form
        key={formKey}
        action={action}
        className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 text-left sm:p-8"
      >
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{t("categoryLabel")}</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {OPINION_CATEGORIES.map((c) => (
              <label
                key={c.value}
                className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide transition-colors ${
                  category === c.value ? "border-accent-warm bg-accent-warm/10" : "border-border bg-background"
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={c.value}
                  required
                  checked={category === c.value}
                  onChange={() => setCategory(c.value)}
                  className="sr-only"
                />
                {tCategories(`${c.value}.label`)}
              </label>
            ))}
          </div>
          {category && <p className="text-xs text-muted">{tCategories(`${category}.question`)}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="idea-text" className="text-sm font-medium">
            {t("textLabel")}
          </label>
          <textarea
            id="idea-text"
            name="text"
            rows={4}
            required
            minLength={2}
            maxLength={1000}
            placeholder={t("textPlaceholder")}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">{t("countryLabel")}</span>
            <Select
              value={country}
              onChange={setCountry}
              options={countries}
              placeholder={t("countryPlaceholder")}
              searchable={false}
              inputClassName={selectInputClass}
            />
            <input type="hidden" name="country" value={country} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="idea-name" className="text-sm font-medium">
              {t("nameLabel")} <span className="font-normal text-muted">{t("optional")}</span>
            </label>
            <input
              id="idea-name"
              name="authorName"
              type="text"
              maxLength={80}
              autoComplete="given-name"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">
            {t("universityLabel")} <span className="font-normal text-muted">{t("optional")}</span>
          </span>
          <Select
            value={universityId}
            onChange={setUniversityId}
            options={universities}
            placeholder={t("universityPlaceholder")}
            allowCustom
            inputClassName={selectInputClass}
            noResultsLabel={tWaitlist("noResultsLabel")}
            customValueLabel={(query) => tWaitlist("customValueLabel", { query })}
          />
          {universityId.startsWith(CUSTOM_VALUE_PREFIX) ? (
            <input type="hidden" name="universityOtherName" value={universityId.slice(CUSTOM_VALUE_PREFIX.length)} />
          ) : (
            <input type="hidden" name="universityId" value={universityId} />
          )}
        </div>

        {/* Honeypot — hidden from real users via CSS, not display:none */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="idea-company">Company</label>
          <input id="idea-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <p className="text-xs text-muted">{t("guidelines")}</p>

        {state.status === "error" && (
          <p role="alert" className="text-sm text-red-600">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || !category || !country}
          className="w-full rounded-xl bg-gradient-to-r from-accent-warm to-[#00d6c8] px-6 py-3.5 text-base font-semibold text-accent-ink shadow-[0_10px_28px_-10px_var(--accent-warm)] transition-opacity disabled:opacity-60"
        >
          {pending ? t("sending") : t("submit")}
        </button>
      </form>
    </div>
  );
}
