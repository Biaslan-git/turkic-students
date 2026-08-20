export function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/80 px-5 py-4 backdrop-blur-md sm:px-8 sm:py-5 md:px-12">
      <span className="flex items-center gap-2 font-display text-base font-bold tracking-tight sm:text-lg">
        <span aria-hidden="true" className="relative inline-flex h-6 w-6 items-center justify-center">
          <span className="absolute h-3.5 w-3.5 rounded-full bg-accent" />
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-accent-warm mix-blend-multiply dark:mix-blend-screen" />
        </span>
        TURKIC STUDENTS
      </span>
      <a
        href="#waitlist"
        className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.04] hover:opacity-90"
      >
        Зарегистрироваться
      </a>
    </header>
  );
}
