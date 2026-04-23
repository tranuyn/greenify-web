"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Leaf,
  MapPin,
  Coins,
  X,
  Check,
} from "lucide-react";
import {
  useCreateActionType,
  useUpdateActionType,
} from "@/hooks/mutations/useAdmin";
import type {
  GreenActionType,
  CreateActionTypeRequest,
} from "@/types/action.types";
import { useActionTypes } from "@/hooks/queries/usePosts";
import { ChipFilterGroup } from "@/components/admin/ui/filter-chip-group";
import {
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/admin/ui/table";

// ── Group badge color map ──────────────────────────────────────
// Tự động gán màu theo groupName hash — không hardcode
function getGroupColor(groupName: string): string {
  const colors = [
    "bg-primary-100 text-primary-content",
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];
  let hash = 0;
  for (let i = 0; i < groupName.length; i++) {
    hash = (hash * 31 + groupName.charCodeAt(i)) % colors.length;
  }
  return colors[hash];
}

// ── Form Modal ─────────────────────────────────────────────────
function ActionTypeFormModal({
  initial,
  onClose,
  onSubmit,
  isPending,
}: {
  initial?: GreenActionType | null;
  onClose: () => void;
  onSubmit: (data: CreateActionTypeRequest) => void;
  isPending: boolean;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<CreateActionTypeRequest>({
    groupName: initial?.groupName ?? "",
    actionName: initial?.actionName ?? "",
    suggestedPoints: initial?.suggestedPoints ?? 10,
    locationRequired: initial?.locationRequired ?? false,
    isActive: initial?.isActive ?? true,
  });

  const set = <K extends keyof CreateActionTypeRequest>(
    k: K,
    v: CreateActionTypeRequest[K],
  ) => setForm((p) => ({ ...p, [k]: v }));

  const canSubmit =
    form.groupName.trim().length > 0 &&
    form.actionName.trim().length > 0 &&
    form.suggestedPoints > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-primary-heading">
            {isEdit ? "Chỉnh sửa loại hành động" : "Thêm loại hành động mới"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-gray-100"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Group name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Nhóm hành động *
            </label>
            <input
              value={form.groupName}
              onChange={(e) => set("groupName", e.target.value)}
              placeholder="Ví dụ: Tái chế, Giảm nhựa, Dọn dẹp..."
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
            <p className="mt-1 text-xs text-gray-400">
              Dùng để nhóm các hành động cùng chủ đề lại với nhau.
            </p>
          </div>

          {/* Action name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tên hành động *
            </label>
            <input
              value={form.actionName}
              onChange={(e) => set("actionName", e.target.value)}
              placeholder="Ví dụ: Phân loại rác tại nhà..."
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Points */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Điểm GP đề xuất *
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={1000}
                value={form.suggestedPoints}
                onChange={(e) => set("suggestedPoints", Number(e.target.value))}
                className="w-full rounded-xl border border-border py-2.5 pl-4 pr-14 text-sm outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-content">
                GP
              </span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 rounded-2xl bg-card p-4">
            {/* Location required */}
            <button
              type="button"
              onClick={() => set("locationRequired", !form.locationRequired)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    form.locationRequired ? "bg-primary-100" : "bg-gray-200"
                  }`}
                >
                  <MapPin
                    size={15}
                    className={
                      form.locationRequired
                        ? "text-primary-content"
                        : "text-gray-400"
                    }
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-primary-content">
                    Bắt buộc vị trí
                  </p>
                  <p className="text-xs text-gray-400">
                    Yêu cầu GPS khi đăng bài
                  </p>
                </div>
              </div>
              <div
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.locationRequired ? "bg-primary-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.locationRequired ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>

            {/* Is active */}
            <button
              type="button"
              onClick={() => set("isActive", !form.isActive)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    form.isActive ? "bg-primary-100" : "bg-gray-200"
                  }`}
                >
                  <Leaf
                    size={15}
                    className={
                      form.isActive ? "text-primary-content" : "text-gray-400"
                    }
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-primary-content">Kích hoạt</p>
                  <p className="text-xs text-gray-400">
                    Hiển thị cho người dùng
                  </p>
                </div>
              </div>
              <div
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.isActive ? "bg-primary-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.isActive ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={() => canSubmit && onSubmit(form)}
            disabled={isPending || !canSubmit}
            className="flex-1 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {isPending
              ? "Đang lưu..."
              : isEdit
                ? "Lưu thay đổi"
                : "Thêm hành động"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function ActionTypesAdminPage() {
  const { data: actionTypes = [], isLoading } = useActionTypes();
  const { mutate: createAction, isPending: isCreating } = useCreateActionType();
  const { mutate: updateAction, isPending: isUpdating } = useUpdateActionType();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<GreenActionType | null>(null);
  const [groupFilter, setGroupFilter] = useState<string>("ALL");
  const [showInactive, setShowInactive] = useState(false);

  // Lấy tất cả groups để render filter chips
  const groups = [
    "ALL",
    ...Array.from(new Set(actionTypes.map((a) => a.groupName))).sort(),
  ];

  const filtered = actionTypes.filter((a) => {
    const matchGroup = groupFilter === "ALL" || a.groupName === groupFilter;
    const matchActive = showInactive ? true : a.isActive;
    return matchGroup && matchActive;
  });

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const handleSubmit = (data: CreateActionTypeRequest) => {
    if (editTarget) {
      updateAction(
        { id: editTarget.id, payload: data },
        { onSuccess: closeForm },
      );
    } else {
      createAction(data, { onSuccess: closeForm });
    }
  };

  const handleToggleActive = (action: GreenActionType) => {
    updateAction({
      id: action.id,
      payload: { isActive: !action.isActive },
    });
  };

  // Stats
  const totalActive = actionTypes.filter((a) => a.isActive).length;
  const totalInactive = actionTypes.filter((a) => !a.isActive).length;
  const totalGroups = new Set(actionTypes.map((a) => a.groupName)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary-heading">
            Loại hành động xanh
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {totalActive} đang hoạt động · {totalInactive} tạm dừng ·{" "}
            {totalGroups} nhóm
          </p>
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Plus size={16} /> Thêm mới
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Tổng loại hành động",
            value: actionTypes.length,
            color: "bg-primary-50 text-primary-content",
          },
          {
            label: "Đang hoạt động",
            value: totalActive,
            color: "bg-primary-50 text-primary-content",
          },
          {
            label: "Số nhóm",
            value: totalGroups,
            color: "bg-blue-50 text-blue-700",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div
              className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}
            >
              <Leaf size={18} />
            </div>
            <div className="text-2xl font-bold text-primary-heading">
              {s.value}
            </div>
            <div className="mt-0.5 text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Group filter chips */}
        <ChipFilterGroup
          value={groupFilter}
          onChange={setGroupFilter}
          options={groups.map((g) => ({
            value: g,
            label: g === "ALL" ? "Tất cả nhóm" : g,
          }))}
          layout="wrap"
          size="sm"
        />

        {/* Show inactive toggle */}
        <button
          onClick={() => setShowInactive((p) => !p)}
          className={`ml-auto flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
            showInactive
              ? "border-amber-400 bg-amber-50 text-amber-700"
              : "border-border bg-white text-gray-500"
          }`}
        >
          {showInactive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          Hiện đã tắt
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {[
                  "Nhóm",
                  "Tên hành động",
                  "Điểm GP",
                  "Vị trí",
                  "Trạng thái",
                  "Hành động",
                ].map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((action) => (
                <TableRow
                  key={action.id}
                  className={!action.isActive ? "opacity-50 group" : "group"}
                >
                  {/* Group */}
                  <TableCell>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getGroupColor(action.groupName)}`}
                    >
                      {action.groupName}
                    </span>
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <span className="text-sm font-medium text-foreground/60 group-hover:text-foreground">
                      {action.actionName}
                    </span>
                  </TableCell>

                  {/* Points */}
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-content">
                      <Coins size={14} />
                      {action.suggestedPoints} GP
                    </span>
                  </TableCell>

                  {/* Location required */}
                  <TableCell>
                    {action.locationRequired ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-primary-content">
                        <MapPin size={13} /> Bắt buộc
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Không yêu cầu
                      </span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        action.isActive
                          ? "bg-primary-100 text-primary-content"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {action.isActive ? (
                        <>
                          <Check size={11} /> Hoạt động
                        </>
                      ) : (
                        <>
                          <X size={11} /> Tạm dừng
                        </>
                      )}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Toggle */}
                      <button
                        onClick={() => handleToggleActive(action)}
                        disabled={isUpdating}
                        title={action.isActive ? "Tạm dừng" : "Kích hoạt"}
                        className={`rounded-lg p-2 transition-colors disabled:opacity-50 ${
                          action.isActive
                            ? "text-primary-content hover:bg-primary-50"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {action.isActive ? (
                          <ToggleRight size={18} />
                        ) : (
                          <ToggleLeft size={18} />
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditTarget(action);
                          setShowForm(true);
                        }}
                        className="rounded-lg p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-content"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={15} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-16">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                <Leaf size={24} className="text-primary-300" />
              </div>
              <p className="text-sm text-gray-500">
                {groupFilter !== "ALL"
                  ? `Không có hành động nào trong nhóm "${groupFilter}".`
                  : "Chưa có loại hành động nào."}
              </p>
              {groupFilter !== "ALL" && (
                <button
                  onClick={() => setGroupFilter("ALL")}
                  className="mt-3 text-sm font-medium text-primary-content hover:underline"
                >
                  Xem tất cả
                </button>
              )}
            </div>
          )}
        </TableContainer>
      )}

      {/* Form modal */}
      {showForm && (
        <ActionTypeFormModal
          initial={editTarget}
          onClose={closeForm}
          onSubmit={handleSubmit}
          isPending={isCreating || isUpdating}
        />
      )}
    </div>
  );
}
