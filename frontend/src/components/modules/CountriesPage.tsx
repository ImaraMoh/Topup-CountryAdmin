"use client";

import { useMemo, useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import PageHeading from "@/components/shared/PageHeading";
import Pagination from "@/components/shared/Pagination";

export default function CountriesPage() {
  const { countriesWithAdminCounts, topupSystems, search, openModal, removeCountry, toggleCountryStatus } = useWorkspace();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const countries = useMemo(() => countriesWithAdminCounts.filter(country => `${country.name} ${country.code} ${country.region}`.toLowerCase().includes(search.toLowerCase())), [countriesWithAdminCounts, search]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(countries.length / pageSize)));
  const pageCountries = countries.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const systemCount = (countryName: string) => topupSystems.filter(system => system.country === countryName).length;
  return <div className="module-page countries-module">
    <PageHeading eyebrow="REGIONS & COVERAGE" title="Countries" description="Manage the countries connected to your workspace." action={<button className="primary-button" onClick={() => openModal("country")}>＋ Add country</button>}/>
    <section className="overview-kpis module-kpis" aria-label="Country key metrics">
      <article className="overview-kpi kpi-blue"><div className="overview-kpi-top"><span className="overview-kpi-icon">◎</span><span className="kpi-trend">Regions</span></div><span className="overview-kpi-label">Countries</span><strong>{countriesWithAdminCounts.length}</strong><small>In your workspace</small><div className="kpi-sparkline" aria-hidden="true">{[35,42,39,56,50,72,63,87,100].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></article>
      <article className="overview-kpi kpi-green"><div className="overview-kpi-top"><span className="overview-kpi-icon">✓</span><span className="kpi-trend">Live</span></div><span className="overview-kpi-label">Active countries</span><strong>{countriesWithAdminCounts.filter(country => country.status === "Active").length}</strong><small>Operating locations</small><div className="kpi-progress"><i style={{width:`${countriesWithAdminCounts.length?countriesWithAdminCounts.filter(country=>country.status==="Active").length/countriesWithAdminCounts.length*100:0}%`}}/></div></article>
      <article className="overview-kpi kpi-purple"><div className="overview-kpi-top"><span className="overview-kpi-icon">♙</span><span className="kpi-trend">Platform</span></div><span className="overview-kpi-label">Top-up admins</span><strong>{topupSystems.length}</strong><small>Connected systems</small><div className="kpi-sparkline" aria-hidden="true">{[28,39,43,54,61,66,77,88,100].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></article>
      <article className="overview-kpi kpi-amber"><div className="overview-kpi-top"><span className="overview-kpi-icon">◷</span><span className={`kpi-status ${countriesWithAdminCounts.some(country=>country.status==="Setup")?"needs-attention":"all-clear"}`}>{countriesWithAdminCounts.filter(country=>country.status==="Setup").length} setup</span></div><span className="overview-kpi-label">In setup</span><strong>{countriesWithAdminCounts.filter(country=>country.status==="Setup").length}</strong><small>Countries completing setup</small><div className="kpi-kicker"><span>Workspace coverage</span><span>→</span></div></article>
    </section>
    <section className="admin-card country-card"><div className="table-toolbar"><div className="table-caption"><strong>All countries</strong><span>{countries.length} results</span></div><span className="toolbar-hint">Use the search above to find a region</span></div><div className="table-scroll"><table><thead><tr><th>COUNTRY</th><th>CODE</th><th>REGION</th><th>TOP-UP SYSTEMS</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>
      {pageCountries.map(country => <tr key={country.id}><td><div className="country-name"><span className="flag">{country.flag}</span><strong>{country.name}</strong></div></td><td><span className="code-pill">{country.code}</span></td><td>{country.region}</td><td>{systemCount(country.name)}</td><td><button className={`status-pill ${country.status === "Active" ? "status-active" : "status-pending"}`} onClick={() => toggleCountryStatus(country)} title="Click to change status"><i/>{country.status} <span className="status-chevron">⌄</span></button></td><td><button className="text-action" onClick={() => removeCountry({ ...country, admins: systemCount(country.name) })} title={systemCount(country.name) > 0 ? "Move this system before removing the country" : "Remove this country"}>Remove</button></td></tr>)}
      {countries.length === 0 && <tr><td colSpan={6} className="empty-row">No countries found.</td></tr>}
    </tbody></table></div><Pagination page={currentPage} pageSize={pageSize} totalItems={countries.length} onPageChange={setPage} onPageSizeChange={setPageSize}/></section>
  </div>;
}
