import { pool } from "./db";
import { translateToAllLocales, type Translations } from "./translate";

export type IdeaComment = {
  id: string;
  authorName: string | null;
  country: string;
  text: string;
  translations: Translations;
  createdAt: string;
  isHidden?: boolean;
};

export type Idea = {
  id: string;
  category: string;
  authorName: string | null;
  country: string;
  universityName: string | null;
  text: string;
  translations: Translations;
  createdAt: string;
  comments: IdeaComment[];
  isHidden?: boolean;
};

type IdeaRow = {
  id: string;
  category: string;
  author_name: string | null;
  country: string;
  university_name: string | null;
  university_other_name: string | null;
  text: string;
  translations: Translations;
  created_at: Date;
  is_hidden?: boolean;
};

type CommentRow = {
  id: string;
  idea_id: string;
  author_name: string | null;
  country: string;
  text: string;
  translations: Translations;
  created_at: Date;
};

export type IdeaFilters = { country?: string; category?: string; limit?: number };

export async function listIdeas({ country, category, limit = 50 }: IdeaFilters = {}): Promise<Idea[]> {
  const ideasResult = await pool.query<IdeaRow>(
    `SELECT i.id, i.category, i.author_name, i.country, i.text, i.translations, i.created_at,
            i.university_other_name, u.name AS university_name
     FROM ideas i
     LEFT JOIN festival_universities u ON u.id = i.university_id
     WHERE NOT i.is_hidden
       AND ($1::text IS NULL OR i.country = $1)
       AND ($2::text IS NULL OR i.category = $2)
     ORDER BY i.created_at DESC
     LIMIT $3`,
    [country ?? null, category ?? null, limit],
  );

  return attachComments(ideasResult.rows, false);
}

// Для админки: все идеи и ответы, включая скрытые.
export async function listAllIdeas(): Promise<Idea[]> {
  const ideasResult = await pool.query<IdeaRow>(
    `SELECT i.id, i.category, i.author_name, i.country, i.text, i.translations, i.created_at,
            i.is_hidden, i.university_other_name, u.name AS university_name
     FROM ideas i
     LEFT JOIN festival_universities u ON u.id = i.university_id
     ORDER BY i.created_at DESC
     LIMIT 300`,
  );
  return attachComments(ideasResult.rows, true);
}

async function attachComments(rows: IdeaRow[], includeHidden: boolean): Promise<Idea[]> {
  if (rows.length === 0) return [];

  const commentsResult = await pool.query<CommentRow & { is_hidden: boolean }>(
    `SELECT id, idea_id, author_name, country, text, translations, created_at, is_hidden
     FROM idea_comments
     WHERE idea_id = ANY($1::uuid[]) AND ($2::boolean OR NOT is_hidden)
     ORDER BY created_at`,
    [rows.map((r) => r.id), includeHidden],
  );

  const commentsByIdea = new Map<string, IdeaComment[]>();
  for (const c of commentsResult.rows) {
    const list = commentsByIdea.get(c.idea_id) ?? [];
    list.push({
      id: c.id,
      authorName: c.author_name,
      country: c.country,
      text: c.text,
      translations: c.translations,
      createdAt: c.created_at.toISOString(),
      isHidden: c.is_hidden,
    });
    commentsByIdea.set(c.idea_id, list);
  }

  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    authorName: r.author_name,
    country: r.country,
    universityName: r.university_name ?? r.university_other_name,
    text: r.text,
    translations: r.translations,
    createdAt: r.created_at.toISOString(),
    comments: commentsByIdea.get(r.id) ?? [],
    isHidden: r.is_hidden,
  }));
}

export async function insertIdea(input: {
  category: string;
  authorName?: string;
  country: string;
  universityId?: string;
  universityOtherName?: string;
  text: string;
  sourceLocale: string;
}): Promise<string> {
  const result = await pool.query<{ id: string }>(
    `INSERT INTO ideas (category, author_name, country, university_id, university_other_name, text, source_locale)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [
      input.category,
      input.authorName ?? null,
      input.country,
      input.universityId || null,
      input.universityId ? null : input.universityOtherName || null,
      input.text,
      input.sourceLocale,
    ],
  );
  return result.rows[0].id;
}

export async function ideaExists(id: string): Promise<boolean> {
  const result = await pool.query(`SELECT 1 FROM ideas WHERE id = $1 AND NOT is_hidden`, [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function insertIdeaComment(input: {
  ideaId: string;
  authorName?: string;
  country: string;
  text: string;
  sourceLocale: string;
}): Promise<string> {
  const result = await pool.query<{ id: string }>(
    `INSERT INTO idea_comments (idea_id, author_name, country, text, source_locale)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [input.ideaId, input.authorName ?? null, input.country, input.text, input.sourceLocale],
  );
  return result.rows[0].id;
}

type TranslatableTable = "ideas" | "idea_comments";

export async function translateAndStore(table: TranslatableTable, id: string, text: string): Promise<boolean> {
  const translations = await translateToAllLocales(text);
  if (!translations) return false;
  // table — только из union выше, не пользовательский ввод.
  await pool.query(`UPDATE ${table} SET translations = $2::jsonb WHERE id = $1`, [id, JSON.stringify(translations)]);
  return true;
}

// Дозапуск перевода для записей, у которых его нет (например, ключ API добавили позже).
export async function translateMissing(): Promise<{ done: number; failed: number }> {
  let done = 0;
  let failed = 0;
  for (const table of ["ideas", "idea_comments"] as const) {
    const rows = await pool.query<{ id: string; text: string }>(
      `SELECT id, text FROM ${table} WHERE translations = '{}'::jsonb ORDER BY created_at DESC LIMIT 100`,
    );
    for (const row of rows.rows) {
      if (await translateAndStore(table, row.id, row.text)) done++;
      else failed++;
    }
  }
  return { done, failed };
}

export async function moderateIdeaItem(
  kind: "idea" | "comment",
  id: string,
  action: "hide" | "show" | "delete",
): Promise<void> {
  const table = kind === "idea" ? "ideas" : "idea_comments";
  if (action === "delete") {
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  } else {
    await pool.query(`UPDATE ${table} SET is_hidden = $2 WHERE id = $1`, [id, action === "hide"]);
  }
}
