import { pool } from "./db";

export type WaitlistBasicRecord = {
  id: string;
  name: string;
  email: string;
};

export async function insertWaitlistSignup(
  name: string,
  email: string,
): Promise<WaitlistBasicRecord | null> {
  const inserted = await pool.query<WaitlistBasicRecord>(
    `INSERT INTO waitlist_signups (name, email)
     VALUES ($1, $2)
     ON CONFLICT (lower(email)) DO NOTHING
     RETURNING id, name, email`,
    [name, email],
  );

  if (inserted.rows[0]) {
    return inserted.rows[0];
  }

  const existing = await pool.query<WaitlistBasicRecord>(
    `SELECT id, name, email FROM waitlist_signups WHERE lower(email) = lower($1)`,
    [email],
  );

  return existing.rows[0] ?? null;
}

export async function updateWaitlistDetails(
  id: string,
  data: { country?: string; placeOfStudy?: string; interestArea?: string },
): Promise<{ email: string; name: string } | null> {
  const result = await pool.query<{ email: string; name: string }>(
    `UPDATE waitlist_signups
     SET country = NULLIF($2, ''),
         place_of_study = NULLIF($3, ''),
         interest_area = NULLIF($4, '')
     WHERE id = $1
     RETURNING email, name`,
    [id, data.country ?? "", data.placeOfStudy ?? "", data.interestArea ?? ""],
  );

  return result.rows[0] ?? null;
}
