"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useWorkspace } from "@/context/WorkspaceContext";
import type { Country } from "@/types/admin";
import PageHeading from "@/components/shared/PageHeading";
import Icon from "@/components/shared/Icon";
import Pagination from "@/components/shared/Pagination";
import shellStyles from "@/components/layout/AppShell.module.css";

type CountryAction = { type: "status" | "delete"; country: Country };

export default function CountriesPage() {
  const { countriesWithAdminCounts, topupSystems, search, openModal, removeCountry, toggleCountryStatus } = useWorkspace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pendingAction, setPendingAction] = useState<CountryAction | null>(null);
  const countries = useMemo(() => countriesWithAdminCounts.filter(country => `${country.name} ${country.code} ${country.region}`.toLowerCase().includes(search.toLowerCase())), [countriesWithAdminCounts, search]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(countries.length / pageSize)));
  const pageCountries = countries.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const systemCount = (countryName: string) => topupSystems.filter(system => system.country === countryName).length;
  return <div className="module-page countries-module">
    <PageHeading eyebrow="REGIONS & COVERAGE" title="Countries" description="Manage country coverage." action={<button className="primary-button" onClick={() => openModal("country")}><Icon name="plus" size={15}/> Add country</button>}/>
    <section className="overview-kpis module-kpis" aria-label="Country key metrics">
      <article className="overview-kpi kpi-blue"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="globe"/></span><span className="kpi-trend">Regions</span></div><span className="overview-kpi-label">Countries</span><strong>{countriesWithAdminCounts.length}</strong><small>In scope</small></article>
      <article className="overview-kpi kpi-green"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="check"/></span><span className="kpi-trend">Live</span></div><span className="overview-kpi-label">Active countries</span><strong>{countriesWithAdminCounts.filter(country => country.status === "Active").length}</strong><small>Operating locations</small></article>
      <article className="overview-kpi kpi-purple"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="user"/></span><span className="kpi-trend">Platform</span></div><span className="overview-kpi-label">Top-up admins</span><strong>{topupSystems.length}</strong><small>Connected systems</small></article>
      <article className="overview-kpi kpi-amber"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="clock"/></span><span className="kpi-status needs-attention">Inactive</span></div><span className="overview-kpi-label">Inactive countries</span><strong>{countriesWithAdminCounts.filter(country=>country.status==="Inactive").length}</strong><small>Paused country operations</small></article>
    </section>
    <section className="admin-card country-card"><div className="table-toolbar"><div className="table-caption"><strong>All countries</strong><span>{countries.length} results</span></div><span className="toolbar-hint">Use the search above to find a region</span></div><div className="table-scroll"><table><thead><tr><th>COUNTRY</th><th>CODE</th><th>REGION</th><th>TOP-UP SYSTEMS</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>
      {pageCountries.map(country => <tr key={country.id}><td><div className="country-name"><span className="country-code-mark"><Icon name="globe" size={16}/></span><strong>{country.name}</strong></div></td><td><span className="code-pill">{country.code}</span></td><td>{country.region}</td><td>{systemCount(country.name)}</td><td><button className={`status-pill ${country.status === "Active" ? "status-active" : "status-inactive"}`} onClick={() => setPendingAction({ type: "status", country })} title="Change country status"><i/>{country.status}</button></td><td><button className="text-action country-delete-action" onClick={() => setPendingAction({ type: "delete", country })} title={systemCount(country.name) > 0 ? "This country has linked top-up systems" : `Delete ${country.name}`}>Delete</button></td></tr>)}
      {countries.length === 0 && <tr><td colSpan={6} className="empty-row">No countries found.</td></tr>}
    </tbody></table></div><Pagination page={currentPage} pageSize={pageSize} totalItems={countries.length} onPageChange={setPage} onPageSizeChange={setPageSize}/></section>
    {pendingAction && <CountryConfirmation action={pendingAction} linkedSystems={systemCount(pendingAction.country.name)} onCancel={() => setPendingAction(null)} onConfirm={() => {
      if (pendingAction.type === "status") toggleCountryStatus(pendingAction.country);
      else removeCountry({ ...pendingAction.country, admins: systemCount(pendingAction.country.name) });
      setPendingAction(null);
    }}/>}
  </div>;
}

function CountryConfirmation({ action, linkedSystems, onCancel, onConfirm }: { action: CountryAction; linkedSystems: number; onCancel: () => void; onConfirm: () => void }) {
  if (typeof document === "undefined") return null;
  const isDelete = action.type === "delete";
  const nextStatus = action.country.status === "Active" ? "Inactive" : "Active";
  const blocked = isDelete && linkedSystems > 0;
  return createPortal(<div className={`${shellStyles.modalPortal} modal-viewport-backdrop`} onMouseDown={event => { if (event.target === event.currentTarget) onCancel(); }}>
    <section className="modal admin-modal country-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="country-confirm-title" aria-describedby="country-confirm-description">
      <div className="modal-header"><div><span className={`modal-icon ${isDelete ? "danger" : ""}`}><Icon name={isDelete ? "globe" : "activity"}/></span><div className="modal-title-copy"><span className="modal-eyebrow">COUNTRY MANAGEMENT</span><h2 id="country-confirm-title">{blocked ? "Country has linked systems" : isDelete ? "Delete country?" : "Change country status?"}</h2></div></div><button type="button" onClick={onCancel} aria-label="Close dialog">×</button></div>
      <div className="country-confirm-body"><p id="country-confirm-description">{blocked ? `${action.country.name} has ${linkedSystems} linked top-up ${linkedSystems === 1 ? "system" : "systems"}. Move those systems to another country before deleting it.` : isDelete ? `This will permanently remove ${action.country.name} from your country coverage.` : `Change ${action.country.name} from ${action.country.status} to ${nextStatus}?`}</p></div>
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={onCancel}>{blocked ? "Close" : "Cancel"}</button>{!blocked && <button type="button" className={`primary-button ${isDelete ? "danger-button" : ""}`} onClick={onConfirm}>{isDelete ? "Delete country" : `Set ${nextStatus}`} <Icon name={isDelete ? "close" : "check"} size={15}/></button>}</div>
    </section>
  </div>, document.body);
}
