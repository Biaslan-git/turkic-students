import { z } from "zod";
import { INTEREST_AREAS } from "./constants";

const interestAreaValues = INTEREST_AREAS.map((a) => a.value) as [
  string,
  ...string[],
];

export const waitlistBasicSchema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(100),
  email: z.string().trim().min(1, "Введите email").email("Некорректный email").max(255),
  company: z.string().max(0).optional().or(z.literal("")),
});

export const waitlistDetailsSchema = z.object({
  id: z.string().uuid(),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  placeOfStudy: z.string().trim().max(200).optional().or(z.literal("")),
  interestArea: z.enum(interestAreaValues).optional().or(z.literal("")),
});

export type WaitlistBasicInput = z.infer<typeof waitlistBasicSchema>;
export type WaitlistDetailsInput = z.infer<typeof waitlistDetailsSchema>;
