import { RouteLinesBackdrop } from "@/components/route-lines";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-tint-teal">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.1]">
        <RouteLinesBackdrop />
      </div>
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 px-5 py-12 text-center text-sm text-muted sm:px-8 md:px-12">
        <span className="font-display text-sm font-bold tracking-tight text-foreground">
          TURKIC STUDENTS
        </span>
        <p className="max-w-md">
          Цифровая платформа, которая соединяет студентов тюркского мира:
          образование, фестивали, стажировки и совместные проекты.
        </p>
        <a href="#waitlist" className="font-medium text-accent underline underline-offset-4">
          Зарегистрироваться
        </a>
        <p>© {new Date().getFullYear()} TURKIC STUDENTS</p>
        <p className="text-xs text-muted/70">
          Иконки: emoji-иллюстрации by{" "}
          <a
            href="https://openmoji.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            OpenMoji
          </a>{" "}
          — CC BY-SA 4.0
        </p>
      </div>
    </footer>
  );
}
