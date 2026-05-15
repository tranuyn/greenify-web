"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { formatCo2 } from "../utils/format";

interface SummaryCardProps {
  label: string;
  description: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  glowClass: string;
  isLoading: boolean;
}

export function SummaryCard({
  label,
  description,
  value,
  icon: Icon,
  colorClass,
  glowClass,
  isLoading,
}: SummaryCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-border/80 ${colorClass}`}
    >
      {/* Glow blob */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl ${glowClass}`}
      />
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${glowClass} bg-opacity-15`}>
          <Icon size={20} className="text-foreground" />
        </div>
      </div>
      {isLoading ? (
        <div className="mt-4 h-8 w-32 animate-pulse rounded-lg bg-muted" />
      ) : (
        <div className="mt-4 font-display text-3xl font-bold text-foreground">
          {formatCo2(value)}
        </div>
      )}
      <div className="mt-1 font-body text-sm font-semibold text-foreground/80">
        {label}
      </div>
      <div className="mt-0.5 font-body text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
