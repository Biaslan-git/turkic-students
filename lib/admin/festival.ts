import { pool } from "@/lib/db";

export type FestivalOpinionRecord = {
  id: string;
  role: string;
  name: string;
  email: string;
  universityName: string;
  country: string | null;
  opinionCategory: string;
  opinionText: string | null;
  createdAt: string;
};

export async function listFestivalOpinions(): Promise<FestivalOpinionRecord[]> {
  const result = await pool.query<{
    id: string;
    role: string;
    name: string;
    email: string;
    university_name: string;
    country: string | null;
    opinion_category: string;
    opinion_text: string | null;
    created_at: Date;
  }>(
    `SELECT w.id, w.role, w.name, w.email,
            COALESCE(u.name, w.university_other_name) AS university_name, u.country,
            w.opinion_category, w.opinion_text, w.created_at
     FROM waitlist_signups w
     LEFT JOIN festival_universities u ON u.id = w.university_id
     WHERE w.opinion_category IS NOT NULL
     ORDER BY w.created_at DESC`,
  );

  return result.rows.map((r) => ({
    id: r.id,
    role: r.role,
    name: r.name,
    email: r.email,
    universityName: r.university_name,
    country: r.country,
    opinionCategory: r.opinion_category,
    opinionText: r.opinion_text,
    createdAt: r.created_at.toISOString(),
  }));
}

export type FestivalUniversityAdminRecord = {
  id: string;
  name: string;
  country: string;
  isActive: boolean;
  registrationCount: number;
};

export async function listFestivalUniversitiesAdmin(): Promise<FestivalUniversityAdminRecord[]> {
  const result = await pool.query<{
    id: string;
    name: string;
    country: string;
    is_active: boolean;
    registration_count: string;
  }>(
    `SELECT u.id, u.name, u.country, u.is_active, count(w.id) AS registration_count
     FROM festival_universities u
     LEFT JOIN waitlist_signups w ON w.university_id = u.id
     GROUP BY u.id, u.name, u.country, u.is_active
     ORDER BY u.country, u.name`,
  );

  return result.rows.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    isActive: r.is_active,
    registrationCount: Number(r.registration_count),
  }));
}

export type CreateUniversityResult = { status: "success" | "duplicate"; id?: string };

export async function createFestivalUniversity(
  name: string,
  country: string,
): Promise<CreateUniversityResult> {
  const inserted = await pool.query<{ id: string }>(
    `INSERT INTO festival_universities (name, country)
     VALUES ($1, $2)
     ON CONFLICT (lower(name), lower(country)) DO NOTHING
     RETURNING id`,
    [name, country],
  );

  if (inserted.rows[0]) {
    return { status: "success", id: inserted.rows[0].id };
  }

  return { status: "duplicate" };
}

export type OtherUniversitySubmission = {
  name: string;
  email: string;
  universityOtherName: string;
  createdAt: string;
};

export async function listOtherUniversitySubmissions(): Promise<OtherUniversitySubmission[]> {
  const result = await pool.query<{
    name: string;
    email: string;
    university_other_name: string;
    created_at: Date;
  }>(
    `SELECT name, email, university_other_name, created_at
     FROM waitlist_signups
     WHERE university_other_name IS NOT NULL
     ORDER BY created_at DESC`,
  );

  return result.rows.map((r) => ({
    name: r.name,
    email: r.email,
    universityOtherName: r.university_other_name,
    createdAt: r.created_at.toISOString(),
  }));
}

export async function setFestivalUniversityActive(id: string, isActive: boolean): Promise<boolean> {
  const result = await pool.query(`UPDATE festival_universities SET is_active = $2 WHERE id = $1`, [
    id,
    isActive,
  ]);
  return (result.rowCount ?? 0) > 0;
}
