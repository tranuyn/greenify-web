"use client";

import { useTranslations } from "next-intl";
import { AdminCo2eMonthlyBreakdown } from "@/types/co2.types";

interface Co2MonthlyTableProps {
  items: AdminCo2eMonthlyBreakdown[];
  isLoading: boolean;
  emptyLabel: string;
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 4 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </td>
      ))}
    </tr>
  );
}

export function Co2MonthlyTable({
  items,
  isLoading,
  emptyLabel,
}: Co2MonthlyTableProps) {
  const t = useTranslations("admin.co2.monthly");

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-6 py-5 font-body text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
              {t("month")}
            </th>
            <th className="px-6 py-5 font-body text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
              {t("total")}
            </th>
            <th className="px-6 py-5 font-body text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
              {t("avoided")}
            </th>
            <th className="px-6 py-5 font-body text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
              {t("absorbed")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : items.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-16 text-center font-body text-sm text-muted-foreground"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.month}
                className="group transition-colors hover:bg-muted/40"
              >
                <td className="px-6 py-4 text-center font-body text-sm font-semibold text-foreground">
                  {item.month}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-mono text-sm font-bold text-foreground">
                    {item.totalCo2eKg.toFixed(3)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-mono text-sm font-bold text-success bg-success/10 px-2 py-1 rounded-md">
                    {item.totalAvoidedKg.toFixed(3)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-mono text-sm font-bold text-info bg-info/10 px-2 py-1 rounded-md">
                    {item.totalAbsorbedKg.toFixed(3)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
