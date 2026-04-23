"use client";

import * as React from "react";
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";

export function Popconfirm({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  disabled,
  onConfirm,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  disabled?: boolean;
  onConfirm: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const rootRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <span ref={rootRef} className="relative inline-flex">
      <span
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        className={clsx(disabled && "cursor-not-allowed opacity-50")}
      >
        {children}
      </span>

      {open && (
        <div className="absolute right-0 top-full z-[130] mt-2 animate-fade-up rounded-2xl border border-border/60 bg-card p-4 shadow-2xl shadow-primary-950/10">
          <div className="flex items-center gap-2.5">
            <div
              className={clsx(
                "mt-0.5 rounded-full p-1.5",
                danger
                  ? "bg-rose-100 text-rose-600"
                  : "bg-amber-100 text-amber-700",
              )}
            >
              <AlertTriangle size={12} />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-heading">
                {title}
              </p>
              {description ? (
                <p className="mt-1 text-xs leading-relaxed text-foreground/70">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={isConfirming}
              className={clsx(
                "rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-all disabled:opacity-60",
                danger
                  ? "bg-rose-500 hover:bg-rose-600"
                  : "bg-primary-600 hover:bg-primary-700",
              )}
            >
              {isConfirming ? "..." : confirmText}
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
