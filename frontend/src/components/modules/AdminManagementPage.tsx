"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CountryCode, getCountryCallingCode, isValidPhoneNumber, validatePhoneNumberLength } from "libphonenumber-js";
import { initialSystemProducts, initialSystemRetailers } from "@/data/initial-data";
import { useWorkspace } from "@/context/WorkspaceContext";
import PageHeading from "@/components/shared/PageHeading";
import Icon from "@/components/shared/Icon";
import Pagination from "@/components/shared/Pagination";
import shellStyles from "@/components/layout/AppShell.module.css";

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
    <PageHeading eyebrow="PLATFORM & TENANT MANAGEMENT" title="Admin management" description="Manage top-up systems in your country network." action={<button className="primary-button" onClick={() => setAddAdminOpen(true)}><Icon name="plus" size={15}/> Add admin</button>}/>
    <section className="overview-kpis module-kpis" aria-label="Admin management key metrics">
      <article className="overview-kpi kpi-purple"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="user"/></span><span className="kpi-trend">Systems</span></div><span className="overview-kpi-label">Top-up admins</span><strong>{topupSystems.length}</strong><small>Managed systems</small></article>
      <article className="overview-kpi kpi-green"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="check"/></span><span className="kpi-trend">Active</span></div><span className="overview-kpi-label">Active admins</span><strong>{activeSystems}</strong><small>{topupSystems.length-activeSystems} inactive</small></article>
      <article className="overview-kpi kpi-blue"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="grid"/></span><span className="kpi-trend">Network</span></div><span className="overview-kpi-label">Retailers</span><strong>{totalRetailers}</strong><small>Across systems</small></article>
      <article className="overview-kpi kpi-amber"><div className="overview-kpi-top"><span className="overview-kpi-icon"><Icon name="package"/></span><span className="kpi-status all-clear">Catalog</span></div><span className="overview-kpi-label">Products</span><strong>{totalProducts}</strong><small>Available products</small></article>
    </section>
    <section className="system-directory-panel">
      <div className="system-directory-heading"><div><span className="panel-eyebrow">COUNTRY ADMINISTRATION</span><h2>Top-up system admins</h2><p>Each top-up system is managed as an admin. Select one to view its operations.</p></div><span className="system-directory-count">{systems.length} {systems.length === 1 ? "admin" : "admins"}</span></div>
      <div className="system-directory-grid">{pageSystems.map((system) => <Link href={`/admin-management/${system.id}`} className="system-directory-card" key={system.id}>
        <div className="system-card-top"><span className="system-brand-mark" style={{ background: `linear-gradient(145deg, ${system.accent}, #6385dc)` }}>{system.name.slice(0, 1)}</span><span className={`system-active-pill ${system.status === "Active" ? "" : "system-pending-pill"}`}><i/>{system.status}</span></div>
        <div className="system-card-title"><h3>{system.name}</h3><span className="system-country-tag">{countryFlag(system.country)} &nbsp;{system.country}</span></div>
        <p className="system-card-contact">Admin contact <strong>{system.contactName}</strong> · {system.contactEmail}</p>
        <div className="system-card-stats"><div><strong>{system.id === "nsol" ? initialSystemRetailers.length : 0}</strong><span>Retailers</span></div><div><strong>{system.id === "nsol" ? initialSystemProducts.length : 0}</strong><span>Products</span></div><div><strong>{system.id === "nsol" ? `LKR ${(initialSystemRetailers.reduce((sum, retailer) => sum + retailer.sales, 0) / 1000).toFixed(0)}k` : "—"}</strong><span>Sales tracked</span></div></div>
        <div className="system-card-footer"><span>Admin since {system.created}</span><span className="system-open-label">View admin details <b><Icon name="arrow-right" size={14}/></b></span></div>
      </Link>)}{systems.length === 0 && <div className="system-directory-empty">No top-up admins match “{search}”.</div>}</div>
      <Pagination page={currentPage} pageSize={pageSize} totalItems={systems.length} onPageChange={setPage} onPageSizeChange={setPageSize}/>
    </section>
    {addAdminOpen && <TopupAdminModal countries={countries} onClose={() => setAddAdminOpen(false)} onSubmit={submitAdmin}/>}
  </div>;
}

function TopupAdminModal({ countries, onClose, onSubmit }: { countries: Array<{ name: string; code: string }>; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]?.name ?? "");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const phoneInput = useRef<HTMLInputElement>(null);
  const selectedCountryCode = countries.find((country) => country.name === selectedCountry)?.code;
  let dialCode = "";
  try { if (selectedCountryCode) dialCode = getCountryCallingCode(selectedCountryCode.toUpperCase() as CountryCode); } catch { /* Keep the number field usable if metadata is unavailable. */ }

  function phoneLengthError(value: string, countryCode = selectedCountryCode) {
    if (!value) return "Enter a contact number.";
    if (!countryCode) return "Select a country with a valid calling code.";
    const length = validatePhoneNumberLength(value, countryCode.toUpperCase() as CountryCode);
    if (length === "TOO_SHORT") return "This number has too few digits for the selected country.";
    if (length === "TOO_LONG") return "This number has too many digits for the selected country.";
    if (length === "INVALID_LENGTH") return "This number has an invalid length for the selected country.";
    if (!isValidPhoneNumber(value, countryCode.toUpperCase() as CountryCode)) return "Enter a valid contact number for the selected country.";
    return "";
  }

  function changePhone(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/\D/g, "");
    if (selectedCountryCode && value) {
      const length = validatePhoneNumberLength(value, selectedCountryCode.toUpperCase() as CountryCode);
      if (length === "TOO_LONG") {
        setPhoneError("This number has reached the maximum length for the selected country.");
        return;
      }
    }
    setPhone(value);
    setPhoneError(value ? phoneLengthError(value) : "");
    event.target.setCustomValidity("");
  }

  function changeCountry(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCountry(event.target.value);
    setPhoneError(phone ? phoneLengthError(phone, countries.find((country) => country.name === event.target.value)?.code) : "");
    phoneInput.current?.setCustomValidity("");
  }

  function validateAndSubmit(event: FormEvent<HTMLFormElement>) {
    const error = phoneLengthError(phone);
    if (error) {
      event.preventDefault();
      setPhoneError(error);
      phoneInput.current?.setCustomValidity(error);
      phoneInput.current?.reportValidity();
      return;
    }
    onSubmit(event);
  }

  if (typeof document === "undefined") return null;
  return createPortal(<div className={`${shellStyles.modalPortal} modal-viewport-backdrop`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="modal admin-modal" role="dialog" aria-modal="true" aria-labelledby="topup-admin-modal-title">
    <div className="modal-header"><div><span className="modal-icon"><Icon name="user"/></span><div className="modal-title-copy"><span className="modal-eyebrow">SYSTEM ACCESS</span><h2 id="topup-admin-modal-title">Add admin</h2></div></div><button type="button" onClick={onClose} aria-label="Close dialog">×</button></div>
    <form onSubmit={validateAndSubmit}><div className="admin-form-grid"><div className="admin-form-field"><label htmlFor="topup-admin-name">System name</label><input id="topup-admin-name" name="name" placeholder="e.g. NSOL E-PIN" required/></div><div className="admin-form-field"><label htmlFor="topup-admin-contact">Contact name</label><input id="topup-admin-contact" name="contactName" placeholder="e.g. Nsol Operations" required/></div><div className="admin-form-field"><label htmlFor="topup-admin-email">Contact email</label><input id="topup-admin-email" name="email" type="email" placeholder="operations@example.com" required/></div><div className="admin-form-field"><label htmlFor="topup-admin-country">Country</label><select id="topup-admin-country" name="country" value={selectedCountry} onChange={changeCountry} required>{countries.map((country) => <option key={country.code} value={country.name}>{country.name}</option>)}</select></div><div className="admin-form-field admin-phone-field"><label htmlFor="topup-admin-phone">Contact number</label><div className="admin-phone-control"><span aria-label={`Country calling code plus ${dialCode}`}>+{dialCode || "—"}</span><input ref={phoneInput} id="topup-admin-phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national" value={phone} onChange={changePhone} onBlur={() => setPhoneError(phone ? phoneLengthError(phone) : "")} maxLength={15} placeholder="Phone number" required aria-describedby={phoneError ? "topup-phone-error" : undefined}/></div>{phoneError && <small id="topup-phone-error" className="admin-phone-error" role="status">{phoneError}</small>}<input type="hidden" name="dialCode" value={dialCode}/></div></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Add admin <span><Icon name="arrow-right" size={14}/></span></button></div></form>
  </section></div>, document.body);
}

function countryFlag(country: string) {
  return <Icon name="globe" size={14} aria-label={country}/>;
}
