"use client";

import { useMemo, useState } from "react";
import { OPINION_CATEGORIES } from "@/lib/constants";
import type { GuestOpinionRecord } from "@/lib/admin/guest-opinions";
import { Select } from "@/components/ui/select";

const categoryLabels = new Map<string, string>(OPINION_CATEGORIES.map((c) => [c.value, c.label]));

const inputClass =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

export function GuestOpinionsTable({ records }: { records: GuestOpinionRecord[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records
      .filter((r) => !categoryFilter || r.category === categoryFilter)
      .filter((r) => !q || r.text.toLowerCase().includes(q));
  }, [records, search, categoryFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Поиск по тексту…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} min-w-64 flex-1`}
        />
        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={OPINION_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
          placeholder="Все категории"
          className="w-56"
        />
        <span className="text-sm text-muted">
          {filtered.length} из {records.length}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              <th className="px-4 py-3 font-medium">Категория</th>
              <th className="px-4 py-3 font-medium">Текст</th>
              <th className="px-4 py-3 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 align-top">
                <td className="px-4 py-3">{categoryLabels.get(r.category) ?? r.category}</td>
                <td className="max-w-md px-4 py-3">{r.text}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted">
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
