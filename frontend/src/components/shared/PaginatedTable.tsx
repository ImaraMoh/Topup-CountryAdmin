"use client";

import { ReactNode, useMemo, useState } from "react";
import Pagination from "@/components/shared/Pagination";

type Column<T> = { label: string; render: (row: T) => ReactNode; className?: string };

export default function PaginatedTable<T extends { id: number }>({ rows, columns, label }: { rows: T[]; columns: Column<T>[]; label: string }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(rows.length / pageSize)));
  const visibleRows = useMemo(() => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize), [rows, currentPage, pageSize]);

  return <><div className="table-scroll"><table aria-label={label}><thead><tr>{columns.map((column) => <th className={column.className} key={column.label}>{column.label}</th>)}</tr></thead><tbody>
    {visibleRows.map((row) => <tr key={row.id}>{columns.map((column) => <td className={column.className} key={column.label}>{column.render(row)}</td>)}</tr>)}
    {rows.length === 0 && <tr><td className="empty-row" colSpan={columns.length}>No {label.toLowerCase()} to show yet.</td></tr>}
  </tbody></table></div><Pagination page={currentPage} pageSize={pageSize} totalItems={rows.length} onPageChange={setPage} onPageSizeChange={setPageSize}/></>;
}
