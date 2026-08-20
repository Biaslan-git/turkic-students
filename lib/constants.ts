export const TELEGRAM_CHANNEL_URL = "https://t.me/turkicstudents";

export const INTEREST_AREAS = [
  { value: "education", label: "Образование" },
  { value: "festivals", label: "Фестивали и культура" },
  { value: "career", label: "Стажировки и карьера" },
  { value: "projects", label: "Международные проекты" },
  { value: "other", label: "Другое" },
] as const;

export const SITE_URL = process.env.SITE_URL ?? "https://turkicstudents.org";
