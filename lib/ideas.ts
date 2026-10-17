import { pool } from "./db";
import { translateText } from "./translate";

export type Translations = Record<string, string>;
export type PostStatus = "pending" | "published" | "hidden";

export type IdeaComment = {
  id: string;
  authorName: string | null;
  country: string;
  text: string;
  translations: Translations;
  createdAt: string;
  status: PostStatus;
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
  status: PostStatus;
};

type IdeaRow = {
  id: string;
  category: string;
  author_name: string | null;
  country: string;
  university_name: string | null;
  university_names: Record<string, string> | null;
  university_other_name: string | null;
  text: string;
  translations: Translations;
  created_at: Date;
  status: PostStatus;
};

type CommentRow = {
  id: string;
  idea_id: string;
  author_name: string | null;
  country: string;
  text: string;
  translations: Translations;
  created_at: Date;
  status: PostStatus;
};

export type IdeaFilters = { country?: string; category?: string; limit?: number; mine?: string[]; locale?: string };

// mine — id записей этого посетителя (cookie): свои идеи/ответы на модерации он видит, чужие — нет.
export async function listIdeas({ country, category, limit = 50, mine = [], locale = "ru" }: IdeaFilters = {}): Promise<Idea[]> {
  const ideasResult = await pool.query<IdeaRow>(
    `SELECT i.id, i.category, i.author_name, i.country, i.text, i.translations, i.created_at, i.status,
            i.university_other_name, u.name AS university_name, u.name_i18n AS university_names
     FROM ideas i
     LEFT JOIN festival_universities u ON u.id = i.university_id
     WHERE (i.status = 'published' OR (i.status = 'pending' AND i.id = ANY($4::uuid[])))
       AND ($1::text IS NULL OR i.country = $1)
       AND ($2::text IS NULL OR i.category = $2)
     ORDER BY i.created_at DESC
     LIMIT $3`,
    [country ?? null, category ?? null, limit, mine],
  );

  return attachComments(ideasResult.rows, false, locale, mine);
}

// Для админки: все идеи и ответы, включая скрытые.
export async function listAllIdeas(): Promise<Idea[]> {
  const ideasResult = await pool.query<IdeaRow>(
    `SELECT i.id, i.category, i.author_name, i.country, i.text, i.translations, i.created_at,
            i.status, i.university_other_name, u.name AS university_name, u.name_i18n AS university_names
     FROM ideas i
     LEFT JOIN festival_universities u ON u.id = i.university_id
     ORDER BY i.created_at DESC
     LIMIT 300`,
  );
  return attachComments(ideasResult.rows, true, "ru");
}

async function attachComments(rows: IdeaRow[], includeAll: boolean, locale: string, mine: string[] = []): Promise<Idea[]> {
  if (rows.length === 0) return [];

  const commentsResult = await pool.query<CommentRow>(
    `SELECT id, idea_id, author_name, country, text, translations, created_at, status
     FROM idea_comments
     WHERE idea_id = ANY($1::uuid[])
       AND ($2::boolean OR status = 'published' OR (status = 'pending' AND id = ANY($3::uuid[])))
     ORDER BY created_at`,
    [rows.map((r) => r.id), includeAll, mine],
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
      status: c.status,
    });
    commentsByIdea.set(c.idea_id, list);
  }

  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    authorName: r.author_name,
    country: r.country,
    universityName: (r.university_names?.[locale] || r.university_name) ?? r.university_other_name,
    text: r.text,
    translations: r.translations,
    createdAt: r.created_at.toISOString(),
    comments: commentsByIdea.get(r.id) ?? [],
    status: r.status,
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

export async function ideaExists(id: string, mine: string[] = []): Promise<boolean> {
  const result = await pool.query(
    `SELECT 1 FROM ideas WHERE id = $1 AND (status = 'published' OR (status = 'pending' AND id = ANY($2::uuid[])))`,
    [id, mine],
  );
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

// Переводим лениво — только на тот язык, на котором запись реально открыли, и кэшируем в
// БД: бесплатный лимит переводчика (lib/translate.ts) тратится только на нужное.
// inFlight не даёт нескольким одновременным заходам переводить одно и то же дважды.
const inFlight = new Set<string>();
const MAX_PER_RENDER = 8;

export async function ensureTranslations(ideas: Idea[], locale: string): Promise<void> {
  const pending: { table: TranslatableTable; id: string; text: string }[] = [];
  for (const idea of ideas) {
    if (!(locale in idea.translations)) pending.push({ table: "ideas", id: idea.id, text: idea.text });
    for (const c of idea.comments) {
      if (!(locale in c.translations)) pending.push({ table: "idea_comments", id: c.id, text: c.text });
    }
  }

  for (const item of pending.slice(0, MAX_PER_RENDER)) {
    const key = `${item.id}:${locale}`;
    if (inFlight.has(key)) continue;
    inFlight.add(key);
    try {
      const translated = await translateText(item.text, locale);
      if (translated === null) return; // лимит или сбой — не долбим сервис дальше, повторим на следующем заходе
      // table — только из union выше, не пользовательский ввод.
      await pool.query(
        `UPDATE ${item.table} SET translations = translations || jsonb_build_object($2::text, $3::text) WHERE id = $1`,
        [item.id, locale, translated],
      );
    } finally {
      inFlight.delete(key);
    }
  }
}

export async function moderateIdeaItem(
  kind: "idea" | "comment",
  id: string,
  action: "publish" | "hide" | "delete",
): Promise<void> {
  const table = kind === "idea" ? "ideas" : "idea_comments";
  if (action === "delete") {
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  } else {
    await pool.query(`UPDATE ${table} SET status = $2 WHERE id = $1`, [id, action === "publish" ? "published" : "hidden"]);
  }
}
