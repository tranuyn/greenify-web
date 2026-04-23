import type { ElementType, ReactNode } from "react";
import clsx from "clsx";

export type ChipFilterValue = string | number | boolean | null | undefined;

export type ChipFilterOption<T extends ChipFilterValue> = {
  value: T;
  label: ReactNode;
  count?: number;
  icon?: ElementType;
  disabled?: boolean;
  className?: string;
  countClassName?: string;
};

type ChipFilterGroupProps<T extends ChipFilterValue> = {
  options: Array<ChipFilterOption<T>>;
  value: T;
  onChange: (value: T) => void;
  label?: ReactNode;
  className?: string;
  labelClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  inactiveItemClassName?: string;
  countClassName?: string;
  activeCountClassName?: string;
  inactiveCountClassName?: string;
  layout?: "wrap" | "scroll";
  size?: "sm" | "md" | "lg";
  showCounts?: boolean;
  ariaLabel?: string;
};

const SIZE_CLS: Record<
  NonNullable<ChipFilterGroupProps<never>["size"]>,
  string
> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

const BASE_ITEM_CLS =
  "inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50";

const ACTIVE_ITEM_CLS =
  "border-primary-500/80 bg-primary-600 text-white shadow-sm shadow-primary-600/20";

const INACTIVE_ITEM_CLS =
  "border-border bg-card/60 text-foreground/70 hover:border-primary hover:bg-card hover:text-foreground";

const ACTIVE_COUNT_CLS = "bg-white/20 text-white";
const INACTIVE_COUNT_CLS = "bg-gray-100 text-gray-500";

export function ChipFilterGroup<T extends ChipFilterValue>({
  options,
  value,
  onChange,
  label,
  className,
  labelClassName,
  listClassName,
  itemClassName,
  activeItemClassName,
  inactiveItemClassName,
  countClassName,
  activeCountClassName,
  inactiveCountClassName,
  layout = "wrap",
  size = "md",
  showCounts = true,
  ariaLabel,
}: ChipFilterGroupProps<T>) {
  const isScrollLayout = layout === "scroll";

  return (
    <div className={clsx("space-y-2", className)}>
      {label ? (
        <p
          className={clsx(
            "text-xs font-semibold uppercase tracking-wide text-gray-500",
            labelClassName,
          )}
        >
          {label}
        </p>
      ) : null}

      <div
        className={clsx(
          "flex gap-2",
          isScrollLayout
            ? "flex-nowrap overflow-x-auto pb-2 scrollbar-hide"
            : "flex-wrap",
          listClassName,
        )}
        aria-label={ariaLabel}
      >
        {options.map((option) => {
          const isActive = Object.is(value, option.value);
          const Icon = option.icon;

          return (
            <button
              key={String(option.value)}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value);
                }
              }}
              aria-pressed={isActive}
              className={clsx(
                BASE_ITEM_CLS,
                SIZE_CLS[size],
                isActive ? ACTIVE_ITEM_CLS : INACTIVE_ITEM_CLS,
                itemClassName,
                option.className,
                isActive ? activeItemClassName : inactiveItemClassName,
              )}
            >
              {Icon ? <Icon size={14} className="shrink-0" /> : null}
              <span className="truncate">{option.label}</span>
              {showCounts && typeof option.count !== "undefined" ? (
                <span
                  className={clsx(
                    "rounded-full px-1.5 py-0.5 font-mono text-[10px] leading-none",
                    countClassName,
                    option.countClassName,
                    isActive
                      ? (activeCountClassName ?? ACTIVE_COUNT_CLS)
                      : (inactiveCountClassName ?? INACTIVE_COUNT_CLS),
                  )}
                >
                  {option.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
