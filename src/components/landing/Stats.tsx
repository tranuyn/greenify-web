"use client";

import { useLandingStats } from "@/hooks/queries/useAnalytics";
import { useTranslations } from "next-intl";

export function Stats() {
  const t = useTranslations("landing.stats");
  const { data } = useLandingStats();

  const stats = [
    { value: data?.totalPosts, label: t("totalPosts") },
    { value: data?.totalUsers, label: t("totalUsers") },
    { value: data?.totalStations, label: t("totalStations") },
    { value: data?.totalEvents, label: t("totalEvents") },
  ];

  const formatValue = (value?: number) => {
    if (typeof value !== "number") return "...";
    return `${value.toLocaleString("vi-VN")}+`;
  };

  return (
    <section id="stats" className="bg-primary-950/90 dark:bg-primary-100/90 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-bold text-5xl text-primary-400 dark:text-primary-700 md:text-6xl">
              {formatValue(s.value)}
            </div>
            <div className="mt-2 font-body text-sm text-primary-200/60 dark:text-primary-700/60">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
