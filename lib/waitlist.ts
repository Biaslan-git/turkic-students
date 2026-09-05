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
  data: {
    role: string;
    universityId?: string;
    universityOtherName?: string;
    graduationYear?: number;
  },
): Promise<{ email: string; name: string; alreadyRegistered: boolean } | null> {
  const updated = await pool.query<{ email: string; name: string }>(
    `UPDATE waitlist_signups
     SET role = $2,
         university_id = NULLIF($3, '')::uuid,
         university_other_name = NULLIF($4, ''),
         graduation_year = $5,
         registered_at = now()
     WHERE id = $1 AND registered_at IS NULL
     RETURNING email, name`,
    [
      id,
      data.role,
      data.universityId ?? "",
      data.universityOtherName ?? "",
      data.graduationYear ?? null,
    ],
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
