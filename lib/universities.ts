import { pool } from "./db";
import { countryName } from "./country";

export type University = { id: string; name: string; country: string; nameI18n: Record<string, string> };

// Страна в справочнике хранится русским словом — для показа переводим через ISO-код.
const COUNTRY_CODES: Record<string, string> = {
  Азербайджан: "AZ",
  Казахстан: "KZ",
  Кыргызстан: "KG",
  Туркменистан: "TM",
  Турция: "TR",
  Узбекистан: "UZ",
};

export function localizedUniversityName(u: Pick<University, "name" | "nameI18n">, locale: string): string {
  return u.nameI18n[locale] || u.name;
}

export function localizedUniversityCountry(country: string, locale: string): string {
  const code = COUNTRY_CODES[country];
  return code ? countryName(code, locale) : country;
}

export function universityOptionLabel(u: University, locale: string): string {
  return `${localizedUniversityName(u, locale)} (${localizedUniversityCountry(u.country, locale)})`;
}

export async function listActiveUniversities(): Promise<University[]> {
  const result = await pool.query<{ id: string; name: string; country: string; name_i18n: Record<string, string> }>(
    `SELECT id, name, country, name_i18n FROM festival_universities
     WHERE is_active ORDER BY country, name`,
  );
  return result.rows.map((r) => ({ id: r.id, name: r.name, country: r.country, nameI18n: r.name_i18n }));
}
