import { IDEA_COUNTRIES } from "@/lib/constants";
import { countryFlag, countryName } from "@/lib/country";
import type { SelectOption } from "@/components/ui/select";

export function getCountryOptions(locale: string): SelectOption[] {
  return IDEA_COUNTRIES.map((code) => ({ value: code, label: `${countryFlag(code)} ${countryName(code, locale)}` }));
}
