import { pool } from "./db";

export type University = { id: string; name: string; country: string };

export async function listActiveUniversities(): Promise<University[]> {
  const result = await pool.query<University>(
    `SELECT id, name, country FROM festival_universities
     WHERE is_active ORDER BY country, name`,
  );
  return result.rows;
}
