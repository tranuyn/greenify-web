"use client";

import { EventStatus, EventType } from "@/types/community.types";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { SearchBar } from "@/components/admin/ui/search-bar";
import { ChipFilterGroup, type ChipFilterOption } from "@/components/admin/ui/filter-chip-group";

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
  DRAFT: {
    label: "Nháp",
    cls: "bg-gray-50 text-gray-600 border-gray-200",
    icon: Clock,
  },
  APPROVAL_WAITING: {
    label: "Chờ duyệt",
    cls: "bg-amber-50 text-amber-600 border-amber-200",
    icon: Clock,
  },
  PUBLISHED: {
    label: "Đã đăng",
    cls: "bg-blue-50 text-blue-600 border-blue-200",
    icon: CheckCircle,
  },
  IN_PROGRESS: {
    label: "Đang diễn ra",
    cls: "bg-primary-50 text-primary-700 border-primary-200",
    icon: CheckCircle,
  },
  COMPLETED: {
    label: "Hoàn thành",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Từ chối",
    cls: "bg-rose-50 text-rose-500 border-rose-200",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Đã hủy",
    cls: "bg-gray-50 text-gray-500 border-gray-200",
    icon: XCircle,
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
  { value: "APPROVAL_WAITING", label: "Chờ duyệt" },
  { value: "PUBLISHED", label: "Đã đăng" },
  { value: "IN_PROGRESS", label: "Đang diễn ra" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "CANCELLED", label: "Đã hủy" },
];

interface Props {
  activeStatus: EventStatus | "ALL";
  onStatusChange: (s: EventStatus | "ALL") => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
  onSearchSubmit: (v: string) => void;
  isSearching?: boolean;
  counts: Partial<Record<EventStatus | "ALL", number>>;
}

export function EventFilterBar({
  activeStatus,
  onStatusChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  isSearching,
  counts,
}: Props) {
  const filterOptions: ChipFilterOption<EventStatus | "ALL">[] = FILTER_TABS.map(
    ({ value, label }) => ({
      value,
      label,
      count: counts[value] ?? 0,
    }),
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <SearchBar
        className="max-w-md"
        value={searchValue}
        onValueChange={onSearchChange}
        onSearch={onSearchSubmit}
        placeholder="Tìm theo tên sự kiện..."
        buttonLabel="Tìm kiếm"
        loading={isSearching}
        inputClassName="rounded-xl"
        buttonClassName="rounded-xl"
      />

      {/* Status tabs */}
      <ChipFilterGroup
        value={activeStatus}
        onChange={onStatusChange}
        options={filterOptions}
        layout="wrap"
        size="md"
      />
    </div>
  );
}
