"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Trophy,
  Medal,
  Gift,
  Send,
  Trash2,
  Plus,
  Users,
  Crown,
} from "lucide-react";
import { useWeeklyLeaderboard, useAdminPrizes } from "@/hooks/queries/useAdmin";
import {
  useCreatePrize,
  useDistributePrize,
  useDeletePrize,
} from "@/hooks/mutations/useAdmin";
import type {
  CreateLeaderboardPrizeRequest,
  LeaderboardEntry,
  LeaderboardPrize
} from "@/types/gamification.types";
import { useAvailableVouchers } from "@/hooks/queries/useGamification";
import { PrizeFormModal } from "@/components/admin/leaderboard/PrizeFormModal";
import {
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/admin/ui/table";
import { Tag } from "@/components/admin/ui/tag";
import { Tooltip } from "@/components/admin/ui/tooltip";
import { Popconfirm } from "@/components/admin/ui/popconfirm";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN");
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("vi-VN");
};
// ── Rank medal ─────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return <Crown size={20} className="text-amber-500 drop-shadow-sm" />;
  if (rank === 2)
    return <Medal size={20} className="text-gray-400 drop-shadow-sm" />;
  if (rank === 3)
    return <Medal size={20} className="text-amber-700 drop-shadow-sm" />;
  return (
    <span className="w-5 text-center text-sm font-bold text-gray-400">
      #{rank}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function LeaderboardAdminPage() {
  const t = useTranslations("admin.leaderboard");

  const {
    data: weeklyLeaderboard,
    isLoading: isLoadingLB,
  } = useWeeklyLeaderboard();

  const {
    data: prizesData,
    isLoading: isLoadingPrizes,
  } = useAdminPrizes({
    weekStartDate: weeklyLeaderboard?.weekStartDate,
    page: 1,
    size: 20,
  });
  const { data: vouchersData } = useAvailableVouchers();

  const leaderboard = weeklyLeaderboard?.entries ?? [];

  const prizes = prizesData?.content ?? [];

  const vouchers = vouchersData?.content ?? [];

  const { mutate: createPrize, isPending: isCreatingPrize } = useCreatePrize();
  const {
    mutate: distributePrize,
    isPending: isDistributing,
    variables: distributingId,
  } = useDistributePrize();
  const {
    mutate: deletePrize,
    isPending: isDeleting,
    variables: deletingId,
  } = useDeletePrize();

  const [showPrizeForm, setShowPrizeForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"ranking" | "prizes">("ranking");

  const activeVouchers = vouchers.filter((v) => v.status === "ACTIVE");
  const effectiveWeekStartDate = weeklyLeaderboard?.weekStartDate ?? [];
  const currentPrizeConfig =
    prizes.find(
      (p: LeaderboardPrize) => p.weekStartDate === effectiveWeekStartDate,
    ) ?? prizes[0];

  const handleCreatePrize = (data: CreateLeaderboardPrizeRequest) => {
    createPrize(data, { onSuccess: () => setShowPrizeForm(false) });
  };

  const handleDistributePrize = (id: string) => {
    distributePrize(id);
  };

  const handleDeletePrize = (id: string) => {
    deletePrize(id);
  };

  const getPrizeStatusTone = (
    status: LeaderboardPrize["status"],
  ): "success" | "danger" | "warning" => {
    if (status === "DISTRIBUTED") return "success";
    if (status === "CANCELLED") return "danger";
    return "warning";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary-heading tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-1.5 font-medium text-sm text-gray-500">
            {t("subtitle", { count: leaderboard.length })}
          </p>
        </div>
        {activeTab === "prizes" && (
          <button
            onClick={() => setShowPrizeForm(true)}
            className="flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 hover:shadow-lg"
          >
            <Plus size={18} /> {t("addPrizeBtn")}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: "ranking", label: t("tabs.ranking"), icon: Users },
          { key: "prizes", label: t("tabs.prizes"), icon: Gift },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as "ranking" | "prizes")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
              activeTab === key
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Ranking ── */}
      {activeTab === "ranking" && (
        <TableContainer className="animate-fade-in">
          {isLoadingLB ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>{t("rankingTable.rank")}</TableHead>
                  <TableHead>{t("rankingTable.user")}</TableHead>
                  <TableHead>{t("rankingTable.points")}</TableHead>
                  <TableHead>{t("rankingTable.prize")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry: LeaderboardEntry) => {
                  const prizeName =
                    entry.rank <= 3
                      ? currentPrizeConfig?.nationalVoucher?.name
                      : currentPrizeConfig?.provincialVoucher?.name;
                  const isTop3 = entry.rank <= 3;

                  return (
                    <TableRow
                      key={entry.userId}
                      className={
                        isTop3 ? "bg-amber-50/20 hover:bg-amber-50/40" : ""
                      }
                    >
                      {/* Rank */}
                      <TableCell>
                        <div className="flex items-center justify-center w-8">
                          <RankBadge rank={entry.rank} />
                        </div>
                      </TableCell>
                      {/* User */}
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm shadow-sm ${
                              isTop3
                                ? "bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800"
                                : "bg-gradient-to-br from-primary-100 to-primary-200 text-primary-800"
                            }`}
                          >
                            {entry.displayName?.[0] ?? "?"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-content">
                              {entry.displayName}
                            </p>
                            {entry.province && (
                              <p className="mt-0.5 text-xs font-medium text-gray-500">
                                {entry.province}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      {/* Points */}
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-sm font-bold text-primary-700">
                          <Trophy size={16} className="text-amber-500" />
                          {entry.weeklyPoints.toLocaleString()} GP
                        </span>
                      </TableCell>
                      {/* Prize */}
                      <TableCell>
                        {prizeName ? (
                          <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700 border border-primary-200/50 shadow-sm">
                            <Gift size={12} className="text-primary-600" />
                            {prizeName}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-gray-400">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}

      {/* ── Tab: Prizes config ── */}
      {activeTab === "prizes" && (
        <TableContainer className="animate-fade-in">
          {isLoadingPrizes ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>{t("prizesTable.weekStartDate")}</TableHead>
                    <TableHead>{t("prizesTable.lockAt")}</TableHead>
                    <TableHead>{t("prizesTable.status")}</TableHead>
                    <TableHead>{t("prizesTable.nationalVoucher")}</TableHead>
                    <TableHead>{t("prizesTable.provincialVoucher")}</TableHead>
                    <TableHead>{t("prizesTable.reserved")}</TableHead>
                    <TableHead className="text-right">
                      {t("prizesTable.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prizes.map((prize: LeaderboardPrize) => (
                    <TableRow key={prize.id}>
                      <TableCell>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatDate(prize.weekStartDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-gray-700">
                          {formatDateTime(prize.lockAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Tag size="sm" tone={getPrizeStatusTone(prize.status)}>
                          {t(`statuses.${prize.status}`)}
                        </Tag>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-bold text-gray-900">
                          {prize.nationalVoucher?.name ?? "-"}
                        </p>
                        {prize.nationalVoucher?.partnerName && (
                          <p className="mt-1 text-xs font-medium text-gray-500">
                            {prize.nationalVoucher.partnerName}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-bold text-gray-900">
                          {prize.provincialVoucher?.name ?? "-"}
                        </p>
                        {prize.provincialVoucher?.partnerName && (
                          <p className="mt-1 text-xs font-medium text-gray-500">
                            {prize.provincialVoucher.partnerName}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs font-semibold text-gray-700">
                          <p>
                            N: {prize.nationalReservedCount.toLocaleString()}
                          </p>
                          <p>
                            P: {prize.provincialReservedCount.toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip content={t("distribute")}>
                            <button
                              onClick={() => handleDistributePrize(prize.id)}
                              disabled={
                                prize.status !== "CONFIGURED" ||
                                (isDistributing && distributingId === prize.id)
                              }
                              className="flex items-center gap-1.5 rounded-2xl bg-primary-50 px-3.5 py-2 text-xs font-bold text-primary-700 hover:bg-primary-100 disabled:opacity-50 transition-colors"
                            >
                              {isDistributing && distributingId === prize.id ? (
                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                              ) : (
                                <Send size={14} />
                              )}
                              {t("distribute")}
                            </button>
                          </Tooltip>

                          <Popconfirm
                            title={t("delete")}
                            description={t("delete")}
                            confirmText={t("delete")}
                            danger
                            disabled={
                              prize.status === "DISTRIBUTED" ||
                              (isDeleting && deletingId === prize.id)
                            }
                            onConfirm={() => handleDeletePrize(prize.id)}
                          >
                            <button className="rounded-2xl bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50">
                              <Trash2 size={18} />
                            </button>
                          </Popconfirm>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {!isLoadingPrizes && prizes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mb-4 animate-float">
                    <Gift size={32} className="text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("emptyPrizes")}
                  </h3>
                  <p className="mt-1.5 text-sm text-gray-500 mb-6">
                    {t("emptyPrizesDescription")}
                  </p>
                  <button
                    onClick={() => setShowPrizeForm(true)}
                    className="flex items-center gap-2 rounded-2xl bg-primary-50 px-5 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-100"
                  >
                    <Plus size={16} /> {t("addFirstPrize")}
                  </button>
                </div>
              )}
            </>
          )}
        </TableContainer>
      )}

      {/* Prize form modal */}
      {showPrizeForm && (
        <PrizeFormModal
          vouchers={activeVouchers.map((v) => ({
            id: v.id,
            name: v.name,
          }))}
          onClose={() => setShowPrizeForm(false)}
          onSubmit={handleCreatePrize}
          isPending={isCreatingPrize}
        />
      )}
    </div>
  );
}
