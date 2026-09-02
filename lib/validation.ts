import { z } from "zod";
import { FESTIVAL_ROLES, OPINION_CATEGORIES } from "./constants";

const festivalRoleValues = FESTIVAL_ROLES.map((r) => r.value) as [string, ...string[]];
const opinionCategoryValues = OPINION_CATEGORIES.map((c) => c.value) as [string, ...string[]];

export const waitlistBasicSchema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(100),
  email: z.string().trim().min(1, "Введите email").email("Некорректный email").max(255),
  company: z.string().max(0).optional().or(z.literal("")),
});

const currentYear = new Date().getFullYear();

export const waitlistDetailsSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(festivalRoleValues),
  universityId: z.string().uuid("Выберите университет"),
  graduationYear: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce.number().int().min(1950).max(currentYear).optional(),
  ),
  opinionCategory: z.enum(opinionCategoryValues).optional().or(z.literal("")),
  opinionText: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const festivalUniversitySchema = z.object({
  name: z.string().trim().min(2, "Введите название").max(200),
  country: z.string().trim().min(2, "Введите страну").max(100),
});

export const guestOpinionSchema = z.object({
  category: z.enum(opinionCategoryValues, { message: "Выберите категорию" }),
  text: z.string().trim().min(2, "Напишите пару слов").max(2000),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type WaitlistBasicInput = z.infer<typeof waitlistBasicSchema>;
export type WaitlistDetailsInput = z.infer<typeof waitlistDetailsSchema>;
export type FestivalUniversityInput = z.infer<typeof festivalUniversitySchema>;
export type GuestOpinionInput = z.infer<typeof guestOpinionSchema>;
