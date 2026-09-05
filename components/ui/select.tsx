"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

export const CUSTOM_VALUE_PREFIX = "custom:";

export function Select({
  value,
  onChange,
  options,
  placeholder,
  className = "",
  allowCustom = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  className?: string;
  allowCustom?: boolean;
}) {
  const allOptions: SelectOption[] = [{ value: "", label: placeholder }, ...options];

  function labelFor(v: string): string {
    const found = allOptions.find((o) => o.value === v);
    if (found) return found.label;
    return v.startsWith(CUSTOM_VALUE_PREFIX) ? v.slice(CUSTOM_VALUE_PREFIX.length) : "";
  }

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  // Пока список закрыт, поле показывает лейбл текущего value напрямую (без
  // отдельного state и эффекта-синхронизации) — как только открыт, показывает то,
  // что человек печатает.
  const displayValue = open ? query : labelFor(value);

  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const matchedOptions = normalizedQuery
    ? options.filter((o) => o.label.toLowerCase().includes(normalizedQuery))
    : allOptions;
  const customOption: SelectOption[] =
    allowCustom && trimmedQuery
      ? [{ value: `${CUSTOM_VALUE_PREFIX}${trimmedQuery}`, label: `Использовать «${trimmedQuery}» как есть` }]
      : [];
  const visibleOptions = [...matchedOptions, ...customOption];

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
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

  function openDropdown() {
    // Выбор из списка при повторном открытии сбрасывается — так виден весь список.
    // А свободный ввод ("как есть") подставляется обратно, иначе его пришлось бы
    // печатать заново, чтобы просто поправить опечатку.
    setQuery(value.startsWith(CUSTOM_VALUE_PREFIX) ? labelFor(value) : "");
    setHighlighted(0);
    setOpen(true);
  }

  function closeDropdown() {
    setOpen(false);
  }

  function selectOption(index: number) {
    const option = visibleOptions[index];
    if (!option) return;
    onChange(option.value);
    closeDropdown();
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((i) => Math.min(i + 1, visibleOptions.length - 1));
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
        closeDropdown();
        break;
      case "Tab":
        closeDropdown();
        break;
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && visibleOptions[highlighted] ? `${listId}-option-${highlighted}` : undefined
          }
          value={displayValue}
          onFocus={(e) => {
            openDropdown();
            e.target.select();
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlighted(0);
          }}
          onKeyDown={onInputKeyDown}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 pr-8 text-base outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25 sm:py-2 sm:text-sm"
        />
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-surface p-1 text-sm shadow-[0_16px_40px_-20px_rgba(0,0,0,0.4)]"
        >
          {visibleOptions.length === 0 && (
            <li className="px-3 py-2 text-muted">Ничего не найдено</li>
          )}
          {visibleOptions.map((option, index) => (
            <li
              key={option.value || "__placeholder__"}
              id={`${listId}-option-${index}`}
              data-index={index}
              role="option"
              aria-selected={option.value === value}
              onClick={() => selectOption(index)}
              onMouseEnter={() => setHighlighted(index)}
              className={`cursor-pointer rounded-md px-3 py-2.5 break-words transition-colors sm:py-2 ${
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
