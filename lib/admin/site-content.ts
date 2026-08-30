import { pool } from "@/lib/db";
import { CONTENT_FIELDS } from "@/lib/content/fields";
import { snapshotCurrentContent } from "@/lib/admin/site-content-history";

export async function updateSiteContent(values: Record<string, string>): Promise<void> {
  const keys = CONTENT_FIELDS.map((f) => f.key);
  const trimmedValues = keys.map((key) => (values[key] ?? "").trim());

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await snapshotCurrentContent(client);
    await client.query(
      `INSERT INTO site_content (key, value)
       SELECT * FROM UNNEST($1::text[], $2::text[])
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [keys, trimmedValues],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
