"use server";

import { getTranslations } from "next-intl/server";
import { insertWaitlistSignup, updateWaitlistDetails } from "@/lib/waitlist";
import { makeWaitlistBasicSchema, makeWaitlistDetailsSchema } from "@/lib/validation";
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
  const [tValidation, tErrors] = await Promise.all([
    getTranslations("Validation"),
    getTranslations("Errors"),
  ]);

  const waitlistBasicSchema = makeWaitlistBasicSchema({
    nameRequired: tValidation("nameRequired"),
    emailRequired: tValidation("emailRequired"),
    emailInvalid: tValidation("emailInvalid"),
  });

  const parsed = waitlistBasicSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return { status: "error", message: tErrors("checkNameEmail") };
  }

  // Honeypot triggered — silently pretend nothing happened.
  if (parsed.data.company) {
    return { status: "idle" };
  }

  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return { status: "error", message: tErrors("tooManyAttempts") };
  }

  const record = await insertWaitlistSignup(parsed.data.name, parsed.data.email);
  if (!record) {
    return { status: "error", message: tErrors("saveFailed") };
  }

  if (record.isRegistered) {
    return { status: "error", message: tErrors("alreadyRegistered") };
  }

  return { status: "step2", id: record.id };
}

export async function submitWaitlistDetails(
  _prevState: WaitlistDetailsState,
  formData: FormData,
): Promise<WaitlistDetailsState> {
  const [tValidation, tErrors] = await Promise.all([
    getTranslations("Validation"),
    getTranslations("Errors"),
  ]);

  const waitlistDetailsSchema = makeWaitlistDetailsSchema({
    universityOtherNameRequired: tValidation("universityOtherNameRequired"),
    universityRequired: tValidation("universityRequired"),
  });

  const parsed = waitlistDetailsSchema.safeParse({
    id: formData.get("id"),
    role: formData.get("role"),
    universityId: formData.get("universityId") ?? "",
    universityOtherName: formData.get("universityOtherName") ?? "",
    graduationYear: formData.get("graduationYear"),
  });

  if (!parsed.success) {
    return { status: "error", message: tErrors("checkFields") };
  }

  const updated = await updateWaitlistDetails(parsed.data.id, {
    role: parsed.data.role,
    universityId: parsed.data.universityId,
    universityOtherName: parsed.data.universityOtherName,
    graduationYear: parsed.data.graduationYear,
  });

  if (!updated) {
    return { status: "error", message: tErrors("applicationNotFound") };
  }

  return { status: "success" };
}
