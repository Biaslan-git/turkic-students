import type { Metadata } from "next";
import { LoginForm } from "@/app/admin/login/login-form";

export const metadata: Metadata = {
  title: "Вход в админку",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] sm:p-8">
        <h1 className="mb-6 font-display text-xl font-bold">Админка</h1>
        <LoginForm />
      </div>
    </div>
  );
}
