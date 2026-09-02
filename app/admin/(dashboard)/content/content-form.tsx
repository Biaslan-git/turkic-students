"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { updateContent, type UpdateContentState } from "@/app/admin/actions";
import type { ContentField } from "@/lib/content/fields";
import type { SiteContent } from "@/lib/content/site-content";
import { SectionNav } from "./section-nav";

const initialState: UpdateContentState = { status: "idle" };

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

const SECTION_SLUGS: Record<string, string> = {
  "Общее": "obshee",
  "Главный экран": "hero",
  "Трудность": "problem",
  "Решение": "solution",
  "Круглый год": "cycle",
  "Для кого": "audience",
  "Принципы": "principles",
  "Если сомневаешься": "objections",
  "Форма регистрации": "waitlist",
  "Футер": "footer",
  "Твой голос": "tvoi-golos",
};

function sectionSlug(section: string): string {
  return SECTION_SLUGS[section] ?? section.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-");
}

function matchesQuery(field: ContentField, query: string): boolean {
  return field.label.toLowerCase().includes(query) || field.key.toLowerCase().includes(query);
}

type Group = { section: string; fields: ContentField[] };

export function ContentForm({ groups, values }: { groups: Group[]; values: SiteContent }) {
  const [state, formAction, pending] = useActionState(updateContent, initialState);
  const [search, setSearch] = useState("");
  const [openSlugs, setOpenSlugs] = useState<Set<string>>(
    () => new Set(groups[0] ? [sectionSlug(groups[0].section)] : []),
  );

  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;

  const navSections = useMemo(
    () => groups.map((group) => ({ slug: sectionSlug(group.section), title: group.section })),
    [groups],
  );

  function toggleSection(slug: string) {
    setOpenSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function expandSection(slug: string) {
    setOpenSlugs((prev) => new Set(prev).add(slug));
  }

  return (
    <div className="lg:grid lg:grid-cols-[220px_1fr] lg:items-start lg:gap-8">
      <aside className="mb-6 lg:mb-0">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по текстам…"
          className={`${fieldClass} mb-3`}
        />
        <SectionNav sections={navSections} onNavigate={expandSection} />
      </aside>

      <form action={formAction} className="flex flex-col gap-6">
        <SaveBar state={state} pending={pending} />

        {groups.map((group) => {
          const slug = sectionSlug(group.section);
          const hasMatch = !isSearching || group.fields.some((field) => matchesQuery(field, query));
          if (!hasMatch) return null;

          const isOpen = isSearching || openSlugs.has(slug);

          return (
            <fieldset
              key={group.section}
              id={`section-${slug}`}
              className="scroll-mt-24 rounded-2xl border border-border p-5"
            >
              <legend className="w-full px-1">
                <button
                  type="button"
                  onClick={() => toggleSection(slug)}
                  className="flex w-full items-center justify-between gap-2 font-display text-lg font-bold"
                  aria-expanded={isOpen}
                >
                  {group.section}
                  <span
                    className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  >
                    ▾
                  </span>
                </button>
              </legend>

              {isOpen && (
                <div className="mt-3 flex flex-col gap-4">
                  {group.fields.map((field) => {
                    const highlighted = isSearching && matchesQuery(field, query);
                    return (
                      <div
                        key={field.key}
                        className={`flex flex-col gap-1.5 rounded-lg ${
                          highlighted ? "-m-2 bg-accent/10 p-2" : ""
                        }`}
                      >
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
                    );
                  })}
                </div>
              )}
            </fieldset>
          );
        })}

        <SaveBar state={state} pending={pending} />
      </form>
    </div>
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
