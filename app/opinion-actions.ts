"use server";

import { getTranslations } from "next-intl/server";
import { insertGuestOpinion } from "@/lib/guest-opinions";
import { makeGuestOpinionSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/get-client-ip";

export type GuestOpinionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitGuestOpinion(
  _prevState: GuestOpinionState,
  formData: FormData,
): Promise<GuestOpinionState> {
  const [tValidation, tErrors] = await Promise.all([
    getTranslations("Validation"),
    getTranslations("Errors"),
  ]);

  const guestOpinionSchema = makeGuestOpinionSchema({
    opinionCategoryRequired: tValidation("opinionCategoryRequired"),
    opinionTextRequired: tValidation("opinionTextRequired"),
  });

  const parsed = guestOpinionSchema.safeParse({
    category: formData.get("category"),
    text: formData.get("text"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return { status: "error", message: tErrors("chooseCategoryAndWrite") };
  }

  // Honeypot triggered — silently pretend nothing happened.
  if (parsed.data.company) {
    return { status: "idle" };
  }

  const ip = await getClientIp();
  if (isRateLimited(`opinion:${ip}`)) {
    return { status: "error", message: tErrors("tooManyAttempts") };
  }

  await insertGuestOpinion(parsed.data.category, parsed.data.text);

  return { status: "success" };
}
