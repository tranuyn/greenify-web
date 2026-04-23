"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { CreateLeaderboardPrizeRequest } from "@/types/gamification.types";
import { createLeaderboardPrizeSchema } from "@/validations/leaderboard.schema";

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
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateLeaderboardPrizeRequest, string>>
  >({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = () => {
    const parsed = schema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        weekStartDate: fieldErrors.weekStartDate?.[0],
        lockAt: fieldErrors.lockAt?.[0],
        nationalVoucherTemplateId: fieldErrors.nationalVoucherTemplateId?.[0],
        provincialVoucherTemplateId:
          fieldErrors.provincialVoucherTemplateId?.[0],
      });
      return;
    }

    setErrors({});
    onSubmit(parsed.data);
  };

  const setField = <K extends keyof CreateLeaderboardPrizeRequest>(
    key: K,
    value: CreateLeaderboardPrizeRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  if (!mounted) return null;

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
            <input
              type="date"
              value={form.weekStartDate}
              onChange={(e) => setField("weekStartDate", e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
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
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
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
            <select
              value={form.nationalVoucherTemplateId}
              onChange={(e) =>
                setField("nationalVoucherTemplateId", e.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
            >
              <option value="">{t("selectVoucher")}</option>
              {vouchers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
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
            <select
              value={form.provincialVoucherTemplateId}
              onChange={(e) =>
                setField("provincialVoucherTemplateId", e.target.value)
              }
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
            >
              <option value="">{t("selectVoucher")}</option>
              {vouchers.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
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
            onClick={handleSubmit}
            disabled={
              isPending ||
              !form.weekStartDate ||
              !form.lockAt ||
              !form.nationalVoucherTemplateId ||
              !form.provincialVoucherTemplateId
            }
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
