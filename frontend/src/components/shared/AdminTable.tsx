"use client";

import type { Admin } from "@/types/admin";
import { useMemo, useState } from "react";
import Pagination from "@/components/shared/Pagination";

type Props = {
  admins: Admin[];
  compact?: boolean;
  selected?: number[];
  setSelected?: (ids: number[]) => void;
  onInvite?: (admin: Admin) => void;
  onStatusChange?: (admin: Admin, status: Admin["status"]) => void;
};

export default function AdminTable({ admins, compact = false, selected = [], setSelected, onInvite, onStatusChange }: Props) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(compact ? 5 : 10);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(admins.length / pageSize)));
  const pageAdmins = useMemo(() => admins.slice((currentPage - 1) * pageSize, currentPage * pageSize), [admins, currentPage, pageSize]);
  const allSelected = pageAdmins.length > 0 && pageAdmins.every(admin => selected.includes(admin.id));
  return <><div className="table-scroll"><table><thead><tr>{!compact && <th><input type="checkbox" aria-label="Select all visible admins" checked={allSelected} onChange={event => setSelected?.(event.target.checked ? [...new Set([...selected, ...pageAdmins.map(admin => admin.id)])] : selected.filter(id => !pageAdmins.some(admin => admin.id === id)))}/></th>}<th>NAME</th><th>ROLE</th><th>COUNTRY</th><th>STATUS</th><th>DATE ADDED</th>{!compact && <th>ACTION</th>}</tr></thead><tbody>
    {pageAdmins.map(admin => <tr key={admin.id}>{!compact && <td><input type="checkbox" aria-label={`Select ${admin.name}`} checked={selected.includes(admin.id)} onChange={event => setSelected?.(event.target.checked ? [...selected, admin.id] : selected.filter(id => id !== admin.id))}/></td>}<td><div className="admin-person"><span className="avatar" style={{ background: admin.color }}>{admin.initials}</span><span><strong>{admin.name}</strong><small>{admin.email}</small></span></div></td><td><span className={`role-pill ${admin.role === "Super Admin" ? "role-super" : ""}`}>{admin.role}</span></td><td>{admin.country}</td><td><span className={`status-pill ${admin.status === "Active" ? "status-active" : "status-pending"}`}><i/>{admin.status}</span></td><td className="date-cell">{admin.joined}</td>{!compact && <td><div className="action-buttons">{admin.status === "Pending" ? <><button onClick={() => onInvite?.(admin)}>Resend invite</button><button onClick={() => onStatusChange?.(admin, "Active")}>Mark active</button></> : <button onClick={() => onStatusChange?.(admin, "Pending")}>Set pending</button>}</div></td>}</tr>)}
    {admins.length === 0 && <tr><td colSpan={compact ? 5 : 7} className="empty-row">No admins found. Try changing your search or filters.</td></tr>}
  </tbody></table></div><Pagination page={currentPage} pageSize={pageSize} totalItems={admins.length} onPageChange={setPage} onPageSizeChange={setPageSize}/></>;
}
