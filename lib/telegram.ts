import { timingSafeEqual } from "node:crypto";
import { fetch as undiciFetch, type Dispatcher } from "undici";
import { socksDispatcher } from "fetch-socks";
import { pool } from "./db";
import { OPINION_CATEGORIES } from "./constants";
import { countryFlag } from "./country";

// Бот модерации — на голом fetch, без библиотек-обёрток: обработчик вебхука (app/api/telegram/webhook)
// срабатывает только по событию, постоянных соединений и циклов нет. Все обращения к Telegram идут
// через SOCKS5 из TELEGRAM_PROXY_URL (сервер сам до api.telegram.org может не дотягиваться).

type Kind = "idea" | "comment";
type Status = "pending" | "published" | "hidden";

const TABLES: Record<Kind, "ideas" | "idea_comments"> = { idea: "ideas", comment: "idea_comments" };
const KIND_CODE: Record<string, Kind> = { i: "idea", c: "comment" };

let cachedDispatcher: Dispatcher | null | undefined;

function getDispatcher(): Dispatcher | null {
  if (cachedDispatcher !== undefined) return cachedDispatcher;
  const raw = process.env.TELEGRAM_PROXY_URL;
  if (!raw) return (cachedDispatcher = null);

  const url = new URL(raw);
  cachedDispatcher = socksDispatcher({
    type: url.protocol.startsWith("socks4") ? 4 : 5,
    host: url.hostname,
    port: Number(url.port || 1080),
    userId: url.username ? decodeURIComponent(url.username) : undefined,
    password: url.password ? decodeURIComponent(url.password) : undefined,
  });
  return cachedDispatcher;
}

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && getModeratorIds().length > 0);
}

function getModeratorIds(): string[] {
  return (process.env.TELEGRAM_MODERATOR_CHAT_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

type TgResponse<T> = { ok: boolean; result?: T; description?: string };

export async function tgCall<T = unknown>(method: string, payload: object): Promise<TgResponse<T>> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, description: "TELEGRAM_BOT_TOKEN не задан" };

  try {
    const response = await undiciFetch(`${process.env.TELEGRAM_API_BASE ?? "https://api.telegram.org"}/bot${token}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      dispatcher: getDispatcher() ?? undefined,
      signal: AbortSignal.timeout(15_000),
    });
    return (await response.json()) as TgResponse<T>;
  } catch (error) {
    // Ошибка может содержать URL с токеном — логируем только метод и код.
    console.error(`Telegram ${method} failed:`, (error as { cause?: { code?: string } }).cause?.code ?? "network error");
    return { ok: false, description: "network error" };
  }
}

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Item = {
  kind: Kind;
  id: string;
  status: Status;
  text: string;
  authorName: string | null;
  country: string;
  place: string | null;
  category: string | null;
  parentText: string | null;
  tgMessages: Record<string, number>;
};

async function loadItem(kind: Kind, id: string): Promise<Item | null> {
  if (kind === "idea") {
    const result = await pool.query(
      `SELECT i.id, i.status, i.text, i.author_name, i.country, i.category, i.tg_messages,
              COALESCE(u.name, i.university_other_name) AS place
       FROM ideas i LEFT JOIN festival_universities u ON u.id = i.university_id WHERE i.id = $1`,
      [id],
    );
    const r = result.rows[0];
    return r && { kind, id, status: r.status, text: r.text, authorName: r.author_name, country: r.country, place: r.place, category: r.category, parentText: null, tgMessages: r.tg_messages };
  }
  const result = await pool.query(
    `SELECT c.id, c.status, c.text, c.author_name, c.country, c.tg_messages, i.text AS parent_text
     FROM idea_comments c JOIN ideas i ON i.id = c.idea_id WHERE c.id = $1`,
    [id],
  );
  const r = result.rows[0];
  return r && { kind, id, status: r.status, text: r.text, authorName: r.author_name, country: r.country, place: null, category: null, parentText: r.parent_text, tgMessages: r.tg_messages };
}

const STATUS_LINE: Record<Status, string> = {
  pending: "⏳ <b>Ждёт решения</b>",
  published: "✅ <b>Опубликовано</b>",
  hidden: "🙈 <b>Скрыто</b>",
};

function renderMessage(item: Item) {
  const categoryLabel = OPINION_CATEGORIES.find((c) => c.value === item.category)?.label;
  const lines = [
    `${item.kind === "idea" ? "💡 <b>Новая идея</b>" : "💬 <b>Новый ответ</b>"} — ${STATUS_LINE[item.status]}`,
    "",
    `${escapeHtml(item.authorName || "Аноним")} · ${countryFlag(item.country)} ${item.country}${item.place ? ` · ${escapeHtml(item.place)}` : ""}`,
  ];
  if (categoryLabel) lines.push(`Направление: <i>${escapeHtml(categoryLabel)}</i>`);
  if (item.parentText) lines.push(`К идее: <i>${escapeHtml(item.parentText.slice(0, 160))}${item.parentText.length > 160 ? "…" : ""}</i>`);
  lines.push("", escapeHtml(item.text.slice(0, 3000)));

  const code = item.kind === "idea" ? "i" : "c";
  const publish = { text: "✅ Опубликовать", callback_data: `p:${code}:${item.id}` };
  const hide = { text: "🙈 Скрыть", callback_data: `h:${code}:${item.id}` };
  const buttons = item.status === "pending" ? [publish, hide] : item.status === "published" ? [hide] : [publish];

  return { text: lines.join("\n"), reply_markup: { inline_keyboard: [buttons] } };
}

// Новая запись → карточка с кнопками всем модераторам. Если бот не настроен или Telegram недоступен,
// запись остаётся pending — её можно опубликовать/скрыть из админки (/admin/ideas).
export async function notifyModerators(kind: Kind, id: string): Promise<void> {
  if (!isTelegramConfigured()) return;
  const item = await loadItem(kind, id);
  if (!item) return;

  const { text, reply_markup } = renderMessage(item);
  const sent: Record<string, number> = {};
  await Promise.all(
    getModeratorIds().map(async (chatId) => {
      const response = await tgCall<{ message_id: number }>("sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        reply_markup,
        disable_web_page_preview: true,
      });
      if (response.ok && response.result) sent[chatId] = response.result.message_id;
    }),
  );

  if (Object.keys(sent).length > 0) {
    await pool.query(`UPDATE ${TABLES[kind]} SET tg_messages = $2::jsonb WHERE id = $1`, [id, JSON.stringify(sent)]);
  }
}

async function refreshCards(kind: Kind, id: string): Promise<void> {
  const item = await loadItem(kind, id);
  if (!item) return;
  const { text, reply_markup } = renderMessage(item);
  await Promise.all(
    Object.entries(item.tgMessages).map(([chatId, messageId]) =>
      tgCall("editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: "HTML", reply_markup, disable_web_page_preview: true }),
    ),
  );
}

type Update = {
  message?: { text?: string; chat: { id: number; type: string } };
  callback_query?: { id: string; data?: string; from: { id: number } };
};

export async function handleUpdate(update: Update): Promise<void> {
  const callback = update.callback_query;
  if (callback) {
    const match = /^([ph]):([ic]):([0-9a-f-]{36})$/.exec(callback.data ?? "");
    if (!match || !getModeratorIds().includes(String(callback.from.id))) {
      await tgCall("answerCallbackQuery", { callback_query_id: callback.id, text: "Нет доступа", show_alert: true });
      return;
    }

    const kind = KIND_CODE[match[2]];
    const status: Status = match[1] === "p" ? "published" : "hidden";
    // Повторное нажатие безопасно: статус просто ставится заново.
    const result = await pool.query(`UPDATE ${TABLES[kind]} SET status = $2 WHERE id = $1`, [match[3], status]);
    await tgCall("answerCallbackQuery", {
      callback_query_id: callback.id,
      text: result.rowCount ? (status === "published" ? "Опубликовано" : "Скрыто") : "Запись не найдена",
    });
    if (result.rowCount) await refreshCards(kind, match[3]);
    return;
  }

  // Единственная команда: /start подсказывает chat_id для TELEGRAM_MODERATOR_CHAT_IDS.
  const message = update.message;
  if (message?.text?.startsWith("/start") && message.chat.type === "private") {
    const isModerator = getModeratorIds().includes(String(message.chat.id));
    await tgCall("sendMessage", {
      chat_id: message.chat.id,
      parse_mode: "HTML",
      text: isModerator
        ? "Вы модератор: сюда будут приходить новые идеи и ответы с кнопками «Опубликовать» и «Скрыть»."
        : `Ваш chat_id: <code>${message.chat.id}</code>\nДобавьте его в переменную TELEGRAM_MODERATOR_CHAT_IDS, чтобы получать мнения на модерацию.`,
    });
  }
}

export function isValidWebhookSecret(received: string | null): boolean {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || !received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Вызывается один раз при старте сервера (instrumentation.ts): регистрирует вебхук, чтобы не
// запускать отдельные скрипты. Повторная регистрация с теми же параметрами — no-op для Telegram.
export async function ensureWebhook(): Promise<void> {
  if (process.env.NODE_ENV !== "production" || !process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_WEBHOOK_SECRET) return;
  const url = process.env.TELEGRAM_WEBHOOK_URL || (process.env.SITE_URL ? `${process.env.SITE_URL}/api/telegram/webhook` : "");
  if (!url) return;

  const response = await tgCall("setWebhook", {
    url,
    secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ["message", "callback_query"],
    max_connections: 5,
  });
  console.log(response.ok ? `Telegram webhook set: ${url}` : `Telegram webhook NOT set: ${response.description}`);
}
