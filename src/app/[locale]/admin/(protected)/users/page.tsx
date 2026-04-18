"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Lock,
  Unlock,
  UserCog,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import { UserRole, UserStatus } from "@/types/user.type";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  ctv_status: string;
  joined: string;
  points: number;
  posts: number;
}

const MOCK_USERS: AdminUser[] = [
  {
    id: "u1",
    name: "Nguyễn Nhã Uyên",
    email: "uyen@greenify.vn",
    role: "USER",
    status: "ACTIVE",
    ctv_status: "ELIGIBLE",
    joined: "10/01/2026",
    points: 290,
    posts: 12,
  },
  {
    id: "u2",
    name: "Trần Minh Thiện",
    email: "thien@dev.vn",
    role: "CTV",
    status: "ACTIVE",
    ctv_status: "ACTIVE_CTV",
    joined: "15/01/2026",
    points: 580,
    posts: 34,
  },
  {
    id: "u3",
    name: "Green Future VN",
    email: "ngo@greenfuture.vn",
    role: "NGO",
    status: "ACTIVE",
    ctv_status: "NOT_ELIGIBLE",
    joined: "20/01/2026",
    points: 0,
    posts: 0,
  },
  {
    id: "u4",
    name: "Lê Văn A",
    email: "lva@email.com",
    role: "USER",
    status: "SUSPENDED",
    ctv_status: "NOT_ELIGIBLE",
    joined: "01/02/2026",
    points: 40,
    posts: 3,
  },
  {
    id: "u5",
    name: "Phạm Bảo Châu",
    email: "chau@mail.com",
    role: "USER",
    status: "ACTIVE",
    ctv_status: "PENDING_UPGRADE",
    joined: "14/02/2026",
    points: 320,
    posts: 21,
  },
  {
    id: "u6",
    name: "EcoViet Club",
    email: "ecoviet@ngo.vn",
    role: "NGO",
    status: "ACTIVE",
    ctv_status: "NOT_ELIGIBLE",
    joined: "03/03/2026",
    points: 0,
    posts: 0,
  },
  {
    id: "u7",
    name: "Hoàng Minh",
    email: "hminh@gmail.com",
    role: "USER",
    status: "FLAGGED",
    ctv_status: "NOT_ELIGIBLE",
    joined: "20/03/2026",
    points: 10,
    posts: 1,
  },
  {
    id: "u8",
    name: "Thu Hà",
    email: "hatu@work.vn",
    role: "USER",
    status: "ACTIVE",
    ctv_status: "NOT_ELIGIBLE",
    joined: "01/04/2026",
    points: 75,
    posts: 5,
  },
];

const ROLE_OPTS: UserRole[] = ["USER", "CTV", "NGO", "ADMIN"];

const ROLE_CLS: Record<UserRole, string> = {
  USER: "bg-gray-100 text-gray-600",
  CTV: "bg-blue-100 text-blue-700",
  NGO: "bg-violet-100 text-violet-700",
  ADMIN: "bg-amber-100 text-amber-700",
};

const STATUS_CLS: Record<UserStatus, string> = {
  ACTIVE: "bg-primary-100 text-primary-700",
  SUSPENDED: "bg-rose-100 text-rose-600",
  FLAGGED: "bg-orange-100 text-orange-600",
  DELETED: "bg-gray-100 text-gray-500",
};

const STATUS_LABEL: Record<UserStatus, string> = {
  ACTIVE: "Hoạt động",
  SUSPENDED: "Tạm khóa",
  FLAGGED: "Gắn cờ",
  DELETED: "Đã xóa",
};

/* ─── role change modal ───────────────────────────── */
function RoleModal({
  user,
  onClose,
  onSave,
}: {
  user: AdminUser;
  onClose: () => void;
  onSave: (role: UserRole) => void;
}) {
  const [selected, setSelected] = useState<UserRole>(user.role);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-body text-lg font-semibold text-forest">
            Đổi vai trò
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-4 font-body text-sm text-gray-500">
          Người dùng: <strong className="text-forest">{user.name}</strong>
        </p>
        <div className="space-y-2">
          {ROLE_OPTS.map((role) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 font-body text-sm transition-all ${
                selected === role
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-gray-100 hover:border-primary-200 hover:bg-primary-50/50"
              }`}
            >
              <span>{role}</span>
              {selected === role && (
                <Check size={16} className="text-primary-600" />
              )}
            </button>
          ))}
        </div>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 font-body text-sm text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(selected)}
            className="flex-1 rounded-xl bg-primary-600 py-2.5 font-body text-sm font-semibold text-card hover:bg-primary-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────── */
export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRole] = useState<UserRole | "ALL">("ALL");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : u,
      ),
    );
  };

  const changeRole = (id: string, role: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-3xl text-primary-heading">Người dùng</h2>
          <p className="mt-1 font-body text-sm text-gray-500">
            {users.length} tài khoản đăng ký
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-11 pr-4 font-body text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          {(["ALL", ...ROLE_OPTS] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 font-body text-xs font-medium transition-all ${
                roleFilter === r
                  ? "bg-primary-600 text-card"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {r === "ALL" ? "Tất cả" : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50">
                {[
                  "Người dùng",
                  "Email",
                  "Vai trò",
                  "Trạng thái",
                  "Điểm GP",
                  "Bài đăng",
                  "Hành động",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left font-body text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  {/* Name + avatar */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 font-body text-sm font-bold text-primary-700">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium text-forest">
                          {user.name}
                        </p>
                        <p className="font-body text-xs text-gray-400">
                          {user.joined}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="px-5 py-4 font-body text-sm text-gray-600">
                    {user.email}
                  </td>
                  {/* Role */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 font-body text-xs font-semibold ${ROLE_CLS[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 font-body text-xs font-semibold ${STATUS_CLS[user.status]}`}
                    >
                      {STATUS_LABEL[user.status]}
                    </span>
                  </td>
                  {/* Points */}
                  <td className="px-5 py-4 font-body text-sm text-gray-700">
                    {user.points}
                  </td>
                  {/* Posts */}
                  <td className="px-5 py-4 font-body text-sm text-gray-700">
                    {user.posts}
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {/* Lock/Unlock */}
                      <button
                        onClick={() => toggleStatus(user.id)}
                        title={
                          user.status === "ACTIVE"
                            ? "Khóa tài khoản"
                            : "Mở khóa"
                        }
                        className={`rounded-lg p-2 transition-colors ${
                          user.status === "ACTIVE"
                            ? "text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                            : "text-rose-500 hover:bg-rose-50"
                        }`}
                      >
                        {user.status === "ACTIVE" ? (
                          <Lock size={15} />
                        ) : (
                          <Unlock size={15} />
                        )}
                      </button>
                      {/* Change role */}
                      <button
                        onClick={() => setEditingUser(user)}
                        title="Đổi vai trò"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                      >
                        <UserCog size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-4">
            <span className="font-body text-sm text-gray-500">
              {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border p-2 text-gray-500 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-border p-2 text-gray-500 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role modal */}
      {editingUser && (
        <RoleModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(role) => changeRole(editingUser.id, role)}
        />
      )}
    </div>
  );
}
