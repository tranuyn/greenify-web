import { useLocale, useTranslations } from "next-intl";
import { ExternalLink, X } from "lucide-react";
import type { ResolveRequestDto } from "@/types/trashspot.types";
import { RESOLVE_STATUS_META } from "@/components/admin/trash-spots/constants";
import { formatDateTime } from "@/common/utils/date-formatter";

interface RequestDetailModalProps {
  request: ResolveRequestDto;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
}

export function RequestDetailModal({
  request,
  onClose,
  onApprove,
  onReject,
  isApproving,
}: RequestDetailModalProps) {
  const t = useTranslations("admin.trashSpots");
  const c = useTranslations("common");
  const locale = useLocale();
  const meta = RESOLVE_STATUS_META[request.status];
  const StatusIcon = meta.icon;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl animate-fade-in overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-primary-heading">
              {t("modals.detail.title")}
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

        <div className="space-y-5 px-6 py-5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}
          >
            <StatusIcon size={12} />
            {c(`resolveRequestStatus.${request.status}`)}
          </span>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("modals.detail.ngo")}
              </p>
              <p className="text-sm font-semibold text-foreground">
                {request.ngoDisplayName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("modals.detail.cleanedAt")}
              </p>
              <p className="text-sm text-foreground">
                {formatDateTime(request.cleanedAt, locale)}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t("modals.detail.description")}
            </p>
            <p className="rounded-xl border border-border bg-gray-50 px-4 py-3 text-sm leading-relaxed text-foreground">
              {request.description}
            </p>
          </div>

          {request.imageUrls?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("modals.detail.evidenceImages", {
                  count: request.imageUrls.length,
                })}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {request.imageUrls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-square overflow-hidden rounded-xl border border-border"
                  >
                    <img
                      src={url}
                      alt={t("modals.detail.evidenceAlt", { index: idx + 1 })}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                      <ExternalLink
                        size={18}
                        className="opacity-0 text-white transition-opacity group-hover:opacity-100"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {request.rejectReason && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("modals.detail.previousRejectReason")}
              </p>
              <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-800">
                {request.rejectReason}
              </p>
            </div>
          )}
        </div>

        {request.status === "PENDING_ADMIN_REVIEW" ? (
          <div className="sticky bottom-0 flex gap-3 border-t border-border bg-card px-6 py-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              {c("actions.close")}
            </button>
            <button
              onClick={onReject}
              className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-100"
            >
              {c("actions.reject")}
            </button>
            <button
              onClick={onApprove}
              disabled={isApproving}
              className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isApproving ? c("actions.processing") : c("actions.approve")}
            </button>
          </div>
        ) : (
          <div className="border-t border-border bg-card px-6 py-4">
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              {c("actions.close")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
