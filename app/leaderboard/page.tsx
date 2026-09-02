import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { getSiteContent } from "@/lib/content/site-content";
import { getFestivalLeaderboard, type UniversityLeaderboardEntry } from "@/lib/festival-stats";

export const metadata: Metadata = {
  title: "Рейтинг вузов — TÜRKSOY STUDENTS",
};

// Та же причина, что и у app/page.tsx — контент и статистика читаются из БД на каждый
// запрос, а не на этапе сборки Docker-образа.
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const [c, leaderboard] = await Promise.all([getSiteContent(), getFestivalLeaderboard()]);

  const podium = leaderboard.universities.slice(0, 3);
  const rest = leaderboard.universities.slice(3);
  const max = Math.max(1, ...leaderboard.universities.map((u) => u.total));

  return (
    <div className="flex flex-1 flex-col">
      <Header ctaLabel={c.cta_label} />
      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden bg-tint-teal">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-accent-warm/20 sm:h-80 sm:w-80"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 bottom-0 select-none text-[11rem] leading-none opacity-[0.05] sm:text-[15rem]"
          >
            🏆
          </span>

          <div className="reveal-on-scroll relative mx-auto flex max-w-4xl flex-col gap-12 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="w-fit rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Твой голос — твой фестиваль
              </span>
              <h1 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Рейтинг вузов
              </h1>
              <p className="max-w-xl text-pretty text-muted">
                Специальный приз TÜRKSOY присуждается университету, сформировавшему наиболее
                многочисленную подтверждённую аудиторию участников инициативы «Твой голос — твой
                фестиваль».
              </p>

              <div className="relative mt-2 w-fit">
                <div
                  aria-hidden="true"
                  className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-accent-warm/25"
                />
                <div className="relative flex items-center gap-4 rounded-2xl border border-border bg-surface px-8 py-5 shadow-[0_16px_40px_-20px_rgba(26,26,46,0.35)]">
                  <span className="text-4xl" aria-hidden="true">
                    🏆
                  </span>
                  <div className="text-left">
                    <p className="font-display text-4xl font-bold">
                      {leaderboard.totalParticipants.toLocaleString("ru-RU")}
                    </p>
                    <p className="text-sm text-muted">участников инициативы</p>
                  </div>
                </div>
              </div>
            </div>

            {leaderboard.universities.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <Podium entries={podium} />
                {rest.length > 0 && (
                  <RestList entries={rest} max={max} startRank={podium.length + 1} />
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer ctaLabel={c.cta_label} text={c.footer_text} />
    </div>
  );
}

const MEDALS = ["🥇", "🥈", "🥉"];

function Podium({ entries }: { entries: UniversityLeaderboardEntry[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {entries.map((u, i) => (
        <div
          key={u.universityId}
          className={`relative flex h-full flex-col items-center gap-3 rounded-2xl border bg-surface p-6 text-center ${
            i === 0
              ? "border-accent-warm shadow-[0_20px_48px_-24px_rgba(26,26,46,0.35)] sm:order-2 sm:-translate-y-3"
              : i === 1
                ? "border-border sm:order-1"
                : "border-border sm:order-3"
          }`}
        >
          <span className="text-4xl" aria-hidden="true">
            {MEDALS[i]}
          </span>
          <p className="flex min-h-14 items-center font-display text-lg font-bold text-balance line-clamp-2">
            {u.universityName}
          </p>
          <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted">
            {u.country}
          </span>
          <div className="mt-auto flex flex-col items-center gap-1 pt-2">
            <p className="font-display text-2xl font-bold text-accent-warm">{u.total}</p>
            <p className="text-xs text-muted">
              студ. {u.students} / вып. {u.alumni}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RestList({
  entries,
  max,
  startRank,
}: {
  entries: UniversityLeaderboardEntry[];
  max: number;
  startRank: number;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-2">
      {entries.map((u, i) => (
        <div
          key={u.universityId}
          className="flex items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-background"
        >
          <span className="w-6 shrink-0 text-center text-sm font-semibold text-muted">
            {startRank + i}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{u.universityName}</p>
              <span className="shrink-0 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted">
                {u.country}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent-warm"
                style={{ width: `${(u.total / max) * 100}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 font-display text-lg font-bold">{u.total}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
      <span className="text-5xl" aria-hidden="true">
        🏆
      </span>
      <p className="font-display text-xl font-bold">Пока никто не присоединился</p>
      <p className="max-w-sm text-sm text-muted">
        Стань первым — и твой университет возглавит рейтинг.
      </p>
      <Link
        href="/#waitlist"
        className="rounded-xl bg-gradient-to-r from-accent-warm to-[#00d6c8] px-6 py-3 text-sm font-semibold text-accent-ink shadow-[0_10px_28px_-10px_var(--accent-warm)] transition-transform hover:scale-[1.02]"
      >
        Присоединиться
      </Link>
    </div>
  );
}
