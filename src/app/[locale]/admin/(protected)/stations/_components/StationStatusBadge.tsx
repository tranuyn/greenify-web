import { STATION_STATUS, type StationStatus } from "@/types/station.types";

const STATUS_CFG: Record<StationStatus, { label: string; cls: string }> = {
  [STATION_STATUS.DRAFT]: {
    label: "Nháp",
    cls: "bg-gray-100 !text-gray-500",
  },
  [STATION_STATUS.ACTIVE]: {
    label: "Hoạt động",
    cls: "bg-primary-100 !text-primary-content",
  },
  [STATION_STATUS.INACTIVE]: {
    label: "Tạm dừng",
    cls: "bg-amber-50 !text-amber-600",
  },
  [STATION_STATUS.TEMPORARY_CLOSED]: {
    label: "Đóng tạm",
    cls: "bg-rose-50 !text-rose-500",
  },
};

export function StationStatusBadge({ status }: { status: StationStatus }) {
  const cfg = STATUS_CFG[status] || {
    label: "Không rõ",
    cls: "bg-gray-100 text-gray-500",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

export { STATUS_CFG };
