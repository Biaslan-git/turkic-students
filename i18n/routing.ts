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
