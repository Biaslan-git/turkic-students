import { pool } from "./db";
import { withTtlCache } from "./ttl-cache";

export type UniversityLeaderboardEntry = {
  universityId: string;
  universityName: string;
  country: string;
  students: number;
  alumni: number;
  total: number;
};

export type FestivalLeaderboard = {
  totalParticipants: number;
  universities: UniversityLeaderboardEntry[];
};

// Пересчитывается раз в 30с, а не на каждый заход — QR-код печатается большим
// тиражом и страница может получать всплески трафика, которые не должны бить
// в Postgres тяжёлым GROUP BY на каждый рендер.
async function loadFestivalLeaderboard(): Promise<FestivalLeaderboard> {
  const [totalResult, byUniversity] = await Promise.all([
    pool.query<{ count: string }>(
      `SELECT count(*) AS count FROM waitlist_signups WHERE role IS NOT NULL`,
    ),
    pool.query<{
      university_id: string;
      name: string;
      country: string;
      students: string;
      alumni: string;
    }>(
      `SELECT u.id AS university_id, u.name, u.country,
              count(*) FILTER (WHERE w.role = 'student') AS students,
              count(*) FILTER (WHERE w.role = 'alumnus') AS alumni
       FROM waitlist_signups w
       JOIN festival_universities u ON u.id = w.university_id
       GROUP BY u.id, u.name, u.country
       ORDER BY count(*) DESC`,
    ),
  ]);

  return {
    totalParticipants: Number(totalResult.rows[0]?.count ?? 0),
    universities: byUniversity.rows.map((r) => ({
      universityId: r.university_id,
      universityName: r.name,
      country: r.country,
      students: Number(r.students),
      alumni: Number(r.alumni),
      total: Number(r.students) + Number(r.alumni),
    })),
  };
}

export const getFestivalLeaderboard = withTtlCache(loadFestivalLeaderboard, 30_000);
