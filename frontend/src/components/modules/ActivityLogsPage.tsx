"use client";

import { useMemo, useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import PageHeading from "@/components/shared/PageHeading";
import Icon from "@/components/shared/Icon";
import Pagination from "@/components/shared/Pagination";

export default function ActivityLogsPage() {
  const { activity, search, flash } = useWorkspace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const visibleActivity = useMemo(() => activity.filter(item => `${item.name} ${item.action} ${item.target} ${item.category}`.toLowerCase().includes(search.toLowerCase())), [activity, search]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(visibleActivity.length / pageSize)));
  const pageActivity = visibleActivity.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function exportCsv() {
    const rows = [["Person", "Action", "Target", "Time", "Category"], ...visibleActivity.map(item => [item.name, item.action, item.target, item.time, item.category])];
    const csv = rows.map(row => row.map(value => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "country-admin-activity.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash("Activity log exported.");
  }
  return <div className="module-page activity-module">
    <PageHeading eyebrow="AUDIT TRAIL" title="Activity logs" description="A transparent record of changes across your workspace." action={<button className="secondary-button" onClick={exportCsv}>↓ Export CSV</button>}/>
    <section className="overview-kpis module-kpis" aria-label="Activity key metrics">
      <article className="overview-kpi kpi-purple"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="clock"/></span><span className="kpi-trend">Audit</span></div><span className="overview-kpi-label">Events shown</span><strong>{visibleActivity.length}</strong><small>Matching workspace activity</small></article>
      <article className="overview-kpi kpi-blue"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="user"/></span><span className="kpi-trend">Team</span></div><span className="overview-kpi-label">People involved</span><strong>{new Set(visibleActivity.map(item => item.name)).size}</strong><small>Unique activity authors</small></article>
      <article className="overview-kpi kpi-green"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="package"/></span><span className="kpi-trend">Tracked</span></div><span className="overview-kpi-label">Event categories</span><strong>{new Set(visibleActivity.map(item => item.category)).size}</strong><small>Across workspace actions</small></article>
      <article className="overview-kpi kpi-amber"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="clock"/></span><span className="kpi-status all-clear">Live log</span></div><span className="overview-kpi-label">Recent updates</span><strong>{visibleActivity.filter(item=>item.time.toLowerCase().includes("today")||item.time==="Just now").length}</strong><small>Today or just now</small></article>
    </section>
    <section className="admin-card log-card"><div className="table-toolbar"><div className="table-caption"><strong>Workspace activity</strong><span>Most recent first</span></div><span className="toolbar-hint">Filtered by your search</span></div><div className="log-list">
      {pageActivity.map(item => <article className="log-entry" key={item.id}><span className="avatar activity-avatar">{item.initials}</span><div className="log-copy"><p><strong>{item.name}</strong> {item.action} <b>{item.target}</b></p><span className="log-category">{item.category}</span></div><time>{item.time}</time></article>)}
      {visibleActivity.length === 0 && <div className="empty-row">No activity matches your search.</div>}
    </div><Pagination page={currentPage} pageSize={pageSize} totalItems={visibleActivity.length} onPageChange={setPage} onPageSizeChange={setPageSize}/></section>
  </div>;
}
