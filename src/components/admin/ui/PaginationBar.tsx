import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationBarProps = {
  page: number;
  totalPages: number;
  totalElements: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  summary: string;
};

export function PaginationBar({
  page,
  totalPages,
  totalElements,
  isFetching,
  onPageChange,
  summary,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-table-border bg-table-header-bg px-6 py-4">
      <span className="text-sm font-medium text-table-header-text">
        {summary}
        {isFetching && (
          <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border border-primary-500 border-t-transparent" />
        )}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0}
          className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-9 w-9 rounded-xl text-sm font-semibold shadow-sm transition-all ${
                p === page
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p + 1}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
