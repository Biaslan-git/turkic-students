import { pool } from "@/lib/db";

export type GuestOpinionRecord = {
  id: string;
  category: string;
  text: string;
  createdAt: string;
};

export async function listGuestOpinions(): Promise<GuestOpinionRecord[]> {
  const result = await pool.query<{
    id: string;
    category: string;
    text: string;
    created_at: Date;
  }>(`SELECT id, category, text, created_at FROM guest_opinions ORDER BY created_at DESC`);

  return result.rows.map((r) => ({
    id: r.id,
    category: r.category,
    text: r.text,
    createdAt: r.created_at.toISOString(),
  }));
}
