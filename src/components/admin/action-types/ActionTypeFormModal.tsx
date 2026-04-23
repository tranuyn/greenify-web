"use client";

import { useState } from "react";
import { Leaf, MapPin, X } from "lucide-react";
import type {
  GreenActionType,
  CreateActionTypeRequest,
} from "@/types/action.types";

interface ActionTypeFormModalProps {
  initial?: GreenActionType | null;
  onClose: () => void;
  onSubmit: (data: CreateActionTypeRequest) => void;
  isPending: boolean;
}

export function ActionTypeFormModal({
  initial,
  onClose,
  onSubmit,
  isPending,
}: ActionTypeFormModalProps) {
  const isEdit = !!initial;

  const [form, setForm] = useState<CreateActionTypeRequest>({
    groupName: initial?.groupName ?? "",
    actionName: initial?.actionName ?? "",
    suggestedPoints: initial?.suggestedPoints ?? 10,
    locationRequired: initial?.locationRequired ?? false,
    isActive: initial?.isActive ?? true,
  });

  const set = <K extends keyof CreateActionTypeRequest>(
    k: K,
    v: CreateActionTypeRequest[K],
  ) => setForm((p) => ({ ...p, [k]: v }));

  const canSubmit =
    form.groupName.trim().length > 0 &&
    form.actionName.trim().length > 0 &&
    form.suggestedPoints > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Chinh sua loai hanh dong" : "Them loai hanh dong moi"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Nhom hanh dong *
            </label>
            <input
              value={form.groupName}
              onChange={(e) => set("groupName", e.target.value)}
              placeholder="Vi du: Tai che, Giam nhua, Don dep..."
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
            <p className="mt-1 text-xs text-gray-400">
              Dung de nhom cac hanh dong cung chu de lai voi nhau.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Ten hanh dong *
            </label>
            <input
              value={form.actionName}
              onChange={(e) => set("actionName", e.target.value)}
              placeholder="Vi du: Phan loai rac tai nha..."
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Diem GP de xuat *
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={1000}
                value={form.suggestedPoints}
                onChange={(e) => set("suggestedPoints", Number(e.target.value))}
                className="w-full rounded-xl border border-border py-2.5 pl-4 pr-14 text-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-content">
                GP
              </span>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
            <button
              type="button"
              onClick={() => set("locationRequired", !form.locationRequired)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    form.locationRequired ? "bg-primary-100" : "bg-gray-200"
                  }`}
                >
                  <MapPin
                    size={15}
                    className={
                      form.locationRequired
                        ? "text-primary-content"
                        : "text-gray-400"
                    }
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Bat buoc vi tri</p>
                  <p className="text-xs text-gray-400">Yeu cau GPS khi dang bai</p>
                </div>
              </div>
              <div
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.locationRequired ? "bg-primary-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.locationRequired ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>

            <button
              type="button"
              onClick={() => set("isActive", !form.isActive)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    form.isActive ? "bg-primary-100" : "bg-gray-200"
                  }`}
                >
                  <Leaf
                    size={15}
                    className={
                      form.isActive ? "text-primary-content" : "text-gray-400"
                    }
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Kich hoat</p>
                  <p className="text-xs text-gray-400">Hien thi cho nguoi dung</p>
                </div>
              </div>
              <div
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.isActive ? "bg-primary-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.isActive ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Huy
          </button>
          <button
            onClick={() => canSubmit && onSubmit(form)}
            disabled={isPending || !canSubmit}
            className="flex-1 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {isPending
              ? "Dang luu..."
              : isEdit
                ? "Luu thay doi"
                : "Them hanh dong"}
          </button>
        </div>
      </div>
    </div>
  );
}
