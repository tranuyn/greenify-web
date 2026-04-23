"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { useAppealsForReview } from "@/hooks/queries/useAppeals";
import type { AppealDto, AppealStatus } from "@/types/action.types";
import {
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/admin/ui/table";
import { TablePagination } from "@/components/admin/ui/table-pagination";
import { Tooltip } from "@/components/admin/ui/tooltip";
import { Tag } from "@/components/admin/ui/tag";
import { ChipFilterGroup } from "@/components/admin/ui/filter-chip-group";
import {
  APPEAL_EMPTY_ICON,
  APPEAL_STATUS_META,
  PAGE_SIZE,
} from "@/components/admin/appeals/constants";
import { AppealReviewModal } from "@/components/admin/appeals/AppealReviewModal";
import { formatDate } from "@/common/utils/date-formatter";

const PAGE_OFFSET = 0;

export default function AppealsAdminPageClient() {
  const t = useTranslations("admin.appeals");
  const c = useTranslations("common");
  const locale = useLocale();

  const [statusFilter, setStatusFilter] = useState<AppealStatus | undefined>(
    undefined,
  );
  const [page, setPage] = useState(0);
  const [selectedAppeal, setSelectedAppeal] = useState<AppealDto | null>(null);

  const { data, isLoading, isFetching } = useAppealsForReview({
    status: statusFilter,
    page,
    size: PAGE_SIZE,
  });

  const appeals = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;
  const CurrentPageIcon = APPEAL_EMPTY_ICON;

  const getStatusLabel = (status: AppealStatus) => t(`statuses.${status}`);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary-heading">
          {t("title")}
        </h2>
        <p className="mt-1 text-sm font-medium text-gray-500">
          {isLoading ? t("loading") : t("subtitle", { count: totalElements })}
        </p>
      </div>

      <ChipFilterGroup
        label={t("filters.status")}
        value={statusFilter}
        onChange={(status) => {
          setStatusFilter(status);
          setPage(PAGE_OFFSET);
        }}
        options={[
          { value: undefined, label: c("status.ALL") },
          ...(Object.keys(APPEAL_STATUS_META) as AppealStatus[]).map(
            (status) => ({
              value: status,
              label: getStatusLabel(status),
              icon: APPEAL_STATUS_META[status].icon,
            }),
          ),
        ]}
        layout="wrap"
        size="md"
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
                <TableHead>{t("table.postId")}</TableHead>
                <TableHead>{t("table.userId")}</TableHead>
                <TableHead>{t("table.reason")}</TableHead>
                <TableHead>{t("table.attempt")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.createdAt")}</TableHead>
                <TableHead className="text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appeals.map((appeal) => {
                const meta = APPEAL_STATUS_META[appeal.status];
                const StatusIcon = meta.icon;
                return (
                  <TableRow key={appeal.id} className="group hover:bg-primary-300/20">
                    <TableCell>
                      <span className="font-mono text-xs text-gray-500">
                        {appeal.postId.slice(0, 8)}...
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-gray-500">
                        {appeal.userId.slice(0, 8)}...
                      </span>
                    </TableCell>
                    <TableCell>
                      <p
                        className="max-w-xs truncate text-sm text-foreground/80"
                        title={appeal.appealReason}
                      >
                        {appeal.appealReason}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                        {appeal.attemptNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Tag tone={meta.tone} size="sm">
                        <StatusIcon size={11} className="mr-1" />
                        {getStatusLabel(appeal.status)}
                      </Tag>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(appeal.createdAt, locale)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip content={t("actions.review")}>
                          <button
                            onClick={() => setSelectedAppeal(appeal)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100"
                          >
                            <FileText size={13} />
                            {t("actions.review")}
                          </button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {!isLoading && appeals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
              <CurrentPageIcon size={32} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground/70">
              {t("empty.title")}
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {statusFilter
                ? t("empty.filtered", { status: getStatusLabel(statusFilter) })
                : t("empty.unfiltered")}
            </p>
          </div>
        )}

        <TablePagination
          currentPage={page + 1}
          totalPages={totalPages}
          onPageChange={(nextPage) => setPage(nextPage - 1)}
          isFetching={isFetching}
          summary={t("pagination.summary", {
            page: page + 1,
            totalPages,
            totalElements: totalElements.toLocaleString(locale),
          })}
        />
      </TableContainer>

      {selectedAppeal && (
        <AppealReviewModal
          appeal={selectedAppeal}
          onClose={() => setSelectedAppeal(null)}
        />
      )}
    </div>
  );
}
