"use client";

import { useTranslations } from "next-intl";
import { AdminCo2eMonthlyBreakdown } from "@/types/co2.types";
import { useMemo, useState } from "react";

interface Co2MonthlyChartProps {
  items: AdminCo2eMonthlyBreakdown[];
  isLoading: boolean;
}

export function Co2MonthlyChart({ items, isLoading }: Co2MonthlyChartProps) {
  const t = useTranslations("admin.co2.monthly");
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);

  // Calculate chart dimensions and scales
  const CHART_HEIGHT = 240;
  const BAR_WIDTH = 40;
  const BAR_GAP = 20;
  const PADDING_TOP = 110;
  const PADDING_BOTTOM = 30;
  const PADDING_LEFT = 50;

  const maxVal = useMemo(() => {
    if (!items || items.length === 0) return 100;
    const peak = Math.max(...items.map((item) => item.totalCo2eKg));
    return peak === 0 ? 100 : peak * 1.2; // Add some headroom
  }, [items]);

  const viewWidth = Math.max(800, items.length * (BAR_WIDTH + BAR_GAP) + PADDING_LEFT * 2);
  const viewHeight = CHART_HEIGHT + PADDING_TOP + PADDING_BOTTOM;

  if (isLoading) {
    return (
      <div className="flex h-[310px] w-full items-center justify-center bg-muted/5 rounded-3xl animate-pulse">
        <div className="flex gap-4 items-end h-40">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-10 bg-muted rounded-t-lg" style={{ height: `${i * 20}px` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex h-[310px] w-full flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/5 rounded-3xl border border-dashed">
        <p className="text-sm font-medium">{t("empty")}</p>
      </div>
    );
  }

  // Active Tooltip Data
  const activeItem = activeTooltipIndex !== null ? items[activeTooltipIndex] : null;
  const activeX = activeTooltipIndex !== null ? PADDING_LEFT + activeTooltipIndex * (BAR_WIDTH + BAR_GAP) : 0;
  const activeTotalH = activeItem ? (activeItem.totalCo2eKg / maxVal) * CHART_HEIGHT : 0;

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
      <svg
        width={viewWidth}
        height={viewHeight}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="mx-auto"
        onMouseLeave={() => setActiveTooltipIndex(null)}
      >
        {/* Y-Axis Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const y = PADDING_TOP + CHART_HEIGHT * (1 - p);
          const val = Math.round(maxVal * p);
          return (
            <g key={p} className="text-muted-foreground/30">
              <line
                x1={PADDING_LEFT}
                y1={y}
                x2={viewWidth - PADDING_LEFT}
                y2={y}
                stroke="currentColor"
                strokeDasharray="4 4"
              />
              <text
                x={PADDING_LEFT - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px] font-medium"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {items.map((item, i) => {
          const x = PADDING_LEFT + i * (BAR_WIDTH + BAR_GAP);
          
          // Heights
          const avoidedH = (item.totalAvoidedKg / maxVal) * CHART_HEIGHT;
          const absorbedH = (item.totalAbsorbedKg / maxVal) * CHART_HEIGHT;
          const isHovered = activeTooltipIndex === i;

          return (
            <g 
              key={item.month} 
              className="cursor-default"
              onMouseEnter={() => setActiveTooltipIndex(i)}
            >
              {/* Tooltip background (invisible) */}
              <rect
                x={x - BAR_GAP / 2}
                y={PADDING_TOP}
                width={BAR_WIDTH + BAR_GAP}
                height={CHART_HEIGHT}
                fill="transparent"
              />

              {/* Stacked Bars */}
              {/* Absorbed (Bottom) */}
              <rect
                x={x}
                y={PADDING_TOP + CHART_HEIGHT - absorbedH}
                width={BAR_WIDTH}
                height={absorbedH}
                className={`fill-info transition-all duration-300 ${isHovered ? 'opacity-80' : ''}`}
                rx="4"
              />
              
              {/* Avoided (Middle) */}
              <rect
                x={x}
                y={PADDING_TOP + CHART_HEIGHT - absorbedH - avoidedH}
                width={BAR_WIDTH}
                height={avoidedH}
                className={`fill-success transition-all duration-300 ${isHovered ? 'opacity-80' : ''}`}
                rx="4"
              />

              {/* Month label */}
              <text
                x={x + BAR_WIDTH / 2}
                y={PADDING_TOP + CHART_HEIGHT + 20}
                textAnchor="middle"
                className={`text-[10px] font-bold transition-colors ${isHovered ? 'fill-foreground' : 'fill-muted-foreground'}`}
              >
                {item.month}
              </text>
            </g>
          );
        })}

        {/* Tooltip Layer - Rendered last so it sits on top of all bars */}
        {activeItem && (
          <g className="pointer-events-none">
            <foreignObject
              x={activeX + BAR_WIDTH / 2 - 80}
              y={PADDING_TOP + CHART_HEIGHT - activeTotalH - 110}
              width={160}
              height={100}
              className="overflow-visible drop-shadow-xl animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex flex-col gap-1.5 rounded-xl bg-card p-3 text-xs border border-border shadow-md">
                <div className="font-bold border-b border-border/60 pb-1.5 text-foreground flex justify-between">
                  <span>{activeItem.month}</span>
                  <span className="font-mono text-primary">{activeItem.totalCo2eKg.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">{t("avoided")}</span>
                  </div>
                  <span className="font-mono font-medium text-foreground">{activeItem.totalAvoidedKg.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-info" />
                    <span className="text-muted-foreground">{t("absorbed")}</span>
                  </div>
                  <span className="font-mono font-medium text-foreground">{activeItem.totalAbsorbedKg.toFixed(1)}</span>
                </div>
              </div>
            </foreignObject>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-6 flex justify-center gap-6 text-[11px] font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-success" />
          <span className="text-muted-foreground">{t("avoided")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-info" />
          <span className="text-muted-foreground">{t("absorbed")}</span>
        </div>
      </div>
    </div>
  );
}
