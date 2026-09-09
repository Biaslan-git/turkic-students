import { z } from "zod";
import { FESTIVAL_ROLES, OPINION_CATEGORIES } from "./constants";

const festivalRoleValues = FESTIVAL_ROLES.map((r) => r.value) as [string, ...string[]];
const opinionCategoryValues = OPINION_CATEGORIES.map((c) => c.value) as [string, ...string[]];

const currentYear = new Date().getFullYear();

type ValidationMessages = {
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  universityOtherNameRequired: string;
  universityRequired: string;
};

// Схемы — фабрики, принимающие локализованные сообщения (см. app/actions.ts), потому что
// текст ошибок валидации попадает прямо в публичные формы и должен идти на языке визита.
export function makeWaitlistBasicSchema(t: Pick<ValidationMessages, "nameRequired" | "emailRequired" | "emailInvalid">) {
  return z.object({
    name: z.string().trim().min(2, t.nameRequired).max(100),
    email: z.string().trim().min(1, t.emailRequired).email(t.emailInvalid).max(255),
    company: z.string().max(0).optional().or(z.literal("")),
  });
}

export function makeWaitlistDetailsSchema(
  t: Pick<ValidationMessages, "universityOtherNameRequired" | "universityRequired">,
) {
  return z
    .object({
      id: z.string().uuid(),
      role: z.enum(festivalRoleValues),
      universityId: z.string().uuid().optional().or(z.literal("")),
      universityOtherName: z
        .string()
        .trim()
        .min(2, t.universityOtherNameRequired)
        .max(200)
        .optional()
        .or(z.literal("")),
      graduationYear: z.preprocess(
        (value) => (value === "" || value == null ? undefined : value),
        z.coerce.number().int().min(1950).max(currentYear).optional(),
      ),
    })
    .refine((data) => Boolean(data.universityId) || Boolean(data.universityOtherName), {
      message: t.universityRequired,
      path: ["universityId"],
    });
}

export function makeGuestOpinionSchema(t: { opinionCategoryRequired: string; opinionTextRequired: string }) {
  return z.object({
    category: z.enum(opinionCategoryValues, { message: t.opinionCategoryRequired }),
    text: z.string().trim().min(2, t.opinionTextRequired).max(2000),
    company: z.string().max(0).optional().or(z.literal("")),
  });
}

// Админка не локализуется (см. CLAUDE.md) — интерфейс управления вузами всегда на русском.
export const festivalUniversitySchema = z.object({
  name: z.string().trim().min(2, "Введите название").max(200),
  country: z.string().trim().min(2, "Введите страну").max(100),
});

export type WaitlistBasicInput = z.infer<ReturnType<typeof makeWaitlistBasicSchema>>;
export type WaitlistDetailsInput = z.infer<ReturnType<typeof makeWaitlistDetailsSchema>>;
export type FestivalUniversityInput = z.infer<typeof festivalUniversitySchema>;
export type GuestOpinionInput = z.infer<ReturnType<typeof makeGuestOpinionSchema>>;
