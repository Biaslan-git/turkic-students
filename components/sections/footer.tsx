export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-border px-5 py-10 text-center text-sm text-muted sm:px-8 md:px-12">
      <span className="font-display text-sm font-bold tracking-tight text-foreground">
        TURKIC STUDENTS
      </span>
      <p className="max-w-md">
        Цифровая платформа, объединяющая студентов тюркского мира:
        образование, фестивали, стажировки и проекты.
      </p>
      <a href="#waitlist" className="font-medium text-accent underline underline-offset-4">
        Зарегистрироваться
      </a>
      <p>© {new Date().getFullYear()} TURKIC STUDENTS</p>
    </footer>
  );
}
