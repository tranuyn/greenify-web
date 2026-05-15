"use client";

import { Car, PlaneTakeoff, Trees } from "lucide-react";
import { useTranslations } from "next-intl";


interface Co2EquivalentsProps {
  totalCo2eKg: number;
}

export function Co2Equivalents({ totalCo2eKg }: Co2EquivalentsProps) {
  const t = useTranslations("admin.co2.equivalents");

  const equivalents = [
    {
      label: t("car"),
      value: `${(totalCo2eKg / 21).toFixed(1)} km`,
      desc: t("carDesc"),
      icon: <Car className="text-error" />,
      bg: "bg-error/5",
      border: "border-error/10",
    },
    {
      label: t("tree"),
      value: `${(totalCo2eKg / 22).toFixed(1)} cây/năm`,
      desc: t("treeDesc"),
      icon: <Trees className="text-success" />,
      bg: "bg-success/5",
      border: "border-success/10",
    },
    {
      label: t("flight"),
      value: `${(totalCo2eKg / 255).toFixed(2)} chuyến`,
      desc: t("flightDesc"),
      icon: <PlaneTakeoff className="text-info" />,
      bg: "bg-info/5",
      border: "border-info/10",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-3 !z-1000">
      {equivalents.map((eq) => (
        <div
          key={eq.label}
          className={`flex items-center gap-4 rounded-2xl border ${eq.border} ${eq.bg} px-5 py-4 transition-transform hover:scale-[1.02]`}
        >
          <span className="text-3xl filter drop-shadow-sm">{eq.icon}</span>
          <div>
            <p className="font-body text-xs font-bold text-muted-foreground uppercase tracking-tight">
              {eq.label}
            </p>
            <p className="mt-0.5 font-display text-lg font-bold text-foreground">
              {eq.value}
            </p>
            <p className="font-body text-[10px] text-muted-foreground/70 italic">{eq.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
