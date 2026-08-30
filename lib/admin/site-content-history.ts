import type { PoolClient } from "pg";
import { pool } from "@/lib/db";
import { CONTENT_FIELDS } from "@/lib/content/fields";

const MAX_HISTORY_ENTRIES = 20;

/** Snapshots the current site_content table and trims history to the most recent entries. */
export async function snapshotCurrentContent(client: PoolClient): Promise<void> {
  await client.query(
    `INSERT INTO site_content_history (content)
     SELECT coalesce(jsonb_object_agg(key, value), '{}'::jsonb) FROM site_content`,
  );
  await client.query(
    `DELETE FROM site_content_history
     WHERE id NOT IN (SELECT id FROM site_content_history ORDER BY created_at DESC LIMIT $1)`,
    [MAX_HISTORY_ENTRIES],
  );
}

export type ContentHistoryEntry = { id: string; createdAt: string };

export async function listContentHistory(): Promise<ContentHistoryEntry[]> {
  const result = await pool.query<{ id: string; created_at: Date }>(
    `SELECT id, created_at FROM site_content_history ORDER BY created_at DESC LIMIT $1`,
    [MAX_HISTORY_ENTRIES],
  );
  return result.rows.map((r) => ({ id: r.id, createdAt: r.created_at.toISOString() }));
}

export async function restoreContentSnapshot(id: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const snapshot = await client.query<{ content: Record<string, string> }>(
      `SELECT content FROM site_content_history WHERE id = $1`,
      [id],
    );
    if (!snapshot.rows[0]) {
      await client.query("ROLLBACK");
      return false;
    }

    // Restoring is itself a save — snapshot the current state first so it can be undone too.
    await snapshotCurrentContent(client);

    const validKeys = new Set(CONTENT_FIELDS.map((f) => f.key));
    const entries = Object.entries(snapshot.rows[0].content).filter(([key]) => validKeys.has(key));

    if (entries.length > 0) {
      await client.query(
        `INSERT INTO site_content (key, value)
         SELECT * FROM UNNEST($1::text[], $2::text[])
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [entries.map(([k]) => k), entries.map(([, v]) => v)],
      );
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
