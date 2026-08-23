"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { INTEREST_AREAS } from "@/lib/constants";
import type { WaitlistSignupRecord } from "@/lib/admin/waitlist";
import { Select } from "@/components/ui/select";
import { deleteSignup } from "@/app/admin/actions";

type SortKey = "name" | "email" | "country" | "createdAt";

const interestLabels = new Map<string, string>(INTEREST_AREAS.map((a) => [a.value, a.label]));

const columns: { key: SortKey; label: string }[] = [
  { key: "name", label: "Имя" },
  { key: "email", label: "Email" },
  { key: "country", label: "Страна" },
  { key: "createdAt", label: "Дата" },
];

const inputClass =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

export function WaitlistTable({ records }: { records: WaitlistSignupRecord[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records
      .filter((r) => !interestFilter || r.interestArea === interestFilter)
      .filter(
        (r) =>
          !q ||
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.country ?? "").toLowerCase().includes(q),
      )
      .sort((a, b) => {
        const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""));
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [records, search, interestFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  async function handleDelete(record: WaitlistSignupRecord) {
    if (!confirm(`Удалить заявку «${record.name}» (${record.email})?`)) return;

    setError(null);
    setDeletingId(record.id);
    const result = await deleteSignup(record.id);
    setDeletingId(null);

    if (result.status === "error") {
      setError(result.message ?? "Не удалось удалить");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Поиск по имени, email, стране…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} min-w-64 flex-1`}
        />
        <Select
          value={interestFilter}
          onChange={setInterestFilter}
          options={INTEREST_AREAS.map((area) => ({ value: area.value, label: area.label }))}
          placeholder="Все интересы"
          className="w-56"
        />
        <span className="text-sm text-muted">
          {filtered.length} из {records.length}
        </span>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className="flex items-center gap-1 hover:text-accent"
                  >
                    {col.label}
                    {sortKey === col.key && (sortDir === "asc" ? "↑" : "↓")}
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Вуз</th>
              <th className="px-4 py-3 font-medium">Интерес</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.country ?? "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-4 py-3">{r.placeOfStudy ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.interestArea ? (interestLabels.get(r.interestArea) ?? r.interestArea) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    disabled={deletingId === r.id}
                    onClick={() => handleDelete(r)}
                    className="text-red-600 underline underline-offset-2 disabled:opacity-50"
                  >
                    {deletingId === r.id ? "Удаляем…" : "Удалить"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
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
