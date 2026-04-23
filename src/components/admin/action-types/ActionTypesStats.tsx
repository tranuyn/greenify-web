import { Leaf } from "lucide-react";

interface ActionTypesStatsProps {
  total: number;
  totalActive: number;
  totalGroups: number;
}

export function ActionTypesStats({
  total,
  totalActive,
  totalGroups,
}: ActionTypesStatsProps) {
  const stats = [
    {
      label: "Tong loai hanh dong",
      value: total,
      color: "bg-primary-50 text-primary-content",
    },
    {
      label: "Dang hoat dong",
      value: totalActive,
      color: "bg-primary-50 text-primary-content",
    },
    {
      label: "So nhom",
      value: totalGroups,
      color: "bg-blue-50 text-blue-700",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div
            className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}
          >
            <Leaf size={18} />
          </div>
          <div className="text-2xl font-bold text-primary-heading">{s.value}</div>
          <div className="mt-0.5 text-xs text-gray-500">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
