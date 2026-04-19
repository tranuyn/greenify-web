"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Lock,
  Unlock,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";
import { useAdminUsers } from "@/hooks/queries/useAdmin";
import {
  useSuspendUser,
  useUnsuspendUser,
  useUpdateUserRole,
  useDemoteCTV,
} from "@/hooks/mutations/useAdmin";
import type { AdminUserDto, UserRole, UserStatus } from "@/types/user.type";

import { SuspendModal } from "@/components/admin/users/SuspendModal";
import { RoleModal } from "@/components/admin/users/RoleModal";
import { UserDetailModal } from "@/components/admin/users/UserDetailModal";
import {
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/admin/ui/table";

const ROLE_CLS: Record<string, string> = {
  USER: "bg-gray-100 text-gray-600 border border-border",
  CTV: "bg-blue-50 text-blue-700 border border-blue-200/50",
  NGO: "bg-violet-50 text-violet-700 border border-violet-200/50",
  ADMIN: "bg-amber-50 text-amber-700 border border-amber-200/50",
};

const STATUS_CLS: Record<string, string> = {
  ACTIVE: "bg-primary-100 text-primary-content",
  SUSPENDED: "bg-rose-100 text-rose-600",
  FLAGGED: "bg-orange-100 text-orange-600",
  DELETED: "bg-gray-100 text-gray-500",
};

const PAGE_SIZE = 5;

export default function UsersPage() {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("common");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const [suspendTarget, setSuspendTarget] = useState<AdminUserDto | null>(null);
  const [roleTarget, setRoleTarget] = useState<AdminUserDto | null>(null);
  const [detailUser, setDetailUser] = useState<AdminUserDto | null>(null);

  // Debounce search — 400ms
  const handleSearchChange = (v: string) => {
    setSearch(v);
    clearTimeout((handleSearchChange as any)._t);
    (handleSearchChange as any)._t = setTimeout(() => {
      setDebouncedSearch(v);
      setPage(1);
    }, 400);
  };

  const { data, isLoading, isFetching } = useAdminUsers({
    page,
    size: PAGE_SIZE,
    name: debouncedSearch || undefined,
    status: statusFilter,
  });

  const users = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;

  // Mutations
  const { mutate: suspendUser, isPending: isSuspending } = useSuspendUser();
  const { mutate: unsuspendUser, isPending: isUnsuspending } =
    useUnsuspendUser();
  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { mutate: demoteCTV, isPending: isDemoting } = useDemoteCTV();

  const handleSuspend = (reason: string) => {
    if (!suspendTarget) return;
    suspendUser(
      { id: suspendTarget.id, payload: { reason } },
      { onSuccess: () => setSuspendTarget(null) },
    );
  };

  const handleUnsuspend = (id: string) => {
    unsuspendUser(id);
  };

  const handleRoleSave = (role: UserRole) => {
    if (!roleTarget) return;
    const isCTVDemotion = roleTarget.roles.includes("CTV") && role !== "CTV";

    if (isCTVDemotion) {
      demoteCTV(roleTarget.id, { onSuccess: () => setRoleTarget(null) });
    } else {
      updateRole(
        { id: roleTarget.id, payload: { roleName: role } },
        { onSuccess: () => setRoleTarget(null) },
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-primary-heading tracking-tight">{t("title")}</h2>
        <p className="mt-1 font-medium text-sm text-gray-500">
          {totalElements > 0 ? t("subtitle", { count: totalElements }) : t("loading")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-2xl border border-border bg-card py-2.5 pl-11 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all shadow-sm"
          />
          {isFetching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
          )}
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 scrollbar-hide overflow-x-auto">
          {(["ALL", "ACTIVE", "SUSPENDED", "FLAGGED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                statusFilter === s
                  ? "border-primary-500 bg-primary-600 text-white shadow-sm shadow-primary-600/20"
                  : "border-border bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tCommon(`status.${s}`)}
            </button>
          ))}
        </div>
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
                <TableHead>{t('table.user')}</TableHead>
                <TableHead>{t('table.email')}</TableHead>
                <TableHead>{t('table.role')}</TableHead>
                <TableHead>{t('table.status')}</TableHead>
                <TableHead>{t('table.points')}</TableHead>
                <TableHead>{t('table.posts')}</TableHead>
                <TableHead className="text-right">{t('table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const sLabel = tCommon(`status.${user.status}`);
                const sCls = STATUS_CLS[user.status] || STATUS_CLS.ACTIVE;
                
                return (
                  <TableRow
                    key={user.id}
                    className="hover:bg-primary-300/20 group"
                  >
                    {/* Name */}
                    <TableCell>
                      <button
                        onClick={() => setDetailUser(user)}
                        className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-content">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-primary-content transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs font-medium text-foreground/60 group-hover:text-foreground transition-colors tracking-wide mt-0.5">
                            {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </button>
                    </TableCell>
                    {/* Email */}
                    <TableCell className="font-medium text-foreground/60 group-hover:text-foreground ">
                      {user.email}
                    </TableCell>
                    {/* Roles */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {user.roles.map((role) => (
                          <span
                            key={role}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${ROLE_CLS[role] ?? "bg-gray-100 text-gray-600"}`}
                          >
                            {tCommon(`roles.${role}`)}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${sCls}`}
                      >
                        {sLabel}
                      </span>
                    </TableCell>
                    {/* Points */}
                    <TableCell className="font-medium text-gray-700">
                      {user.availableGreenPoints.toLocaleString()}
                    </TableCell>
                    {/* Posts */}
                    <TableCell className="font-medium text-gray-700">
                      {user.greenPostCount.toLocaleString()}
                    </TableCell>
                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                         <button
                           onClick={() => setDetailUser(user)}
                           title={t("tooltip.viewDetails") || "Xem chi tiết"}
                           className="rounded-xl bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
                         >
                           <Eye size={16} />
                         </button>

                        {/* Suspend / Unsuspend */}
                        {user.status === "ACTIVE" ||
                        user.status === "FLAGGED" ? (
                          <button
                            onClick={() => setSuspendTarget(user)}
                            title={t("tooltip.suspend")}
                            className="rounded-xl bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-500"
                          >
                            <Lock size={16} />
                          </button>
                        ) : user.status === "SUSPENDED" ? (
                          <button
                            onClick={() => handleUnsuspend(user.id)}
                            disabled={isUnsuspending}
                            title={t("tooltip.unsuspend")}
                            className="rounded-xl p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 disabled:opacity-50 transition-colors"
                          >
                            <Unlock size={16} />
                          </button>
                        ) : null}

                        {/* Change role */}
                        <button
                          onClick={() => setRoleTarget(user)}
                          title={t("tooltip.changeRole")}
                          className="rounded-xl p-2 bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <UserCog size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Empty */}
        {!isLoading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mb-4 animate-float">
               <UserCog size={32} className="text-primary-400" />
             </div>
            <h3 className="text-lg font-semibold text-gray-900">{t("empty")}</h3>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-table-border px-6 py-4 bg-table-header-bg">
            <span className="text-sm font-medium text-table-header-text">
              {t("pagination", { page, total: totalPages, count: totalElements })}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              {/* Page numbers — hiện tối đa 5 page */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
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
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </TableContainer>

      {/* Modals */}
      {suspendTarget && (
        <SuspendModal
          user={suspendTarget}
          onClose={() => setSuspendTarget(null)}
          onConfirm={handleSuspend}
          isPending={isSuspending}
        />
      )}

      {roleTarget && (
        <RoleModal
          user={roleTarget}
          onClose={() => setRoleTarget(null)}
          onSave={handleRoleSave}
          isPending={isUpdatingRole || isDemoting}
        />
      )}

      {detailUser && (
        <UserDetailModal
           user={detailUser}
           onClose={() => setDetailUser(null)}
        />
      )}
    </div>
  );
}
