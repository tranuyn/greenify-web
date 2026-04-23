"use client";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  summary?: string;
  className?: string;
  maxVisible?: number;
  isFetching?: boolean;
};

function getPageItems(currentPage: number, totalPages: number, maxVisible: number) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: Array<number | "..."> = [];
  const sideSlots = Math.max(1, Math.floor((maxVisible - 3) / 2));
  const start = Math.max(2, currentPage - sideSlots);
  const end = Math.min(totalPages - 1, currentPage + sideSlots);

  items.push(1);

  if (start > 2) items.push("...");
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < totalPages - 1) items.push("...");

  items.push(totalPages);

  return items;
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  summary,
  className,
  maxVisible = 7,
  isFetching,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const pageItems = getPageItems(currentPage, totalPages, maxVisible);

  return (
    <div
      className={clsx(
        "flex flex-wrap items-center justify-between gap-3 border-t border-table-border bg-table-header-bg px-6 py-4",
        className,
      )}
    >
      <span className="text-sm font-medium text-table-header-text">
        {summary ?? `Page ${currentPage}/${totalPages}`}
        {isFetching && (
          <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border border-primary-500 border-t-transparent" />
        )}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {pageItems.map((item, idx) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-1 text-sm text-gray-400">
                ...
              </span>
            );
          }

          return (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={clsx(
                "h-9 min-w-9 rounded-xl px-2 text-sm font-semibold shadow-sm transition-all",
                item === currentPage
                  ? "border border-primary-600 bg-primary-600 text-white shadow-primary-600/20"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              {item}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
