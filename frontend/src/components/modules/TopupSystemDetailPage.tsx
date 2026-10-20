"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { initialSystemProducts, initialSystemRetailers, initialSystemSales } from "@/data/initial-data";
import { useWorkspace } from "@/context/WorkspaceContext";
import PageHeading from "@/components/shared/PageHeading";
import Icon from "@/components/shared/Icon";
import PaginatedTable from "@/components/shared/PaginatedTable";
import type { SystemProduct, SystemRetailer, SystemSale } from "@/types/admin";

const currency = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 });
const salesTrend = [38, 48, 43, 56, 49, 67, 61, 75, 70, 84, 78, 100];

export default function TopupSystemDetailPage({ systemId }: { systemId: string }) {
  const { topupSystems } = useWorkspace();
  const [activeTab, setActiveTab] = useState("overview");
  const system = topupSystems.find((item) => item.id === systemId);
  const isNsol = systemId === "nsol";
  const retailers = useMemo(() => isNsol ? initialSystemRetailers : [], [isNsol]);
  const products = isNsol ? initialSystemProducts : [];
  const sales = isNsol ? initialSystemSales : [];
  const salesTotal = retailers.reduce((total, retailer) => total + retailer.sales, 0);
  const completedSales = sales.filter((sale) => sale.status === "Completed");

  if (!system) return <div className="module-page system-detail-module"><section className="system-not-found"><span>?</span><h1>System not found</h1><p>This top-up system is not available in this workspace.</p><Link className="secondary-button" href="/admin-management">← Back to top-up systems</Link></section></div>;

  return <div className="module-page system-detail-module">
    <div className="system-detail-back"><Link href="/admin-management">← <span>All top-up systems</span></Link><span className="system-breadcrumb-separator">/</span><span>{system.name}</span></div>
    <PageHeading eyebrow="TOP-UP SYSTEM · SRI LANKA" title={system.name} description="Monitor this top-up system, its retailers, products, transactions, and sales performance."/>
    <section className="system-detail-hero">
      <div className="system-identity"><span className="system-brand-mark system-brand-large" style={{ background: `linear-gradient(145deg, ${system.accent}, #6385dc)` }}>N</span><div><span className="system-active-pill"><i/>{system.status} system</span><h2>{system.name}</h2><p>{system.country} · Managed by Country Admin</p></div></div>
      <div className="system-contact"><span>System contact</span><strong>{system.contactName}</strong><a href={`mailto:${system.contactEmail}`}>{system.contactEmail}</a></div>
      <div className="system-health-summary"><i/>System services operational</div>
    </section>
    <nav className="system-section-nav" role="tablist" aria-label={`${system.name} sections`}>{[["overview", "Overview"], ["retailers", "Retailers"], ["sales", "Sales"], ["products", "Products"]].map(([id, label]) => <button type="button" role="tab" aria-selected={activeTab === id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)} key={id}>{label}</button>)}</nav>

    {activeTab === "overview" && <div role="tabpanel" className="system-tab-panel">
    <section className="system-detail-kpis" id="system-overview" aria-label={`${system.name} key metrics`}>
      <article className="system-detail-kpi"><span className="system-kpi-icon purple-dot-bg"><Icon name="globe"/></span><small>Retail network sales</small><strong>{currency.format(salesTotal)}</strong><span className="system-kpi-change"><Icon name="arrow-up-right" size={13}/> 14.8% <i>vs. previous month</i></span></article>
      <article className="system-detail-kpi"><span className="system-kpi-icon blue-dot-bg"><Icon name="grid"/></span><small>Retailers</small><strong>{retailers.length}</strong><span className="system-kpi-sub">{retailers.filter((retailer) => retailer.status === "Active").length} active outlets</span></article>
      <article className="system-detail-kpi"><span className="system-kpi-icon green-dot-bg"><Icon name="package"/></span><small>Products</small><strong>{products.length}</strong><span className="system-kpi-sub">Available in this catalog</span></article>
      <article className="system-detail-kpi"><span className="system-kpi-icon amber-dot-bg"><Icon name="clock"/></span><small>Transactions</small><strong>{sales.length}</strong><span className="system-kpi-sub">{completedSales.length} completed · {sales.length - completedSales.length} pending</span></article>
    </section>

    <section className="system-detail-panel system-sales-analytics">
      <div className="system-section-heading"><div><span className="panel-eyebrow">PERFORMANCE</span><h2>Sales analytics</h2><p>Retail network sales and transaction activity.</p></div><span className="system-date-range">Last 30 days <span>⌄</span></span></div>
      <div className="system-chart-summary"><strong>{currency.format(salesTotal)}</strong><span className="system-kpi-change"><Icon name="arrow-up-right" size={13}/> 14.8%</span><small>Retail network sales volume</small></div>
      <div className="system-sales-chart" role="img" aria-label={`${system.name} sales trend for the last 30 days`}><div className="system-chart-guides"><i/><i/><i/><i/></div>{sales.length ? <div className="system-chart-bars">{salesTrend.map((height, index) => <span key={index} style={{ height: `${height}%` }} title={`Period ${index + 1}: ${height}% of peak sales`}/>)}</div> : <p className="system-empty-state">Sales analytics will appear once this system starts processing transactions.</p>}</div>
      <div className="system-chart-axis"><span>01 Oct</span><span>08 Oct</span><span>15 Oct</span><span>22 Oct</span><span>30 Oct</span></div>
      <div className="system-chart-footer"><span><i/>Sales volume</span><span>Transaction volume <strong>{sales.length.toLocaleString()}</strong></span></div>
    </section>

    </div>}

    {activeTab === "retailers" && <section role="tabpanel" className="system-detail-panel" id="system-retailers"><div className="system-section-heading"><div><span className="panel-eyebrow">RETAIL NETWORK</span><h2>Retailers</h2><p>Retail locations connected to this top-up system.</p></div><span className="system-table-total">{retailers.length} outlets</span></div>
      <PaginatedTable<SystemRetailer> rows={retailers} label="Retailers" columns={[
        { label: "SHOP", render: (retailer) => <div className="system-table-person"><span className="system-table-avatar">{retailer.shopName.slice(0, 1)}</span><span><strong>{retailer.shopName}</strong><small>{retailer.location}</small></span></div> },
        { label: "LOCATION", render: (retailer) => retailer.location },
        { label: "SALES · 30 DAYS", render: (retailer) => <strong className="system-money">{currency.format(retailer.sales)}</strong> },
        { label: "STATUS", render: (retailer) => <span className={`system-active-pill ${retailer.status === "Active" ? "" : "system-pending-pill"}`}><i/>{retailer.status}</span> },
      ]}/>
    </section>}

    {activeTab === "sales" && <section role="tabpanel" className="system-detail-panel" id="system-sales"><div className="system-section-heading"><div><span className="panel-eyebrow">TRANSACTIONS</span><h2>Recent sales</h2><p>Latest E-PIN and reload transactions processed by retailers.</p></div><span className="system-table-total">Today · {sales.length} sales</span></div>
      <PaginatedTable<SystemSale> rows={sales} label="Recent sales" columns={[
        { label: "REFERENCE", render: (sale) => <span className="system-reference">{sale.reference}</span> },
        { label: "RETAILER", render: (sale) => sale.retailer },
        { label: "PRODUCT", render: (sale) => sale.product },
        { label: "AMOUNT", render: (sale) => <strong className="system-money">{currency.format(sale.amount)}</strong> },
        { label: "TIME", render: (sale) => sale.time },
        { label: "STATUS", render: (sale) => <span className={`system-active-pill ${sale.status === "Completed" ? "" : "system-pending-pill"}`}><i/>{sale.status}</span> },
      ]}/>
    </section>}

    {activeTab === "products" && <section role="tabpanel" className="system-detail-panel" id="system-products"><div className="system-section-heading"><div><span className="panel-eyebrow">CATALOG</span><h2>Products</h2><p>Reload and data products available through this system.</p></div><span className="system-table-total">{products.length} products</span></div>
      <PaginatedTable<SystemProduct> rows={products} label="Products" columns={[
        { label: "PRODUCT", render: (product) => <div className="system-product-name"><span><Icon name="package"/></span><span><strong>{product.name}</strong><small>{product.sku}</small></span></div> },
        { label: "CATEGORY", render: (product) => product.category },
        { label: "UNIT PRICE", render: (product) => <strong className="system-money">{currency.format(product.price)}</strong> },
        { label: "AVAILABLE PINS", render: (product) => product.stock.toLocaleString() },
        { label: "STATUS", render: (product) => <span className={`system-active-pill ${product.status === "Available" ? "" : "system-low-stock-pill"}`}><i/>{product.status}</span> },
      ]}/>
    </section>}
  </div>;
}

