"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminPassword } from "@/lib/admin/auth";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  createSessionCookieValue,
  verifySessionCookieValue,
} from "@/lib/admin/session";
import { deleteWaitlistSignup } from "@/lib/admin/waitlist";
import { updateSiteContent } from "@/lib/admin/site-content";
import { restoreContentSnapshot } from "@/lib/admin/site-content-history";
import { createFestivalUniversity, setFestivalUniversityActive } from "@/lib/admin/festival";
import { festivalUniversitySchema } from "@/lib/validation";

export type LoginState = { status: "idle" | "error"; message?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    return { status: "error", message: "Неверный пароль" };
  }

  (await cookies()).set(SESSION_COOKIE_NAME, createSessionCookieValue(), SESSION_COOKIE_OPTIONS);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}

export type DeleteSignupResult = { status: "success" | "error"; message?: string };

export async function deleteSignup(id: string): Promise<DeleteSignupResult> {
  const store = await cookies();
  if (!verifySessionCookieValue(store.get(SESSION_COOKIE_NAME)?.value)) {
    return { status: "error", message: "Не авторизовано" };
  }

  const deleted = await deleteWaitlistSignup(id);
  if (!deleted) {
    return { status: "error", message: "Запись не найдена" };
  }

  return { status: "success" };
}

export type UpdateContentState = { status: "idle" | "success" | "error"; message?: string };

export async function updateContent(
  _prevState: UpdateContentState,
  formData: FormData,
): Promise<UpdateContentState> {
  const store = await cookies();
  if (!verifySessionCookieValue(store.get(SESSION_COOKIE_NAME)?.value)) {
    return { status: "error", message: "Не авторизовано" };
  }

  const values = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [key, String(value)]),
  );
  await updateSiteContent(values);

  return { status: "success", message: "Сохранено" };
}

export async function restoreContent(formData: FormData): Promise<void> {
  const store = await cookies();
  if (!verifySessionCookieValue(store.get(SESSION_COOKIE_NAME)?.value)) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  if (id) {
    await restoreContentSnapshot(id);
  }
  redirect("/admin/content");
}

export type CreateUniversityState = { status: "idle" | "success" | "error"; message?: string };

export async function createUniversity(
  _prevState: CreateUniversityState,
  formData: FormData,
): Promise<CreateUniversityState> {
  const store = await cookies();
  if (!verifySessionCookieValue(store.get(SESSION_COOKIE_NAME)?.value)) {
    return { status: "error", message: "Не авторизовано" };
  }

  const parsed = festivalUniversitySchema.safeParse({
    name: formData.get("name"),
    country: formData.get("country"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Проверьте название и страну" };
  }

  const result = await createFestivalUniversity(parsed.data.name, parsed.data.country);
  if (result.status === "duplicate") {
    return { status: "error", message: "Такой университет уже есть в справочнике" };
  }

  return { status: "success", message: "Добавлено" };
}

export type ToggleUniversityResult = { status: "success" | "error"; message?: string };

export async function toggleUniversityActive(
  id: string,
  nextActive: boolean,
): Promise<ToggleUniversityResult> {
  const store = await cookies();
  if (!verifySessionCookieValue(store.get(SESSION_COOKIE_NAME)?.value)) {
    return { status: "error", message: "Не авторизовано" };
  }

  const updated = await setFestivalUniversityActive(id, nextActive);
  if (!updated) {
    return { status: "error", message: "Университет не найден" };
  }

  return { status: "success" };
}
