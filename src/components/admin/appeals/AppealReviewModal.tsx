"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink, X } from "lucide-react";
import { useReviewAppeal } from "@/hooks/mutations/useAppeals";
import type { AppealDto, AppealStatus, ReviewAppealRequest } from "@/types/action.types";
import { Tag } from "@/components/admin/ui/tag";
import { APPEAL_DECISION_OPTIONS, APPEAL_STATUS_META } from "@/components/admin/appeals/constants";
import { formatDateTime } from "@/common/utils/date-formatter";

interface AppealReviewModalProps {
  appeal: AppealDto;
  onClose: () => void;
}

export function AppealReviewModal({ appeal, onClose }: AppealReviewModalProps) {
  const t = useTranslations("admin.appeals");
  const c = useTranslations("common");
  const locale = useLocale();
  const [status, setStatus] = useState<AppealStatus>("APPEAL_ACCEPTED");
  const [adminNote, setAdminNote] = useState("");

  const { mutate: reviewAppeal, isPending } = useReviewAppeal(appeal.id);
  const meta = APPEAL_STATUS_META[appeal.status];
  const StatusIcon = meta.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ReviewAppealRequest = { status, adminNote };
    reviewAppeal(payload, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl animate-fade-in overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-primary-heading">
              {t("modal.title")}
            </h2>
            <p className="mt-0.5 font-mono text-xs text-gray-400">
              #{appeal.id.slice(0, 8)}...
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 border-b border-border px-6 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone={meta.tone} size="md">
              <StatusIcon size={12} className="mr-1" />
              {t(`statuses.${appeal.status}`)}
            </Tag>
            <span className="text-xs text-gray-400">
              {t("modal.attempt", { count: appeal.attemptNumber })}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {t("modal.reason")}
            </p>
            <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground">
              {appeal.appealReason}
            </p>
          </div>

          {appeal.evidenceUrls?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("modal.evidence")}
              </p>
              <div className="flex flex-wrap gap-2">
                {appeal.evidenceUrls.map((url, idx) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
                  >
                    <ExternalLink size={12} />
                    {t("modal.evidenceItem", { index: idx + 1 })}
                  </a>
                ))}
              </div>
            </div>
          )}

          {appeal.adminNote && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("modal.previousNote")}
              </p>
              <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                {appeal.adminNote}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("table.postId")}
              </p>
              <p className="font-mono text-sm text-foreground/80">{appeal.postId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("table.userId")}
              </p>
              <p className="font-mono text-sm text-foreground/80">{appeal.userId}</p>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t("modal.createdAt")}
              </p>
              <p className="text-sm text-foreground/80">
                {formatDateTime(appeal.createdAt, locale)}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("modal.decision")}
            </p>
            <div className="flex gap-3">
              {APPEAL_DECISION_OPTIONS.map((nextStatus) => {
                const decisionMeta = APPEAL_STATUS_META[nextStatus];
                const DecisionIcon = decisionMeta.icon;
                return (
                  <button
                    key={nextStatus}
                    type="button"
                    onClick={() => setStatus(nextStatus)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                      status === nextStatus
                        ? nextStatus === "APPEAL_ACCEPTED"
                          ? "border-emerald-400 bg-emerald-500 text-white shadow-sm"
                          : "border-rose-400 bg-rose-500 text-white shadow-sm"
                        : "border-border bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <DecisionIcon size={15} />
                    {t(`statuses.${nextStatus}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="adminNote"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              {t("modal.adminNoteLabel")} <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="adminNote"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              placeholder={t("modal.adminNotePlaceholder")}
              required
              className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
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
              disabled={isPending || !adminNote.trim()}
              className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? c("actions.processing") : c("actions.confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
