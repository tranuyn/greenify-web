import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useRejectResolveRequest } from "@/hooks/mutations/useAdminTrashSpots";
import type { ResolveRequestDto } from "@/types/trashspot.types";

interface RejectModalProps {
  request: ResolveRequestDto;
  onClose: () => void;
}

export function RejectModal({ request, onClose }: RejectModalProps) {
  const t = useTranslations("admin.trashSpots");
  const c = useTranslations("common");
  const [reason, setReason] = useState("");
  const { mutate: rejectRequest, isPending } = useRejectResolveRequest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rejectRequest(
      { id: request.id, payload: { rejectReason: reason } },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-fade-in overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-primary-heading">
              {t("modals.reject.title")}
            </h2>
            <p className="mt-0.5 font-mono text-xs text-gray-400">
              #{request.id.slice(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="mb-1 text-xs font-semibold text-rose-600">
              {t("requests.table.ngo")}: {request.ngoDisplayName}
            </p>
            <p className="text-sm leading-relaxed text-rose-800">
              {request.description}
            </p>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="rejectReason"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              {t("modals.reject.reasonLabel")} <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="rejectReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              placeholder={t("modals.reject.reasonPlaceholder")}
              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              {c("actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending || !reason.trim()}
              className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? c("actions.processing") : t("actions.confirmReject")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
