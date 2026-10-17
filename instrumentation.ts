export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { ensureWebhook } = await import("./lib/telegram");
  void ensureWebhook();
}
