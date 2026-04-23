import {
  Coins,
  Leaf,
  MapPin,
  Pencil,
  ToggleLeft,
  ToggleRight,
  X,
  Check,
} from "lucide-react";
import {
  TableContainer,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/admin/ui/table";
import type { GreenActionType } from "@/types/action.types";

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

interface ActionTypesTableProps {
  data: GreenActionType[];
  groupFilter: string;
  isUpdating: boolean;
  onEdit: (action: GreenActionType) => void;
  onToggleActive: (action: GreenActionType) => void;
}

export function ActionTypesTable({
  data,
  groupFilter,
  isUpdating,
  onEdit,
  onToggleActive,
}: ActionTypesTableProps) {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {["Nhom", "Ten hanh dong", "Diem GP", "Vi tri", "Trang thai", "Hanh dong"].map((h) => (
              <TableHead key={h}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((action) => (
            <TableRow
              key={action.id}
              className={!action.isActive ? "opacity-50 group" : "group"}
            >
              <TableCell>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getGroupColor(action.groupName)}`}
                >
                  {action.groupName}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-sm font-medium text-foreground/60 group-hover:text-foreground">
                  {action.actionName}
                </span>
              </TableCell>

              <TableCell>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-content">
                  <Coins size={14} />
                  {action.suggestedPoints} GP
                </span>
              </TableCell>

              <TableCell>
                {action.locationRequired ? (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-primary-content">
                    <MapPin size={13} /> Bat buoc
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Khong yeu cau</span>
                )}
              </TableCell>

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
                      <Check size={11} /> Hoat dong
                    </>
                  ) : (
                    <>
                      <X size={11} /> Tam dung
                    </>
                  )}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleActive(action)}
                    disabled={isUpdating}
                    title={action.isActive ? "Tam dung" : "Kich hoat"}
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

                  <button
                    onClick={() => onEdit(action)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-primary-50 hover:text-primary-content"
                    title="Chinh sua"
                  >
                    <Pencil size={15} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.length === 0 && (
        <div className="flex flex-col items-center py-16">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
            <Leaf size={24} className="text-primary-300" />
          </div>
          <p className="text-sm text-gray-500">
            {groupFilter !== "ALL"
              ? `Khong co hanh dong nao trong nhom "${groupFilter}".`
              : "Chua co loai hanh dong nao."}
          </p>
          {groupFilter !== "ALL" && (
            <button
              onClick={() => {
                // no-op; handled by parent via groupFilter in current call-site
              }}
              className="mt-3 cursor-default text-sm font-medium text-primary-content"
            >
              Loc theo nhom dang bat
            </button>
          )}
        </div>
      )}
    </TableContainer>
  );
}
