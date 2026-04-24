"use client";

import {
  Users,
  Calendar,
  Leaf,
  TrendingUp,
  MapPin,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAdminDashboardOverview } from "@/hooks/queries/useAnalytics";
import { useTranslations } from "next-intl";
import { Event, EventStatus } from "@/types/community.types";
import { AdminUserDto, UserStatus } from "@/types/user.type";

const EVENT_STATUS_CONFIG: Record<
  EventStatus,
  { label: string; icon: LucideIcon; cls: string }
> = {
  DRAFT: {
    label: "Nháp",
    icon: Clock,
    cls: "bg-gray-100 text-gray-600",
  },
  APPROVAL_WAITING: {
    label: "Chờ duyệt",
    icon: Clock,
    cls: "bg-amber-50 text-amber-600",
  },
  PUBLISHED: {
    label: "Đã đăng",
    icon: CheckCircle,
    cls: "bg-blue-50 text-blue-600",
  },
  IN_PROGRESS: {
    label: "Đang diễn ra",
    icon: CheckCircle,
    cls: "bg-primary-50 text-primary-700",
  },
  COMPLETED: {
    label: "Hoàn thành",
    icon: CheckCircle,
    cls: "bg-emerald-50 text-emerald-700",
  },
  REJECTED: {
    label: "Từ chối",
    icon: XCircle,
    cls: "bg-rose-50 text-rose-500",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: XCircle,
    cls: "bg-rose-50 text-rose-500",
  },
};

const USER_STATUS_CONFIG: Record<UserStatus, { cls: string; label: string }> = {
  ACTIVE: { cls: "bg-primary-100 text-primary-700", label: "Hoạt động" },
  SUSPENDED: { cls: "bg-rose-100 text-rose-600", label: "Tạm khóa" },
  DELETED: { cls: "bg-gray-100 text-gray-600", label: "Đã xóa" },
  FLAGGED: { cls: "bg-amber-100 text-amber-700", label: "Đang cảnh báo" },
};

const ROLE_CONFIG: Record<string, { cls: string }> = {
  USER: { cls: "bg-gray-100 text-gray-600" },
  CTV: { cls: "bg-blue-100 text-blue-700" },
  NGO: { cls: "bg-violet-100 text-violet-700" },
  ADMIN: { cls: "bg-amber-100 text-amber-700" },
};

interface StatCardItem {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  color: string;
}

const formatNumber = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

const formatMonth = (month: string) => {
  if (/^\d{4}-\d{2}$/.test(month)) {
    return `T${month.slice(5, 7)}`;
  }
  return month;
};

const formatDate = (value: string) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("vi-VN");
};

function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  color,
}: StatCardItem) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-6 shadow-sm`}>
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-xl border p-2.5 ${color}`}>
          <Icon size={20} />
        </div>
        {delta ? (
          <span className="flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 font-mono text-xs text-primary-700">
            <TrendingUp size={10} />
            {delta}
          </span>
        ) : null}
      </div>
      <div className="font-display text-3xl text-forest">{value}</div>
      <div className="mt-1 font-body text-sm text-gray-500">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const t = useTranslations("admin.dashboard");
  const tCommon = useTranslations("common");

  const { totals, monthlyBreakdown, recentEvents, recentUsers, isLoading } =
    useAdminDashboardOverview();

  const chartItems = monthlyBreakdown.map((item) => ({
    label: formatMonth(item.month),
    verifiedPosts: item.verifiedPosts,
    trashResolved: item.trashResolved,
  }));

  const maxChartValue = Math.max(
    1,
    ...chartItems.map((item) => Math.max(item.verifiedPosts, item.trashResolved)),
  );

  const statCards: StatCardItem[] = [
    {
      label: t("stats.totalUsers"),
      value: formatNumber(totals.totalUsers),
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-500",
    },
    {
      label: t("stats.verifiedPosts"),
      value: formatNumber(totals.verifiedPosts),
      icon: Leaf,
      color: "bg-primary-50 text-primary-600 border-primary-100",
    },
    {
      label: t("stats.totalEvents"),
      value: formatNumber(totals.totalEvents),
      icon: Calendar,
      color: "bg-violet-50 text-violet-600 border-violet-100",
    },
    {
      label: t("stats.pointsIssued"),
      value: formatNumber(totals.pointsIssued),
      icon: Trophy,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h2 className="font-bold text-3xl text-primary-heading">{t("title")}</h2>
        <p className="mt-1 font-body text-sm text-gray-500">
          {t("subtitle")}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts + tables row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly activity chart — takes 2/3 */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-body text-base font-semibold text-forest">
              {t("chart.title")}
            </h3>
            <div className="flex items-center gap-4 font-body text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-primary-500" /> {t("chart.verifiedPosts")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-400" /> {t("chart.trashResolved")}
              </span>
            </div>
          </div>

          <div className="flex h-48 items-end gap-3">
            {isLoading ? (
              <div className="flex w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
              </div>
            ) : chartItems.length === 0 ? (
              <div className="flex w-full items-center justify-center text-sm text-gray-400">
                {t("chart.empty")}
              </div>
            ) : (
              chartItems.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div className="relative flex w-full max-w-16 items-end gap-1 justify-center">
                    <div
                      className="flex-1 rounded-t-md bg-primary-400 transition-all hover:bg-primary-500"
                      style={{
                        height: `${(item.verifiedPosts / maxChartValue) * 176}px`,
                      }}
                      title={t("chart.tooltipVerified", { count: item.verifiedPosts })}
                    />
                    <div
                      className="flex-1 rounded-t-md bg-violet-300 transition-all hover:bg-violet-400"
                      style={{
                        height: `${(item.trashResolved / maxChartValue) * 176}px`,
                      }}
                      title={t("chart.tooltipTrash", { count: item.trashResolved })}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-gray-400">
                    {item.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick stats — takes 1/3 */}
        <div className="space-y-4">
          {[
            {
              label: t("quickStats.pendingPosts"),
              value: totals.pendingPosts,
              icon: Clock,
              cls: "text-amber-500 bg-amber-50",
            },
            {
              label: t("quickStats.pendingEvents"),
              value: totals.pendingEvents,
              icon: Calendar,
              cls: "text-violet-500 bg-violet-50",
            },
            {
              label: t("quickStats.totalTrashReports"),
              value: totals.totalTrashReports,
              icon: AlertTriangle,
              cls: "text-rose-500 bg-rose-50",
            },
            {
              label: t("quickStats.activeStations"),
              value: totals.activeStations,
              icon: MapPin,
              cls: "text-primary-600 bg-primary-50",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className={`rounded-xl p-2.5 ${item.cls}`}>
                <item.icon size={18} />
              </div>
              <div className="flex-1">
                <div className="font-body text-xs text-gray-500">
                  {item.label}
                </div>
                <div className="font-display text-2xl text-forest">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent tables row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent events needing approval */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-body text-base font-semibold text-forest">
              {t("recentEvents.title")}
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentEvents.map((evt: Event) => {
              const s = EVENT_STATUS_CONFIG[evt.status] ?? {
                label: evt.status,
                icon: Clock,
                cls: "bg-gray-100 text-gray-600",
              };
              return (
                <div
                  key={evt.title}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-body text-sm font-medium text-forest">
                      {evt.title}
                    </p>
                    <p className="font-body text-xs text-gray-400">
                      {evt.organizer?.name ?? t("recentEvents.na")} · {formatDate(evt.startTime)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 font-body text-[10px] font-semibold ${s.cls}`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
            {recentEvents.length === 0 && (
              <div className="px-6 py-8 text-sm text-gray-400">{t("recentEvents.empty")}</div>
            )}
          </div>
        </div>

        {/* Recent users */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-body text-base font-semibold text-forest">
              {t("recentUsers.title")}
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.map((user: AdminUserDto) => {
              const primaryRole = user.roles[0] ?? "USER";
              const role = ROLE_CONFIG[primaryRole] ?? ROLE_CONFIG.USER;
              const status = USER_STATUS_CONFIG[user.status] ?? USER_STATUS_CONFIG.ACTIVE;
              return (
                <div
                  key={user.id}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 font-body text-sm font-bold text-primary-700">
                    {user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-body text-sm font-medium text-forest">
                      {user.name}
                    </p>
                    <p className="font-body text-xs text-gray-400">
                      {t("recentUsers.joined", { date: formatDate(user.createdAt) })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 font-body text-[10px] font-semibold ${role.cls}`}
                    >
                      {tCommon(`roles.${primaryRole}`)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-body text-[10px] font-semibold ${status.cls}`}
                    >
                      {tCommon(`status.${user.status}`)}
                    </span>
                  </div>
                </div>
              );
            })}
            {recentUsers.length === 0 && (
              <div className="px-6 py-8 text-sm text-gray-400">{t("recentUsers.empty")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
