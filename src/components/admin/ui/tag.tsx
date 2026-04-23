import * as React from "react";
import clsx from "clsx";

type TagTone = "default" | "success" | "warning" | "danger" | "info";
type TagSize = "sm" | "md";

const TONE_CLS: Record<TagTone, string> = {
  default:
    "border-border bg-neutral-100 text-neutral-600 dark:border-neutral-700/60 dark:bg-neutral-700/50 dark:text-neutral-300",
  success:
    "border-primary-border/60 bg-primary-element/60 text-primary-content",
  warning:
    "border-amber-200/60 bg-amber-50/60 text-amber-700 dark:border-amber-200/40 dark:bg-amber-400/60 dark:text-amber-50",
  danger:
    "border-rose-200/60 bg-rose-100/70 text-rose-600 dark:border-rose-200/40 dark:bg-rose-500/60 dark:text-rose-100",
  info: "border-blue-200/60 bg-blue-50 text-blue-700 dark:border-blue-200/40 dark:bg-blue-400/60 dark:text-blue-100",
};

const SIZE_CLS: Record<TagSize, string> = {
  sm: "px-2.5 py-1 text-[11px]",
  md: "px-3 py-1.5 text-xs",
};

export function Tag({
  tone = "default",
  size = "md",
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: TagTone;
  size?: TagSize;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border font-semibold tracking-wide transition-all duration-200 hover:-translate-y-px",
        TONE_CLS[tone],
        SIZE_CLS[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
