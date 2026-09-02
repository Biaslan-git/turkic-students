import { pool } from "./db";

export async function insertGuestOpinion(category: string, text: string): Promise<string> {
  const result = await pool.query<{ id: string }>(
    `INSERT INTO guest_opinions (category, text) VALUES ($1, $2) RETURNING id`,
    [category, text],
  );
  return result.rows[0].id;
}
