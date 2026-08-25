import { pool } from "./db";

export type WaitlistBasicRecord = {
  id: string;
  name: string;
  email: string;
  isRegistered: boolean;
};

export async function insertWaitlistSignup(
  name: string,
  email: string,
): Promise<WaitlistBasicRecord | null> {
  const inserted = await pool.query<{ id: string; name: string; email: string }>(
    `INSERT INTO waitlist_signups (name, email)
     VALUES ($1, $2)
     ON CONFLICT (lower(email)) DO NOTHING
     RETURNING id, name, email`,
    [name, email],
  );

  if (inserted.rows[0]) {
    return { ...inserted.rows[0], isRegistered: false };
  }

  const existing = await pool.query<WaitlistBasicRecord>(
    `SELECT id, name, email, registered_at IS NOT NULL AS "isRegistered"
     FROM waitlist_signups WHERE lower(email) = lower($1)`,
    [email],
  );

  return existing.rows[0] ?? null;
}

export async function updateWaitlistDetails(
  id: string,
  data: { country?: string; placeOfStudy?: string; interestArea?: string },
): Promise<{ email: string; name: string; alreadyRegistered: boolean } | null> {
  const updated = await pool.query<{ email: string; name: string }>(
    `UPDATE waitlist_signups
     SET country = NULLIF($2, ''),
         place_of_study = NULLIF($3, ''),
         interest_area = NULLIF($4, ''),
         registered_at = now()
     WHERE id = $1 AND registered_at IS NULL
     RETURNING email, name`,
    [id, data.country ?? "", data.placeOfStudy ?? "", data.interestArea ?? ""],
  );

  if (updated.rows[0]) {
    return { ...updated.rows[0], alreadyRegistered: false };
  }

  const existing = await pool.query<{ email: string; name: string }>(
    `SELECT email, name FROM waitlist_signups WHERE id = $1`,
    [id],
  );

  if (!existing.rows[0]) {
    return null;
  }

  return { ...existing.rows[0], alreadyRegistered: true };
}
