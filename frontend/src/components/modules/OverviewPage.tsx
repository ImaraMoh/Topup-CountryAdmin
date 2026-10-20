"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import Icon from "@/components/shared/Icon";

const regionPalette = ["r1", "r2", "r3", "r4"];

export default function OverviewPage() {
  const { topupSystems, countries, activity } = useWorkspace();
  const pending = topupSystems.filter((admin) => admin.status === "Setup").length;
  const activeAdmins = topupSystems.filter((admin) => admin.status === "Active").length;
  const activeCountries = countries.filter((country) => country.status === "Active").length;
  const coverage = countries.length ? Math.round((activeCountries / countries.length) * 100) : 0;
  const regions = useMemo(() => {
    const counts = countries.reduce<Record<string, number>>((result, country) => {
      result[country.region] = (result[country.region] ?? 0) + 1;
      return result;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [countries]);

  return <div className="overview-page">
    <section className="overview-welcome">
      <div><span className="overview-eyebrow"><i/>GLOBAL OPERATIONS · OVERVIEW</span><h1>Good morning, Olivia</h1><p>Your workspace at a glance. Here are the details that need your attention today.</p></div>
      <div className="overview-actions"><Link className="overview-analytics-link" href="/analytics"><Icon name="arrow-up-right" size={15}/> <span>Analytics</span></Link><Link className="primary-button" href="/admin-management"><Icon name="plus" size={15}/> Add admin</Link></div>
    </section>

    <section className="overview-kpis" aria-label="Workspace key metrics">
      <article className="overview-kpi kpi-purple"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="globe"/></span><span className="kpi-trend"><Icon name="arrow-up-right" size={12}/> 12%</span></div><span className="overview-kpi-label">Countries</span><strong>{countries.length}</strong><small>{activeCountries} active operations</small><div className="kpi-sparkline" aria-hidden="true">{[28, 45, 36, 54, 49, 73, 62, 88, 76, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }}/>)}</div></article>
      <article className="overview-kpi kpi-blue"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="user"/></span><span className="kpi-trend">Systems</span></div><span className="overview-kpi-label">Top-up admins</span><strong>{topupSystems.length}</strong><small>{activeAdmins} active top-up systems</small><div className="kpi-sparkline" aria-hidden="true">{[38, 30, 48, 42, 59, 51, 71, 65, 86, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }}/>)}</div></article>
      <article className="overview-kpi kpi-amber"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="clock"/></span><span className={`kpi-status ${pending ? "needs-attention" : "all-clear"}`}>{pending ? "Needs attention" : "All clear"}</span></div><span className="overview-kpi-label">Systems in setup</span><strong>{pending}</strong><small>{pending ? "Awaiting configuration" : "No systems need setup"}</small><div className="kpi-kicker"><span>{pending ? "Review setup" : "All systems ready"}</span><span><Icon name="arrow-up-right" size={14}/></span></div></article>
      <article className="overview-kpi kpi-green"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="check"/></span><span className="kpi-trend">Healthy</span></div><span className="overview-kpi-label">Country coverage</span><strong>{coverage}<em>%</em></strong><small>{activeCountries} of {countries.length} countries active</small><div className="kpi-progress"><i style={{ width: `${coverage}%` }}/></div></article>
    </section>

    <section className="overview-panels">
      <article className="overview-panel overview-team-panel">
        <div className="overview-panel-heading"><div><span className="panel-eyebrow">TOP-UP ADMINISTRATION</span><h2>Top-up systems</h2><p>Systems managed by the Country Admin.</p></div><Link className="panel-link" href="/admin-management">Manage systems <span><Icon name="arrow-up-right" size={14}/></span></Link></div>
        <div className="overview-team-list">{topupSystems.slice(0, 4).map((system) => <Link className="overview-team-row" key={system.id} href={`/admin-management/${system.id}`}><span className="system-brand-mark" style={{ background: `linear-gradient(145deg, ${system.accent}, #6385dc)` }}><Icon name="arrow-up-right"/></span><div className="overview-admin-info"><strong>{system.name}</strong><small>{system.country} · Top-up system</small></div><span className={`overview-status ${system.status === "Active" ? "is-active" : "is-pending"}`}><i/>{system.status}</span></Link>)}{topupSystems.length === 0 && <p className="overview-empty">No top-up admins yet. Add a system to get started.</p>}</div>
        <Link className="overview-invite-link" href="/admin-management"><Icon name="plus" size={15}/> Add a top-up admin</Link>
      </article>

      <article className="overview-panel overview-pulse-panel">
        <div className="overview-panel-heading"><div><span className="panel-eyebrow">WORKSPACE PULSE</span><h2>Regional coverage</h2><p>Countries operating across your regions.</p></div><Link className="panel-icon-link" href="/countries" aria-label="View all countries" title="View all countries"><Icon name="arrow-up-right" size={15}/></Link></div>
        {regions.length ? <div className="overview-region-list">{regions.map(([name, count], index) => <div className="overview-region-row" key={name}><div className="overview-region-top"><span><i className={`region-dot ${regionPalette[index % regionPalette.length]}`}/>{name}</span><strong>{count}<small> {count === 1 ? "country" : "countries"}</small></strong></div><div className="overview-region-track"><i style={{ width: `${countries.length ? (count / countries.length) * 100 : 0}%` }}/></div></div>)}</div> : <p className="overview-empty">Add a country to see regional coverage.</p>}
        <div className="overview-pulse-footer"><span className="system-health"><i/>All systems operational</span><span className="workspace-update-label">Recent activity</span></div>
      </article>
    </section>

    <section className="overview-recent-activity"><div className="overview-activity-heading"><div><span className="panel-eyebrow">LATEST UPDATES</span><h2>Recent activity</h2></div></div><div className="overview-activity-list">{activity.slice(0, 3).map((item) => <article className="overview-activity-row" key={item.id}><span className="avatar" style={{ background: item.color }}>{item.initials}</span><div><p><strong>{item.name}</strong> {item.action} <b>{item.target}</b></p><small>{item.category}</small></div><time>{item.time}</time></article>)}{activity.length === 0 && <p className="overview-empty">Workspace updates will appear here.</p>}</div></section>
  </div>;
}
