"use client";

/**
 * LeafletMapInner
 * ─────────────────────────────────────────────────────────────────────────
 * Inner component – chỉ được import qua dynamic({ ssr: false }).
 * Chứa toàn bộ logic Leaflet để tránh "window is not defined" lúc SSR.
 */

import { useEffect, useRef, useState } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Check, MapPin } from "lucide-react";

// Fix icon Leaflet bị mất khi bundle với webpack/Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Mặc định: trung tâm TP.HCM
const DEFAULT_LAT = 10.7769;
const DEFAULT_LNG = 106.7009;
const DEFAULT_ZOOM = 13;

export interface LeafletMapInnerProps {
  initialLat?: number;
  initialLng?: number;
  onConfirm: (lat: number, lng: number) => void;
  onClose: () => void;
}

export default function LeafletMapInner({
  initialLat,
  initialLng,
  onConfirm,
  onClose,
}: LeafletMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const startLat =
    initialLat && initialLat !== 0 ? initialLat : DEFAULT_LAT;
  const startLng =
    initialLng && initialLng !== 0 ? initialLng : DEFAULT_LNG;

  const [pickedLat, setPickedLat] = useState<number>(startLat);
  const [pickedLng, setPickedLng] = useState<number>(startLng);
  const [hasPicked, setHasPicked] = useState(
    !!(initialLat && initialLat !== 0),
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Khởi tạo map
    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLng],
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    // OpenStreetMap tile (miễn phí)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Marker ban đầu (nếu có tọa độ hợp lệ)
    if (initialLat && initialLat !== 0) {
      const marker = L.marker([startLat, startLng], { draggable: true }).addTo(
        map,
      );
      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        setPickedLat(parseFloat(lat.toFixed(6)));
        setPickedLng(parseFloat(lng.toFixed(6)));
      });
      markerRef.current = marker;
    }

    // Click để đặt/di chuyển marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const roundedLat = parseFloat(lat.toFixed(6));
      const roundedLng = parseFloat(lng.toFixed(6));

      setPickedLat(roundedLat);
      setPickedLng(roundedLng);
      setHasPicked(true);

      if (markerRef.current) {
        markerRef.current.setLatLng([roundedLat, roundedLng]);
      } else {
        const marker = L.marker([roundedLat, roundedLng], {
          draggable: true,
        }).addTo(map);
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          setPickedLat(parseFloat(pos.lat.toFixed(6)));
          setPickedLng(parseFloat(pos.lng.toFixed(6)));
        });
        markerRef.current = marker;
      }
    });

    mapRef.current = map;

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="h-[360px] w-full overflow-hidden rounded-2xl border border-border"
        style={{ zIndex: 0 }}
      />

      {/* Tọa độ đã chọn */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
        <MapPin size={15} className="shrink-0 text-primary-content" />
        {hasPicked ? (
          <div className="flex flex-1 items-center gap-4 text-sm">
            <span className="text-foreground/60">
              Vĩ độ:{" "}
              <span className="font-mono font-semibold text-foreground">
                {pickedLat}
              </span>
            </span>
            <span className="text-foreground/60">
              Kinh độ:{" "}
              <span className="font-mono font-semibold text-foreground">
                {pickedLng}
              </span>
            </span>
          </div>
        ) : (
          <span className="flex-1 text-sm text-foreground/40">
            Click vào bản đồ để chọn vị trí…
          </span>
        )}

        {/* Nút Xác nhận */}
        <button
          disabled={!hasPicked}
          onClick={() => {
            onConfirm(pickedLat, pickedLng);
            onClose();
          }}
          className="flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check size={14} />
          Xác nhận
        </button>
      </div>
    </div>
  );
}
