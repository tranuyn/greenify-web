"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Lock, Unlock, UserCog, Eye } from "lucide-react";
import { useAdminUsers } from "@/hooks/queries/useAdmin";
import {
  useSuspendUser,
  useUnsuspendUser,
  useUpdateUserRole,
  useDemoteCTV,
} from "@/hooks/mutations/useAdmin";
import { ADMIN_USER_STATUS_FILTERS, USER_STATUS } from "@/types/user.type";
import type {
  AdminUserDto,
  AdminUserStatusFilter,
  UserRole,
  UserStatus,
} from "@/types/user.type";

import { SuspendModal } from "@/components/admin/users/SuspendModal";
import { RoleModal } from "@/components/admin/users/RoleModal";
import { UserDetailModal } from "@/components/admin/users/UserDetailModal";
import { UserAvatar } from "@/components/admin/users/UserAvatar";
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
import { TablePagination } from "@/components/admin/ui/table-pagination";
import { SearchBar } from "@/components/admin/ui/search-bar";
import { ChipFilterGroup } from "@/components/admin/ui/filter-chip-group";

const ROLE_TONE: Record<string, "default" | "info" | "warning"> = {
  USER: "default",
  CTV: "info",
  NGO: "info",
  ADMIN: "warning",
};

const STATUS_TONE: Record<
  UserStatus,
  "success" | "danger" | "warning" | "default"
> = {
  [USER_STATUS.ACTIVE]: "success",
  [USER_STATUS.SUSPENDED]: "danger",
  [USER_STATUS.FLAGGED]: "warning",
  [USER_STATUS.DELETED]: "default",
};

const PAGE_SIZE = 5;

export default function UsersPage() {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("common");

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AdminUserStatusFilter>("ALL");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const [suspendTarget, setSuspendTarget] = useState<AdminUserDto | null>(null);
  const [roleTarget, setRoleTarget] = useState<AdminUserDto | null>(null);
  const [detailUser, setDetailUser] = useState<AdminUserDto | null>(null);

  const { data, isLoading, isFetching, refetch } = useAdminUsers({
    page,
    size: PAGE_SIZE,
    search: appliedSearch || undefined,
    status: statusFilter,
    role: roleFilter,
  });

  const handleSearch = (submittedSearch?: string) => {
    const nextSearch = (submittedSearch ?? search).trim();
    const isSameSearch = nextSearch === appliedSearch;

    setPage(1);

    if (isSameSearch) {
      void refetch();
      return;
    }

    setAppliedSearch(nextSearch);
  };

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
        <p className="mt-1 font-medium text-sm text-gray-500">
          {totalElements > 0
            ? t("subtitle", { count: totalElements })
            : t("loading")}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 3xl:flex-row 3xl:items-end">
        {/* Search */}
        <div className="space-y-2 2xl:flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {t("filters.search")}
          </p>
          <SearchBar
            value={search}
            onValueChange={setSearch}
            onSearch={handleSearch}
            placeholder={t("searchPlaceholder")}
            buttonLabel={t("searchButton")}
            loading={isFetching}
          />
        </div>

        {/* Status filter */}
        <div className="space-y-2 2xl:flex-1">
          <ChipFilterGroup
            label={t("filters.status")}
            value={statusFilter}
            onChange={(s) => {
              setStatusFilter(s);
              setPage(1);
            }}
            options={ADMIN_USER_STATUS_FILTERS.map((s) => ({
              value: s,
              label: tCommon(`status.${s}`),
            }))}
            layout="scroll"
            size="md"
          />
        </div>

        {/* Role filter */}
        <div className="space-y-2 2xl:flex-1">
          <ChipFilterGroup
            label={t("filters.role")}
            value={roleFilter}
            onChange={(role) => {
              setRoleFilter(role);
              setPage(1);
            }}
            options={(["ALL", "USER", "CTV", "NGO", "ADMIN"] as const).map(
              (role) => ({
                value: role,
                label:
                  role === "ALL" ? tCommon("status.ALL") : tCommon(`roles.${role}`),
              }),
            )}
            layout="scroll"
            size="md"
          />
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
                <TableHead>{t("table.user")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.role")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.points")}</TableHead>
                <TableHead>{t("table.posts")}</TableHead>
                <TableHead className="text-right">
                  {t("table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const sLabel = tCommon(`status.${user.status}`);
                const sTone = STATUS_TONE[user.status];

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
                        <UserAvatar
                          name={user.name}
                          avatarUrl={user.avatarUrl}
                          sizeClassName="h-10 w-10"
                          textClassName="text-sm"
                          className="shrink-0"
                        />
                        <div>
                          <p className="text-sm font-semibold text-primary-content transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs font-medium text-foreground/60 group-hover:text-foreground transition-colors tracking-wide mt-0.5">
                            {new Date(user.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
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
                          <Tag
                            key={role}
                            size="sm"
                            tone={ROLE_TONE[role] ?? "default"}
                            // className="uppercase"
                          >
                            {tCommon(`roles.${role}`)}
                          </Tag>
                        ))}
                      </div>
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                      <Tag size="sm" tone={sTone}>
                        {sLabel}
                      </Tag>
                    </TableCell>
                    {/* Points */}
                    <TableCell className="font-medium text-foreground/60 group-hover:text-foreground">
                      {user.availableGreenPoints.toLocaleString()}
                    </TableCell>
                    {/* Posts */}
                    <TableCell className="font-medium text-foreground/60 group-hover:text-foreground">
                      {user.greenPostCount.toLocaleString()}
                    </TableCell>
                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip
                          content={t("tooltip.viewDetails") || "Details"}
                        >
                          <button
                            onClick={() => setDetailUser(user)}
                            className="rounded-xl bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
                          >
                            <Eye size={16} />
                          </button>
                        </Tooltip>

                        {/* Suspend / Unsuspend */}
                        {user.status === "ACTIVE" ||
                        user.status === "FLAGGED" ? (
                          <Tooltip content={t("tooltip.suspend")}>
                            <button
                              onClick={() => setSuspendTarget(user)}
                              className="rounded-xl bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-rose-50 hover:text-rose-500"
                            >
                              <Lock size={16} />
                            </button>
                          </Tooltip>
                        ) : user.status === "SUSPENDED" ? (
                          <Popconfirm
                            title={t("tooltip.unsuspend")}
                            confirmText={t("tooltip.unsuspend")}
                            onConfirm={() => handleUnsuspend(user.id)}
                            disabled={isUnsuspending}
                          >
                            <button className="rounded-xl p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 disabled:opacity-50 transition-colors">
                              <Unlock size={16} />
                            </button>
                          </Popconfirm>
                        ) : null}

                        {/* Change role */}
                        <Tooltip content={t("tooltip.changeRole")}>
                          <button
                            onClick={() => setRoleTarget(user)}
                            className="rounded-xl p-2 bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          >
                            <UserCog size={16} />
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

        {/* Empty */}
        {!isLoading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 mb-4 animate-float">
              <UserCog size={32} className="text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground/70">
              {t("empty")}
            </h3>
          </div>
        )}

        {/* Pagination */}
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          summary={t("pagination", {
            page,
            total: totalPages,
            count: totalElements,
          })}
          maxVisible={5}
        />
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
