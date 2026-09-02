"use server";

import { insertWaitlistSignup, updateWaitlistDetails } from "@/lib/waitlist";
import { waitlistBasicSchema, waitlistDetailsSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/get-client-ip";

export type WaitlistBasicState = {
  status: "idle" | "step2" | "error";
  message?: string;
  id?: string;
};

export type WaitlistDetailsState = {
  status: "idle" | "success" | "error";
  message?: string;
};

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
    role: formData.get("role"),
    universityId: formData.get("universityId"),
    graduationYear: formData.get("graduationYear"),
    opinionCategory: formData.get("opinionCategory"),
    opinionText: formData.get("opinionText"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Проверьте заполненные поля" };
  }

  const updated = await updateWaitlistDetails(parsed.data.id, {
    role: parsed.data.role,
    universityId: parsed.data.universityId,
    graduationYear: parsed.data.graduationYear,
    opinionCategory: parsed.data.opinionCategory,
    opinionText: parsed.data.opinionText,
  });

  if (!updated) {
    return { status: "error", message: "Заявка не найдена" };
  }

  return { status: "success" };
}
