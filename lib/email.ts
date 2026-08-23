import { Resend } from "resend";
import { TELEGRAM_CHANNEL_URL } from "./constants";

export async function sendWelcomeEmail(email: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set — skipping welcome email");
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "TÜRKSOY STUDENTS <hello@turkicstudents.org>",
      to: email,
      subject: "Вы в списке TÜRKSOY STUDENTS",
      html: `
        <p>Здравствуйте, ${escapeHtml(name)}!</p>
        <p>Спасибо за регистрацию. Мы напишем вам, как только платформа откроется.</p>
        <p>А пока — подпишитесь на наш Telegram-канал, там будут все новости:</p>
        <p><a href="${TELEGRAM_CHANNEL_URL}">${TELEGRAM_CHANNEL_URL}</a></p>
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
