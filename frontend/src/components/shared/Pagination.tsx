"use client";

type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export default function Pagination({ page, pageSize, totalItems, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, index) => startPage + index);

  return <div className="pagination-bar">
    <div className="pagination-summary">Showing <strong>{start}–{end}</strong> of <strong>{totalItems}</strong></div>
    <div className="pagination-controls" aria-label="Table pagination">
      <label className="page-size-label">Rows <select aria-label="Rows per page" value={pageSize} onChange={(event) => { onPageSizeChange(Number(event.target.value)); onPageChange(1); }}><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option></select></label>
      <button className="page-button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">‹</button>
      {pages.map((pageNumber) => <button key={pageNumber} className={`page-button ${page === pageNumber ? "page-active" : ""}`} aria-current={page === pageNumber ? "page" : undefined} onClick={() => onPageChange(pageNumber)}>{pageNumber}</button>)}
      <button className="page-button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">›</button>
    </div>
  </div>;
}
