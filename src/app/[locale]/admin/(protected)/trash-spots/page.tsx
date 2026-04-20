"use client";

import { useState } from "react";
import {
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  AlertTriangle,
  Shield,
  Flame,
  Eye,
} from "lucide-react";
import {
  useAdminResolveRequests,
  useAdminTrashSpots,
  useAdminTrashReports,
} from "@/hooks/queries/useAdminTrashSpots";
import {
  useApproveResolveRequest,
  useRejectResolveRequest,
  useReopenTrashSpot,
  useDeleteTrashSpot,
} from "@/hooks/mutations/useAdminTrashSpots";
import type {
  ResolveRequestDto,
  ResolveRequestStatus,
  TrashSpotSummaryDto,
  TrashSpotStatus,
  SeverityTier,
  AdminTrashReportDto,
} from "@/types/trashspot.types";
import {
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/admin/ui/table";

// ─── Meta maps ─────────────────────────────────────────────────────────────────

const RESOLVE_STATUS_META: Record<
  ResolveRequestStatus,
  { label: string; cls: string; icon: React.ElementType }
> = {
  PENDING_ADMIN_REVIEW: {
    label: "Chờ duyệt",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Clock,
  },
  APPROVED: {
    label: "Đã duyệt",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Từ chối",
    cls: "bg-rose-50 text-rose-600 border border-rose-200",
    icon: XCircle,
  },
};

const SPOT_STATUS_META: Record<
  TrashSpotStatus,
  { label: string; cls: string }
> = {
  PENDING_VERIFY: {
    label: "Chờ xác minh",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  VERIFIED: {
    label: "Đã xác minh",
    cls: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  IN_PROGRESS: {
    label: "Đang xử lý",
    cls: "bg-violet-50 text-violet-700 border border-violet-200",
  },
  RESOLVED: {
    label: "Đã giải quyết",
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  REOPENED: {
    label: "Mở lại",
    cls: "bg-orange-50 text-orange-700 border border-orange-200",
  },
};

const SEVERITY_META: Record<SeverityTier, { label: string; cls: string }> = {
  SEVERITY_LOW: {
    label: "Thấp",
    cls: "bg-green-50 text-green-700 border border-green-200",
  },
  SEVERITY_MEDIUM: {
    label: "Trung bình",
    cls: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  SEVERITY_HIGH: {
    label: "Cao",
    cls: "bg-rose-50 text-rose-600 border border-rose-200",
  },
};

// ─── Pagination Control ────────────────────────────────────────────────────────

function PaginationBar({
  page,
  totalPages,
  totalElements,
  isFetching,
  onPageChange,
  label,
}: {
  page: number;
  totalPages: number;
  totalElements: number;
  isFetching?: boolean;
  onPageChange: (p: number) => void;
  label: string;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-table-border px-6 py-4 bg-table-header-bg">
      <span className="text-sm font-medium text-table-header-text">
        {label} &bull; Trang {page + 1}/{totalPages} &bull;{" "}
        {totalElements.toLocaleString()} kết quả
        {isFetching && (
          <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border border-primary-500 border-t-transparent" />
        )}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(0, page - 1))}
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
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                p === page
                  ? "bg-primary-600 text-white border-primary-600"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p + 1}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── Reject Modal ──────────────────────────────────────────────────────────────

interface RejectModalProps {
  request: ResolveRequestDto;
  onClose: () => void;
}

function RejectModal({ request, onClose }: RejectModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-primary-heading">
              Từ chối yêu cầu giải quyết
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              #{request.id.slice(0, 8)}…
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3">
            <p className="text-xs font-semibold text-rose-600 mb-1">
              NGO: {request.ngoDisplayName}
            </p>
            <p className="text-sm text-rose-800 leading-relaxed">
              {request.description}
            </p>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="rejectReason"
              className="text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Lý do từ chối <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="rejectReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              placeholder="Nêu rõ lý do từ chối để NGO biết cần cải thiện gì…"
              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

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
              disabled={isPending || !reason.trim()}
              className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Đang lưu…" : "Xác nhận từ chối"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Request Detail Modal ──────────────────────────────────────────────────────

interface RequestDetailModalProps {
  request: ResolveRequestDto;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
}

function RequestDetailModal({
  request,
  onClose,
  onApprove,
  onReject,
  isApproving,
}: RequestDetailModalProps) {
  const meta = RESOLVE_STATUS_META[request.status];
  const StatusIcon = meta.icon;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl animate-fade-in">
        <div className="sticky top-0 flex items-center justify-between border-b border-border px-6 py-4 bg-card">
          <div>
            <h2 className="text-lg font-bold text-primary-heading">
              Chi tiết yêu cầu giải quyết
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              #{request.id.slice(0, 8)}…
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Status */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.cls}`}
          >
            <StatusIcon size={12} />
            {meta.label}
          </span>

          {/* NGO info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                NGO
              </p>
              <p className="text-sm font-semibold text-foreground">
                {request.ngoDisplayName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Ngày dọn sạch
              </p>
              <p className="text-sm text-foreground">
                {new Date(request.cleanedAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Mô tả
            </p>
            <p className="rounded-xl bg-gray-50 border border-border px-4 py-3 text-sm text-foreground leading-relaxed">
              {request.description}
            </p>
          </div>

          {/* Images */}
          {request.imageUrls?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Hình ảnh bằng chứng ({request.imageUrls.length})
              </p>
              <div className="grid grid-cols-3 gap-2">
                {request.imageUrls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-xl border border-border aspect-square block"
                  >
                    <img
                      src={url}
                      alt={`Bằng chứng ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                      <ExternalLink
                        size={18}
                        className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Reject reason if any */}
          {request.rejectReason && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Lý do từ chối trước đó
              </p>
              <p className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-800 leading-relaxed">
                {request.rejectReason}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {request.status === "PENDING_ADMIN_REVIEW" && (
          <div className="sticky bottom-0 flex gap-3 border-t border-border px-6 py-4 bg-card">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={onReject}
              className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
            >
              Từ chối
            </button>
            <button
              onClick={onApprove}
              disabled={isApproving}
              className="flex-1 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isApproving ? "Đang duyệt…" : "Chấp thuận"}
            </button>
          </div>
        )}
        {request.status !== "PENDING_ADMIN_REVIEW" && (
          <div className="border-t border-border px-6 py-4 bg-card">
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab: Resolve Requests ─────────────────────────────────────────────────────

function ResolveRequestsTab() {
  const [statusFilter, setStatusFilter] = useState<
    ResolveRequestStatus | undefined
  >(undefined);
  const [page, setPage] = useState(0);
  const [selectedRequest, setSelectedRequest] =
    useState<ResolveRequestDto | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ResolveRequestDto | null>(
    null,
  );

  const { data, isLoading, isFetching } = useAdminResolveRequests({
    status: statusFilter,
    page,
    size: 20,
  });
  const { mutate: approveRequest, isPending: isApproving } =
    useApproveResolveRequest();

  const requests = data?.content ?? [];

  const handleApprove = (id: string) => {
    approveRequest(id, { onSuccess: () => setSelectedRequest(null) });
  };

  return (
    <div className="space-y-4">
      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setStatusFilter(undefined);
            setPage(0);
          }}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
            statusFilter === undefined
              ? "border-primary-500 bg-primary-600 text-white"
              : "border-border bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Tất cả
        </button>
        {(Object.keys(RESOLVE_STATUS_META) as ResolveRequestStatus[]).map(
          (s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(0);
              }}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                statusFilter === s
                  ? "border-primary-500 bg-primary-600 text-white"
                  : "border-border bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {RESOLVE_STATUS_META[s].label}
            </button>
          ),
        )}
      </div>

      <TableContainer>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>NGO</TableHead>
                <TableHead>Điểm rác</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Ngày dọn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => {
                const meta = RESOLVE_STATUS_META[req.status];
                const Icon = meta.icon;
                return (
                  <TableRow
                    key={req.id}
                    className="hover:bg-primary-300/20 group"
                  >
                    <TableCell>
                      <p className="text-sm font-semibold text-foreground">
                        {req.ngoDisplayName}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        {req.ngoId.slice(0, 8)}…
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-mono text-xs text-gray-500">
                        {req.trashSpotId.slice(0, 8)}…
                      </p>
                    </TableCell>
                    <TableCell>
                      <p
                        className="max-w-xs truncate text-sm text-foreground/80"
                        title={req.description}
                      >
                        {req.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(req.cleanedAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls}`}
                      >
                        <Icon size={11} />
                        {meta.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          title="Xem chi tiết"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                        >
                          <Eye size={13} />
                          Chi tiết
                        </button>
                        {req.status === "PENDING_ADMIN_REVIEW" && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              disabled={isApproving}
                              title="Chấp thuận"
                              className="rounded-xl bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => setRejectTarget(req)}
                              title="Từ chối"
                              className="rounded-xl bg-rose-50 p-2 text-rose-500 hover:bg-rose-100 transition-colors"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {!isLoading && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mb-4">
              <CheckCircle size={32} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground/70">
              Không có yêu cầu nào
            </h3>
          </div>
        )}

        <PaginationBar
          page={page}
          totalPages={data?.totalPages ?? 1}
          totalElements={data?.totalElements ?? 0}
          isFetching={isFetching}
          onPageChange={setPage}
          label="Yêu cầu giải quyết"
        />
      </TableContainer>

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={() => handleApprove(selectedRequest.id)}
          onReject={() => {
            setRejectTarget(selectedRequest);
            setSelectedRequest(null);
          }}
          isApproving={isApproving}
        />
      )}

      {rejectTarget && (
        <RejectModal
          request={rejectTarget}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}

// ─── Tab: Trash Spots ──────────────────────────────────────────────────────────

function TrashSpotsTab() {
  const [statusFilter, setStatusFilter] = useState<TrashSpotStatus | undefined>(
    undefined,
  );
  const [page, setPage] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<TrashSpotSummaryDto | null>(
    null,
  );

  const { data, isLoading, isFetching } = useAdminTrashSpots({
    status: statusFilter,
    page,
    size: 20,
  });
  const { mutate: reopenSpot, isPending: isReopening } = useReopenTrashSpot();
  const { mutate: deleteSpot, isPending: isDeleting } = useDeleteTrashSpot();

  const spots = data?.content ?? [];

  return (
    <div className="space-y-4">
      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setStatusFilter(undefined);
            setPage(0);
          }}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
            statusFilter === undefined
              ? "border-primary-500 bg-primary-600 text-white"
              : "border-border bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Tất cả
        </button>
        {(Object.keys(SPOT_STATUS_META) as TrashSpotStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(0);
            }}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
              statusFilter === s
                ? "border-primary-500 bg-primary-600 text-white"
                : "border-border bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {SPOT_STATUS_META[s].label}
          </button>
        ))}
      </div>

      <TableContainer>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Địa điểm</TableHead>
                <TableHead>Tỉnh/Thành</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hot score</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spots.map((spot) => {
                const statusMeta = SPOT_STATUS_META[spot.status];
                const severityMeta = SEVERITY_META[spot.severityTier];
                return (
                  <TableRow
                    key={spot.id}
                    className="hover:bg-primary-300/20 group"
                  >
                    <TableCell>
                      <div className="flex items-start gap-2">
                        {spot.primaryImageUrl ? (
                          <img
                            src={spot.primaryImageUrl}
                            alt={spot.name}
                            className="h-9 w-9 shrink-0 rounded-lg object-cover border border-border"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 border border-orange-100">
                            <MapPin size={16} className="text-orange-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-foreground line-clamp-1">
                            {spot.name}
                          </p>
                          <p
                            className="text-xs text-gray-400 line-clamp-1 max-w-[200px]"
                            title={spot.location}
                          >
                            {spot.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {spot.province}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${severityMeta.cls}`}
                      >
                        <AlertTriangle size={10} />
                        {severityMeta.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.cls}`}
                      >
                        {statusMeta.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                        <Flame size={13} />
                        {spot.hotScore}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(spot.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {spot.status === "RESOLVED" && (
                          <button
                            onClick={() => reopenSpot(spot.id)}
                            disabled={isReopening}
                            title="Mở lại điểm rác"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-50 transition-colors"
                          >
                            <RefreshCw size={13} />
                            Mở lại
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmDelete(spot)}
                          title="Xóa điểm rác"
                          className="rounded-xl bg-rose-50 p-2 text-rose-500 hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {!isLoading && spots.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mb-4">
              <MapPin size={32} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground/70">
              Chưa có điểm rác nào
            </h3>
          </div>
        )}

        <PaginationBar
          page={page}
          totalPages={data?.totalPages ?? 1}
          totalElements={data?.totalElements ?? 0}
          isFetching={isFetching}
          onPageChange={setPage}
          label="Điểm rác"
        />
      </TableContainer>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 animate-fade-in space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 mx-auto">
              <Trash2 size={22} className="text-rose-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-primary-heading">
                Xoá điểm rác?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-semibold text-foreground">
                  {confirmDelete.name}
                </span>{" "}
                sẽ bị xoá vĩnh viễn và không thể khôi phục.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={() =>
                  deleteSpot(confirmDelete.id, {
                    onSuccess: () => setConfirmDelete(null),
                  })
                }
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Đang xoá…" : "Xoá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Reports ──────────────────────────────────────────────────────────────

function ReportsTab() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isFetching } = useAdminTrashReports({
    page,
    size: 20,
  });
  const reports = data?.content ?? [];

  return (
    <TableContainer>
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Người báo cáo</TableHead>
              <TableHead>Điểm rác</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead>Mức độ</TableHead>
              <TableHead>Trạng thái spot</TableHead>
              <TableHead>Ngày báo cáo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report: AdminTrashReportDto) => {
              const spotStatus = SPOT_STATUS_META[report.trashSpot.status];
              const severity = SEVERITY_META[report.trashSpot.severityTier];
              return (
                <TableRow
                  key={report.id}
                  className="hover:bg-primary-300/20 group"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {report.reporterAvatarUrl ? (
                        <img
                          src={report.reporterAvatarUrl}
                          alt={report.reporterDisplayName}
                          className="h-8 w-8 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
                          {report.reporterDisplayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <p className="text-sm font-semibold text-foreground">
                        {report.reporterDisplayName}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-semibold text-foreground line-clamp-1 max-w-[180px]">
                      {report.trashSpot.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {report.trashSpot.province}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p
                      className="max-w-xs truncate text-sm text-foreground/80"
                      title={report.note}
                    >
                      {report.note || <span className="italic text-gray-400">—</span>}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${severity.cls}`}
                    >
                      <AlertTriangle size={10} />
                      {severity.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${spotStatus.cls}`}
                    >
                      {spotStatus.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {!isLoading && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mb-4">
            <Shield size={32} className="text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground/70">
            Chưa có báo cáo nào
          </h3>
        </div>
      )}

      <PaginationBar
        page={page}
        totalPages={data?.totalPages ?? 1}
        totalElements={data?.totalElements ?? 0}
        isFetching={isFetching}
        onPageChange={setPage}
        label="Báo cáo"
      />
    </TableContainer>
  );
}

// ─── Page Root ─────────────────────────────────────────────────────────────────

type Tab = "requests" | "spots" | "reports";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "requests", label: "Yêu cầu giải quyết", icon: CheckCircle },
  { key: "spots", label: "Điểm rác", icon: MapPin },
  { key: "reports", label: "Báo cáo", icon: Shield },
];

export default function TrashSpotsAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("requests");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary-heading tracking-tight">
          Quản lý Điểm rác
        </h2>
        <p className="mt-1 text-sm font-medium text-gray-500">
          Duyệt yêu cầu giải quyết từ NGO, xem danh sách điểm rác và báo cáo từ cộng đồng.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl bg-gray-100/80 p-1 w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === key
                ? "bg-white text-primary-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "requests" && <ResolveRequestsTab />}
      {activeTab === "spots" && <TrashSpotsTab />}
      {activeTab === "reports" && <ReportsTab />}
    </div>
  );
}
