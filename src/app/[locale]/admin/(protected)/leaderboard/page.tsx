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
import {
  useWeeklyLeaderboard,
  useAdminPrizes,
} from "@/hooks/queries/useAdmin";
import {
  useCreatePrize,
  useDistributePrize,
  useDeletePrize,
} from "@/hooks/mutations/useAdmin";
import type { CreateLeaderboardPrizeRequest } from "@/types/gamification.types";
import { LeaderboardScope } from "@/types/gamification.types";
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
// ── Rank medal ─────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={20} className="text-amber-500 drop-shadow-sm" />;
  if (rank === 2) return <Medal size={20} className="text-gray-400 drop-shadow-sm" />;
  if (rank === 3) return <Medal size={20} className="text-amber-700 drop-shadow-sm" />;
  return (
    <span className="w-5 text-center text-sm font-bold text-gray-400">
      #{rank}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function LeaderboardAdminPage() {
  const t = useTranslations("admin.leaderboard");

  const { data: leaderboard = [], isLoading: isLoadingLB } = useWeeklyLeaderboard();
  const { data: prizes = [], isLoading: isLoadingPrizes } = useAdminPrizes();
  
  const { data: vouchersData } = useAvailableVouchers();
  const vouchers = Array.isArray(vouchersData) ? vouchersData : (vouchersData?.content ?? []);

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

  const activeVouchers = vouchers.filter((v: any) => v.status === "ACTIVE");

  const handleCreatePrize = (data: CreateLeaderboardPrizeRequest) => {
    createPrize(data, { onSuccess: () => setShowPrizeForm(false) });
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
                {leaderboard.map((entry: any) => {
                  const prize = prizes.find(
                    (p: any) =>
                      p.rank === entry.rank &&
                      p.scope === LeaderboardScope.NATIONAL,
                  );
                  const isTop3 = entry.rank <= 3;

                  return (
                    <TableRow
                      key={entry.userId}
                      className={isTop3 ? "bg-amber-50/20 hover:bg-amber-50/40" : ""}
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
                        {prize ? (
                          <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700 border border-primary-200/50 shadow-sm">
                            <Gift size={12} className="text-primary-600" />
                            {prize.voucherTemplate?.name ??
                              prize.voucherTemplateId}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-gray-400">—</span>
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
                    <TableHead>{t("prizesTable.rank")}</TableHead>
                    <TableHead>{t("prizesTable.scope")}</TableHead>
                    <TableHead>{t("prizesTable.voucher")}</TableHead>
                    <TableHead>{t("prizesTable.quantity")}</TableHead>
                    <TableHead className="text-right">{t("prizesTable.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prizes.map((prize: any) => (
                    <TableRow key={prize.id}>
                      {/* Rank */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <RankBadge rank={prize.rank} />
                          <span className="text-sm font-bold text-gray-900">
                            {t("rankingTable.rank")} {prize.rank}
                          </span>
                        </div>
                      </TableCell>
                      {/* Scope */}
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold border ${
                            prize.scope === LeaderboardScope.NATIONAL
                              ? "bg-blue-50 text-blue-700 border-blue-200/50"
                              : "bg-violet-50 text-violet-700 border-violet-200/50"
                          }`}
                        >
                          {t(`scopes.${prize.scope}`)}
                        </span>
                      </TableCell>
                      {/* Voucher */}
                      <TableCell>
                        <p className="text-sm font-bold text-gray-900">
                          {prize.voucherTemplate?.name ?? prize.voucherTemplateId}
                        </p>
                        {prize.voucherTemplate?.partnerName && (
                          <p className="mt-1 text-xs font-medium text-gray-500">
                            {prize.voucherTemplate.partnerName}
                          </p>
                        )}
                      </TableCell>
                      {/* Quantity */}
                      <TableCell>
                        <span className="flex w-fit items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1 text-xs font-bold text-gray-700 border border-gray-200/50">
                          <Gift size={14} className="text-primary-500" />
                          {prize.quantity}
                        </span>
                      </TableCell>
                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {/* Distribute */}
                          <button
                            onClick={() => distributePrize(prize.id)}
                            disabled={isDistributing && distributingId === prize.id}
                            className="flex items-center gap-1.5 rounded-2xl bg-primary-50 px-3.5 py-2 text-xs font-bold text-primary-700 hover:bg-primary-100 disabled:opacity-50 transition-colors"
                            title={t("distribute")}
                          >
                            {isDistributing && distributingId === prize.id ? (
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                            ) : (
                              <Send size={14} />
                            )}
                            {t("distribute")}
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => deletePrize(prize.id)}
                            disabled={isDeleting && deletingId === prize.id}
                            className="rounded-2xl bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                            title={t("delete")}
                          >
                            <Trash2 size={18} />
                          </button>
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
                  <h3 className="text-lg font-semibold text-gray-900">{t("emptyPrizes")}</h3>
                  <p className="mt-1.5 text-sm text-gray-500 mb-6">
                    Hệ thống chưa thiết lập phần thưởng cho chu kỳ này.
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
          vouchers={activeVouchers.map((v: any) => ({
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
