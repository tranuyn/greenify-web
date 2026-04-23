import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, Flame, MapPin, RefreshCw, Trash2 } from "lucide-react";
import { useAdminTrashSpots } from "@/hooks/queries/useAdminTrashSpots";
import {
  useDeleteTrashSpot,
  useReopenTrashSpot,
} from "@/hooks/mutations/useAdminTrashSpots";
import type { TrashSpotStatus, TrashSpotSummaryDto } from "@/types/trashspot.types";
import {
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/admin/ui/table";
import {
  SEVERITY_META,
  SPOT_STATUS_META,
} from "@/components/admin/trash-spots/constants";
import { PaginationBar } from "@/components/admin/ui/PaginationBar";
import { formatDate } from "@/common/utils/date-formatter";
import { ChipFilterGroup } from "@/components/admin/ui/filter-chip-group";

export function TrashSpotsTab() {
  const t = useTranslations("admin.trashSpots");
  const c = useTranslations("common");
  const locale = useLocale();

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
      <ChipFilterGroup
        value={statusFilter}
        onChange={(status) => {
          setStatusFilter(status);
          setPage(0);
        }}
        options={[
          { value: undefined, label: c("status.ALL") },
          ...(Object.keys(SPOT_STATUS_META) as TrashSpotStatus[]).map(
            (status) => ({
              value: status,
              label: c(`trashSpotStatus.${status}`),
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
                <TableHead>{t("spots.table.location")}</TableHead>
                <TableHead>{t("spots.table.province")}</TableHead>
                <TableHead>{t("spots.table.severity")}</TableHead>
                <TableHead>{t("spots.table.status")}</TableHead>
                <TableHead>{t("spots.table.hotScore")}</TableHead>
                <TableHead>{t("spots.table.createdAt")}</TableHead>
                <TableHead className="text-right">
                  {t("spots.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spots.map((spot) => {
                const statusMeta = SPOT_STATUS_META[spot.status];
                const severityMeta = SEVERITY_META[spot.severityTier];
                return (
                  <TableRow key={spot.id} className="group hover:bg-primary-300/20">
                    <TableCell>
                      <div className="flex items-start gap-2">
                        {spot.primaryImageUrl ? (
                          <img
                            src={spot.primaryImageUrl}
                            alt={spot.name}
                            className="h-9 w-9 shrink-0 rounded-lg border border-border object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-100 bg-orange-50">
                            <MapPin size={16} className="text-orange-400" />
                          </div>
                        )}
                        <div>
                          <p className="line-clamp-1 text-sm font-semibold text-foreground">
                            {spot.name}
                          </p>
                          <p
                            className="line-clamp-1 max-w-[200px] text-xs text-gray-400"
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
                        {c(`severity.${spot.severityTier}`)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta.cls}`}
                      >
                        {c(`trashSpotStatus.${spot.status}`)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600">
                        <Flame size={13} />
                        {spot.hotScore}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(spot.createdAt, locale)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {spot.status === "RESOLVED" && (
                          <button
                            onClick={() => reopenSpot(spot.id)}
                            disabled={isReopening}
                            title={c("actions.reopen")}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-50"
                          >
                            <RefreshCw size={13} />
                            {c("actions.reopen")}
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmDelete(spot)}
                          title={c("actions.delete")}
                          className="rounded-xl bg-rose-50 p-2 text-rose-500 transition-colors hover:bg-rose-100"
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
              <MapPin size={32} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground/70">
              {t("spots.empty")}
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
            label: t("tabs.spots"),
            page: page + 1,
            totalPages: data?.totalPages ?? 1,
            totalElements: (data?.totalElements ?? 0).toLocaleString(locale),
          })}
        />
      </TableContainer>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-fade-in space-y-4 rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
              <Trash2 size={22} className="text-rose-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-primary-heading">
                {t("spots.deleteModal.title")}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t("spots.deleteModal.description", { name: confirmDelete.name })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
              >
                {c("actions.cancel")}
              </button>
              <button
                onClick={() =>
                  deleteSpot(confirmDelete.id, {
                    onSuccess: () => setConfirmDelete(null),
                  })
                }
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:opacity-50"
              >
                {isDeleting ? c("actions.processing") : c("actions.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
