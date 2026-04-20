import type { StationStatus } from "@/types/station.types";

const STATUS_CFG: Record<StationStatus, { label: string; cls: string }> = {
  DRAFT: { label: "Nháp", cls: "bg-gray-100 !text-gray-500" },
  ACTIVE: { label: "Hoạt động", cls: "bg-primary-100 !text-primary-content" },
  INACTIVE: { label: "Tạm dừng", cls: "bg-amber-50 !text-amber-600" },
  TEMPORARY_CLOSED: { label: "Đóng tạm", cls: "bg-rose-50 !text-rose-500" },
};

export function StationStatusBadge({ status }: { status: StationStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

export { STATUS_CFG };
