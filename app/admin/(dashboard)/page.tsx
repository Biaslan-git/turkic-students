import { listAllWaitlistSignups, getWaitlistStats } from "@/lib/admin/waitlist";
import { StatsCards } from "@/components/admin/stats-cards";
import { WaitlistTable } from "@/components/admin/waitlist-table";

export default async function AdminDashboardPage() {
  const [records, stats] = await Promise.all([listAllWaitlistSignups(), getWaitlistStats()]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Waitlist</h1>
        <a
          href="/admin/api/export"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
        >
          Экспорт CSV
        </a>
      </div>
      <StatsCards stats={stats} />
      <WaitlistTable records={records} />
    </div>
  );
}
