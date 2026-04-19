import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { AdminUserDto } from "@/types/user.type";
import { useTranslations } from "next-intl";

export function SuspendModal({
  user,
  onClose,
  onConfirm,
  isPending,
}: {
  user: AdminUserDto;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}) {
  const [reason, setReason] = useState("");
  const t = useTranslations("admin.users.modals.suspend");
  const tCommon = useTranslations("common.actions");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-opacity">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-fade-up">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
            <AlertTriangle size={18} className="text-rose-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {t("title")}
            </h3>
            <p className="text-xs text-gray-500">{user.name}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t("reasonLabel")}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("reasonPlaceholder")}
            rows={3}
            className="w-full resize-none rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {tCommon("cancel")}
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim() || isPending}
            className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 disabled:opacity-50 transition-all"
          >
            {isPending ? tCommon("processing") : t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
