export function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-5 sm:px-8 md:px-12">
      <span className="font-display text-base font-bold tracking-tight sm:text-lg">
        TURKIC STUDENTS
      </span>
      <a
        href="#waitlist"
        className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
      >
        Регистрация
      </a>
    </header>
  );
}
