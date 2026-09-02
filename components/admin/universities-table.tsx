"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleUniversityActive } from "@/app/admin/actions";
import type { FestivalUniversityAdminRecord } from "@/lib/admin/festival";

export function UniversitiesTable({ records }: { records: FestivalUniversityAdminRecord[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle(record: FestivalUniversityAdminRecord) {
    setError(null);
    setPendingId(record.id);
    const result = await toggleUniversityActive(record.id, !record.isActive);
    setPendingId(null);

    if (result.status === "error") {
      setError(result.message ?? "Не удалось изменить");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              <th className="px-4 py-3 font-medium">Название</th>
              <th className="px-4 py-3 font-medium">Страна</th>
              <th className="px-4 py-3 font-medium">Регистраций</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.country}</td>
                <td className="px-4 py-3">{r.registrationCount}</td>
                <td className="px-4 py-3">
                  {r.isActive ? "Активен" : "Скрыт"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    disabled={pendingId === r.id}
                    onClick={() => handleToggle(r)}
                    className="text-sm text-accent underline underline-offset-2 disabled:opacity-50"
                  >
                    {pendingId === r.id ? "Сохраняем…" : r.isActive ? "Скрыть" : "Показать"}
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Нет университетов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
