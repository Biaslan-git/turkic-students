import { WaitlistForm } from "@/components/waitlist-form";
import { RouteLinesBackdrop } from "@/components/route-lines";
import { RocketIcon } from "@/components/mood-icons/rocket-icon";
import type { University } from "@/lib/universities";

export function WaitlistSection({
  title,
  text,
  universities,
}: {
  title: string;
  text: string;
  universities: University[];
}) {
  return (
    <section id="waitlist" className="relative scroll-mt-20 overflow-hidden bg-tint-coral">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.15]">
        <RouteLinesBackdrop />
      </div>
      <RocketIcon className="pointer-events-none absolute -left-12 -top-16 h-56 w-56 select-none text-accent/[0.1] sm:h-72 sm:w-72" />
      <div className="reveal-on-scroll relative mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 py-16 text-center sm:px-8 sm:py-24 md:px-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-xl text-pretty text-lg text-muted">{text}</p>
        </div>
        <div className="relative w-full max-w-md">
          <div
            aria-hidden="true"
            className="absolute -right-6 -top-6 hidden h-24 w-24 rotate-6 rounded-3xl bg-accent-warm/25 sm:block"
          />
          <WaitlistForm universities={universities} />
        </div>
      </div>
    </section>
  );
}
