"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type {
  RecyclingStation,
  CreateStationRequest,
  DayOfWeek,
  StationOpenTime,
  WasteType,
} from "@/types/station.types";

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

interface Props {
  initial?: RecyclingStation | null;
  allWasteTypes: WasteType[];
  onClose: () => void;
  onSubmit: (data: CreateStationRequest) => void;
  isPending: boolean;
}

type OpenTimeInput = Omit<StationOpenTime, "id">;

function defaultForm(): CreateStationRequest {
  return {
    name: "",
    description: "",
    phoneNumber: "",
    email: "",
    address: {
      province: "",
      ward: "",
      addressDetail: "",
      latitude: 0,
      longitude: 0,
    },
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
      startTime,
      endTime,
      dayOfWeek,
    })),
  };
}

export function StationFormModal({
  initial,
  allWasteTypes,
  onClose,
  onSubmit,
  isPending,
}: Props) {
  const isEdit = !!initial;
  const [form, setForm] = useState<CreateStationRequest>(
    initial ? stationToForm(initial) : defaultForm(),
  );
  const [activeTab, setActiveTab] = useState<"info" | "waste" | "time">("info");

  const setField = <K extends keyof CreateStationRequest>(
    k: K,
    v: CreateStationRequest[K],
  ) => setForm((p) => ({ ...p, [k]: v }));

  const setAddr = <K extends keyof CreateStationRequest["address"]>(
    k: K,
    v: string | number,
  ) => setForm((p) => ({ ...p, address: { ...p.address, [k]: v } }));

  const toggleWasteType = (id: string) => {
    setForm((p) => ({
      ...p,
      wasteTypeIds: p.wasteTypeIds.includes(id)
        ? p.wasteTypeIds.filter((w) => w !== id)
        : [...p.wasteTypeIds, id],
    }));
  };

  const addOpenTime = () => {
    setForm((p) => ({
      ...p,
      openTimes: [
        ...p.openTimes,
        { startTime: "08:00:00", endTime: "17:00:00", dayOfWeek: "MONDAY" },
      ],
    }));
  };

  const removeOpenTime = (idx: number) => {
    setForm((p) => ({
      ...p,
      openTimes: p.openTimes.filter((_, i) => i !== idx),
    }));
  };

  const updateOpenTime = (
    idx: number,
    key: keyof OpenTimeInput,
    val: string,
  ) => {
    setForm((p) => ({
      ...p,
      openTimes: p.openTimes.map((ot, i) =>
        i === idx ? { ...ot, [key]: val } : ot,
      ),
    }));
  };

  const canSubmit =
    form.name.trim() &&
    form.address.province.trim() &&
    form.address.addressDetail.trim();

  const TABS = [
    { key: "info", label: "Thông tin" },
    { key: "waste", label: `Loại rác (${form.wasteTypeIds.length})` },
    { key: "time", label: `Giờ mở (${form.openTimes.length})` },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-header">
            {isEdit ? "Chỉnh sửa điểm thu gom" : "Thêm điểm thu gom mới"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-border">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === key
                  ? "border-b-2 border-primary-600 text-primary-content"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* ── Tab: Thông tin ── */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Tên điểm thu gom *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Điểm thu gom Co.opmart..."
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Mô tả
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    rows={2}
                    placeholder="Thông tin thêm về điểm thu gom..."
                    className="w-full resize-none rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary-600"
                  />
                </div>

                {/* Phone + Email */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Điện thoại
                  </label>
                  <input
                    value={form.phoneNumber}
                    onChange={(e) => setField("phoneNumber", e.target.value)}
                    placeholder="028 xxxx xxxx"
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="contact@example.com"
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="rounded-2xl border border-border p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Địa chỉ
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      {
                        k: "province",
                        label: "Tỉnh/TP *",
                        placeholder: "TP. Hồ Chí Minh",
                      },
                      {
                        k: "ward",
                        label: "Phường/Xã",
                        placeholder: "Phường 6",
                      },
                      {
                        k: "addressDetail",
                        label: "Địa chỉ chi tiết *",
                        placeholder: "168 Nguyễn Đình Chiểu",
                      },
                    ] as const
                  ).map(({ k, label, placeholder }) => (
                    <div
                      key={k}
                      className={k === "addressDetail" ? "col-span-2" : ""}
                    >
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        {label}
                      </label>
                      <input
                        value={form.address[k]}
                        onChange={(e) => setAddr(k, e.target.value)}
                        placeholder={placeholder}
                        className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary-600"
                      />
                    </div>
                  ))}

                  {/* Lat/Lng */}
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Vĩ độ
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={form.address.latitude}
                      onChange={(e) =>
                        setAddr("latitude", parseFloat(e.target.value) || 0)
                      }
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary-600"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Kinh độ
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={form.address.longitude}
                      onChange={(e) =>
                        setAddr("longitude", parseFloat(e.target.value) || 0)
                      }
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Loại rác ── */}
          {activeTab === "waste" && (
            <div>
              <p className="mb-4 text-sm text-gray-500">
                Chọn các loại rác mà điểm này tiếp nhận.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {allWasteTypes.map((wt) => {
                  const checked = form.wasteTypeIds.includes(wt.id);
                  return (
                    <button
                      key={wt.id}
                      onClick={() => toggleWasteType(wt.id)}
                      className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                        checked
                          ? "border-primary-500 bg-primary-50"
                          : "border-border hover:border-primary-200 hover:bg-gray-50"
                      }`}
                    >
                      {/* Checkbox indicator */}
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                          checked
                            ? "border-primary-600 bg-primary-600"
                            : "border-gray-300"
                        }`}
                      >
                        {checked && (
                          <svg
                            viewBox="0 0 10 8"
                            fill="none"
                            className="h-2.5 w-2.5"
                          >
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
                        <p
                          className={`text-sm font-medium ${checked ? "text-primary-700" : "text-foreground"}`}
                        >
                          {wt.name}
                        </p>
                        {wt.description && (
                          <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">
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

          {/* ── Tab: Giờ mở cửa ── */}
          {activeTab === "time" && (
            <div className="space-y-3">
              {form.openTimes.map((ot, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  {/* Day */}
                  <select
                    value={ot.dayOfWeek}
                    onChange={(e) =>
                      updateOpenTime(idx, "dayOfWeek", e.target.value)
                    }
                    className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary-600"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {DAY_LABELS[d]}
                      </option>
                    ))}
                  </select>

                  {/* Start time */}
                  <input
                    type="time"
                    value={ot.startTime.slice(0, 5)}
                    onChange={(e) =>
                      updateOpenTime(idx, "startTime", `${e.target.value}:00`)
                    }
                    className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary-600"
                  />
                  <span className="text-gray-400">—</span>
                  {/* End time */}
                  <input
                    type="time"
                    value={ot.endTime.slice(0, 5)}
                    onChange={(e) =>
                      updateOpenTime(idx, "endTime", `${e.target.value}:00`)
                    }
                    className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary-600"
                  />

                  <button
                    onClick={() => removeOpenTime(idx)}
                    className="ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              <button
                onClick={addOpenTime}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-200 py-3 text-sm font-medium text-primary-content hover:border-primary-400 hover:bg-primary-50"
              >
                <Plus size={16} /> Thêm khung giờ
              </button>

              {form.openTimes.length === 0 && (
                <p className="text-center text-sm text-gray-400">
                  Chưa có khung giờ nào. Nhấn "Thêm khung giờ" để bắt đầu.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 shrink-0 border-t border-border px-6 py-4">
          {/* Tab nav shortcuts */}
          <div className="flex gap-2 mr-auto">
            {TABS.map(({ key, label }, i) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  activeTab === key
                    ? "bg-primary-100 text-primary-content"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={() => canSubmit && onSubmit(form)}
            disabled={isPending || !canSubmit}
            className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {isPending
              ? "Đang lưu..."
              : isEdit
                ? "Lưu thay đổi"
                : "Tạo điểm thu gom"}
          </button>
        </div>
      </div>
    </div>
  );
}
