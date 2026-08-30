import Image from "next/image";
import { RouteLinesBackdrop } from "@/components/route-lines";
import { HandshakeIcon } from "@/components/mood-icons/handshake-icon";

type Principle = { title: string; text: string };

type PrinciplesSectionProps = {
  badge: string;
  title: string;
  text: string;
  countries: string[];
  principles: Principle[];
};

export function PrinciplesSection({
  badge,
  title,
  text,
  countries,
  principles,
}: PrinciplesSectionProps) {
  return (
    <section className="relative overflow-hidden bg-accent-ink text-[#f7f1e6]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.18]">
        <RouteLinesBackdrop />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96"
      />
      <HandshakeIcon className="pointer-events-none absolute -left-12 -bottom-16 h-56 w-56 select-none text-accent-warm/[0.14] sm:h-72 sm:w-72" />
      <div className="reveal-on-scroll relative mx-auto flex max-w-4xl flex-col gap-10 px-5 py-16 sm:px-8 sm:py-24 md:px-12">
        <div className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-warm">
            {badge}
          </span>
          <h2 className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-2xl text-pretty text-lg text-white/70">{text}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Image
              src="/turksoy-emblem.png"
              alt=""
              aria-hidden="true"
              width={14}
              height={14}
              className="mr-0.5 h-3.5 w-3.5"
            />
            {countries.map((country, i) => (
              <span
                key={i}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {principles.map((principle, i) => (
            <div
              key={i}
              className={`flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-5 ${
                i % 2 === 1 ? "sm:translate-y-4" : ""
              }`}
            >
              <div className={`h-1 w-8 rounded-full ${i % 2 === 0 ? "bg-accent-warm" : "bg-accent"}`} />
              <h3 className="font-display text-lg font-bold">{principle.title}</h3>
              <p className="text-sm text-white/70">{principle.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
