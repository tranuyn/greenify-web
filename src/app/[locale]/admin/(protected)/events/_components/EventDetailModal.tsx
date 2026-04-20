"use client";

import { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Users,
  Trophy,
  CheckCircle,
  XCircle,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { Event } from "@/types/community.types";
import { STATUS_CONFIG, EVENT_TYPE_LABELS } from "./EventFilterBar";

const REJECT_REASONS = [
  "Thông tin không đầy đủ",
  "Địa điểm không hợp lệ",
  "Nội dung không phù hợp",
  "Điểm thưởng không hợp lý",
  "Vi phạm điều khoản",
  "Lý do khác",
];

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} · ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

interface Props {
  event: Event;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export function EventDetailModal({
  event,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: Props) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectNote, setRejectNote] = useState("");

  const s = STATUS_CONFIG[event.status];
  const isPending = event.status === "PENDING_APPROVAL";

  const handleRejectConfirm = () => {
    if (!rejectReason) return;
    // Gộp reason + note thành 1 string nếu có note
    const fullReason = rejectNote.trim()
      ? `${rejectReason}: ${rejectNote.trim()}`
      : rejectReason;
    onReject(event.id, fullReason);
  };

  const locationFull = event.address
    ? `${event.address.addressDetail}, ${event.address.ward}, ${event.address.province}`
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Cover image */}
        <div className="relative h-52 shrink-0 bg-primary-100">
          {event.thumbnail?.imageUrl ? (
            <img
              src={event.thumbnail.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-primary-100 text-5xl">
              🌿
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            <X size={18} />
          </button>

          {/* Event type */}
          <div className="absolute bottom-4 left-4">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm">
              {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-2xl text-gray-900">
                {event.title}
              </h3>
                {event.organizer?.name && (
                <p className="mt-1 text-sm font-medium text-primary-700">
                    {event.organizer.name}
                </p>
              )}
            </div>
            {s && (
              <span
                className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${s.cls}`}
              >
                <s.icon size={12} />
                {s.label}
              </span>
            )}
          </div>

          {/* Reject reason banner */}
          {event.rejectReason && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
              <AlertTriangle
                size={16}
                className="shrink-0 text-rose-500 mt-0.5"
              />
              <div>
                <p className="text-sm font-semibold text-rose-700">
                  Lý do từ chối trước đó
                </p>
                <p className="mt-0.5 text-sm text-rose-600">
                  {event.rejectReason}
                </p>
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: Calendar,
                label: "Bắt đầu",
                value: formatDateTime(event.startTime),
              },
              {
                icon: Calendar,
                label: "Kết thúc",
                value: formatDateTime(event.endTime),
              },
              {
                icon: Users,
                label: "Tối đa",
                value: `${event.maxParticipants} người`,
              },
              {
                icon: Users,
                label: "Tối thiểu",
                value: `${event.minParticipants} người`,
              },
              {
                icon: Trophy,
                label: "Điểm thưởng",
                value: `${event.rewardPoints} GP`,
              },
              { icon: MapPin, label: "Địa điểm", value: locationFull },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-2 rounded-xl bg-gray-50 px-3 py-2.5"
              >
                <Icon size={14} className="mt-0.5 shrink-0 text-primary-600" />
                <div>
                  <p className="text-[10px] text-gray-400">{label}</p>
                  <p className="text-xs font-medium text-gray-700">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="rounded-xl bg-primary-50 p-4">
            <p className="text-sm leading-relaxed text-gray-700">
              {event.description}
            </p>
          </div>

          {/* Gallery thumbnails */}
          {event.images && event.images.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Ảnh sự kiện ({event.images.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {event.images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.id ?? i}
                    src={img.imageUrl}
                    alt={`img-${i}`}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reject form */}
          {showRejectForm && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 space-y-3">
              <p className="text-sm font-semibold text-rose-700">
                Lý do từ chối *
              </p>

              {/* Reason select */}
              <div className="relative">
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-rose-400"
                >
                  <option value="">-- Chọn lý do --</option>
                  {REJECT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-3.5 text-gray-400"
                />
              </div>

              {/* Note */}
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Ghi chú thêm cho NGO (không bắt buộc)..."
                rows={3}
                className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-400 resize-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectReason("");
                    setRejectNote("");
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={!rejectReason || isRejecting}
                  className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 disabled:opacity-50"
                >
                  {isRejecting ? "Đang xử lý..." : "Xác nhận từ chối"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {isPending && !showRejectForm && (
          <div className="flex gap-3 shrink-0 border-t border-gray-100 px-6 py-4">
            <button
              onClick={() => setShowRejectForm(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 py-3 font-semibold text-rose-600 hover:bg-rose-100"
            >
              <XCircle size={18} /> Từ chối
            </button>
            <button
              onClick={() => onApprove(event.id)}
              disabled={isApproving}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {isApproving ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <CheckCircle size={18} /> Duyệt
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
