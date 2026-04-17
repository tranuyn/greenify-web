"use client";

import { EventStatus, EventType } from "@/types/community.types";
import { Clock, CheckCircle, XCircle, Search } from "lucide-react";

export const STATUS_CONFIG: Partial<
  Record<
    EventStatus,
    {
      label: string;
      cls: string;
      icon: typeof Clock;
    }
  >
> = {
  PENDING_APPROVAL: {
    label: "Chờ duyệt",
    cls: "bg-amber-50 text-amber-600 border-amber-200",
    icon: Clock,
  },
  APPROVED: {
    label: "Đã duyệt",
    cls: "bg-primary-50 text-primary-700 border-primary-200",
    icon: CheckCircle,
  },
  PUBLISHED: {
    label: "Đã đăng",
    cls: "bg-blue-50 text-blue-600 border-blue-200",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Từ chối",
    cls: "bg-rose-50 text-rose-500 border-rose-200",
    icon: XCircle,
  },
  NEEDS_REVISION: {
    label: "Cần chỉnh sửa",
    cls: "bg-orange-50 text-orange-600 border-orange-200",
    icon: Clock,
  },
  CLOSED: {
    label: "Đã đóng",
    cls: "bg-gray-50 text-gray-500 border-gray-200",
    icon: Clock,
  },
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  CLEANUP: "Dọn rác",
  PLANTING: "Trồng cây",
  RECYCLING: "Tái chế",
  EDUCATION: "Giáo dục",
  OTHER: "Khác",
};

const FILTER_TABS: Array<{
  value: EventStatus | "ALL";
  label: string;
  count?: number;
}> = [
  { value: "ALL", label: "Tất cả" },
  { value: "PENDING_APPROVAL", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "PUBLISHED", label: "Đã đăng" },
  { value: "REJECTED", label: "Từ chối" },
];

interface Props {
  activeStatus: EventStatus | "ALL";
  onStatusChange: (s: EventStatus | "ALL") => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
  counts: Partial<Record<EventStatus | "ALL", number>>;
}

export function EventFilterBar({
  activeStatus,
  onStatusChange,
  searchValue,
  onSearchChange,
  counts,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo tên sự kiện..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(({ value, label }) => {
          const count = counts[value] ?? 0;
          const isActive = activeStatus === value;
          return (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "border-primary-500 bg-primary-600 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-primary-300"
              }`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
