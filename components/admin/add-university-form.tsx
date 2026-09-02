"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUniversity, type CreateUniversityState } from "@/app/admin/actions";

const initialState: CreateUniversityState = { status: "idle" };

const inputClass =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

export function AddUniversityForm() {
  const [state, formAction, pending] = useActionState(createUniversity, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router]);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="uni-name" className="text-sm font-medium">
          Название
        </label>
        <input
          id="uni-name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={200}
          className={`${inputClass} w-72`}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="uni-country" className="text-sm font-medium">
          Страна
        </label>
        <input
          id="uni-country"
          name="country"
          type="text"
          required
          minLength={2}
          maxLength={100}
          className={`${inputClass} w-48`}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
      >
        {pending ? "Добавляем…" : "Добавить"}
      </button>
      {state.status === "error" && (
        <p role="alert" className="w-full text-sm text-red-600">
          {state.message}
        </p>
      )}
    </form>
  );
}
