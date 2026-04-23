import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import {
  useAdminResolveRequests,
} from "@/hooks/queries/useAdminTrashSpots";
import { useApproveResolveRequest } from "@/hooks/mutations/useAdminTrashSpots";
import type {
  ResolveRequestDto,
  ResolveRequestStatus,
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
import { RESOLVE_STATUS_META } from "@/components/admin/trash-spots/constants";
import { PaginationBar } from "@/components/admin/ui/PaginationBar";
import { formatDate } from "@/common/utils/date-formatter";
import { RequestDetailModal } from "@/components/admin/trash-spots/modals/RequestDetailModal";
import { RejectModal } from "@/components/admin/trash-spots/modals/RejectModal";
import { ChipFilterGroup } from "@/components/admin/ui/filter-chip-group";

export function ResolveRequestsTab() {
  const t = useTranslations("admin.trashSpots");
  const c = useTranslations("common");
  const locale = useLocale();

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

  const getResolveStatusLabel = (status: ResolveRequestStatus) => {
    const key = `resolveRequestStatus.${status}`;
    return c.has(key) ? c(key) : status;
  };

  const handleApprove = (id: string) => {
    approveRequest(id, { onSuccess: () => setSelectedRequest(null) });
  };

  return (
    <div className="space-y-4">
      <ChipFilterGroup
        value={statusFilter}
        onChange={(status) => {
          setStatusFilter(status);
          setPage(0);
        }}
        options={[
          { value: undefined, label: c("status.ALL") },
          ...(Object.keys(RESOLVE_STATUS_META) as ResolveRequestStatus[]).map(
            (s) => ({
              value: s,
              label: getResolveStatusLabel(s),
              icon: RESOLVE_STATUS_META[s].icon,
            }),
          ),
        ]}
        layout="wrap"
        size="sm"
      />

      <TableContainer>
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t("requests.table.ngo")}</TableHead>
                <TableHead>{t("requests.table.trashSpot")}</TableHead>
                <TableHead>{t("requests.table.description")}</TableHead>
                <TableHead>{t("requests.table.cleanedAt")}</TableHead>
                <TableHead>{t("requests.table.status")}</TableHead>
                <TableHead className="text-right">
                  {t("requests.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => {
                const meta = RESOLVE_STATUS_META[req.status];
                const Icon = meta.icon;

                return (
                  <TableRow key={req.id} className="group hover:bg-primary-300/20">
                    <TableCell>
                      <p className="text-sm font-semibold text-foreground">
                        {req.ngoDisplayName}
                      </p>
                      <p className="font-mono text-xs text-gray-400">
                        {req.ngoId.slice(0, 8)}...
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-mono text-xs text-gray-500">
                        {req.trashSpotId.slice(0, 8)}...
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
                      {formatDate(req.cleanedAt, locale)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls}`}
                      >
                        <Icon size={11} />
                        {getResolveStatusLabel(req.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          title={c("actions.viewDetails")}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100"
                        >
                          <Eye size={13} />
                          {c("actions.details")}
                        </button>
                        {req.status === "PENDING_ADMIN_REVIEW" && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              disabled={isApproving}
                              title={c("actions.approve")}
                              className="rounded-xl bg-emerald-50 p-2 text-emerald-600 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => setRejectTarget(req)}
                              title={c("actions.reject")}
                              className="rounded-xl bg-rose-50 p-2 text-rose-500 transition-colors hover:bg-rose-100"
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
              <CheckCircle size={32} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground/70">
              {t("requests.empty")}
            </h3>
          </div>
        )}

        <PaginationBar
          page={page}
          totalPages={data?.totalPages ?? 1}
          totalElements={data?.totalElements ?? 0}
          isFetching={isFetching}
          onPageChange={setPage}
          summary={t("pagination.summary", {
            label: t("tabs.requests"),
            page: page + 1,
            totalPages: data?.totalPages ?? 1,
            totalElements: (data?.totalElements ?? 0).toLocaleString(locale),
          })}
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
