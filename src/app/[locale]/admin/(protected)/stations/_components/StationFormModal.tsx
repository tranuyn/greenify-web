"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2, MapPin, ChevronDown } from "lucide-react";
import type {
  RecyclingStation,
  CreateStationRequest,
  DayOfWeek,
  StationOpenTime,
  WasteType,
} from "@/types/station.types";
import { createStationSchema } from "@/validations/station.schema";
import { useProvinces, useWards } from "@/hooks/queries/useLocation";
import { Select } from "@/components/admin/ui/select";
import type { Province } from "@/types/location.types";
import { MapPickerModal } from "./MapPickerModal";

// ── Constants ──────────────────────────────────────────────────────────
const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Thứ 2",
  TUESDAY: "Thứ 3",
  WEDNESDAY: "Thứ 4",
  THURSDAY: "Thứ 5",
  FRIDAY: "Thứ 6",
  SATURDAY: "Thứ 7",
  SUNDAY: "Chủ nhật",
};
const DAYS = Object.keys(DAY_LABELS) as DayOfWeek[];

// ── Types ──────────────────────────────────────────────────────────────
interface Props {
  initial?: RecyclingStation | null;
  allWasteTypes: WasteType[];
  onClose: () => void;
  onSubmit: (data: CreateStationRequest) => void;
  isPending: boolean;
}

type OpenTimeInput = Omit<StationOpenTime, "id">;

// ── Helpers ────────────────────────────────────────────────────────────
function defaultForm(): CreateStationRequest {
  return {
    name: "",
    description: "",
    phoneNumber: "",
    email: "",
    address: { province: "", ward: "", addressDetail: "", latitude: 0, longitude: 0 },
    wasteTypeIds: [],
    openTimes: [],
  };
}

function stationToForm(s: RecyclingStation): CreateStationRequest {
  return {
    name: s.name,
    description: s.description,
    phoneNumber: s.phoneNumber,
    email: s.email,
    address: {
      province: s.address.province,
      ward: s.address.ward,
      addressDetail: s.address.addressDetail,
      latitude: s.address.latitude,
      longitude: s.address.longitude,
    },
    wasteTypeIds: s.wasteTypes.map((w) => w.id),
    openTimes: s.openTimes.map(({ startTime, endTime, dayOfWeek }) => ({
      startTime: startTime.slice(0, 5),
      endTime: endTime.slice(0, 5),
      dayOfWeek,
    })),
  };
}

// ── Shared input className helper ──────────────────────────────────────
function inputCls(hasError?: string) {
  return `w-full rounded-xl border px-4 py-2.5 text-sm bg-card text-foreground outline-none transition-colors focus:ring-2 ${
    hasError
      ? "border-rose-500 focus:ring-rose-100"
      : "border-border focus:border-primary-600 focus:ring-primary-100"
  }`;
}

// ── Label className ────────────────────────────────────────────────────
const labelCls =
  "mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/50";

// ── Component ──────────────────────────────────────────────────────────
export function StationFormModal({ initial, allWasteTypes, onClose, onSubmit, isPending }: Props) {
  const isEdit = !!initial;
  const schema = createStationSchema((key) => key);

  const [mounted, setMounted] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [form, setForm] = useState<CreateStationRequest>(
    initial ? stationToForm(initial) : defaultForm(),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"info" | "waste" | "time">("info");

  // Province code state (để drive useWards)
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | null>(null);

  // ── Location hooks ─────────────────────────────────────────────────
  const { data: provinces = [], isLoading: isLoadingProvinces } = useProvinces();
  const { data: wards = [], isLoading: isLoadingWards } = useWards(selectedProvinceCode);

  // Pre-select tỉnh khi edit (tìm code theo tên)
  useEffect(() => {
    if (!initial?.address.province || provinces.length === 0) return;
    const match = provinces.find(
      (p: Province) =>
        p.name === initial.address.province ||
        p.codename === initial.address.province,
    );
    if (match) setSelectedProvinceCode(match.code);
  }, [initial, provinces]);

  useEffect(() => { setMounted(true); }, []);

  // ── Form helpers ───────────────────────────────────────────────────
  const setField = <K extends keyof CreateStationRequest>(k: K, v: CreateStationRequest[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k as string]) setErrors((prev) => ({ ...prev, [k as string]: "" }));
  };

  const setAddr = <K extends keyof CreateStationRequest["address"]>(k: K, v: string | number) => {
    setForm((p) => ({ ...p, address: { ...p.address, [k]: v } }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const toggleWasteType = (id: string) => {
    setForm((p) => ({
      ...p,
      wasteTypeIds: p.wasteTypeIds.includes(id)
        ? p.wasteTypeIds.filter((w) => w !== id)
        : [...p.wasteTypeIds, id],
    }));
    if (errors.wasteTypeIds) setErrors((prev) => ({ ...prev, wasteTypeIds: "" }));
  };

  const addOpenTime = () => {
    setForm((p) => ({
      ...p,
      openTimes: [...p.openTimes, { startTime: "08:00", endTime: "17:00", dayOfWeek: "MONDAY" }],
    }));
    if (errors.openTimes) setErrors((prev) => ({ ...prev, openTimes: "" }));
  };

  const removeOpenTime = (idx: number) => {
    setForm((p) => ({ ...p, openTimes: p.openTimes.filter((_, i) => i !== idx) }));
  };

  const updateOpenTime = (idx: number, key: keyof OpenTimeInput, val: string) => {
    setForm((p) => ({
      ...p,
      openTimes: p.openTimes.map((ot, i) => (i === idx ? { ...ot, [key]: val } : ot)),
    }));
  };

  const handleFormSubmit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[issue.path.length - 1]);
        if (!newErrors[fieldName]) newErrors[fieldName] = issue.message;
      });
      setErrors(newErrors);
      if (newErrors.wasteTypeIds) setActiveTab("waste");
      else if (newErrors.openTimes || newErrors.startTime || newErrors.endTime) setActiveTab("time");
      else setActiveTab("info");
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  };

  // ── Province / Ward options ─────────────────────────────────────────
  const provinceOptions = provinces.map((p: Province) => ({
    value: p.name,
    label: p.name,
  }));

  const wardOptions = wards.map((w) => ({ value: w.name, label: w.name }));

  const TABS = [
    { key: "info", label: "Thông tin" },
    { key: "waste", label: `Loại rác (${form.wasteTypeIds.length})` },
    { key: "time", label: `Giờ mở (${form.openTimes.length})` },
  ] as const;

  if (!mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-card shadow-2xl">

          {/* ── Header ── */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="text-lg font-semibold text-foreground">
              {isEdit ? "Chỉnh sửa điểm thu gom" : "Thêm điểm thu gom mới"}
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-foreground/40 transition-colors hover:bg-primary-surface hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Tab nav ── */}
          <div className="flex border-b border-border">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as "info" | "waste" | "time")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === key
                    ? "border-b-2 border-primary-600 text-primary-content"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Tab body ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* ════ Tab: Thông tin ════ */}
            {activeTab === "info" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">

                  {/* Name */}
                  <div className="col-span-2">
                    <label className={labelCls}>Tên điểm thu gom *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="Điểm thu gom Co.opmart..."
                      className={inputCls(errors.name)}
                    />
                    {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className={labelCls}>Mô tả</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                      rows={2}
                      placeholder="Thông tin thêm về điểm thu gom..."
                      className="w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelCls}>Điện thoại *</label>
                    <input
                      value={form.phoneNumber}
                      onChange={(e) => setField("phoneNumber", e.target.value)}
                      placeholder="0987654321"
                      className={inputCls(errors.phoneNumber)}
                    />
                    {errors.phoneNumber && <p className="mt-1 text-xs text-rose-500">{errors.phoneNumber}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="contact@example.com"
                      className={inputCls(errors.email)}
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
                  </div>
                </div>

                {/* ── Address block ── */}
                <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                  <p className={labelCls}>Địa chỉ</p>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Province dropdown */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground/50">
                        Tỉnh / Thành phố *
                      </label>
                      <Select
                        value={form.address.province}
                        options={provinceOptions}
                        isLoading={isLoadingProvinces}
                        placeholder="Chọn tỉnh / thành phố"
                        onChange={(val) => {
                          setAddr("province", val);
                          // reset ward khi đổi tỉnh
                          setAddr("ward", "");
                          const found = provinces.find((p: Province) => p.name === val);
                          setSelectedProvinceCode(found?.code ?? null);
                          if (errors.province)
                            setErrors((prev) => ({ ...prev, province: "" }));
                        }}
                      />
                      {errors.province && (
                        <p className="mt-1 text-xs text-rose-500">{errors.province}</p>
                      )}
                    </div>

                    {/* Ward dropdown */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground/50">
                        Phường / Xã *
                      </label>
                      <Select
                        value={form.address.ward}
                        options={wardOptions}
                        isLoading={isLoadingWards}
                        disabled={!selectedProvinceCode}
                        placeholder={
                          selectedProvinceCode
                            ? "Chọn phường / xã"
                            : "Chọn tỉnh trước"
                        }
                        onChange={(val) => {
                          setAddr("ward", val);
                          if (errors.ward)
                            setErrors((prev) => ({ ...prev, ward: "" }));
                        }}
                      />
                      {errors.ward && (
                        <p className="mt-1 text-xs text-rose-500">{errors.ward}</p>
                      )}
                    </div>

                    {/* Address detail */}
                    <div className="col-span-2">
                      <label className="mb-1 block text-xs font-medium text-foreground/50">
                        Địa chỉ chi tiết *
                      </label>
                      <input
                        value={form.address.addressDetail}
                        onChange={(e) => setAddr("addressDetail", e.target.value)}
                        placeholder="168 Nguyễn Đình Chiểu"
                        className={inputCls(errors.addressDetail)}
                      />
                      {errors.addressDetail && (
                        <p className="mt-1 text-xs text-rose-500">{errors.addressDetail}</p>
                      )}
                    </div>

                    {/* Lat / Lng + Map picker button */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground/50">
                        Vĩ độ
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={form.address.latitude || ""}
                        onChange={(e) => setAddr("latitude", parseFloat(e.target.value) || 0)}
                        placeholder="10.7769"
                        className={inputCls()}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-foreground/50">
                        Kinh độ
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={form.address.longitude || ""}
                        onChange={(e) => setAddr("longitude", parseFloat(e.target.value) || 0)}
                        placeholder="106.7009"
                        className={inputCls()}
                      />
                    </div>

                    {/* Map picker trigger */}
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => setShowMap(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary-200 py-2.5 text-sm font-medium text-primary-content transition-colors hover:border-primary-400 hover:bg-primary-surface"
                      >
                        <MapPin size={15} />
                        {form.address.latitude && form.address.longitude
                          ? `Vị trí: ${form.address.latitude.toFixed(4)}, ${form.address.longitude.toFixed(4)} — Chọn lại`
                          : "Chọn vị trí trên bản đồ"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════ Tab: Loại rác ════ */}
            {activeTab === "waste" && (
              <div>
                <p className="mb-4 text-sm text-foreground/60">
                  Chọn các loại rác mà điểm này tiếp nhận.
                </p>
                {errors.wasteTypeIds && (
                  <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
                    {errors.wasteTypeIds}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {allWasteTypes.map((wt) => {
                    const checked = form.wasteTypeIds.includes(wt.id);
                    return (
                      <button
                        key={wt.id}
                        onClick={() => toggleWasteType(wt.id)}
                        className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                          checked
                            ? "border-primary-border bg-primary-surface"
                            : "border-border hover:border-primary-border hover:bg-background"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                            checked ? "border-primary-600 bg-primary-600" : "border-foreground/30"
                          }`}
                        >
                          {checked && (
                            <svg viewBox="0 0 10 8" fill="none" className="h-2.5 w-2.5">
                              <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${checked ? "text-primary-content" : "text-foreground"}`}>
                            {wt.name}
                          </p>
                          {wt.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-foreground/40">
                              {wt.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════ Tab: Giờ mở cửa ════ */}
            {activeTab === "time" && (
              <div className="space-y-3">
                {errors.openTimes && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
                    {errors.openTimes}
                  </div>
                )}
                {form.openTimes.map((ot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3"
                  >
                    <select
                      value={ot.dayOfWeek}
                      onChange={(e) => updateOpenTime(idx, "dayOfWeek", e.target.value)}
                      className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>{DAY_LABELS[d]}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={ot.startTime.slice(0, 5)}
                      onChange={(e) => updateOpenTime(idx, "startTime", e.target.value)}
                      className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                    <span className="text-foreground/30">—</span>
                    <input
                      type="time"
                      value={ot.endTime.slice(0, 5)}
                      onChange={(e) => updateOpenTime(idx, "endTime", e.target.value)}
                      className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                    />
                    <button
                      onClick={() => removeOpenTime(idx)}
                      className="ml-auto rounded-lg p-1.5 text-foreground/30 transition-colors hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={addOpenTime}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-border py-3 text-sm font-medium text-primary-content transition-colors hover:border-primary-hover hover:bg-primary-surface"
                >
                  <Plus size={16} /> Thêm khung giờ
                </button>

                {form.openTimes.length === 0 && (
                  <p className="mt-4 text-center text-sm text-foreground/40">
                    Chưa có khung giờ nào. Nhấn &quot;Thêm khung giờ&quot; để bắt đầu.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex shrink-0 items-center gap-3 border-t border-border px-6 py-4">
            {/* Tab indicators với error dots */}
            <div className="mr-auto flex gap-2">
              {TABS.map(({ key }, i) => {
                const hasError =
                  (key === "info" &&
                    (errors.name || errors.phoneNumber || errors.email || errors.province || errors.addressDetail)) ||
                  (key === "waste" && errors.wasteTypeIds) ||
                  (key === "time" && errors.openTimes);

                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as "info" | "waste" | "time")}
                    className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      activeTab === key
                        ? "bg-primary-element text-primary-content"
                        : "text-foreground/40 hover:bg-background"
                    }`}
                  >
                    {i + 1}
                    {hasError && (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-rose-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-background"
            >
              Hủy
            </button>
            <button
              onClick={handleFormSubmit}
              disabled={isPending}
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {isPending ? "Đang lưu…" : isEdit ? "Lưu thay đổi" : "Tạo điểm thu gom"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Map Picker Modal (z-[10000], trên form) ── */}
      {showMap && (
        <MapPickerModal
          initialLat={form.address.latitude}
          initialLng={form.address.longitude}
          onConfirm={(lat, lng) => {
            setAddr("latitude", lat);
            setAddr("longitude", lng);
          }}
          onClose={() => setShowMap(false)}
        />
      )}
    </>,
    document.body,
  );
}
