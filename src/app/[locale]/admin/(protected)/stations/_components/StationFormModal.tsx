"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // IMPORT THÊM ĐỂ FIX LỖI MODAL BỊ ĐÈ
import { X, Plus, Trash2 } from "lucide-react";
import type {
  RecyclingStation,
  CreateStationRequest,
  DayOfWeek,
  StationOpenTime,
  WasteType,
} from "@/types/station.types";
import { createStationSchema } from "@/validations/station.schema";
import { useTranslations } from "next-intl";

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
      // Cắt bỏ phần giây (:00) ngay từ lúc load form để tránh lỗi API
      startTime: startTime.slice(0, 5),
      endTime: endTime.slice(0, 5),
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
  const tRoot = useTranslations();
  const schema = createStationSchema((key) => key); // Nếu có file ngôn ngữ thì đổi lại tRoot(key)

  // State để check render Client (dùng cho Portal)
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState<CreateStationRequest>(
    initial ? stationToForm(initial) : defaultForm(),
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"info" | "waste" | "time">("info");

  useEffect(() => {
    setMounted(true);
  }, []);

  const setField = <K extends keyof CreateStationRequest>(
    k: K,
    v: CreateStationRequest[K],
  ) => {
    setForm((p) => ({ ...p, [k]: v }));
    // Xóa lỗi khi user bắt đầu sửa
    if (errors[k as string])
      setErrors((prev) => ({ ...prev, [k as string]: "" }));
  };

  const setAddr = <K extends keyof CreateStationRequest["address"]>(
    k: K,
    v: string | number,
  ) => {
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
    if (errors.wasteTypeIds)
      setErrors((prev) => ({ ...prev, wasteTypeIds: "" }));
  };

  const addOpenTime = () => {
    setForm((p) => ({
      ...p,
      openTimes: [
        ...p.openTimes,
        // Dùng HH:mm chuẩn không có giây
        { startTime: "08:00", endTime: "17:00", dayOfWeek: "MONDAY" },
      ],
    }));
    if (errors.openTimes) setErrors((prev) => ({ ...prev, openTimes: "" }));
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

  const handleFormSubmit = () => {
    const parsed = schema.safeParse(form);

    if (!parsed.success) {
      const newErrors: Record<string, string> = {};

      // Duyệt qua toàn bộ danh sách lỗi chi tiết của Zod
      parsed.error.issues.forEach((issue) => {
        // issue.path là mảng đường dẫn, VD: ['address', 'province'] hoặc ['name']
        // Ta lấy phần tử CÙNG (phía sau cùng) để làm key báo lỗi.
        // Như vậy ['address', 'province'] -> key sẽ là 'province' (Khớp 100% với cách UI bạn đang gọi errors[k])
        const fieldName = String(issue.path[issue.path.length - 1]);

        // Chỉ lưu thông báo lỗi đầu tiên gặp phải cho field đó
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = issue.message;
        }
      });

      setErrors(newErrors);

      // Auto switch tab dựa trên lỗi
      if (newErrors.wasteTypeIds) {
        setActiveTab("waste");
      } else if (
        newErrors.openTimes ||
        newErrors.startTime ||
        newErrors.endTime
      ) {
        setActiveTab("time");
      } else {
        setActiveTab("info");
      }

      return;
    }

    setErrors({});
    onSubmit(parsed.data);
  };

  const TABS = [
    { key: "info", label: "Thông tin" },
    { key: "waste", label: `Loại rác (${form.wasteTypeIds.length})` },
    { key: "time", label: `Giờ mở (${form.openTimes.length})` },
  ] as const;

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
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
              onClick={() => setActiveTab(key as "info" | "waste" | "time")}
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
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 ${
                      errors.name
                        ? "border-rose-500 focus:ring-rose-100"
                        : "border-border focus:border-primary-600 focus:ring-primary-100"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
                  )}
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
                    className="w-full resize-none rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
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
                    placeholder="0987654321"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 ${
                      errors.phoneNumber
                        ? "border-rose-500 focus:ring-rose-100"
                        : "border-border focus:border-primary-600 focus:ring-primary-100"
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-rose-500">
                      {errors.phoneNumber}
                    </p>
                  )}
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
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 ${
                      errors.email
                        ? "border-rose-500 focus:ring-rose-100"
                        : "border-border focus:border-primary-600 focus:ring-primary-100"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
                  )}
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
                        className={`w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 ${
                          errors[k]
                            ? "border-rose-500 focus:ring-rose-100"
                            : "border-border focus:border-primary-600 focus:ring-primary-100"
                        }`}
                      />
                      {errors[k] && (
                        <p className="mt-1 text-xs text-rose-500">
                          {errors[k]}
                        </p>
                      )}
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
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
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
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
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
              {errors.wasteTypeIds && (
                <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200">
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
              {errors.openTimes && (
                <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200">
                  {errors.openTimes}
                </div>
              )}
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
                    className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
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
                      updateOpenTime(idx, "startTime", e.target.value)
                    }
                    className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                  />
                  <span className="text-gray-400">—</span>
                  {/* End time */}
                  <input
                    type="time"
                    value={ot.endTime.slice(0, 5)}
                    onChange={(e) =>
                      updateOpenTime(idx, "endTime", e.target.value)
                    }
                    className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                  />

                  <button
                    onClick={() => removeOpenTime(idx)}
                    className="ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              <button
                onClick={addOpenTime}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-200 py-3 text-sm font-medium text-primary-content hover:border-primary-400 hover:bg-primary-50 transition-colors"
              >
                <Plus size={16} /> Thêm khung giờ
              </button>

              {form.openTimes.length === 0 && (
                <p className="text-center text-sm text-gray-400 mt-4">
                  Chưa có khung giờ nào. Nhấn "Thêm khung giờ" để bắt đầu.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 shrink-0 border-t border-border px-6 py-4">
          <div className="flex gap-2 mr-auto">
            {TABS.map(({ key }, i) => {
              // Highlight các tab có lỗi bằng chấm đỏ
              const hasError =
                (key === "info" &&
                  (errors.name ||
                    errors.phoneNumber ||
                    errors.email ||
                    errors.province ||
                    errors.addressDetail)) ||
                (key === "waste" && errors.wasteTypeIds) ||
                (key === "time" && errors.openTimes);

              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as "info" | "waste" | "time")}
                  className={`relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeTab === key
                      ? "bg-primary-100 text-primary-content"
                      : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                  {hasError && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white" />
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>

          <button
            onClick={handleFormSubmit}
            disabled={isPending}
            className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isPending
              ? "Đang lưu..."
              : isEdit
                ? "Lưu thay đổi"
                : "Tạo điểm thu gom"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
