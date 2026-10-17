"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { getLocale, getTranslations } from "next-intl/server";
import { ideaCommentSchema, ideaSchema } from "@/lib/validation";
import { ideaExists, insertIdea, insertIdeaComment } from "@/lib/ideas";
import { getMyPosts, rememberMyPost } from "@/lib/my-posts";
import { notifyModerators } from "@/lib/telegram";
import { isRateLimited } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/get-client-ip";

export type IdeaFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitIdea(_prevState: IdeaFormState, formData: FormData): Promise<IdeaFormState> {
  const [tErrors, locale] = await Promise.all([getTranslations("Errors"), getLocale()]);

  const parsed = ideaSchema.safeParse({
    category: formData.get("category"),
    text: formData.get("text"),
    authorName: formData.get("authorName") ?? undefined,
    country: formData.get("country"),
    universityId: formData.get("universityId") ?? undefined,
    universityOtherName: formData.get("universityOtherName") ?? undefined,
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return { status: "error", message: tErrors("ideaInvalid") };
  }

  // Honeypot triggered — silently pretend nothing happened.
  if (parsed.data.company) {
    return { status: "idle" };
  }

  const ip = await getClientIp();
  if (isRateLimited(`idea:${ip}`)) {
    return { status: "error", message: tErrors("tooManyAttempts") };
  }

  let id: string;
  try {
    id = await insertIdea({ ...parsed.data, sourceLocale: locale });
  } catch {
    return { status: "error", message: tErrors("saveFailed") };
  }

  await rememberMyPost(id);
  after(() => notifyModerators("idea", id));
  revalidatePath("/", "layout");

  return { status: "success" };
}

export async function submitIdeaComment(
  _prevState: IdeaFormState,
  formData: FormData,
): Promise<IdeaFormState> {
  const [tErrors, locale] = await Promise.all([getTranslations("Errors"), getLocale()]);

  const parsed = ideaCommentSchema.safeParse({
    ideaId: formData.get("ideaId"),
    text: formData.get("text"),
    authorName: formData.get("authorName") ?? undefined,
    country: formData.get("country"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return { status: "error", message: tErrors("commentInvalid") };
  }

  if (parsed.data.company) {
    return { status: "idle" };
  }

  const ip = await getClientIp();
  if (isRateLimited(`idea-comment:${ip}`)) {
    return { status: "error", message: tErrors("tooManyAttempts") };
  }

  if (!(await ideaExists(parsed.data.ideaId, await getMyPosts()))) {
    return { status: "error", message: tErrors("saveFailed") };
  }

  let id: string;
  try {
    id = await insertIdeaComment({ ...parsed.data, sourceLocale: locale });
  } catch {
    return { status: "error", message: tErrors("saveFailed") };
  }

  await rememberMyPost(id);
  after(() => notifyModerators("comment", id));
  revalidatePath("/", "layout");

  return { status: "success" };
}
