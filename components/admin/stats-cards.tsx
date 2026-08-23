import { INTEREST_AREAS } from "@/lib/constants";
import type { WaitlistStats } from "@/lib/admin/waitlist";

const interestLabels = new Map<string, string>(INTEREST_AREAS.map((a) => [a.value, a.label]));

function BreakdownList({ items }: { items: { key: string; count: number }[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));

  if (items.length === 0) {
    return <p className="text-sm text-muted">Нет данных</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.key} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span>{interestLabels.get(item.key) ?? item.key}</span>
            <span className="font-medium">{item.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-4 text-sm font-medium text-muted">{title}</h2>
      {children}
    </div>
  );
}

export function StatsCards({ stats }: { stats: WaitlistStats }) {
  const last14Days = stats.byDay.slice(-14);
  const maxPerDay = Math.max(1, ...last14Days.map((d) => d.count));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Всего заявок">
        <p className="font-display text-4xl font-bold">{stats.total}</p>
      </Card>

      <Card title="По интересам">
        <BreakdownList items={stats.byInterestArea} />
      </Card>

      <Card title="По странам">
        <BreakdownList items={stats.byCountry} />
      </Card>

      <Card title="По дням (последние 14)">
        {last14Days.length === 0 ? (
          <p className="text-sm text-muted">Нет данных</p>
        ) : (
          <div className="flex h-24 items-end gap-1">
            {last14Days.map((d) => (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1" title={`${d.day}: ${d.count}`}>
                <div
                  className="w-full rounded-t bg-accent-warm"
                  style={{ height: `${(d.count / maxPerDay) * 100}%`, minHeight: d.count > 0 ? "2px" : 0 }}
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
