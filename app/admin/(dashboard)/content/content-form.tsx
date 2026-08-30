"use client";

import { useActionState } from "react";
import { updateContent, type UpdateContentState } from "@/app/admin/actions";
import type { ContentField } from "@/lib/content/fields";
import type { SiteContent } from "@/lib/content/site-content";

const initialState: UpdateContentState = { status: "idle" };

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

export function ContentForm({
  groups,
  values,
}: {
  groups: { section: string; fields: ContentField[] }[];
  values: SiteContent;
}) {
  const [state, formAction, pending] = useActionState(updateContent, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <SaveBar state={state} pending={pending} />

      {groups.map((group) => (
        <fieldset key={group.section} className="rounded-2xl border border-border p-5">
          <legend className="px-1 font-display text-lg font-bold">{group.section}</legend>
          <div className="mt-3 flex flex-col gap-4">
            {group.fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label htmlFor={field.key} className="text-sm font-medium">
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea
                    id={field.key}
                    name={field.key}
                    rows={3}
                    defaultValue={values[field.key] ?? ""}
                    className={fieldClass}
                  />
                ) : (
                  <input
                    id={field.key}
                    name={field.key}
                    type="text"
                    defaultValue={values[field.key] ?? ""}
                    className={fieldClass}
                  />
                )}
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      <SaveBar state={state} pending={pending} />
    </form>
  );
}

function SaveBar({ state, pending }: { state: UpdateContentState; pending: boolean }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-4 rounded-xl border border-border bg-background/95 px-4 py-3 backdrop-blur-sm">
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity disabled:opacity-60"
      >
        {pending ? "Сохраняем…" : "Сохранить изменения"}
      </button>
      {state.status === "success" && (
        <p role="status" className="text-sm font-medium text-emerald-600">
          {state.message}
        </p>
      )}
      {state.status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.message}
        </p>
      )}
    </div>
  );
}
