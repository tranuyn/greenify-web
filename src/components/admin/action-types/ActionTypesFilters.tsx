import { ToggleLeft, ToggleRight } from "lucide-react";
import { ChipFilterGroup } from "@/components/admin/ui/filter-chip-group";

interface ActionTypesFiltersProps {
  groups: string[];
  groupFilter: string;
  setGroupFilter: (value: string) => void;
  showInactive: boolean;
  setShowInactive: (value: boolean) => void;
}

export function ActionTypesFilters({
  groups,
  groupFilter,
  setGroupFilter,
  showInactive,
  setShowInactive,
}: ActionTypesFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ChipFilterGroup
        value={groupFilter}
        onChange={setGroupFilter}
        options={groups.map((g) => ({
          value: g,
          label: g === "ALL" ? "Tat ca nhom" : g,
        }))}
        layout="wrap"
        size="sm"
      />

      <button
        onClick={() => setShowInactive(!showInactive)}
        className={`ml-auto flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
          showInactive
            ? "border-amber-400 bg-amber-50 text-amber-700"
            : "border-border bg-white text-gray-500"
        }`}
      >
        {showInactive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
        Hien da tat
      </button>
    </div>
  );
}
