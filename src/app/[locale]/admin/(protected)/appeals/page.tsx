"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  X,
} from "lucide-react";
import { useAppealsForReview } from "@/hooks/queries/useAppeals";
import { useReviewAppeal } from "@/hooks/mutations/useAppeals";
import type { AppealDto, AppealStatus, ReviewAppealRequest } from "@/types/action.types";
import {
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/admin/ui/table";

// ─── Constants ───────────────────────────────────────────────
const PAGE_SIZE = 20;

const STATUS_META: Record<
  AppealStatus,
  { label: string; cls: string; icon: React.ElementType }
> = {
  APPEAL_SUBMITTED: {
    label: "Chờ xét",
    cls: "bg-amber-50 text-amber-700 border border-amber-200/60",
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: "Đang xét",
    cls: "bg-blue-50 text-blue-700 border border-blue-200/60",
    icon: Clock,
  },
  APPEAL_ACCEPTED: {
    label: "Chấp thuận",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    icon: CheckCircle,
  },
  APPEAL_REJECTED: {
    label: "Từ chối",
    cls: "bg-rose-50 text-rose-600 border border-rose-200/60",
    icon: XCircle,
  },
};

// ─── Review Modal ─────────────────────────────────────────────
interface ReviewModalProps {
  appeal: AppealDto;
  onClose: () => void;
}

function ReviewModal({ appeal, onClose }: ReviewModalProps) {
  const [status, setStatus] = useState<AppealStatus>("APPEAL_ACCEPTED");
  const [adminNote, setAdminNote] = useState("");

  const { mutate: reviewAppeal, isPending } = useReviewAppeal(appeal.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ReviewAppealRequest = { status, adminNote };
    reviewAppeal(payload, { onSuccess: onClose });
  };

  const meta = STATUS_META[appeal.status];
  const StatusIcon = meta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card">
          <div>
            <h2 className="text-lg font-bold text-primary-heading">Xét duyệt khiếu nại</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">#{appeal.id.slice(0, 8)}…</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Appeal details */}
        <div className="px-6 py-5 space-y-4 border-b border-border">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}
            >
              <StatusIcon size={12} />
              {meta.label}
            </span>
            <span className="text-xs text-gray-400">Lần {appeal.attemptNumber}</span>
          </div>

          {/* Reason */}
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Lý do khiếu nại</p>
            <p className="rounded-xl bg-gray-50 border border-border px-4 py-3 text-sm text-foreground leading-relaxed">
              {appeal.appealReason}
            </p>
          </div>

          {/* Evidence */}
          {appeal.evidenceUrls?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Bằng chứng</p>
              <div className="flex flex-wrap gap-2">
                {appeal.evidenceUrls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    <ExternalLink size={12} />
                    Bằng chứng {idx + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Existing admin note */}
          {appeal.adminNote && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Ghi chú admin trước đó</p>
              <p className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-800 leading-relaxed">
                {appeal.adminNote}
              </p>
            </div>
          )}
        </div>

        {/* Review form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Decision */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Quyết định</p>
            <div className="flex gap-3">
              {(["APPEAL_ACCEPTED", "APPEAL_REJECTED"] as const).map((s) => {
                const m = STATUS_META[s];
                const Icon = m.icon;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                      status === s
                        ? s === "APPEAL_ACCEPTED"
                          ? "border-emerald-400 bg-emerald-500 text-white shadow-sm"
                          : "border-rose-400 bg-rose-500 text-white shadow-sm"
                        : "border-border bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={15} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin note */}
          <div className="space-y-1">
            <label
              htmlFor="adminNote"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Ghi chú admin <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="adminNote"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              placeholder="Nhập lý do quyết định…"
              required
              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isPending || !adminNote.trim()}
              className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-colors hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Đang lưu…" : "Xác nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────
export default function AppealsPage() {
  const [statusFilter, setStatusFilter] = useState<AppealStatus | undefined>(undefined);
  const [page, setPage] = useState(0); // API uses 0-indexed pages
  const [selectedAppeal, setSelectedAppeal] = useState<AppealDto | null>(null);

  const { data, isLoading, isFetching } = useAppealsForReview({
    status: statusFilter,
    page,
    size: PAGE_SIZE,
  });

  const appeals = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary-heading tracking-tight">
          Quản lý khiếu nại
        </h2>
        <p className="mt-1 text-sm font-medium text-gray-500">
          {isLoading
            ? "Đang tải…"
            : `${totalElements.toLocaleString()} khiếu nại`}
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Lọc theo trạng thái
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setStatusFilter(undefined); setPage(0); }}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
              statusFilter === undefined
                ? "border-primary-500 bg-primary-600 text-white shadow-sm shadow-primary-600/20"
                : "border-border bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            Tất cả
          </button>
          {(Object.keys(STATUS_META) as AppealStatus[]).map((s) => {
            const { label } = STATUS_META[s];
            return (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(0); }}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                  statusFilter === s
                    ? "border-primary-500 bg-primary-600 text-white shadow-sm shadow-primary-600/20"
                    : "border-border bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <TableContainer>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>ID Bài viết</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Lý do khiếu nại</TableHead>
                <TableHead>Lần</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appeals.map((appeal) => {
                const meta = STATUS_META[appeal.status];
                const StatusIcon = meta.icon;
                return (
                  <TableRow key={appeal.id} className="hover:bg-primary-300/20 group">
                    {/* Post ID */}
                    <TableCell>
                      <span className="font-mono text-xs text-gray-500">
                        {appeal.postId.slice(0, 8)}…
                      </span>
                    </TableCell>

                    {/* User ID */}
                    <TableCell>
                      <span className="font-mono text-xs text-gray-500">
                        {appeal.userId.slice(0, 8)}…
                      </span>
                    </TableCell>

                    {/* Reason */}
                    <TableCell>
                      <p className="max-w-xs truncate text-sm text-foreground/80" title={appeal.appealReason}>
                        {appeal.appealReason}
                      </p>
                    </TableCell>

                    {/* Attempt */}
                    <TableCell>
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                        {appeal.attemptNumber}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls}`}
                      >
                        <StatusIcon size={11} />
                        {meta.label}
                      </span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-sm text-gray-500">
                      {new Date(appeal.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedAppeal(appeal)}
                          title="Xét duyệt khiếu nại"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                        >
                          <FileText size={13} />
                          Xét duyệt
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Empty state */}
        {!isLoading && appeals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mb-4 animate-float">
              <FileText size={32} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground/70">
              Không có khiếu nại nào
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {statusFilter ? `Chưa có khiếu nại "${STATUS_META[statusFilter].label}"` : "Chưa có khiếu nại nào được gửi"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-table-border px-6 py-4 bg-table-header-bg">
            <span className="text-sm font-medium text-table-header-text">
              Trang {page + 1} / {totalPages} &bull; {totalElements.toLocaleString()} khiếu nại
              {isFetching && (
                <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border border-primary-500 border-t-transparent" />
              )}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                      p === page
                        ? "bg-primary-600 text-white shadow-primary-600/20 border-primary-600"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {p + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </TableContainer>

      {/* Review modal */}
      {selectedAppeal && (
        <ReviewModal
          appeal={selectedAppeal}
          onClose={() => setSelectedAppeal(null)}
        />
      )}
    </div>
  );
}
