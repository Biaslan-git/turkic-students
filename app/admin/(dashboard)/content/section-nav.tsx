"use client";

import { useEffect, useState } from "react";

export type NavSection = { slug: string; title: string };

export function SectionNav({
  sections,
  onNavigate,
}: {
  sections: NavSection[];
  onNavigate: (slug: string) => void;
}) {
  const [activeSlug, setActiveSlug] = useState(sections[0]?.slug ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveSlug(visible[0].target.id.replace("section-", ""));
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const el = document.getElementById(`section-${section.slug}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Разделы" className="sticky top-24 flex flex-col gap-0.5 text-sm">
      {sections.map((section) => (
        <a
          key={section.slug}
          href={`#section-${section.slug}`}
          onClick={() => onNavigate(section.slug)}
          className={`rounded-lg px-3 py-1.5 transition-colors ${
            activeSlug === section.slug
              ? "bg-accent/10 font-semibold text-accent"
              : "text-muted hover:bg-border/40 hover:text-foreground"
          }`}
        >
          {section.title}
        </a>
      ))}
    </nav>
  );
}
