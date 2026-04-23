"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { CreateLeaderboardPrizeRequest } from "@/types/gamification.types";
import { createLeaderboardPrizeSchema } from "@/validations/leaderboard.schema";
import { normalizeLockAtForApi } from "@/common/utils/date-time";
import { WeekPicker } from "@/components/admin/ui/week-picker";
import { Select } from "@/components/admin/ui/select";

// Lấy ngày Thứ 2 của tuần tiếp theo (chặn chọn quá khứ)
const getNextMondayStr = () => {
  const now = new Date();
  const day = now.getDay();
  // Nếu hnay là CN(0) thì mai là T2 (+1). Các ngày khác thì lấy 8 - ngày hiện tại
  const diff = day === 0 ? 1 : 8 - day; 
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + diff);
  
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${nextMonday.getFullYear()}-${pad(nextMonday.getMonth() + 1)}-${pad(nextMonday.getDate())}`;
};

const formatForDateTimeInput = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00`;
};

interface PrizeFormModalProps {
  vouchers: { id: string; name: string }[];
  onClose: () => void;
  onSubmit: (data: CreateLeaderboardPrizeRequest) => void;
  isPending: boolean;
}

export function PrizeFormModal({
  vouchers,
  onClose,
  onSubmit,
  isPending,
}: PrizeFormModalProps) {
  const t = useTranslations("admin.leaderboard.form");
  const tRoot = useTranslations();
  const schema = createLeaderboardPrizeSchema((key) => tRoot(key));

  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState<CreateLeaderboardPrizeRequest>({
    weekStartDate: "",
    lockAt: "",
    nationalVoucherTemplateId: "",
    provincialVoucherTemplateId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFormSubmit = () => {
    const parsed = schema.safeParse(form);

    if (!parsed.success) {
      const newErrors: Record<string, string> = {};

      parsed.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[issue.path.length - 1]);
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = issue.message;
        }
      });

      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Nắn lại format giờ theo đúng ý Backend trước khi gọi API
    const finalPayload: CreateLeaderboardPrizeRequest = {
      ...parsed.data,
      lockAt: normalizeLockAtForApi(parsed.data.lockAt),
    };

    onSubmit(finalPayload);
  };

  const setField = <K extends keyof CreateLeaderboardPrizeRequest>(
    key: K,
    value: CreateLeaderboardPrizeRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Xóa lỗi khi user gõ/chọn lại
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const voucherOptions = [
    { value: "", label: t("selectVoucher") }, // Placeholder
    ...vouchers.map((v) => ({
      value: v.id,
      label: v.name,
    })),
  ];

  if (!mounted) return null;

  // Tính toán giới hạn cho lịch WeekPicker và LockAt
  const minFutureMonday = getNextMondayStr();

  const minLockDate = form.weekStartDate
    ? formatForDateTimeInput(new Date(form.weekStartDate))
    : "";

  let maxLockDate = "";
  if (form.weekStartDate) {
    const d = new Date(form.weekStartDate);
    d.setDate(d.getDate() + 6); // Cộng thêm 6 ngày là đến Chủ nhật
    maxLockDate = `${formatForDateTimeInput(d).split("T")[0]}T23:59`; // Cuối ngày CN
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary-950/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative flex w-full max-w-md animate-fade-up flex-col overflow-hidden rounded-3xl bg-background shadow-2xl shadow-primary-900/10">
        <div className="flex items-center justify-between border-b border-gray-100 bg-card px-6 py-5">
          <h3 className="text-lg font-bold text-primary-heading">
            {t("title")}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-50 p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Week start */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("weekStartDate")}
            </label>
            <WeekPicker
              value={form.weekStartDate}
              onChange={(val) => setField("weekStartDate", val)}
              minDate={minFutureMonday}
              className={errors.weekStartDate ? "ring-2 ring-rose-500 rounded-xl" : ""}
            />
            {errors.weekStartDate && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.weekStartDate}
              </p>
            )}
          </div>

          {/* Lock at */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("lockAt")}
            </label>
            <input
              type="datetime-local"
              value={form.lockAt}
              onChange={(e) => setField("lockAt", e.target.value)}
              min={minLockDate}
              max={maxLockDate}
              disabled={!form.weekStartDate}
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.lockAt
                  ? "border-rose-500 bg-rose-50 focus:ring-rose-100"
                  : "border-gray-200 bg-gray-50/50 focus:border-primary-500 focus:bg-white focus:ring-primary-500/10"
              }`}
            />
            {errors.lockAt && (
              <p className="mt-1 text-xs text-rose-600">{errors.lockAt}</p>
            )}
          </div>

          {/* National voucher */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("nationalVoucher")}
            </label>
            <Select
              value={form.nationalVoucherTemplateId}
              options={voucherOptions}
              onChange={(val) => setField("nationalVoucherTemplateId", val)}
              className={errors.nationalVoucherTemplateId ? "ring-2 ring-rose-500 rounded-xl" : ""}
            />
            {errors.nationalVoucherTemplateId && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.nationalVoucherTemplateId}
              </p>
            )}
          </div>

          {/* Provincial voucher */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              {t("provincialVoucher")}
            </label>
            <Select
              value={form.provincialVoucherTemplateId}
              options={voucherOptions}
              onChange={(val) => setField("provincialVoucherTemplateId", val)}
              className={errors.provincialVoucherTemplateId ? "ring-2 ring-rose-500 rounded-xl" : ""}
            />
            {errors.provincialVoucherTemplateId && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.provincialVoucherTemplateId}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-100 bg-card px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-white border border-gray-200 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleFormSubmit}
            disabled={isPending}
            className="flex-1 rounded-2xl bg-primary-600 py-3 text-sm font-bold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
          >
            {isPending ? t("saving") : t("submit")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}