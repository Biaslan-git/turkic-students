export const TELEGRAM_CHANNEL_URL = "https://t.me/turksoy_students";

export const INTEREST_AREAS = [
  { value: "education", label: "Образование" },
  { value: "festivals", label: "Фестивали и культура" },
  { value: "career", label: "Стажировки и карьера" },
  { value: "projects", label: "Международные проекты" },
  { value: "other", label: "Другое" },
] as const;

export const SITE_URL = process.env.SITE_URL ?? "https://turkicstudents.org";

export const FESTIVAL_ROLES = [
  { value: "student", label: "Студент" },
  { value: "alumnus", label: "Выпускник" },
] as const;

export const OPINION_CATEGORIES = [
  { value: "opinion", label: "МОЁ МНЕНИЕ", question: "Что ты думаешь о фестивале?" },
  { value: "idea", label: "МОЯ ИДЕЯ", question: "Как ты хотел бы видеть фестиваль в будущем?" },
  {
    value: "proposal",
    label: "МОЁ ПРЕДЛОЖЕНИЕ",
    question: "Что необходимо изменить, добавить или создать?",
  },
  {
    value: "viewpoint",
    label: "МОЙ ВЗГЛЯД",
    question: "Каким должен быть современный международный студенческий театральный фестиваль?",
  },
  {
    value: "missing",
    label: "ЧЕГО НЕ ХВАТАЕТ?",
    question: "Какие мероприятия или форматы ты хотел бы увидеть?",
  },
  { value: "other", label: "ДРУГОЕ", question: "Свободное поле для любого предложения" },
] as const;
