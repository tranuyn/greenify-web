"use client";

import { useState, useMemo } from "react";
import { Plus, Recycle, Search, X } from "lucide-react";
import { useStations, useWasteTypes } from "@/hooks/queries/useStations";
import {
  useCreateStation,
  useUpdateStation,
  useUpdateStationStatus,
  useDeleteStation,
} from "@/hooks/mutations/useStations";

import type {
  RecyclingStation,
  StationStatus,
  CreateStationRequest,
} from "@/types/station.types";
import { STATUS_CFG } from "./_components/StationStatusBadge";
import { StationCard } from "./_components/StationCard";
import { StationFormModal } from "./_components/StationFormModal";

export default function StationsAdminPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StationStatus | "ALL">(
    "ALL",
  );
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>("ALL");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<RecyclingStation | null>(null);

  const { data: stations = [], isLoading } = useStations();
  const { data: allWasteTypes = [] } = useWasteTypes();

  const { mutate: createStation, isPending: isCreating } = useCreateStation();
  const { mutate: updateStation, isPending: isUpdating } = useUpdateStation();
  const { mutate: updateStatus } = useUpdateStationStatus();
  const {
    mutate: deleteStation,
    isPending: isDeleting,
    variables: deletingId,
  } = useDeleteStation();

  const filtered = useMemo(() => {
    return stations.filter((s) => {
      const matchSearch =
        search.trim() === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.address.addressDetail.toLowerCase().includes(search.toLowerCase()) ||
        s.address.province.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "ALL" || s.status === statusFilter;

      const matchWaste =
        wasteTypeFilter === "ALL" ||
        s.wasteTypes.some((w) => w.id === wasteTypeFilter);

      return matchSearch && matchStatus && matchWaste;
    });
  }, [stations, search, statusFilter, wasteTypeFilter]);

  const counts = useMemo(() => {
    const c: Partial<Record<StationStatus | "ALL", number>> = {
      ALL: stations.length,
    };
    stations.forEach((s) => {
      c[s.status] = (c[s.status] ?? 0) + 1;
    });
    return c;
  }, [stations]);

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const handleSubmit = (data: CreateStationRequest) => {
    if (editTarget) {
      updateStation(
        { id: editTarget.id, payload: data },
        { onSuccess: closeForm },
      );
    } else {
      createStation(data, { onSuccess: closeForm });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary-heading">
            Điểm thu gom
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {stations.length} điểm · {counts["ACTIVE"] ?? 0} đang hoạt động
          </p>
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Plus size={16} /> Thêm điểm mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, địa chỉ, tỉnh/thành..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-11 pr-4 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {(
            ["ALL", "ACTIVE", "INACTIVE", "DRAFT", "TEMPORARY_CLOSED"] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
                statusFilter === s
                  ? "border-primary-500 bg-primary-600 text-white"
                  : "border-border bg-white text-gray-600 hover:border-primary-300"
              }`}
            >
              {s === "ALL" ? "Tất cả" : STATUS_CFG[s].label}
              <span
                className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                  statusFilter === s
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[s] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Waste type filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400">Lọc loại rác:</span>
        <button
          onClick={() => setWasteTypeFilter("ALL")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
            wasteTypeFilter === "ALL"
              ? "border-primary-500 bg-primary-100 text-primary-content"
              : "border-border text-gray-500 hover:border-primary-300"
          }`}
        >
          Tất cả loại
        </button>
        {allWasteTypes.map((wt) => (
          <button
            key={wt.id}
            onClick={() =>
              setWasteTypeFilter(wt.id === wasteTypeFilter ? "ALL" : wt.id)
            }
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              wasteTypeFilter === wt.id
                ? "border-primary-500 bg-primary-100 text-primary-content"
                : "border-border text-gray-500 hover:border-primary-300"
            }`}
          >
            {wt.name}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onEdit={() => {
                setEditTarget(station);
                setShowForm(true);
              }}
              onDelete={() => deleteStation(station.id)}
              onStatusChange={(s) =>
                updateStatus({ id: station.id, payload: { status: s } })
              }
              isDeleting={isDeleting && deletingId === station.id}
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center py-24">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <Recycle size={28} className="text-primary-300" />
          </div>
          <p className="text-gray-500">
            {search || statusFilter !== "ALL" || wasteTypeFilter !== "ALL"
              ? "Không tìm thấy điểm thu gom phù hợp."
              : "Chưa có điểm thu gom nào."}
          </p>
          {(search || statusFilter !== "ALL" || wasteTypeFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
                setWasteTypeFilter("ALL");
              }}
              className="mt-3 text-sm font-medium text-primary-content hover:underline"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <StationFormModal
          initial={editTarget}
          allWasteTypes={allWasteTypes}
          onClose={closeForm}
          onSubmit={handleSubmit}
          isPending={isCreating || isUpdating}
        />
      )}
    </div>
  );
}
