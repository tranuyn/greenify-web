"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Wind,
  TreePine,
  TrendingDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAdminCo2eAnalytics } from "@/hooks/queries/useAdmin";

// Components
import { SummaryCard } from "./components/SummaryCard";
import { Co2DonutChart } from "./components/Co2DonutChart";
import { Co2MonthlyTable } from "./components/Co2MonthlyTable";
import { Co2MonthlyChart } from "./components/Co2MonthlyChart";
import { Co2Equivalents } from "./components/Co2Equivalents";

export default function Co2Page() {
  const t = useTranslations("admin.co2");
  const tCommon = useTranslations("common.actions");

  // View state: 'chart' | 'table'
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  // Filter state (Default: last 1 year)
  const today = new Date();
  const defaultEndDate = today.toISOString().split("T")[0];
  const lastYear = new Date();
  lastYear.setFullYear(today.getFullYear() - 1);
  const defaultStartDate = lastYear.toISOString().split("T")[0];

  const [dateRange] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  // ---- Data fetching ----
  const { data: analyticsData, isLoading, isError, isFetching } = useAdminCo2eAnalytics(dateRange);

  const summary = analyticsData?.totalMetrics;
  const monthlyData = analyticsData?.monthlyBreakdown;

  // ---- Summary cards config ----
  const summaryCards = [
    {
      label: t("summary.total"),
      description: t("summary.totalUnit"),
      value: summary?.totalCo2eKg ?? 0,
      icon: Wind,
      colorClass: "hover:border-primary/50",
      glowClass: "bg-primary",
    },
    {
      label: t("summary.avoided"),
      description: t("summary.avoidedDesc"),
      value: summary?.totalAvoidedKg ?? 0,
      icon: TrendingDown,
      colorClass: "hover:border-success/50",
      glowClass: "bg-success",
    },
    {
      label: t("summary.absorbed"),
      description: t("summary.absorbedDesc"),
      value: summary?.totalAbsorbedKg ?? 0,
      icon: TreePine,
      colorClass: "hover:border-info/50",
      glowClass: "bg-info",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ---- Page header ---- */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-500/20">
              {t("badge")}
            </span>
          </div>
          <p className="mt-1 font-body text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Refresh indicator */}
        {isFetching && (
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary ring-1 ring-primary/20">
            <RefreshCw size={14} className="animate-spin" />
            {tCommon("processing")}
          </div>
        )}
      </div>

      {/* ---- Error states ---- */}
      {isError && (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-6 py-5 text-sm text-destructive shadow-sm">
          <AlertCircle size={18} className="shrink-0" />
          <p className="font-semibold">{t("error.title")}</p>
          <p>{t("error.message")}</p>
        </div>
      )}

      {/* ---- Summary stat cards ---- */}
      <div className="grid gap-6 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <SummaryCard 
            key={card.label} 
            {...card} 
            isLoading={isLoading} 
          />
        ))}
      </div>

      {/* ---- Chart + Equivalents row ---- */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
        <h3 className="mb-8 font-display text-lg font-bold text-foreground flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          {t("chart.title")}
        </h3>
        
        <div className="flex items-center justify-center min-h-[220px]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              <span className="text-sm font-medium">{tCommon("loading")}</span>
            </div>
          ) : (
            <Co2DonutChart
              avoided={summary?.totalAvoidedKg ?? 0}
              absorbed={summary?.totalAbsorbedKg ?? 0}
            />
          )}
        </div>

        {/* Equivalents section */}
        {summary && summary.totalCo2eKg > 0 && (
          <Co2Equivalents totalCo2eKg={summary.totalCo2eKg} />
        )}
      </div>

      {/* ---- Monthly Data Section ---- */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between border-b border-border bg-muted/20 px-8 py-6">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              {t("monthly.title")}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{t("monthly.description")}</p>
          </div>

          {/* View Toggle */}
          <div className="flex p-1 bg-background rounded-xl border border-border">
            <button
              onClick={() => setViewMode("chart")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "chart"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("monthly.chartView")}
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("monthly.tableView")}
            </button>
          </div>
        </div>

        <div className="p-8">
          {viewMode === "chart" ? (
            <Co2MonthlyChart
              items={monthlyData ?? []}
              isLoading={isLoading}
            />
          ) : (
            <Co2MonthlyTable
              items={monthlyData ?? []}
              isLoading={isLoading}
              emptyLabel={tCommon("empty")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
