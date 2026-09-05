import type { OtherUniversitySubmission } from "@/lib/admin/festival";

export function OtherUniversitySubmissionsTable({
  records,
}: {
  records: OtherUniversitySubmission[];
}) {
  if (records.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-display text-lg font-bold">Вузы, введённые вручную</h2>
        <p className="text-sm text-muted">
          Люди, чьего вуза не было в списке при регистрации — можно добавить его выше через форму.
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              <th className="px-4 py-3 font-medium">Название вуза</th>
              <th className="px-4 py-3 font-medium">Имя</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={`${r.email}-${i}`} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{r.universityOtherName}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
