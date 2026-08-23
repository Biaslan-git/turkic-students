"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

export function Select({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const allOptions: SelectOption[] = [{ value: "", label: placeholder }, ...options];
  const selectedIndex = Math.max(
    0,
    allOptions.findIndex((o) => o.value === value),
  );
  const selectedLabel = allOptions[selectedIndex]?.label ?? placeholder;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector(`[data-index="${highlighted}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, highlighted]);

  function selectOption(index: number) {
    onChange(allOptions[index].value);
    setOpen(false);
  }

  function openDropdown() {
    setHighlighted(selectedIndex);
    setOpen(true);
  }

  function onButtonKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDropdown();
    }
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((i) => Math.min(i + 1, allOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        selectOption(highlighted);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        onKeyDown={onButtonKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25"
      >
        <span className={value ? "" : "text-muted"}>{selectedLabel}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          ref={(el) => {
            listRef.current = el;
            el?.focus();
          }}
          id={listId}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className="absolute z-20 mt-1.5 max-h-64 w-full min-w-max overflow-auto rounded-lg border border-border bg-surface p-1 text-sm shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)] focus:outline-none"
        >
          {allOptions.map((option, index) => (
            <li
              key={option.value || "__placeholder__"}
              data-index={index}
              role="option"
              aria-selected={option.value === value}
              onClick={() => selectOption(index)}
              onMouseEnter={() => setHighlighted(index)}
              className={`cursor-pointer rounded-md px-3 py-2 whitespace-nowrap transition-colors ${
                index === highlighted ? "bg-accent/15" : ""
              } ${option.value === value ? "font-medium" : ""}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
