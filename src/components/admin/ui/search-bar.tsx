"use client";

import { Search, X } from "lucide-react";
import clsx from "clsx";

type SearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder: string;
  buttonLabel: string;
  loading?: boolean;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

export function SearchBar({
  value,
  onValueChange,
  onSearch,
  placeholder,
  buttonLabel,
  loading = false,
  className,
  inputClassName,
  buttonClassName,
}: SearchBarProps) {
  const submit = () => onSearch(value.trim());

  const clear = () => {
    onValueChange("");
    onSearch("");
  };

  return (
    <div className={clsx("flex flex-col gap-2 sm:flex-row", className)}>
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/70"
        />
        <input
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className={clsx(
            "w-full rounded-2xl border border-border bg-card py-2.5 pl-11 pr-10 text-sm outline-none transition-all shadow-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
            inputClassName,
          )}
        />

        {loading ? (
          <div className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        ) : value ? (
          <button
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-foreground/70 transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>

      <button
        onClick={submit}
        className={clsx(
          "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700 sm:w-auto",
          buttonClassName,
        )}
      >
        <Search size={16} />
        {buttonLabel}
      </button>
    </div>
  );
}
