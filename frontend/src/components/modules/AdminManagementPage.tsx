"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { initialSystemProducts, initialSystemRetailers } from "@/data/initial-data";
import { useWorkspace } from "@/context/WorkspaceContext";
import PageHeading from "@/components/shared/PageHeading";
import Icon from "@/components/shared/Icon";
import Pagination from "@/components/shared/Pagination";

export default function AdminManagementPage() {
  const { topupSystems, countries, search, addTopupAdmin } = useWorkspace();
  const [addAdminOpen, setAddAdminOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const systems = useMemo(() => topupSystems.filter((system) => `${system.name} ${system.country} ${system.contactName}`.toLowerCase().includes(search.toLowerCase())), [topupSystems, search]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(systems.length / pageSize)));
  const pageSystems = systems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeSystems = topupSystems.filter((system) => system.status === "Active").length;
  const totalRetailers = initialSystemRetailers.length;
  const totalProducts = initialSystemProducts.length;
  function submitAdmin(event: FormEvent<HTMLFormElement>) {
    addTopupAdmin(event);
    setAddAdminOpen(false);
  }

  return <div className="module-page admin-module system-management-module">
    <PageHeading eyebrow="PLATFORM & TENANT MANAGEMENT" title="Admin management" description="Manage NSOL E-PIN and other top-up systems under your country administration." action={<button className="primary-button" onClick={() => setAddAdminOpen(true)}><Icon name="plus" size={15}/> Add admin</button>}/>
    <section className="overview-kpis module-kpis" aria-label="Admin management key metrics">
      <article className="overview-kpi kpi-purple"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="user"/></span><span className="kpi-trend">Systems</span></div><span className="overview-kpi-label">Top-up admins</span><strong>{topupSystems.length}</strong><small>Managed by Country Admin</small><div className="kpi-sparkline" aria-hidden="true">{[38,46,43,58,54,66,72,81,91].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></article>
      <article className="overview-kpi kpi-green"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="check"/></span><span className="kpi-trend">Active</span></div><span className="overview-kpi-label">Active admins</span><strong>{activeSystems}</strong><small>{topupSystems.length-activeSystems} in setup</small><div className="kpi-progress"><i style={{width:`${topupSystems.length?activeSystems/topupSystems.length*100:0}%`}}/></div></article>
      <article className="overview-kpi kpi-blue"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="grid"/></span><span className="kpi-trend">Network</span></div><span className="overview-kpi-label">Retailers</span><strong>{totalRetailers}</strong><small>Across connected systems</small><div className="kpi-sparkline" aria-hidden="true">{[26,39,35,55,47,67,61,83,100].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></article>
      <article className="overview-kpi kpi-amber"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="package"/></span><span className="kpi-status all-clear">Catalog</span></div><span className="overview-kpi-label">Products</span><strong>{totalProducts}</strong><small>Available in seeded system data</small><div className="kpi-kicker"><span>View system details</span><span><Icon name="arrow-up-right" size={14}/></span></div></article>
    </section>
    <section className="system-directory-panel">
      <div className="system-directory-heading"><div><span className="panel-eyebrow">COUNTRY ADMINISTRATION</span><h2>Top-up system admins</h2><p>Each top-up system is managed as an admin. Select one to view its operations.</p></div><span className="system-directory-count">{systems.length} {systems.length === 1 ? "admin" : "admins"}</span></div>
      <div className="system-directory-grid">{pageSystems.map((system) => <Link href={`/admin-management/${system.id}`} className="system-directory-card" key={system.id}>
        <div className="system-card-top"><span className="system-brand-mark" style={{ background: `linear-gradient(145deg, ${system.accent}, #6385dc)` }}>{system.name.slice(0, 1)}</span><span className={`system-active-pill ${system.status === "Active" ? "" : "system-pending-pill"}`}><i/>{system.status}</span></div>
        <div className="system-card-title"><h3>{system.name}</h3><span className="system-country-tag">{countryFlag(system.country)} &nbsp;{system.country}</span></div>
        <p className="system-card-contact">Admin contact <strong>{system.contactName}</strong> · {system.contactEmail}</p>
        <div className="system-card-stats"><div><strong>{system.id === "nsol" ? initialSystemRetailers.length : 0}</strong><span>Retailers</span></div><div><strong>{system.id === "nsol" ? initialSystemProducts.length : 0}</strong><span>Products</span></div><div><strong>{system.id === "nsol" ? `LKR ${(initialSystemRetailers.reduce((sum, retailer) => sum + retailer.sales, 0) / 1000).toFixed(0)}k` : "—"}</strong><span>Sales tracked</span></div></div>
        <div className="system-card-footer"><span>Admin since {system.created}</span><span className="system-open-label">View admin details <b><Icon name="arrow-up-right" size={14}/></b></span></div>
      </Link>)}{systems.length === 0 && <div className="system-directory-empty">No top-up admins match “{search}”.</div>}</div>
      <Pagination page={currentPage} pageSize={pageSize} totalItems={systems.length} onPageChange={setPage} onPageSizeChange={setPageSize}/>
    </section>
    {addAdminOpen && <TopupAdminModal countries={countries.map((country) => country.name)} onClose={() => setAddAdminOpen(false)} onSubmit={submitAdmin}/>}
  </div>;
}

function TopupAdminModal({ countries, onClose, onSubmit }: { countries: string[]; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  if (typeof document === "undefined") return null;
  return createPortal(<div className="modal-backdrop modal-viewport-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="topup-admin-modal-title">
    <div className="modal-header"><div><span className="modal-icon"><Icon name="user"/></span><h2 id="topup-admin-modal-title">Add a top-up admin</h2><p>Add an E-PIN system to your country administration.</p></div><button type="button" onClick={onClose} aria-label="Close dialog">×</button></div>
    <form onSubmit={onSubmit}><label htmlFor="topup-admin-name">Admin / system name</label><input id="topup-admin-name" name="name" placeholder="e.g. NSOL E-PIN" required/><label htmlFor="topup-admin-contact">Admin contact name</label><input id="topup-admin-contact" name="contactName" placeholder="e.g. Nsol Operations" required/><label htmlFor="topup-admin-email">Contact email</label><input id="topup-admin-email" name="email" type="email" placeholder="operations@example.com" required/><label htmlFor="topup-admin-country">Country</label><select id="topup-admin-country" name="country" required>{countries.map((country) => <option key={country}>{country}</option>)}</select><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Add admin <span><Icon name="arrow-up-right" size={14}/></span></button></div></form>
  </section></div>, document.body);
}

function countryFlag(country: string) {
  return <Icon name="globe" size={14} aria-label={country}/>;
}
