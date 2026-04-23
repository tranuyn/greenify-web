import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, Shield } from "lucide-react";
import { useAdminTrashReports } from "@/hooks/queries/useAdminTrashSpots";
import type { AdminTrashReportDto } from "@/types/trashspot.types";
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

export function ReportsTab() {
  const t = useTranslations("admin.trashSpots");
  const c = useTranslations("common");
  const locale = useLocale();
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
              <TableHead>{t("reports.table.reporter")}</TableHead>
              <TableHead>{t("reports.table.trashSpot")}</TableHead>
              <TableHead>{t("reports.table.note")}</TableHead>
              <TableHead>{t("reports.table.severity")}</TableHead>
              <TableHead>{t("reports.table.spotStatus")}</TableHead>
              <TableHead>{t("reports.table.createdAt")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report: AdminTrashReportDto) => {
              const spotStatus = SPOT_STATUS_META[report.trashSpot.status];
              const severity = SEVERITY_META[report.trashSpot.severityTier];
              return (
                <TableRow key={report.id} className="group hover:bg-primary-300/20">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {report.reporterAvatarUrl ? (
                        <img
                          src={report.reporterAvatarUrl}
                          alt={report.reporterDisplayName}
                          className="h-8 w-8 rounded-full border border-border object-cover"
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
                    <p className="line-clamp-1 max-w-[180px] text-sm font-semibold text-foreground">
                      {report.trashSpot.name}
                    </p>
                    <p className="text-xs text-gray-400">{report.trashSpot.province}</p>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-xs truncate text-sm text-foreground/80" title={report.note}>
                      {report.note || (
                        <span className="italic text-gray-400">{t("reports.emptyNote")}</span>
                      )}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${severity.cls}`}
                    >
                      <AlertTriangle size={10} />
                      {c(`severity.${report.trashSpot.severityTier}`)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${spotStatus.cls}`}
                    >
                      {c(`trashSpotStatus.${report.trashSpot.status}`)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(report.createdAt, locale)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {!isLoading && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <Shield size={32} className="text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground/70">
            {t("reports.empty")}
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
          label: t("tabs.reports"),
          page: page + 1,
          totalPages: data?.totalPages ?? 1,
          totalElements: (data?.totalElements ?? 0).toLocaleString(locale),
        })}
      />
    </TableContainer>
  );
}
