"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import Icon from "@/components/shared/Icon";
import styles from "./OverviewPage.module.css";

export default function OverviewPage() {
  const { topupSystems, countries, activity, profile } = useWorkspace();
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

  const firstName = profile?.name ? profile.name.split(" ")[0] : "Admin";

  return (
    <div className={`${styles.root} executive-overview`}>
      <section className="exec-welcome-card">
        <div className="exec-welcome-content">
          <div className="exec-eyebrow"><span className="live-indicator"/> COUNTRY ADMIN</div>
          <h1>Good day, {firstName}</h1>
          <p>Manage top-up systems and country coverage.</p>
        </div>
        <div className="exec-welcome-actions">
          <Link className="exec-btn-secondary" href="/analytics"><Icon name="chart" size={16}/><span>View analytics</span></Link>
          <Link className="exec-btn-primary" href="/admin-management"><Icon name="plus" size={16}/><span>Add top-up admin</span></Link>
        </div>
        <div className="welcome-orbit" aria-hidden="true"><i/><i/><i/></div>
      </section>

      <section className="exec-kpi-grid" aria-label="Workspace key metrics">
        <article className="exec-kpi-card kpi-glow-purple">
          <div className="exec-kpi-header"><div className="exec-kpi-icon-box purple"><Icon name="globe" size={19}/></div></div>
          <span className="exec-kpi-title">Countries covered</span>
          <div className="exec-kpi-value-row"><strong>{countries.length}</strong><em>{activeCountries} active</em></div>
          
        </article>
        <article className="exec-kpi-card kpi-glow-blue">
          <div className="exec-kpi-header"><div className="exec-kpi-icon-box blue"><Icon name="layers" size={19}/></div></div>
          <span className="exec-kpi-title">Top-up systems</span>
          <div className="exec-kpi-value-row"><strong>{topupSystems.length}</strong><em>{activeAdmins} active</em></div>
          
        </article>
        <article className="exec-kpi-card kpi-glow-amber">
          <div className="exec-kpi-header"><div className="exec-kpi-icon-box amber"><Icon name="clock" size={19}/></div><span className={`exec-kpi-badge ${pending ? "warning" : "success"}`}>{pending ? "Needs attention" : "All clear"}</span></div>
          <span className="exec-kpi-title">Awaiting setup</span>
          <div className="exec-kpi-value-row"><strong>{pending}</strong><em>{pending ? "Needs review" : "All clear"}</em></div>
          
        </article>
        <article className="exec-kpi-card kpi-glow-green">
          <div className="exec-kpi-header"><div className="exec-kpi-icon-box green"><Icon name="check" size={19}/></div></div>
          <span className="exec-kpi-title">Active country coverage</span>
          <div className="exec-kpi-value-row"><strong>{coverage}<em>%</em></strong><em>{activeCountries} / {countries.length} active</em></div>
          
        </article>
      </section>

      <section className="exec-main-grid">
        <article className="exec-panel exec-systems-panel">
          <div className="exec-panel-header"><div><span className="exec-panel-sub">PLATFORM ADMINS</span><h2>Top-up systems</h2><p>Open a system to see its retailers, products, sales, and analytics.</p></div><Link className="exec-panel-action" href="/admin-management">All admins <span><Icon name="arrow-up-right" size={14}/></span></Link></div>
          <div className="exec-systems-list">{topupSystems.slice(0,5).map(system=><Link className="exec-row-item" key={system.id} href={`/admin-management/${system.id}`}>
            <div className="exec-row-icon" style={{background:`linear-gradient(145deg,${system.accent || "#6d45a5"},#302044)`}}><Icon name="layers" size={17}/></div>
            <div className="exec-row-meta"><strong>{system.name}</strong><span>{system.country} · {system.contactName}</span></div>
            <span className={`exec-status-pill ${system.status === "Active" ? "active" : "setup"}`}><i/>{system.status}</span>
            <span className="exec-row-arrow"><Icon name="arrow-up-right" size={15}/></span>
          </Link>)}{topupSystems.length===0&&<p className="exec-empty-state">No top-up admins have been added yet.</p>}</div>
          <Link className="exec-panel-footer-btn" href="/admin-management"><Icon name="plus" size={15}/> Add a top-up admin</Link>
        </article>

        <div className="exec-overview-aside">
          <article className="exec-panel exec-coverage-panel">
            <div className="exec-panel-header"><div><span className="exec-panel-sub">COUNTRY PORTFOLIO</span><h2>Regional coverage</h2></div><Link className="exec-panel-action icon-only" href="/countries" aria-label="Open countries"><Icon name="arrow-up-right" size={15}/></Link></div>
            <div className="exec-panel-body padded">{regions.length?<div className="exec-region-list">{regions.map(([name,count],index)=><div className="exec-region-item" key={name}><div className="exec-region-info"><span className={`exec-region-dot dot-${(index%4)+1}`}/><strong>{name}</strong><span className="exec-region-count">{count} {count===1?"country":"countries"}</span></div><div className="exec-region-bar"><i style={{width:`${countries.length?(count/countries.length)*100:0}%`}}/></div></div>)}</div>:<p className="exec-empty-state">Country coverage will appear here.</p>}</div>
            <div className="exec-panel-status-bar"><span className="exec-telemetry-status"><i/> Workspace operational</span><span>{activeCountries} active</span></div>
          </article>
          <article className="exec-panel exec-activity-panel">
            <div className="exec-panel-header"><div><span className="exec-panel-sub">LATEST UPDATES</span><h2>Recent activity</h2></div></div>
            <div className="exec-activity-list">{activity.slice(0,4).map(item=><div className="exec-activity-row" key={item.id}><div className="exec-activity-avatar" style={{background:item.color || "#6e5aa5"}}>{item.initials}</div><div className="exec-activity-content"><p><strong>{item.name}</strong> {item.action} <b>{item.target}</b></p><span>{item.category}</span></div><time>{item.time}</time></div>)}{activity.length===0&&<p className="exec-empty-state">No recent updates to show.</p>}</div>
          </article>
        </div>
      </section>
    </div>
  );
}
