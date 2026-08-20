import { WaitlistForm } from "@/components/waitlist-form";

export function WaitlistSection() {
  return (
    <section
      id="waitlist"
      className="mx-auto flex max-w-4xl scroll-mt-6 flex-col items-center gap-8 px-5 py-16 text-center sm:px-8 sm:py-24 md:px-12"
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Зарегистрируйтесь первым
        </h2>
        <p className="max-w-xl text-pretty text-lg text-muted">
          Платформа в разработке. Оставьте контакты — и узнаете о запуске
          одними из первых.
        </p>
      </div>
      <WaitlistForm />
    </section>
  );
}
