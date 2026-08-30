import { cache } from "react";
import { pool } from "@/lib/db";

export type SiteContent = Record<string, string>;

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const result = await pool.query<{ key: string; value: string }>(`SELECT key, value FROM site_content`);
  return Object.fromEntries(result.rows.map((r) => [r.key, r.value]));
});
