import { INTEREST_AREAS } from "@/lib/constants";
import type { WaitlistSignupRecord } from "@/lib/admin/waitlist";

const interestLabels = new Map<string, string>(INTEREST_AREAS.map((a) => [a.value, a.label]));

function escapeCsvField(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function waitlistToCsv(records: WaitlistSignupRecord[]): string {
  const header = ["Name", "Email", "Country", "Place of study", "Interest area", "Created at"];
  const rows = records.map((r) =>
    [
      r.name,
      r.email,
      r.country ?? "",
      r.placeOfStudy ?? "",
      r.interestArea ? (interestLabels.get(r.interestArea) ?? r.interestArea) : "",
      r.createdAt,
    ]
      .map(escapeCsvField)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}
