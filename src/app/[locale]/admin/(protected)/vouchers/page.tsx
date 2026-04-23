"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  Pencil,
  Package,
  Coins,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import {
  useCreateVoucher,
  useUpdateVoucher,
  useUpdateVoucherStatus,
} from "@/hooks/mutations/useAdmin";
import type {
  AdminVoucherStatus,
  VoucherTemplate,
  VoucherTemplateStatus,
  CreateVoucherTemplateRequest,
  UpdateVoucherTemplateRequest,
} from "@/types/gamification.types";
import {
  ADMIN_VOUCHER_STATUS_FILTER,
  ADMIN_VOUCHER_STATUS_FILTERS,
  VOUCHER_TEMPLATE_STATUS,
} from "@/types/gamification.types";
import { VoucherFormModal } from "@/components/admin/vouchers/VoucherFormModal";
import {
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/admin/ui/table";
import { useAdminVouchers } from "@/hooks/queries/useAdmin";
import { Select } from "@/components/admin/ui/select";
import type { SelectOption } from "@/components/admin/ui/select";
import { ChipFilterGroup } from "@/components/admin/ui/filter-chip-group";

const getStatusIcon = (status: VoucherTemplateStatus) => {
  switch (status) {
    case VOUCHER_TEMPLATE_STATUS.ACTIVE:
      return CheckCircle;
    case VOUCHER_TEMPLATE_STATUS.INACTIVE:
      return AlertCircle;
    case VOUCHER_TEMPLATE_STATUS.EXPIRED:
      return X;
    case VOUCHER_TEMPLATE_STATUS.DEPLETED:
      return Package;
    case VOUCHER_TEMPLATE_STATUS.DRAFT:
    default:
      return Clock;
  }
};

const EDITABLE_VOUCHER_STATUSES: readonly VoucherTemplateStatus[] = [
  VOUCHER_TEMPLATE_STATUS.DRAFT,
  VOUCHER_TEMPLATE_STATUS.ACTIVE,
  VOUCHER_TEMPLATE_STATUS.INACTIVE,
  VOUCHER_TEMPLATE_STATUS.DEPLETED,
];

const getStatusCls = (status: VoucherTemplateStatus) => {
  switch (status) {
    case VOUCHER_TEMPLATE_STATUS.ACTIVE:
      return "bg-primary-100 text-primary-content";
    case VOUCHER_TEMPLATE_STATUS.INACTIVE:
      return "bg-amber-50 text-amber-600 border border-amber-200/50";
    case VOUCHER_TEMPLATE_STATUS.EXPIRED:
      return "bg-rose-50 text-rose-500 border border-rose-200/50";
    case VOUCHER_TEMPLATE_STATUS.DEPLETED:
      return "bg-orange-50 text-orange-500 border border-orange-200/50";
    case VOUCHER_TEMPLATE_STATUS.DRAFT:
    default:
      return "bg-gray-100 text-gray-500 border border-gray-200";
  }
};

export default function VouchersAdminPage() {
  const t = useTranslations("admin.vouchers");

  const { data, isLoading } = useAdminVouchers();
  const vouchers = data?.content || [];

  const { mutate: createVoucher, isPending: isCreating } = useCreateVoucher();
  const { mutate: updateVoucher, isPending: isUpdating } = useUpdateVoucher();
  const {
    mutate: updateStatus,
    isPending: isUpdatingStatus,
    variables: updatingVariables,
  } = useUpdateVoucherStatus();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<VoucherTemplate | null>(null);
  const [statusFilter, setStatusFilter] = useState<AdminVoucherStatus>(
    ADMIN_VOUCHER_STATUS_FILTER.ALL,
  );

  const filtered =
    statusFilter === ADMIN_VOUCHER_STATUS_FILTER.ALL
      ? vouchers
      : vouchers.filter((v) => v.status === statusFilter);

  const counts: Partial<Record<AdminVoucherStatus, number>> = {
    ALL: vouchers.length,
  };
  vouchers.forEach((v) => {
    counts[v.status] = (counts[v.status] ?? 0) + 1;
  });
  const handleSubmit = (
    formData: CreateVoucherTemplateRequest | UpdateVoucherTemplateRequest,
  ) => {
    if (editTarget) {
      updateVoucher(
        {
          id: editTarget.id,
          payload: formData as UpdateVoucherTemplateRequest,
        },
        { onSuccess: closeForm },
      );
    } else {
      createVoucher(formData as CreateVoucherTemplateRequest, {
        onSuccess: closeForm,
      });
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const changeStatus = (
    voucherId: string,
    nextStatus: VoucherTemplateStatus,
  ) => {
    updateStatus({ id: voucherId, payload: { status: nextStatus } });
  };

  const statusOptions: SelectOption<VoucherTemplateStatus>[] =
    EDITABLE_VOUCHER_STATUSES.map((status) => ({
      value: status,
      label: t(`status.${status}`),
    }));

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary-heading tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-1.5 font-medium text-sm text-gray-500">
            {t("subtitle", { count: vouchers.length })}
          </p>
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-lg"
        >
          <Plus size={18} /> {t("createBtn")}
        </button>
      </div>

      {/* Status filter */}
      <ChipFilterGroup
        value={statusFilter}
        onChange={setStatusFilter}
        options={ADMIN_VOUCHER_STATUS_FILTERS.map((s) => ({
          value: s,
          label: t(`status.${s}`),
          count: counts[s] ?? 0,
        }))}
        layout="scroll"
        size="md"
      />

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t("table.voucher")}</TableHead>
                <TableHead>{t("table.partner")}</TableHead>
                <TableHead>{t("table.points")}</TableHead>
                <TableHead>{t("table.stock")}</TableHead>
                <TableHead>{t("table.validUntil")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="text-right">
                  {t("table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => {
                const sLabel = t(`status.${v.status}`);
                const stockPct =
                  v.totalStock > 0
                    ? Math.round((v.remainingStock / v.totalStock) * 100)
                    : 0;
                const Icon = getStatusIcon(v.status);
                const isThisVoucherUpdating =
                  isUpdatingStatus && updatingVariables?.id === v.id;
                return (
                  <TableRow key={v.id} className={"group"}>
                    <TableCell>
                      <p className="font-semibold text-primary-content">
                        {v.name}
                      </p>
                      <p className="mt-1 max-w-[200px] truncate text-xs text-foreground/60 group-hover:text-foreground">
                        {v.description}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium text-foreground/60 group-hover:text-foreground">
                      {v.partnerName}
                    </TableCell>
                    <TableCell>
                      <span className="flex w-fit items-center gap-1.5 rounded-lg bg-green-50 px-2 py-1 text-xs font-bold text-green-700 border border-green-200/50">
                        <Coins size={14} /> {v.requiredPoints} GP
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs font-medium text-foreground/60 group-hover:text-foreground ">
                          <span>{v.remainingStock}</span>
                          <span className="text-gray-400">
                            / {v.totalStock}
                          </span>
                        </div>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full transition-all ${
                              stockPct > 50
                                ? "bg-primary-500 "
                                : stockPct > 20
                                  ? "bg-amber-400"
                                  : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.min(stockPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground/60 group-hover:text-foreground">
                      {formatDate(v.validUntil)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusCls(v.status)}`}
                      >
                        <Icon size={12} /> {sLabel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-3">
                        {/* Nút X khi hết hạn */}
                        {v.status === VOUCHER_TEMPLATE_STATUS.EXPIRED ? (
                          <button
                            disabled
                            className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg bg-gray-50 text-gray-400 border border-gray-100"
                            title={t("status.EXPIRED")}
                          >
                            <X size={16} strokeWidth={2.5} />
                          </button>
                        ) : (
                          <Select
                            value={v.status}
                            options={statusOptions}
                            disabled={isThisVoucherUpdating}
                            isLoading={isUpdatingStatus}
                            onChange={(nextStatus) => {
                              if (nextStatus !== v.status) {
                                changeStatus(v.id, nextStatus);
                              }
                            }}
                            className="w-[100px]"
                          />
                        )}

                        {/* Nút Edit */}
                        <button
                          onClick={() => {
                            setEditTarget(v);
                            setShowForm(true);
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 transition-all hover:border-primary-400 hover:text-primary-600 shadow-sm"
                          title={t("edit")}
                        >
                          <Pencil size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mb-4 animate-float">
                <Package size={32} className="text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground/70">
                {t("empty")}
              </h3>
              <p className="mt-1.5 text-sm text-gray-500">
                {statusFilter !== ADMIN_VOUCHER_STATUS_FILTER.ALL
                  ? `Không tìm thấy voucher nào đang ${String(t(`status.${statusFilter}`)).toLowerCase()}.`
                  : "Hãy tạo voucher mới để bắt đầu."}
              </p>
            </div>
          )}
        </TableContainer>
      )}

      {showForm && (
        <VoucherFormModal
          initial={editTarget}
          onClose={closeForm}
          onSubmit={handleSubmit}
          isPending={isCreating || isUpdating}
        />
      )}
    </div>
  );
}
