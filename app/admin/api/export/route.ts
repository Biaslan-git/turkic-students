import { NextResponse } from "next/server";
import { requireAdminSessionOrResponse } from "@/lib/admin/session";
import { listAllWaitlistSignups } from "@/lib/admin/waitlist";
import { waitlistToCsv } from "@/lib/admin/csv";

export async function GET() {
  const unauthorized = await requireAdminSessionOrResponse();
  if (unauthorized) return unauthorized;

  const records = await listAllWaitlistSignups();
  const csv = waitlistToCsv(records);
  const filename = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
