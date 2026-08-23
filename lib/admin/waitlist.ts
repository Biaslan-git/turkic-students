import { pool } from "@/lib/db";

export type WaitlistSignupRecord = {
  id: string;
  name: string;
  email: string;
  country: string | null;
  placeOfStudy: string | null;
  interestArea: string | null;
  createdAt: string;
};

export async function listAllWaitlistSignups(): Promise<WaitlistSignupRecord[]> {
  const result = await pool.query<{
    id: string;
    name: string;
    email: string;
    country: string | null;
    place_of_study: string | null;
    interest_area: string | null;
    created_at: Date;
  }>(
    `SELECT id, name, email, country, place_of_study, interest_area, created_at
     FROM waitlist_signups
     ORDER BY created_at DESC`,
  );

  return result.rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    country: r.country,
    placeOfStudy: r.place_of_study,
    interestArea: r.interest_area,
    createdAt: r.created_at.toISOString(),
  }));
}

export type WaitlistStats = {
  total: number;
  byInterestArea: { key: string; count: number }[];
  byCountry: { key: string; count: number }[];
  byDay: { day: string; count: number }[];
};

export async function getWaitlistStats(): Promise<WaitlistStats> {
  const [total, byInterestArea, byCountry, byDay] = await Promise.all([
    pool.query<{ count: string }>(`SELECT count(*) AS count FROM waitlist_signups`),
    pool.query<{ key: string; count: string }>(
      `SELECT coalesce(interest_area, 'unspecified') AS key, count(*) AS count
       FROM waitlist_signups GROUP BY key ORDER BY count DESC`,
    ),
    pool.query<{ key: string; count: string }>(
      `SELECT coalesce(country, 'unspecified') AS key, count(*) AS count
       FROM waitlist_signups GROUP BY key ORDER BY count DESC LIMIT 10`,
    ),
    pool.query<{ day: string; count: string }>(
      `SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, count(*) AS count
       FROM waitlist_signups GROUP BY day ORDER BY day ASC`,
    ),
  ]);

  return {
    total: Number(total.rows[0]?.count ?? 0),
    byInterestArea: byInterestArea.rows.map((r) => ({ key: r.key, count: Number(r.count) })),
    byCountry: byCountry.rows.map((r) => ({ key: r.key, count: Number(r.count) })),
    byDay: byDay.rows.map((r) => ({ day: r.day, count: Number(r.count) })),
  };
}
