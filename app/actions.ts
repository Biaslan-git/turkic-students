"use server";

import { headers } from "next/headers";
import { insertWaitlistSignup, updateWaitlistDetails } from "@/lib/waitlist";
import { sendWelcomeEmail } from "@/lib/email";
import { waitlistBasicSchema, waitlistDetailsSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";

export type WaitlistBasicState = {
  status: "idle" | "step2" | "error";
  message?: string;
  id?: string;
};

export type WaitlistDetailsState = {
  status: "idle" | "success" | "error";
  message?: string;
};

async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

export async function submitWaitlistBasic(
  _prevState: WaitlistBasicState,
  formData: FormData,
): Promise<WaitlistBasicState> {
  const parsed = waitlistBasicSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Проверьте имя и email" };
  }

  // Honeypot triggered — silently pretend nothing happened.
  if (parsed.data.company) {
    return { status: "idle" };
  }

  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return { status: "error", message: "Слишком много попыток, попробуйте позже" };
  }

  const record = await insertWaitlistSignup(parsed.data.name, parsed.data.email);
  if (!record) {
    return { status: "error", message: "Не удалось сохранить, попробуйте ещё раз" };
  }

  if (record.isRegistered) {
    return { status: "error", message: "Вы уже зарегистрированы в списке ожидания" };
  }

  return { status: "step2", id: record.id };
}

export async function submitWaitlistDetails(
  _prevState: WaitlistDetailsState,
  formData: FormData,
): Promise<WaitlistDetailsState> {
  const parsed = waitlistDetailsSchema.safeParse({
    id: formData.get("id"),
    country: formData.get("country"),
    placeOfStudy: formData.get("placeOfStudy"),
    interestArea: formData.get("interestArea"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Не удалось сохранить данные" };
  }

  const updated = await updateWaitlistDetails(parsed.data.id, {
    country: parsed.data.country,
    placeOfStudy: parsed.data.placeOfStudy,
    interestArea: parsed.data.interestArea,
  });

  if (!updated) {
    return { status: "error", message: "Заявка не найдена" };
  }

  if (!updated.alreadyRegistered) {
    void sendWelcomeEmail(updated.email, updated.name);
  }

  return { status: "success" };
}
