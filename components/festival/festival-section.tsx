import { getFestivalLeaderboard, type UniversityLeaderboardEntry } from "@/lib/festival-stats";
import { listActiveUniversities } from "@/lib/universities";

type FestivalSectionProps = {
  badge: string;
  title: string;
  subtitle: string;
  text: string;
  alumniNote: string;
};

export async function FestivalSection({ badge, title, subtitle, text, alumniNote }: FestivalSectionProps) {
  const leaderboard = await getFestivalLeaderboard();
  const topUniversities = leaderboard.universities.slice(0, 3);
  const universities = await listActiveUniversities();

  return (
    <section id="tvoi-golos" className="relative scroll-mt-20 overflow-hidden bg-tint-teal">
      <div className="reveal-on-scroll relative mx-auto flex max-w-4xl flex-col items-center gap-10 px-5 pt-16 sm:px-8 sm:pt-24 md:flex-row md:gap-12 md:px-12">
        <FestivalStatsCard total={leaderboard.totalParticipants} universities={topUniversities} />
        <div className="flex flex-col gap-5 md:w-3/5">
          <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {badge}
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="font-display text-lg font-bold text-accent-warm">{subtitle}</p>
          <p className="text-pretty text-muted">{text}</p>
          <p className="text-pretty text-sm text-muted">{alumniNote}</p>
          <a
            href="#waitlist"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent-warm underline underline-offset-4"
          >
            Присоединиться <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div className="relative mx-auto max-w-4xl px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-24 md:px-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Вузы-участники
        </p>
        <div className="flex flex-wrap gap-1.5">
          {universities.map((university) => (
            <span
              key={university.id}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted"
            >
              {university.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FestivalStatsCard({
  total,
  universities,
}: {
  total: number;
  universities: UniversityLeaderboardEntry[];
}) {
  const hasParticipants = total > 0;
  const max = Math.max(1, ...universities.map((u) => u.total));

  return (
    <div className="relative w-full md:w-2/5 md:-ml-6">
      <div
        aria-hidden="true"
        className="absolute -bottom-5 -right-5 h-full w-full rounded-[3rem] bg-accent-warm/20"
      />
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-[3rem_1rem_3rem_1rem] border border-border bg-surface p-7 shadow-[0_20px_48px_-24px_rgba(26,26,46,0.35)]">
        <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Аудитория фестиваля
        </span>

        {hasParticipants ? (
          <>
            <div>
              <p className="font-display text-4xl font-bold">{total.toLocaleString("ru-RU")}</p>
              <p className="text-sm text-muted">присоединились к инициативе</p>
            </div>
            <ol className="flex flex-col gap-2.5">
              {universities.map((u, i) => (
                <li key={u.universityId} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">
                      {i + 1}. {u.universityName}
                    </span>
                    <span className="shrink-0 font-medium">{u.total}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-accent-warm"
                      style={{ width: `${(u.total / max) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>
            <a
              href="/leaderboard"
              className="text-sm font-semibold text-accent-warm underline underline-offset-4"
            >
              Смотреть весь рейтинг →
            </a>
          </>
        ) : (
          <div className="flex flex-col items-start gap-2">
            <span className="text-4xl" aria-hidden="true">
              🎓
            </span>
            <p className="font-display text-2xl font-bold">Список формируется</p>
            <p className="text-sm text-muted">
              Зарегистрируйся — и твой университет появится в рейтинге.
            </p>
          </div>
        )}
      </div>
      <span aria-hidden="true" className="absolute -bottom-3 -left-3 flex -space-x-2">
        <span className="h-5 w-5 rounded-full border-2 border-surface bg-accent" />
        <span className="h-5 w-5 rounded-full border-2 border-surface bg-accent-warm" />
        <span className="h-5 w-5 rounded-full border-2 border-surface bg-accent-ink" />
      </span>
    </div>
  );
}
