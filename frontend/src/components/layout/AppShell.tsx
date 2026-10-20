"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Brand } from "@/components/auth/LoginPage";

const navigation = [
  { label: "Overview", href: "/overview", icon: "▦" },
  { label: "Analytics", href: "/analytics", icon: "↗" },
  { label: "Admin management", href: "/admin-management", icon: "♙" },
  { label: "Countries", href: "/countries", icon: "◎" },
  { label: "Activity logs", href: "/activity-logs", icon: "◷" },
];
const titles: Record<string, string> = {
  "/overview": "Overview", "/analytics": "Analytics", "/admin-management": "Admin management", "/activity-logs": "Activity logs", "/settings": "Settings",
};

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { countries, topupSystems, activity, profile, search, notice, modal, setSearch, clearSearch, dismissNotice, flash } = useWorkspace();
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const title = pathname.startsWith("/admin-management/") ? topupSystems.find(system => system.id === pathname.split("/")[2])?.name ?? "Top-up system" : titles[pathname] ?? "Overview";

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
      if (countries.some(country => `${country.name} ${country.code} ${country.region}`.toLowerCase().includes(term))) router.push("/countries");
      else if (activity.some(item => `${item.name} ${item.action} ${item.target}`.toLowerCase().includes(term))) router.push("/activity-logs");
      else router.push("/admin-management");
    }
  }

  if (!ready || !authorized) return <main className="shell-loading" aria-label="Loading workspace"/>;
  return <main className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${mobileSidebarOpen ? "mobile-sidebar-open" : ""}`}>
    <aside className="sidebar" aria-label="Workspace sidebar">
      <button className="mobile-sidebar-close" onClick={() => setMobileSidebarOpen(false)} aria-label="Close menu">×</button>
      <div className="sidebar-brand-row"><Brand onClick={() => { clearSearch(); router.push("/overview"); }}/></div>
      <div className="nav-label">MENU</div>
      <nav aria-label="Main menu">{navigation.map(item => { const active = pathname === item.href || pathname.startsWith(`${item.href}/`); return <Link key={item.href} href={item.href} title={sidebarCollapsed ? item.label : undefined} aria-current={active ? "page" : undefined} className={`nav-item ${active ? "selected" : ""}`} onClick={() => { clearSearch(); setMobileSidebarOpen(false); }}><span className="nav-icon">{item.icon}</span><span className="nav-text">{item.label}</span>{item.label === "Admin management" && <span className="nav-count">{topupSystems.length}</span>}</Link>; })}</nav>
      <div className="sidebar-bottom"><Link href="/settings" title={sidebarCollapsed ? "Settings" : undefined} aria-current={pathname === "/settings" ? "page" : undefined} className={`nav-item ${pathname === "/settings" ? "selected" : ""}`} onClick={() => { clearSearch(); setMobileSidebarOpen(false); }}><span className="nav-icon">⚙</span><span className="nav-text">Settings</span></Link><button className="profile" onClick={logout} title={sidebarCollapsed ? `Sign out · ${profile.name}` : "Sign out"}><span className="avatar profile-avatar">{initialsFor(profile.name)}</span><span className="profile-meta"><strong>{profile.name}</strong><small>Country Admin · Sign out</small></span><span className="profile-more">↗</span></button></div>
    </aside>
    <section className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu-toggle" onClick={() => setMobileSidebarOpen(true)} aria-label="Open navigation menu" aria-expanded={mobileSidebarOpen}><span/><span/><span/></button><button className="header-sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!sidebarCollapsed} title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}><span aria-hidden="true">{sidebarCollapsed ? "›" : "‹"}</span></button><div className="breadcrumbs">Workspace <span>/</span> <strong>{title}</strong></div></div><div className="top-actions"><label className="global-search"><span>⌕</span><input value={search} onChange={event => setSearch(event.target.value)} onKeyDown={event => { if (event.key === "Enter") handleGlobalSearch(); }} placeholder={pathname === "/overview" || pathname === "/settings" ? "Search workspace…" : `Search ${title.toLowerCase()}…`} aria-label="Search workspace"/>{search && <button onClick={clearSearch} aria-label="Clear search">×</button>}</label><div className="notification-wrap"><button className="icon-btn notification" aria-label="Notifications" aria-expanded={notificationsOpen} aria-controls="notification-popover" onClick={() => setNotificationsOpen(!notificationsOpen)}>♧{!notificationsRead && <i/>}</button>{notificationsOpen && <div className="notification-popover" id="notification-popover" role="dialog" aria-label="Notifications"><div className="notification-popover-heading"><div><strong>Notifications</strong><small>{activity.length ? `${activity.length} recent workspace updates` : "You are all caught up"}</small></div><button onClick={() => setNotificationsRead(true)} disabled={notificationsRead}>{notificationsRead ? "All read" : "Mark all read"}</button></div><div className="notification-list">{activity.slice(0, 4).map(item => <article className="notification-item" key={item.id}><span className="notification-icon" style={{background:`${item.color}18`,color:item.color}}>{item.category === "Country" ? "◎" : item.category === "Settings" ? "⚙" : "♙"}</span><div><p><strong>{item.name}</strong> {item.action} <b>{item.target}</b></p><small>{item.time} · {item.category}</small></div>{!notificationsRead && <i className="notification-unread-dot"/>}</article>)}{activity.length === 0 && <p className="notification-empty">Workspace updates will appear here.</p>}</div><Link href="/activity-logs" onClick={() => { clearSearch(); setNotificationsOpen(false); }}>View all activity <span>→</span></Link></div>}</div><span className="top-divider"/><button className="avatar top-avatar" onClick={logout} aria-label="Sign out">{initialsFor(profile.name)}</button></div></header>
      <div className="content">{children}<footer className="app-footer"><span>© 2026 Country Admin, Inc.</span><span>All systems operational <i/></span><button onClick={() => flash("Privacy and terms are available from your organization administrator.")}>Privacy &nbsp;·&nbsp; Terms</button></footer></div>
    </section>
    {notice && <div className="toast" role="status"><span>✓</span>{notice}<button onClick={dismissNotice} aria-label="Dismiss message">×</button></div>}
    {modal && <WorkspaceModal/>}
  </main>;
}

function WorkspaceModal() {
  const { modal, addCountry, openModal } = useWorkspace();
  if (!modal) return null;
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) openModal(null); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><span className="modal-icon">◎</span><h2 id="modal-title">Add a country</h2><p>Add a country to your global workspace.</p></div><button onClick={() => openModal(null)} aria-label="Close dialog">×</button></div><form onSubmit={addCountry}><label htmlFor="country-name">Country name</label><input id="country-name" name="name" placeholder="e.g. New Zealand" required/><div className="modal-fields"><div><label htmlFor="country-code">Country code</label><input id="country-code" name="code" placeholder="NZ" maxLength={3} required/></div><div><label htmlFor="country-region">Region</label><select id="country-region" name="region"><option>Asia Pacific</option><option>Europe</option><option>North America</option><option>South America</option><option>Africa</option><option>Middle East</option></select></div></div><ModalActions onCancel={() => openModal(null)} submit="Add country"/></form></section></div>;
}

function ModalActions({ onCancel, submit }: { onCancel: () => void; submit: string }) { return <div className="modal-actions"><button type="button" className="secondary-button" onClick={onCancel}>Cancel</button><button type="submit" className="primary-button">{submit} <span>→</span></button></div>; }
function initialsFor(name: string) { return name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase(); }
