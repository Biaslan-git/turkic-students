import Image from "next/image";
import { ChangedText } from "@/components/changed-text";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/80 px-5 py-4 backdrop-blur-md sm:px-8 sm:py-5 md:px-12">
      <span className="flex items-center gap-2 font-display text-base font-bold tracking-tight sm:text-lg">
        <Image src="/turksoy-logo.svg" alt="Эмблема ТЮРКСОЙ" width={28} height={28} className="h-7 w-7" />
        TÜRKSOY STUDENTS
      </span>
      <a
        href="#waitlist"
        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_16px_-8px_var(--accent)] transition-transform hover:scale-[1.04]"
      >
        <ChangedText old="Зарегистрироваться">Забронировать место</ChangedText>
      </a>
    </header>
  );
}
