import { after } from "next/server";
import { handleUpdate, isValidWebhookSecret } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isValidWebhookSecret(request.headers.get("x-telegram-bot-api-secret-token"))) {
    return new Response("forbidden", { status: 403 });
  }

  let update;
  try {
    update = await request.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  // Telegram ждёт быстрый 200, иначе повторяет запрос, — обработку делаем уже после ответа.
  after(() => handleUpdate(update));
  return new Response("ok");
}
