import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/admin/session";
import { logout } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="font-display text-lg font-bold">Waitlist админка</span>
        <form action={logout}>
          <button type="submit" className="text-sm text-muted underline underline-offset-2">
            Выйти
          </button>
        </form>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted">
        TÜRKSOY Students · Административная панель
      </footer>
    </div>
  );
}
