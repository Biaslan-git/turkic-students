import Image from "next/image";
import { RouteLinesBackdrop } from "@/components/route-lines";
import { ChangedText } from "@/components/changed-text";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-tint-teal">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.1]">
        <RouteLinesBackdrop />
      </div>
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4 px-5 py-12 text-center text-sm text-muted sm:px-8 md:px-12">
        <span className="flex items-center gap-2 font-display text-sm font-bold tracking-tight text-foreground">
          <Image src="/turksoy-logo.svg" alt="Эмблема ТЮРКСОЙ" width={24} height={24} className="h-6 w-6" />
          TÜRKSOY STUDENTS
        </span>
        <p className="max-w-md">
          Цифровая платформа, которая соединяет студентов тюркского мира:
          образование, фестивали, стажировки и совместные проекты.
        </p>
        <a href="#waitlist" className="font-medium text-accent underline underline-offset-4">
          <ChangedText old="Зарегистрироваться">Забронировать место</ChangedText>
        </a>
        <p>
          © {new Date().getFullYear()} TÜRKSOY STUDENTS
        </p>
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
        <p className="text-xs text-muted/70">
          Разработал{" "}
          <a
            href="https://void-tech.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Байрамкулов Биаслан
          </a>
        </p>
      </div>
    </footer>
  );
}
