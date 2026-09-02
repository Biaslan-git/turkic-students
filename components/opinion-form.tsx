"use client";

import { useActionState, useState } from "react";
import { submitGuestOpinion, type GuestOpinionState } from "@/app/opinion-actions";
import { OPINION_CATEGORIES } from "@/lib/constants";

const initialState: GuestOpinionState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base outline-none transition-colors focus:border-accent-warm focus:ring-2 focus:ring-accent-warm/25";

export function OpinionForm() {
  const [state, action, pending] = useActionState(submitGuestOpinion, initialState);
  const [category, setCategory] = useState("");

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center">
        <span className="text-4xl" aria-hidden="true">
          💬
        </span>
        <h2 className="font-display text-xl font-bold">Спасибо! Мнение получено</h2>
        <p className="text-sm text-muted">Мы обязательно его учтём.</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Направление</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {OPINION_CATEGORIES.map((c) => (
            <label
              key={c.value}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide transition-colors ${
                category === c.value
                  ? "border-accent-warm bg-accent-warm/10"
                  : "border-border bg-background"
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
              {c.label}
            </label>
          ))}
        </div>
        {category && (
          <p className="text-xs text-muted">
            {OPINION_CATEGORIES.find((c) => c.value === category)?.question}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="opinion-text" className="text-sm font-medium">
          Мнение
        </label>
        <textarea
          id="opinion-text"
          name="text"
          rows={4}
          required
          minLength={2}
          maxLength={2000}
          placeholder="Коротко напиши свою мысль…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Honeypot — hidden from real users via CSS, not display:none */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="opinion-company">Company</label>
        <input id="opinion-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !category}
        className="w-full rounded-xl bg-gradient-to-r from-accent-warm to-[#00d6c8] px-6 py-3.5 text-base font-semibold text-accent-ink shadow-[0_10px_28px_-10px_var(--accent-warm)] transition-opacity disabled:opacity-60"
      >
        {pending ? "Отправляем…" : "Отправить"}
      </button>
    </form>
  );
}
