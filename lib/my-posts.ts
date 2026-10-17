import { cookies } from "next/headers";

const COOKIE_NAME = "my_posts";
const MAX_POSTS = 40;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Автор не авторизован, поэтому «свои» идеи на модерации определяем по cookie с их id: пока запись
// не опубликована, её видит только тот браузер, который её отправил. id — случайные UUID, так что
// подделать cookie для чужой записи нельзя без знания id.
export async function getMyPosts(): Promise<string[]> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  return value ? value.split(",").filter((id) => UUID.test(id)).slice(-MAX_POSTS) : [];
}

export async function rememberMyPost(id: string): Promise<void> {
  const list = [...(await getMyPosts()), id].slice(-MAX_POSTS);
  (await cookies()).set(COOKIE_NAME, list.join(","), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}
