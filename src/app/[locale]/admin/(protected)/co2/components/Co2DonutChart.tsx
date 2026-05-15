"use client";

import { useTranslations } from "next-intl";
import { Wind } from "lucide-react";
import { formatCo2 } from "../utils/format";

interface Co2DonutChartProps {
  avoided: number;
  absorbed: number;
}

export function Co2DonutChart({ avoided, absorbed }: Co2DonutChartProps) {
  const t = useTranslations("admin.co2.chart");
  const tCommon = useTranslations("common.actions");
  const total = avoided + absorbed;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <Wind size={32} className="opacity-30" />
        <p className="text-sm">{t("empty")}</p>
      </div>
    );
  }

  const SIZE = 160;
  const STROKE = 24;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const avoidedPct = avoided / total;
  const absorbedPct = absorbed / total;

  // Emerald for avoided, sky for absorbed
  const avoidedDash = avoidedPct * CIRC;
  const absorbedDash = absorbedPct * CIRC;
  const GAP = total > 0 ? 4 : 0;

  return (
    <div className="flex items-center gap-8">
      {/* SVG donut */}
      <div className="relative shrink-0">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90 drop-shadow-sm"
        >
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={STROKE}
          />
          {/* Avoided arc */}
          {/* Avoided arc */}
          {avoided > 0 && (
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2} 
              r={R}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={STROKE}
              strokeDasharray={`${avoidedDash - GAP / 2} ${CIRC - avoidedDash + GAP / 2}`}
              strokeLinecap="round"
            />
          )}
          {/* Absorbed arc — offset after avoided */}
          {absorbed > 0 && (
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="var(--color-info)"
              strokeWidth={STROKE}
              strokeDasharray={`${absorbedDash - GAP / 2} ${CIRC - absorbedDash + GAP / 2}`}
              strokeDashoffset={-(avoidedDash + GAP / 2)}
              strokeLinecap="round"
            />
          )}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-bold text-foreground">
            {formatCo2(total)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {tCommon("total")}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground/70">{t("avoided")}</p>
            <p className="font-mono text-sm font-bold text-primary">
              {formatCo2(avoided)}{" "}
              <span className="text-[10px] font-medium text-muted-foreground ml-1">
                ({Math.round(avoidedPct * 100)}%)
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-info ring-4 ring-info/10 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground/70">{t("absorbed")}</p>
            <p className="font-mono text-sm font-bold text-info">
              {formatCo2(absorbed)}{" "}
              <span className="text-[10px] font-medium text-muted-foreground ml-1">
                ({Math.round(absorbedPct * 100)}%)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
