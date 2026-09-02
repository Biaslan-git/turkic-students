"use client";

import { useActionState, useEffect, useState, useSyncExternalStore } from "react";
import {
  submitWaitlistBasic,
  submitWaitlistDetails,
  type WaitlistBasicState,
  type WaitlistDetailsState,
} from "@/app/actions";
import { FESTIVAL_ROLES, OPINION_CATEGORIES, TELEGRAM_CHANNEL_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { Select } from "@/components/ui/select";
import type { University } from "@/lib/universities";

const JOINED_STORAGE_KEY = "tvoi-golos-joined";

const initialBasicState: WaitlistBasicState = { status: "idle" };
const initialDetailsState: WaitlistDetailsState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

const copy = {
  privacyNote: "Твои данные используются только для регистрации на платформе.",
  step2Intro:
    "Расскажи о себе — так мы учтём тебя в аудитории твоего университета и покажем подходящие возможности с самого запуска.",
  step2Cta: "Зарегистрироваться",
  successSubtitle:
    "Подпишись на наш Telegram-канал, чтобы не пропустить запуск платформы.",
  telegramCta: "Подписаться на Telegram",
};

function subscribeNoop() {
  return () => {};
}

function readAlreadyJoined(): boolean {
  try {
    return localStorage.getItem(JOINED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function readAlreadyJoinedServer(): boolean {
  return false;
}

export function WaitlistForm({ universities }: { universities: University[] }) {
  const [basicState, basicAction, basicPending] = useActionState(
    submitWaitlistBasic,
    initialBasicState,
  );
  const [detailsState, detailsAction, detailsPending] = useActionState(
    submitWaitlistDetails,
    initialDetailsState,
  );
  const alreadyJoined = useSyncExternalStore(
    subscribeNoop,
    readAlreadyJoined,
    readAlreadyJoinedServer,
  );
  const [forceForm, setForceForm] = useState(false);

  useEffect(() => {
    if (basicState.status === "step2") {
      trackEvent("waitlist_step1_completed");
    }
  }, [basicState.status]);

  useEffect(() => {
    if (detailsState.status === "success") {
      trackEvent("waitlist_step2_completed");
      try {
        localStorage.setItem(JOINED_STORAGE_KEY, "1");
      } catch {
        // недоступность localStorage не критична — это лишь UX-подсказка, не защита
      }
    }
  }, [detailsState.status]);

  const showSuccess = detailsState.status === "success";
  const showStepTwo = basicState.status === "step2" && basicState.id;

  if (alreadyJoined && !forceForm && !showStepTwo && !showSuccess) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-center shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] sm:p-8">
        <h3 className="font-display text-xl font-bold">Вы уже с нами 🎉</h3>
        <p className="mt-2 text-sm text-muted">Этот браузер уже отмечен как зарегистрированный.</p>
        <button
          type="button"
          onClick={() => setForceForm(true)}
          className="mt-4 text-sm text-muted underline underline-offset-2"
        >
          Зарегистрировать другого человека
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] sm:p-8">
      {showSuccess ? (
        <SuccessScreen />
      ) : showStepTwo ? (
        <StepTwoForm
          id={basicState.id!}
          action={detailsAction}
          pending={detailsPending}
          error={detailsState.status === "error" ? detailsState.message : undefined}
          universities={universities}
        />
      ) : (
        <form action={basicAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Имя
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={255}
              autoComplete="email"
              className={inputClass}
            />
            <p className="text-xs text-muted">{copy.privacyNote}</p>
          </div>

          {/* Honeypot — hidden from real users via CSS, not display:none */}
          <div
            className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {basicState.status === "error" && (
            <p role="alert" className="text-sm text-red-600">
              {basicState.message}
            </p>
          )}

          <button
            type="submit"
            disabled={basicPending}
            className="w-full rounded-xl bg-gradient-to-r from-accent to-[#ff8a63] px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_28px_-10px_var(--accent)] transition-opacity disabled:opacity-60"
          >
            {basicPending ? "Отправляем…" : "Далее"}
          </button>
        </form>
      )}
    </div>
  );
}

function StepTwoForm({
  id,
  action,
  pending,
  error,
  universities,
}: {
  id: string;
  action: (formData: FormData) => void;
  pending: boolean;
  error?: string;
  universities: University[];
}) {
  const [role, setRole] = useState<string>(FESTIVAL_ROLES[0].value);
  const [universityId, setUniversityId] = useState("");
  const [opinionCategory, setOpinionCategory] = useState("");

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />

      <p className="text-sm text-muted">{copy.step2Intro}</p>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Кто вы?</span>
        <div className="flex gap-2">
          {FESTIVAL_ROLES.map((r) => (
            <label
              key={r.value}
              className={`flex-1 cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors ${
                role === r.value ? "border-accent bg-accent/10" : "border-border bg-background"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                required
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="universityId" className="text-sm font-medium">
          Университет
        </label>
        <Select
          value={universityId}
          onChange={setUniversityId}
          options={universities.map((u) => ({ value: u.id, label: `${u.name} (${u.country})` }))}
          placeholder="Выберите университет"
        />
        <input type="hidden" name="universityId" value={universityId} required />
      </div>

      {role === "alumnus" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="graduationYear" className="text-sm font-medium">
            Год окончания <span className="font-normal text-muted">(необязательно)</span>
          </label>
          <input
            id="graduationYear"
            name="graduationYear"
            type="number"
            min={1950}
            max={new Date().getFullYear()}
            className={inputClass}
          />
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <p className="text-sm font-medium">
          Хочешь поделиться мнением о фестивале? <span className="font-normal text-muted">(необязательно)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {OPINION_CATEGORIES.map((c) => (
            <label
              key={c.value}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide transition-colors ${
                opinionCategory === c.value
                  ? "border-accent-warm bg-accent-warm/10"
                  : "border-border bg-background"
              }`}
            >
              <input
                type="radio"
                name="opinionCategory"
                value={c.value}
                checked={opinionCategory === c.value}
                onChange={() => setOpinionCategory(c.value)}
                className="sr-only"
              />
              {c.label}
            </label>
          ))}
        </div>
        {opinionCategory && (
          <p className="text-xs text-muted">
            {OPINION_CATEGORIES.find((c) => c.value === opinionCategory)?.question}
          </p>
        )}
        <textarea
          name="opinionText"
          rows={3}
          maxLength={2000}
          placeholder="Коротко напиши свою мысль…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !universityId}
        className="w-full rounded-xl bg-gradient-to-r from-accent to-[#ff8a63] px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_28px_-10px_var(--accent)] transition-opacity disabled:opacity-60"
      >
        {pending ? "Сохраняем…" : copy.step2Cta}
      </button>
    </form>
  );
}

function SuccessScreen() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h3 className="font-display text-xl font-bold">
        Спасибо! Ты в списке TÜRKSOY STUDENTS
      </h3>
      <p className="text-muted">{copy.successSubtitle}</p>
      <a
        href={TELEGRAM_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full rounded-xl bg-accent px-6 py-3.5 text-base font-semibold text-accent-ink"
      >
        {copy.telegramCta}
      </a>
    </div>
  );
}
