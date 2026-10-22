"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";
import { countryOptions } from "@/data/country-options";
import { Brand } from "@/components/auth/LoginPage";
import Icon, { type IconName } from "@/components/shared/Icon";
import styles from "./AppShell.module.css";

const navigation: Array<{ label: string; href: string; icon: IconName }> = [
  { label: "Overview", href: "/overview", icon: "grid" },
  { label: "Analytics", href: "/analytics", icon: "chart" },
  { label: "Admin management", href: "/admin-management", icon: "layers" },
  { label: "Countries", href: "/countries", icon: "globe" },
];

const titles: Record<string, string> = {
  "/overview": "Overview",
  "/analytics": "Analytics",
  "/admin-management": "Admin management",
  "/activity-logs": "Activity logs",
  "/settings": "Settings",
};

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { countries, topupSystems, profile, search, notice, modal, activity, setSearch, clearSearch, dismissNotice, flash } = useWorkspace();
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifications = activity.filter(item => item.category === "Admin" || item.category === "Country").slice(0, 8);

  const title = pathname.startsWith("/admin-management/")
    ? topupSystems.find(system => system.id === pathname.split("/")[2])?.name ?? "Top-up system"
    : titles[pathname] ?? "Overview";

  useEffect(() => {
    function handleViewportChange() {
      setMobileSidebarOpen(false);
      if (window.innerWidth <= 820) setSidebarCollapsed(false);
    }
    window.addEventListener("resize", handleViewportChange);
    return () => window.removeEventListener("resize", handleViewportChange);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hasSession = localStorage.getItem("country-admin-session") === "active" || sessionStorage.getItem("country-admin-session") === "active";
      setAuthorized(hasSession);
      setReady(true);
      if (!hasSession) router.replace("/");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  function logout() {
    localStorage.removeItem("country-admin-session");
    sessionStorage.removeItem("country-admin-session");
    router.replace("/");
  }

  function handleGlobalSearch() {
    const term = search.trim().toLowerCase();
    if (!term) return;
    if (["/overview", "/settings"].includes(pathname)) {
      if (countries.some(country => `${country.name} ${country.code} ${country.region}`.toLowerCase().includes(term))) {
        router.push("/countries");
      } else {
        router.push("/admin-management");
      }
    }
  }

  if (!ready || !authorized) return <main className="shell-loading" aria-label="Loading workspace"/>;

  return (
    <main className={`${styles.root} app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${mobileSidebarOpen ? "mobile-sidebar-open" : ""}`}>
      {/* Ultra-Premium Sidebar */}
      <aside className="sidebar" aria-label="Workspace sidebar">
        <button className="mobile-sidebar-close" onClick={() => setMobileSidebarOpen(false)} aria-label="Close menu">×</button>
        <div className="sidebar-brand-row">
          <div className="side-brand">
            <Brand onClick={() => { clearSearch(); router.push("/overview"); }}/>
          </div>
        </div>

        <div className="nav-label">MAIN NAVIGATION</div>
        <nav aria-label="Main menu">
          {navigation.map(item => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={sidebarCollapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={`nav-item ${active ? "selected" : ""}`}
                onClick={() => { clearSearch(); setMobileSidebarOpen(false); }}
              >
                <span className="nav-icon"><Icon name={item.icon}/></span>
                <span className="nav-text">{item.label}</span>
                {item.label === "Admin management" && <span className="nav-count">{topupSystems.length}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <Link
            href="/settings"
            title={sidebarCollapsed ? "Settings" : undefined}
            aria-current={pathname === "/settings" ? "page" : undefined}
            className={`nav-item ${pathname === "/settings" ? "selected" : ""}`}
            onClick={() => { clearSearch(); setMobileSidebarOpen(false); }}
          >
            <span className="nav-icon"><Icon name="settings"/></span>
            <span className="nav-text">Settings</span>
          </Link>

          <button className="profile" onClick={logout} title={sidebarCollapsed ? `Sign out · ${profile.name}` : "Sign out"}>
            <span className="avatar profile-avatar">{initialsFor(profile.name)}</span>
            <span className="profile-meta">
              <strong>{profile.name}</strong>
              <small>Country Admin</small>
            </span>
            <span className="profile-more"><Icon name="arrow-right" size={14}/></span>
          </button>
        </div>
      </aside>

      {mobileSidebarOpen && <button className="sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)} aria-label="Close navigation"/>}

      {/* Main Area with Ultra-Luxurious Glass Header */}
      <section className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-toggle" onClick={() => setMobileSidebarOpen(true)} aria-label="Open navigation menu" aria-expanded={mobileSidebarOpen}>
              <span/><span/><span/>
            </button>
            <button className="header-sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!sidebarCollapsed} title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <span aria-hidden="true"><Icon name={sidebarCollapsed ? "arrow-right" : "arrow-left"} size={16}/></span>
            </button>

            <div className="breadcrumbs">
              Workspace <span>/</span> <strong>{title}</strong>
            </div>
          </div>

          <div className="top-actions">
            <label className="global-search">
              <span><Icon name="search" size={15}/></span>
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                onKeyDown={event => { if (event.key === "Enter") handleGlobalSearch(); }}
                placeholder={pathname === "/overview" || pathname === "/settings" ? "Search workspace..." : `Search ${title.toLowerCase()}...`}
                aria-label="Search workspace"
              />
              {search && <button onClick={clearSearch} aria-label="Clear search">×</button>}
            </label>
            <button
              className="notification-toggle"
              type="button"
              aria-label="Open notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen(open => !open)}
            >
              <Icon name="bell" size={18}/>
              {notifications.length > 0 && <span className="notification-count">{notifications.length > 9 ? "9+" : notifications.length}</span>}
            </button>
            <span className="top-divider"/>
            <button className="avatar top-avatar" onClick={logout} aria-label="Sign out">{initialsFor(profile.name)}</button>
          </div>
        </header>

        {notificationsOpen && <>
          <button className="notification-backdrop" type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)}/>
          <section className="notification-drawer" aria-label="Notifications" aria-live="polite">
            <div className="notification-drawer-header">
              <div><span className="notification-eyebrow">WORKSPACE UPDATES</span><h2>Notifications</h2></div>
              <button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><Icon name="close" size={17}/></button>
            </div>
            {notifications.length ? <div className="notification-list">
              {notifications.map(item => <article className="notification-item" key={item.id}>
                <span className={`notification-item-icon ${item.category.toLowerCase()}`}><Icon name={item.category === "Country" ? "globe" : "user"} size={16}/></span>
                <div className="notification-item-copy"><p><strong>{item.name}</strong> {item.action} <b>{item.target}</b></p><span>{item.category} · {item.time}</span></div>
              </article>)}
            </div> : <div className="notification-empty"><span><Icon name="bell" size={21}/></span><strong>You’re all caught up</strong><p>Admin and country updates will appear here.</p></div>}
          </section>
        </>}

        <div className="content">
          {children}
          <footer className="app-footer">
            <span>© 2026 Neirah Tech, Inc.</span>
            <span>All systems operational <i/></span>
            <button onClick={() => flash("Privacy and terms are available from your organization administrator.")}>Privacy &nbsp;·&nbsp; Terms</button>
          </footer>
        </div>
      </section>

      {notice && (
        <div className="toast" role="status">
          <span><Icon name="check" size={16}/></span>
          {notice}
          <button onClick={dismissNotice} aria-label="Dismiss message">×</button>
        </div>
      )}

      {modal && <WorkspaceModal />}

    </main>
  );
}

function WorkspaceModal() {
  const { modal, addCountry, openModal, countries } = useWorkspace();
  const [selectedCode, setSelectedCode] = useState("");
  if (!modal || typeof document === "undefined") return null;
  const availableCountries = countryOptions.filter(option => !countries.some(country => country.code === option.code || country.name.toLocaleLowerCase() === option.name.toLocaleLowerCase()));
  const selectedCountry = availableCountries.find(country => country.code === selectedCode);

  return createPortal(
    <div className={`${styles.modalPortal} modal-viewport-backdrop`} onMouseDown={event => { if (event.target === event.currentTarget) openModal(null); }}>
      <section className="modal admin-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header"><div><span className="modal-icon"><Icon name="globe"/></span><div className="modal-title-copy"><span className="modal-eyebrow">COUNTRY COVERAGE</span><h2 id="modal-title">Add country</h2><p>Add a country to your workspace.</p></div></div><button type="button" onClick={() => openModal(null)} aria-label="Close dialog">×</button></div>
        <form onSubmit={addCountry}>
          <div className="admin-form-grid">
            <div className="admin-form-field"><label htmlFor="country-name">Country</label><select id="country-name" name="code" value={selectedCode} onChange={event => setSelectedCode(event.target.value)} required><option value="" disabled>Select a country</option>{availableCountries.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}</select></div>
            <div className="admin-form-field"><label htmlFor="country-code">Country code</label><input id="country-code" value={selectedCountry?.code ?? ""} placeholder="Auto-filled" readOnly/></div>
            <div className="admin-form-field"><label htmlFor="country-region">Region</label><input id="country-region" value={selectedCountry?.region ?? ""} placeholder="Auto-filled" readOnly/></div>
          </div>
          {availableCountries.length === 0 && <p className="country-list-empty">Every country is already in this workspace.</p>}
          <ModalActions onCancel={() => openModal(null)} submit="Add country"/>
        </form>
      </section>
    </div>, document.body
  );
}

function ModalActions({ onCancel, submit }: { onCancel: () => void; submit: string }) {
  return (
    <div className="modal-actions">
      <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
      <button type="submit" className="primary-button">{submit} <Icon name="arrow-right" size={15}/></button>
    </div>
  );
}

function initialsFor(name: string) {
  return name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
}
