"use client";

import * as React from "react";
import clsx from "clsx";

type Side = "top" | "bottom";

export function Tooltip({
  content,
  side = "top",
  className,
  children,
}: {
  content: React.ReactNode;
  side?: Side;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), 80);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <span
        role="tooltip"
        className={clsx(
          "pointer-events-none absolute z-[120] w-max max-w-[220px] rounded-xl border border-primary-border/60 bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-xl shadow-primary-950/10 backdrop-blur transition-all duration-200",
          side === "top"
            ? "-top-2 left-1/2 -translate-x-1/2 -translate-y-full"
            : "bottom-0 left-1/2 -translate-x-1/2 translate-y-full",
          open
            ? "visible opacity-100 motion-safe:animate-fade-in"
            : "invisible opacity-0",
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
}
