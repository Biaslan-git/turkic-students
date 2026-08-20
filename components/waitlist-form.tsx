"use client";

import { useActionState, useEffect } from "react";
import {
  submitWaitlistBasic,
  submitWaitlistDetails,
  type WaitlistBasicState,
  type WaitlistDetailsState,
} from "@/app/actions";
import { INTEREST_AREAS, TELEGRAM_CHANNEL_URL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

const initialBasicState: WaitlistBasicState = { status: "idle" };
const initialDetailsState: WaitlistDetailsState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

const copy = {
  privacyNote: "Твои данные используются только для регистрации на платформе.",
  step2Intro:
    "Расскажи о себе, чтобы мы показывали тебе подходящие возможности с самого запуска.",
  step2Cta: "Зарегистрироваться",
  skipLabel: "Пропустить",
  successTitle: "Спасибо! Ты в списке TURKIC STUDENTS",
  successSubtitle:
    "Подпишись на наш Telegram-канал, чтобы не пропустить запуск платформы.",
  telegramCta: "Подписаться на Telegram",
};

export function WaitlistForm() {
  const [basicState, basicAction, basicPending] = useActionState(
    submitWaitlistBasic,
    initialBasicState,
  );
  const [detailsState, detailsAction, detailsPending] = useActionState(
    submitWaitlistDetails,
    initialDetailsState,
  );

  useEffect(() => {
    if (basicState.status === "step2") {
      trackEvent("waitlist_step1_completed");
    }
  }, [basicState.status]);

  useEffect(() => {
    if (detailsState.status === "success") {
      trackEvent("waitlist_step2_completed");
    }
  }, [detailsState.status]);

  const showSuccess = detailsState.status === "success";
  const showStepTwo = basicState.status === "step2" && basicState.id;

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
            className="w-full rounded-xl bg-foreground px-6 py-3.5 text-base font-semibold text-background transition-opacity disabled:opacity-60"
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
}: {
  id: string;
  action: (formData: FormData) => void;
  pending: boolean;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />

      <p className="text-sm text-muted">{copy.step2Intro}</p>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="country" className="text-sm font-medium">
          Страна
        </label>
        <input
          id="country"
          name="country"
          type="text"
          maxLength={100}
          autoComplete="country-name"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="placeOfStudy" className="text-sm font-medium">
          Вуз / место учёбы
        </label>
        <input
          id="placeOfStudy"
          name="placeOfStudy"
          type="text"
          maxLength={200}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="interestArea" className="text-sm font-medium">
          Что тебе интереснее всего
        </label>
        <select
          id="interestArea"
          name="interestArea"
          defaultValue=""
          className={inputClass}
        >
          <option value="" disabled>
            Выберите вариант
          </option>
          {INTEREST_AREAS.map((area) => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-foreground px-6 py-3.5 text-base font-semibold text-background transition-opacity disabled:opacity-60"
      >
        {pending ? "Сохраняем…" : copy.step2Cta}
      </button>

      <button
        type="submit"
        disabled={pending}
        formNoValidate
        className="text-center text-sm text-muted underline underline-offset-2"
        onClick={() => trackEvent("waitlist_step2_skipped")}
      >
        {copy.skipLabel}
      </button>
    </form>
  );
}

function SuccessScreen() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h3 className="font-display text-xl font-bold">{copy.successTitle}</h3>
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
