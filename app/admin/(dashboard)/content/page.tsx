import type { Metadata } from "next";
import { CONTENT_FIELDS, type ContentField } from "@/lib/content/fields";
import { getSiteContent } from "@/lib/content/site-content";
import { listContentHistory } from "@/lib/admin/site-content-history";
import { restoreContent } from "@/app/admin/actions";
import { ContentForm } from "./content-form";

export const metadata: Metadata = {
  title: "Тексты сайта",
  robots: { index: false, follow: false },
};

function groupBySection(fields: ContentField[]): { section: string; fields: ContentField[] }[] {
  const groups: { section: string; fields: ContentField[] }[] = [];
  for (const field of fields) {
    const group = groups.find((g) => g.section === field.section);
    if (group) {
      group.fields.push(field);
    } else {
      groups.push({ section: field.section, fields: [field] });
    }
  }
  return groups;
}

const historyDateFormat = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminContentPage() {
  const [values, history] = await Promise.all([getSiteContent(), listContentHistory()]);
  const groups = groupBySection(CONTENT_FIELDS);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Тексты сайта</h1>
        <p className="mt-1 text-sm text-muted">
          Здесь можно поменять заголовки, тексты и пункты списков на лендинге. После
          сохранения изменения сразу появятся на сайте.
        </p>
      </div>

      <details className="rounded-2xl border border-border p-4">
        <summary className="cursor-pointer font-display text-base font-bold">
          История сохранений{history.length > 0 ? ` (${history.length})` : ""}
        </summary>
        <div className="mt-3 flex flex-col gap-2">
          {history.length === 0 ? (
            <p className="text-sm text-muted">
              Пока нет сохранённых версий — появятся после первого сохранения.
            </p>
          ) : (
            history.map((entry) => (
              <form
                key={entry.id}
                action={restoreContent}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
              >
                <input type="hidden" name="id" value={entry.id} />
                <span>{historyDateFormat.format(new Date(entry.createdAt))}</span>
                <button type="submit" className="font-medium text-accent underline underline-offset-2">
                  Восстановить
                </button>
              </form>
            ))
          )}
        </div>
      </details>

      <ContentForm groups={groups} values={values} />
    </div>
  );
}
