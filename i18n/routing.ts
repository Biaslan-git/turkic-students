import { defineRouting } from "next-intl/routing";

export const LOCALE_NAMES: Record<string, string> = {
  ru: "Русский",
  az: "Azərbaycan",
  kk: "Қазақша",
  ky: "Кыргызча",
  tk: "Türkmençe",
  tr: "Türkçe",
  uz: "Oʻzbekcha",
};

// Флаги вместо двухбуквенных кодов языка в переключателе языка — "KK" (казахский) и "KY"
// (киргизский) визуально почти неразличимы и ничего не говорят без объяснения.
export const LOCALE_FLAGS: Record<string, string> = {
  ru: "🇷🇺",
  az: "🇦🇿",
  kk: "🇰🇿",
  ky: "🇰🇬",
  tk: "🇹🇲",
  tr: "🇹🇷",
  uz: "🇺🇿",
};

// Коды стран (ISO 3166-1), а не языка — "KZ"/"KG" различимы лучше, чем языковые "KK"/"KY".
export const LOCALE_COUNTRY_CODES: Record<string, string> = {
  ru: "RU",
  az: "AZ",
  kk: "KZ",
  ky: "KG",
  tk: "TM",
  tr: "TR",
  uz: "UZ",
};

export const NUMBER_LOCALE_TAGS: Record<string, string> = {
  ru: "ru-RU",
  az: "az-AZ",
  kk: "kk-KZ",
  ky: "ky-KG",
  tk: "tk-TM",
  tr: "tr-TR",
  uz: "uz-UZ",
};

export const routing = defineRouting({
  locales: ["ru", "az", "kk", "ky", "tk", "tr", "uz"],
  defaultLocale: "ru",
  localePrefix: "always",
});
