"use client";

import { useState, useMemo } from "react";
import { Plus, Recycle } from "lucide-react";
import { useStations, useWasteTypes } from "@/hooks/queries/useStations";
import {
  useCreateStation,
  useUpdateStation,
  useUpdateStationStatus,
  useDeleteStation,
} from "@/hooks/mutations/useStations";

import {
  ADMIN_STATION_STATUS_FILTER,
  ADMIN_STATION_STATUS_FILTERS,
  CreateStationRequest,
  RecyclingStation,
  type AdminStationStatus,
} from "@/types/station.types";
import { STATUS_CFG } from "./_components/StationStatusBadge";
import { StationCard } from "./_components/StationCard";
import { StationFormModal } from "./_components/StationFormModal";
import { SearchBar } from "@/components/admin/ui/search-bar";
import { ChipFilterGroup } from "@/components/admin/ui/filter-chip-group";

export default function StationsAdminPage() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminStationStatus>(
    ADMIN_STATION_STATUS_FILTER.ALL,
  );
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>(
    ADMIN_STATION_STATUS_FILTER.ALL,
  );
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
        appliedSearch.trim() === "" ||
        s.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        s.address.addressDetail
          .toLowerCase()
          .includes(appliedSearch.toLowerCase()) ||
        s.address.province.toLowerCase().includes(appliedSearch.toLowerCase());

      const matchStatus =
        statusFilter === ADMIN_STATION_STATUS_FILTER.ALL ||
        s.status === statusFilter;

      const matchWaste =
        wasteTypeFilter === ADMIN_STATION_STATUS_FILTER.ALL ||
        s.wasteTypes.some((w) => w.id === wasteTypeFilter);

      return matchSearch && matchStatus && matchWaste;
    });
  }, [stations, appliedSearch, statusFilter, wasteTypeFilter]);

  const counts = useMemo(() => {
    const c: Partial<Record<AdminStationStatus, number>> = {
      [ADMIN_STATION_STATUS_FILTER.ALL]: stations.length,
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

  const handleSearch = (submittedSearch: string) => {
    setAppliedSearch(submittedSearch);
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
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        {/* Search */}
        <SearchBar
          className="flex-1"
          value={search}
          onValueChange={setSearch}
          onSearch={handleSearch}
          placeholder="Tìm theo tên, địa chỉ, tỉnh/thành..."
          buttonLabel="Tìm kiếm"
          inputClassName="rounded-xl"
          buttonClassName="rounded-xl"
        />

        {/* Status filter */}
        <ChipFilterGroup
          value={statusFilter}
          onChange={setStatusFilter}
          options={ADMIN_STATION_STATUS_FILTERS.map((s) => ({
            value: s,
            label:
              s === ADMIN_STATION_STATUS_FILTER.ALL
                ? "Tất cả"
                : STATUS_CFG[s].label,
            count: counts[s] ?? 0,
          }))}
          layout="scroll"
          size="sm"
        />
      </div>

      {/* Waste type filter */}
      <ChipFilterGroup
        label="Lọc loại rác"
        value={wasteTypeFilter}
        onChange={setWasteTypeFilter}
        options={[
          { value: ADMIN_STATION_STATUS_FILTER.ALL, label: "Tất cả loại" },
          ...allWasteTypes.map((wt) => ({
            value: wt.id,
            label: wt.name,
          })),
        ]}
        layout="wrap"
        size="sm"
      />

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
            {appliedSearch ||
            statusFilter !== ADMIN_STATION_STATUS_FILTER.ALL ||
            wasteTypeFilter !== ADMIN_STATION_STATUS_FILTER.ALL
              ? "Không tìm thấy điểm thu gom phù hợp."
              : "Chưa có điểm thu gom nào."}
          </p>
          {(appliedSearch ||
            statusFilter !== ADMIN_STATION_STATUS_FILTER.ALL ||
            wasteTypeFilter !== ADMIN_STATION_STATUS_FILTER.ALL) && (
            <button
              onClick={() => {
                setSearch("");
                setAppliedSearch("");
                setStatusFilter(ADMIN_STATION_STATUS_FILTER.ALL);
                setWasteTypeFilter(ADMIN_STATION_STATUS_FILTER.ALL);
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
