"use client";

/**
 * MapPickerModal
 * ─────────────────────────────────────────────────────────────────────────
 * Leaflet map modal để user click chọn tọa độ (lat/lng).
 * Dùng dynamic import (ssr: false) vì Leaflet cần browser DOM.
 * OpenStreetMap tile – miễn phí, không cần API key.
 */

import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { X, MapPin, Navigation } from "lucide-react";
import type { LeafletMapInnerProps } from "./LeafletMapInner";

// ── Dynamic import của inner map (chỉ render phía client) ──────────────
const LeafletMap = dynamic<LeafletMapInnerProps>(
  () => import("./LeafletMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[380px] items-center justify-center rounded-2xl bg-primary-50">
        <div className="flex flex-col items-center gap-3 text-primary-content">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          <span className="text-sm font-medium">Đang tải bản đồ…</span>
        </div>
      </div>
    ),
  },
);

// ── Props ──────────────────────────────────────────────────────────────
interface MapPickerModalProps {
  initialLat?: number;
  initialLng?: number;
  onConfirm: (lat: number, lng: number) => void;
  onClose: () => void;
}

export function MapPickerModal({
  initialLat,
  initialLng,
  onConfirm,
  onClose,
}: MapPickerModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100">
              <MapPin size={16} className="text-primary-content" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Chọn vị trí trên bản đồ
              </h3>
              <p className="text-xs text-foreground/50">
                Click vào bản đồ để ghim vị trí điểm thu gom
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-foreground/40 transition-colors hover:bg-primary-surface hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Map */}
        <div className="p-4">
          <LeafletMap
            initialLat={initialLat}
            initialLng={initialLng}
            onConfirm={onConfirm}
            onClose={onClose}
          />
        </div>

        {/* Hint */}
        <div className="flex items-center gap-2 border-t border-border px-6 py-3">
          <Navigation size={13} className="shrink-0 text-foreground/40" />
          <p className="text-xs text-foreground/50">
            Sau khi ghim, nhấn{" "}
            <span className="font-semibold text-primary-content">
              Xác nhận
            </span>{" "}
            để điền tọa độ vào form.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
