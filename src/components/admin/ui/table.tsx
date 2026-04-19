import * as React from "react";

export function TableContainer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-table-border bg-card shadow-sm ${className || ""}`}
      {...props}
    >
      <div className="overflow-x-auto w-full">{children}</div>
    </div>
  );
}

export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={`w-full whitespace-nowrap text-left text-sm ${className || ""}`}
      {...props}
    />
  )
);
Table.displayName = "Table";

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={`border-b border-table-border bg-table-header-bg ${className || ""}`} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={`divide-y divide-table-border bg-table-row-bg ${className || ""}`}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={`transition-colors hover:bg-table-row-hover/50 ${className || ""}`}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={`px-6 py-4 font-semibold text-table-header-text uppercase tracking-wider text-xs align-middle ${className || ""}`}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={`px-6 py-4 align-middle ${className || ""}`} {...props} />
  )
);
TableCell.displayName = "TableCell";
