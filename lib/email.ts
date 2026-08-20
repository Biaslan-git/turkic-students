import { Resend } from "resend";
import { TELEGRAM_CHANNEL_URL } from "./constants";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: "TURKIC STUDENTS <hello@turkicstudents.org>",
      to: email,
      subject: "Вы в списке TURKIC STUDENTS",
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
