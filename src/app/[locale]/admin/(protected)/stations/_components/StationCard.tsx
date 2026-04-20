import { RecyclingStation, StationStatus } from "@/types/station.types";
import { useState } from "react";
import { StationStatusBadge, STATUS_CFG } from "./StationStatusBadge";
import {
  Pencil,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Recycle,
  ChevronDown,
} from "lucide-react";

const DAY_SHORT: Record<string, string> = {
  MONDAY: "T2",
  TUESDAY: "T3",
  WEDNESDAY: "T4",
  THURSDAY: "T5",
  FRIDAY: "T6",
  SATURDAY: "T7",
  SUNDAY: "CN",
};

function formatTime(t: string) {
  return t.slice(0, 5);
}
export function StationCard({
  station,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
}: {
  station: RecyclingStation;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (s: StationStatus) => void;
  isDeleting: boolean;
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const statusOptions: StationStatus[] = [
    "DRAFT",
    "ACTIVE",
    "INACTIVE",
    "TEMPORARY_CLOSED",
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      {/* Header */}
      <div className="border-b border-border p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="line-clamp-1 text-sm font-semibold text-header">
              {station.name}
            </h3>
            {station.description && (
              <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                {station.description}
              </p>
            )}
          </div>

          {/* Status dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowStatusMenu((p) => !p)}
              className="flex items-center gap-1"
            >
              <StationStatusBadge status={station.status} />
              <ChevronDown size={12} className="text-gray-400" />
            </button>

            {showStatusMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowStatusMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        onStatusChange(s);
                        setShowStatusMenu(false);
                      }}
                      className={`flex w-full items-center gap-2 px-4 py-2.5 text-xs hover:bg-gray-50 ${
                        station.status === s
                          ? "font-semibold text-primary-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${STATUS_CFG[s].cls.split(" ")[0]}`}
                      />
                      {STATUS_CFG[s].label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <MapPin size={12} className="mt-0.5 shrink-0 text-primary-content" />
          <span className="line-clamp-1">
            {station.address.addressDetail}, {station.address.ward},
          </span>
        </div>

        {/* Phone */}
        {station.phoneNumber && (
          <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
            <Phone size={12} className="shrink-0 text-primary-content" />
            <span>{station.phoneNumber}</span>
          </div>
        )}
      </div>

      {/* Waste types */}
      <div className="border-b border-border px-5 py-3">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Recycle size={11} className="text-primary-content" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Loại rác tiếp nhận
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {station.wasteTypes.length > 0 ? (
            station.wasteTypes.map((wt) => (
              <span
                key={wt.id}
                className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-medium text-primary-content"
              >
                {wt.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">Chưa có</span>
          )}
        </div>
      </div>

      {/* Open times summary */}
      <div className="border-b border-border px-5 py-3">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Clock size={11} className="text-primary-content" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Giờ mở cửa ({station.openTimes.length} khung)
          </span>
        </div>
        {station.openTimes.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {station.openTimes.slice(0, 4).map((ot, i) => (
              <span
                key={ot.id ?? i}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
              >
                {DAY_SHORT[ot.dayOfWeek] ?? ot.dayOfWeek}:{" "}
                {formatTime(ot.startTime)}–{formatTime(ot.endTime)}
              </span>
            ))}
            {station.openTimes.length > 4 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                +{station.openTimes.length - 4} khác
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-400">Chưa có giờ mở cửa</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 py-3.5">
        <button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          <Pencil size={13} /> Chỉnh sửa
        </button>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-500 hover:bg-rose-100 disabled:opacity-50"
          title="Xóa"
        >
          {isDeleting ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" />
          ) : (
            <Trash2 size={13} />
          )}
        </button>
      </div>
    </div>
  );
}
