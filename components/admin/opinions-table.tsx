"use client";

import { useMemo, useState } from "react";
import { OPINION_CATEGORIES } from "@/lib/constants";
import type { FestivalOpinionRecord } from "@/lib/admin/festival";
import { Select } from "@/components/ui/select";

const categoryLabels = new Map<string, string>(OPINION_CATEGORIES.map((c) => [c.value, c.label]));

const inputClass =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

export function OpinionsTable({ records }: { records: FestivalOpinionRecord[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const universityOptions = useMemo(() => {
    const names = new Set(records.map((r) => r.universityName));
    return Array.from(names)
      .sort()
      .map((name) => ({ value: name, label: name }));
  }, [records]);
  const [universityFilter, setUniversityFilter] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records
      .filter((r) => !categoryFilter || r.opinionCategory === categoryFilter)
      .filter((r) => !universityFilter || r.universityName === universityFilter)
      .filter(
        (r) =>
          !q ||
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.opinionText ?? "").toLowerCase().includes(q),
      );
  }, [records, search, categoryFilter, universityFilter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Поиск по имени, email, тексту…"
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
        <Select
          value={universityFilter}
          onChange={setUniversityFilter}
          options={universityOptions}
          placeholder="Все университеты"
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
              <th className="px-4 py-3 font-medium">Имя</th>
              <th className="px-4 py-3 font-medium">Роль</th>
              <th className="px-4 py-3 font-medium">Университет</th>
              <th className="px-4 py-3 font-medium">Категория</th>
              <th className="px-4 py-3 font-medium">Текст</th>
              <th className="px-4 py-3 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 align-top">
                <td className="px-4 py-3">
                  {r.name}
                  <div className="text-xs text-muted">{r.email}</div>
                </td>
                <td className="px-4 py-3">{r.role === "student" ? "Студент" : "Выпускник"}</td>
                <td className="px-4 py-3">
                  {r.universityName}
                  <div className="text-xs text-muted">{r.country ?? "—"}</div>
                </td>
                <td className="px-4 py-3">
                  {categoryLabels.get(r.opinionCategory) ?? r.opinionCategory}
                </td>
                <td className="max-w-sm px-4 py-3">{r.opinionText ?? "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
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
