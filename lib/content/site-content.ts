import { cache } from "react";
import { pool } from "@/lib/db";

export type SiteContent = Record<string, string>;

export const getSiteContent = cache(async (locale: string = "ru"): Promise<SiteContent> => {
  if (locale === "ru") {
    const result = await pool.query<{ key: string; value: string }>(
      `SELECT key, value FROM site_content WHERE locale = 'ru'`,
    );
    return Object.fromEntries(result.rows.map((r) => [r.key, r.value]));
  }

  // Пока переводы контента не заведены для конкретной локали — берём русский оригинал
  // как fallback, чтобы страница не разваливалась на непереведённых ключах.
  const result = await pool.query<{ key: string; value: string; locale: string }>(
    `SELECT key, value, locale FROM site_content WHERE locale IN ($1, 'ru') ORDER BY locale = 'ru'`,
    [locale],
  );
  const merged: SiteContent = {};
  for (const row of result.rows) {
    if (!(row.key in merged)) merged[row.key] = row.value;
  }
  return merged;
});
