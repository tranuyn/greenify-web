"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Wind,
  Leaf,
  TreePine,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Sprout,
} from "lucide-react";
import { useCo2WalletSummary, useCo2eHistory } from "@/hooks/queries/useCo2";
import type { Co2eHistoryItem, Co2eType } from "@/types/co2.types";

// ============================================================
// HELPERS
// ============================================================

const formatCo2 = (kg: number): string => {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`;
  return `${kg.toFixed(2)} kg`;
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
};

const formatConfidence = (score: number): string =>
  `${Math.round(score * 100)}%`;

// ============================================================
// CO2E TYPE BADGE
// ============================================================

function Co2TypeBadge({ type }: { type: Co2eType }) {
  const t = useTranslations("admin.co2.co2eType");
  const isAvoided = type === "AVOIDED";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isAvoided
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-sky-50 text-sky-700 border border-sky-200"
      }`}
    >
      {isAvoided ? <TrendingDown size={10} /> : <Sprout size={10} />}
      {t(type)}
    </span>
  );
}

// ============================================================
// DONUT CHART (pure SVG — no library needed)
// ============================================================

function Co2DonutChart({
  avoided,
  absorbed,
}: {
  avoided: number;
  absorbed: number;
}) {
  const t = useTranslations("admin.co2.chart");
  const total = avoided + absorbed;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
        <Wind size={32} className="opacity-30" />
        <p className="text-sm">{t("empty")}</p>
      </div>
    );
  }

  const SIZE = 160;
  const STROKE = 28;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const avoidedPct = avoided / total;
  const absorbedPct = absorbed / total;

  // Emerald for avoided, sky for absorbed
  const avoidedDash = avoidedPct * CIRC;
  const absorbedDash = absorbedPct * CIRC;
  const GAP = 4;

  return (
    <div className="flex items-center gap-6">
      {/* SVG donut */}
      <div className="relative shrink-0">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={STROKE}
          />
          {/* Avoided arc */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#10b981"
            strokeWidth={STROKE}
            strokeDasharray={`${avoidedDash - GAP / 2} ${CIRC - avoidedDash + GAP / 2}`}
            strokeLinecap="round"
          />
          {/* Absorbed arc — offset after avoided */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth={STROKE}
            strokeDasharray={`${absorbedDash - GAP / 2} ${CIRC - absorbedDash + GAP / 2}`}
            strokeDashoffset={-(avoidedDash + GAP / 2)}
            strokeLinecap="round"
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-bold text-forest">
            {formatCo2(total)}
          </span>
          <span className="text-[10px] text-gray-400 font-body">Tổng</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-emerald-500 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-forest">{t("avoided")}</p>
            <p className="font-mono text-sm text-emerald-600">
              {formatCo2(avoided)}{" "}
              <span className="text-xs text-gray-400">
                ({Math.round(avoidedPct * 100)}%)
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-sky-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-forest">{t("absorbed")}</p>
            <p className="font-mono text-sm text-sky-600">
              {formatCo2(absorbed)}{" "}
              <span className="text-xs text-gray-400">
                ({Math.round(absorbedPct * 100)}%)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUMMARY CARDS
// ============================================================

interface SummaryCardProps {
  label: string;
  description: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
  glowClass: string;
  isLoading: boolean;
}

function SummaryCard({
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
      className={`relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md ${colorClass}`}
    >
      {/* Glow blob */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl ${glowClass}`}
      />
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${glowClass} bg-opacity-15`}>
          <Icon size={20} />
        </div>
      </div>
      {isLoading ? (
        <div className="mt-4 h-8 w-32 animate-pulse rounded-lg bg-gray-100" />
      ) : (
        <div className="mt-4 font-display text-3xl font-bold text-forest">
          {formatCo2(value)}
        </div>
      )}
      <div className="mt-1 font-body text-sm font-semibold text-forest/80">
        {label}
      </div>
      <div className="mt-0.5 font-body text-xs text-gray-400">{description}</div>
    </div>
  );
}

// ============================================================
// HISTORY TABLE ROW SKELETON
// ============================================================

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 animate-pulse rounded bg-gray-100" />
        </td>
      ))}
    </tr>
  );
}

// ============================================================
// HISTORY TABLE
// ============================================================

function Co2HistoryTable({
  items,
  isLoading,
  emptyLabel,
}: {
  items: Co2eHistoryItem[];
  isLoading: boolean;
  emptyLabel: string;
}) {
  const t = useTranslations("admin.co2.history.columns");

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 pb-3 font-body text-xs font-semibold text-gray-500">
              {t("post")}
            </th>
            <th className="px-4 pb-3 font-body text-xs font-semibold text-gray-500">
              {t("material")}
            </th>
            <th className="px-4 pb-3 font-body text-xs font-semibold text-gray-500">
              {t("type")}
            </th>
            <th className="px-4 pb-3 font-body text-xs font-semibold text-gray-500 text-right">
              {t("amount")}
            </th>
            <th className="px-4 pb-3 font-body text-xs font-semibold text-gray-500 text-right">
              {t("confidence")}
            </th>
            <th className="px-4 pb-3 font-body text-xs font-semibold text-gray-500 text-right">
              {t("creditedAt")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : items.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-12 text-center font-body text-sm text-gray-400"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            items.map((item, idx) => (
              <tr
                key={`${item.post.id}-${idx}`}
                className="group transition-colors hover:bg-primary-50/30"
              >
                {/* Post */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {item.post.mediaUrl ? (
                      <img
                        src={item.post.mediaUrl}
                        alt=""
                        className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 ring-1 ring-border">
                        <Leaf size={14} className="text-primary-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="max-w-[180px] truncate font-body text-xs font-medium text-forest">
                        {item.post.caption || item.post.actionTypeName}
                      </p>
                      <p className="font-body text-[10px] text-gray-400">
                        {item.post.authorDisplayName}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Material */}
                <td className="px-4 py-3">
                  <div>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-[10px] text-gray-600">
                      {item.materialCode}
                    </span>
                    {item.materialLabel && (
                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {item.materialLabel}
                      </p>
                    )}
                  </div>
                </td>

                {/* CO2e type */}
                <td className="px-4 py-3">
                  <Co2TypeBadge type={item.co2eType} />
                </td>

                {/* Amount */}
                <td className="px-4 py-3 text-right">
                  <span className="font-mono text-sm font-semibold text-forest">
                    {item.co2eKg.toFixed(3)}
                  </span>
                  <span className="ml-1 text-[10px] text-gray-400">kg</span>
                </td>

                {/* Confidence */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all"
                        style={{ width: `${item.confidenceScore * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-gray-500">
                      {formatConfidence(item.confidenceScore)}
                    </span>
                  </div>
                </td>

                {/* Credited at */}
                <td className="px-4 py-3 text-right font-body text-xs text-gray-500">
                  {formatDate(item.creditedAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// PAGINATION
// ============================================================

function Pagination({
  page,
  totalPages,
  totalElements,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (p: number) => void;
}) {
  const t = useTranslations("admin.co2.history");
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <span className="font-body text-xs text-gray-500">
        {t("pagination", {
          page,
          totalPages,
          total: totalElements,
        })}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-gray-500 transition hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-medium transition ${
                p === page
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-border text-gray-600 hover:bg-primary-50"
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-gray-500 transition hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

const PAGE_SIZE = 10;

export default function Co2Page() {
  const t = useTranslations("admin.co2");

  const [historyPage, setHistoryPage] = useState(1);

  // ---- Data fetching ----
  const summaryQuery = useCo2WalletSummary();
  const historyQuery = useCo2eHistory({ page: historyPage, size: PAGE_SIZE });

  const summary = summaryQuery.data;
  const historyData = historyQuery.data;

  // ---- Summary cards config ----
  const summaryCards: SummaryCardProps[] = [
    {
      label: t("summary.total"),
      description: t("summary.totalUnit"),
      value: summary?.totalCo2eKg ?? 0,
      icon: Wind,
      colorClass: "border-primary-100",
      glowClass: "bg-primary-500",
      isLoading: summaryQuery.isLoading,
    },
    {
      label: t("summary.avoided"),
      description: t("summary.avoidedDesc"),
      value: summary?.totalAvoidedKg ?? 0,
      icon: TrendingDown,
      colorClass: "border-emerald-100",
      glowClass: "bg-emerald-500",
      isLoading: summaryQuery.isLoading,
    },
    {
      label: t("summary.absorbed"),
      description: t("summary.absorbedDesc"),
      value: summary?.totalAbsorbedKg ?? 0,
      icon: TreePine,
      colorClass: "border-sky-100",
      glowClass: "bg-sky-400",
      isLoading: summaryQuery.isLoading,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ---- Page header ---- */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-3xl text-primary-heading">
              {t("title")}
            </h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-body text-[11px] font-semibold text-emerald-600 border border-emerald-200">
              CO2e
            </span>
          </div>
          <p className="mt-1 font-body text-sm text-gray-500">{t("subtitle")}</p>
        </div>

        {/* Refresh indicator */}
        {(summaryQuery.isFetching || historyQuery.isFetching) && (
          <div className="flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-xs text-primary-600">
            <RefreshCw size={12} className="animate-spin" />
            Đang tải...
          </div>
        )}
      </div>

      {/* ---- Error states ---- */}
      {summaryQuery.isError && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600">
          <AlertCircle size={16} className="shrink-0" />
          Không thể tải dữ liệu CO2 tổng quan. Vui lòng thử lại sau.
        </div>
      )}

      {/* ---- Summary stat cards ---- */}
      <div className="grid gap-5 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* ---- Chart + breakdown row ---- */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 font-body text-base font-semibold text-forest">
          {t("chart.title")}
        </h3>
        <div className="flex items-center justify-center min-h-[180px]">
          {summaryQuery.isLoading ? (
            <div className="flex items-center gap-3 text-gray-400">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-300 border-t-transparent" />
              <span className="text-sm">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <Co2DonutChart
              avoided={summary?.totalAvoidedKg ?? 0}
              absorbed={summary?.totalAbsorbedKg ?? 0}
            />
          )}
        </div>

        {/* Equivalents callout */}
        {summary && summary.totalCo2eKg > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-border pt-5 sm:grid-cols-3">
            {[
              {
                label: "Tương đương xe hơi",
                value: `${(summary.totalCo2eKg / 21).toFixed(1)} km`,
                desc: "21 kg CO2e/100km",
                icon: "🚗",
              },
              {
                label: "Tương đương cây xanh",
                value: `${(summary.totalCo2eKg / 22).toFixed(1)} cây/năm`,
                desc: "~22 kg CO2e/cây/năm",
                icon: "🌳",
              },
              {
                label: "Tương đương chuyến bay",
                value: `${(summary.totalCo2eKg / 255).toFixed(2)} chuyến`,
                desc: "~255 kg CO2e/h bay",
                icon: "✈️",
              },
            ].map((eq) => (
              <div
                key={eq.label}
                className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3"
              >
                <span className="text-2xl">{eq.icon}</span>
                <div>
                  <p className="font-body text-xs text-gray-500">{eq.label}</p>
                  <p className="font-mono text-sm font-semibold text-forest">
                    {eq.value}
                  </p>
                  <p className="font-body text-[10px] text-gray-400">{eq.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- History table ---- */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="font-body text-base font-semibold text-forest">
              {t("history.title")}
            </h3>
            {historyData && (
              <p className="mt-0.5 font-body text-xs text-gray-400">
                {t("history.subtitle", {
                  total: historyData.totalElements,
                })}
              </p>
            )}
          </div>
        </div>

        {historyQuery.isError ? (
          <div className="flex items-center gap-3 px-6 py-8 text-sm text-rose-500">
            <AlertCircle size={15} />
            Không thể tải lịch sử CO2. Vui lòng thử lại.
          </div>
        ) : (
          <>
            <Co2HistoryTable
              items={historyData?.content ?? []}
              isLoading={historyQuery.isLoading}
              emptyLabel={t("history.empty")}
            />
            <Pagination
              page={historyPage}
              totalPages={historyData?.totalPages ?? 1}
              totalElements={historyData?.totalElements ?? 0}
              onPageChange={(p) => setHistoryPage(p)}
            />
          </>
        )}
      </div>
    </div>
  );
}
