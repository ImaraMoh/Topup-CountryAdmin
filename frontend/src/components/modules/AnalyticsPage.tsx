"use client";

import { PointerEvent as ReactPointerEvent, ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/context/WorkspaceContext";
import { initialSystemProducts, initialSystemRetailers } from "@/data/initial-data";
import PageHeading from "@/components/shared/PageHeading";
import Icon, { IconName } from "@/components/shared/Icon";
import styles from "./AnalyticsPage.module.css";

const periods = ["7 days", "30 days", "90 days"] as const;
type Period = (typeof periods)[number];
const trends: Record<Period, number[]> = {
  "7 days": [380, 460, 420, 560, 510, 690, 640, 770, 730, 880, 800, 960],
  "30 days": [350, 410, 390, 480, 460, 570, 530, 650, 610, 740, 690, 860],
  "90 days": [240, 330, 310, 390, 370, 480, 440, 560, 530, 660, 620, 780],
};
const categoryGroups = [
  { name: "Telecom", icon: "activity" as IconName, color: "telecom", categories: [{ name: "Mobile reload", value: 285000 }, { name: "Data bundles", value: 214000 }, { name: "Voice & SMS", value: 126000 }] },
  { name: "Digital services", icon: "layers" as IconName, color: "digital", categories: [{ name: "Gaming PINs", value: 196000 }, { name: "Gift cards", value: 178000 }, { name: "Utility payments", value: 108000 }] },
];
const networkMix = [
  { name: "Dialog", value: 384000, color: "#684285" },
  { name: "Mobitel", value: 298000, color: "#9271ac" },
  { name: "Airtel", value: 243000, color: "#c0a8d0" },
  { name: "Hutch", value: 182000, color: "#e0d4e9" },
];
const retailerAdminLinks: Record<number, string[]> = {
  201: ["nsol", "apex-digital"],
  202: ["nsol", "northstar-reload", "apex-digital"],
  203: ["nsol", "harbor-connect"],
  204: ["nsol", "apex-digital", "northstar-reload"],
  205: ["nsol", "harbor-connect"],
};
const productSales: Record<string, number> = {
  "NSL-500": 185000, "NSL-1000": 100000, "NSD-30": 90000, "NSD-60": 124000,
  "NSV-01": 126000, "NSG-1000": 196000, "NSGFT-2500": 178000, "NSU-01": 108000,
};
const money = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 });
const compactMoney = new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", notation: "compact", maximumFractionDigits: 1 });

export default function AnalyticsPage() {
  const { topupSystems, countries } = useWorkspace();
  const [period, setPeriod] = useState<Period>("30 days");
  const retailers = initialSystemRetailers;
  const products = initialSystemProducts;
  const totalSales = categoryGroups.flatMap((group) => group.categories).reduce((sum, category) => sum + category.value, 0);
  const activeRegionCount = new Set(countries.filter((country) => country.status === "Active").map((country) => country.region)).size;
  const regions = useMemo(() => {
    const counts = countries.reduce<Record<string, number>>((result, country) => {
      result[country.region] = (result[country.region] ?? 0) + 1;
      return result;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [countries]);
  const retailersRanked = useMemo(() => [...retailers].sort((a, b) => b.sales - a.sales).map((retailer) => ({ ...retailer, admins: retailerAdminLinks[retailer.id]?.length ?? 1 })), [retailers]);
  const adminsRanked = useMemo(() => topupSystems.map((system) => {
    const linkedRetailers = retailersRanked.filter((retailer) => retailerAdminLinks[retailer.id]?.includes(system.id));
    return { ...system, retailerCount: linkedRetailers.length, sales: linkedRetailers.reduce((sum, retailer) => sum + retailer.sales, 0) };
  }).sort((a, b) => b.sales - a.sales), [topupSystems, retailersRanked]);
  const productsRanked = useMemo(() => [...products].map((product) => ({ ...product, sales: productSales[product.sku] ?? 0 })).sort((a, b) => b.sales - a.sales).slice(0, 5), [products]);
  const values = trends[period];
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 760},${210 - value / 6}`).join(" ");
  const areaPath = `M 0 210 L ${points} L 760 210 Z`;
  const linePath = `M ${points}`;
  const hoveredValue = hoveredPoint === null ? null : values[hoveredPoint];
  const hoveredX = hoveredPoint === null ? 0 : (hoveredPoint / (values.length - 1)) * 100;
  const hoveredY = hoveredValue === null ? 0 : ((210 - hoveredValue / 6) / 220) * 100;
  function moveChartPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    setHoveredPoint(Math.round(progress * (values.length - 1)));
  }
  const circumference = 2 * Math.PI * 59;
  let offset = 0;
  const networkSegments = networkMix.map((network) => {
    const share = network.value / totalSales;
    const segment = { ...network, dash: `${share * circumference} ${circumference}`, offset };
    offset -= share * circumference;
    return segment;
  });

  return <div className={`module-page analytics-module ${styles.root}`}>
    <PageHeading eyebrow="PERFORMANCE" title="Analytics" description="Sales, product mix and rankings." action={<div className={styles.periodControl} aria-label="Analytics period">{periods.map((option) => <button type="button" className={period === option ? styles.periodActive : ""} onClick={() => setPeriod(option)} key={option}>{option}</button>)}</div>} />

    <section className={styles.kpiGrid} aria-label="Network metrics">
      <Metric icon="layers" label="Platform admins" value={topupSystems.length} note={`${topupSystems.filter((admin) => admin.status === "Active").length} active`} tone="violet"/>
      <Metric icon="grid" label="Retailers" value={retailers.length} note="Across admin networks" tone="blue"/>
      <Metric icon="package" label="Products" value={products.length} note="6 product categories" tone="plum"/>
      <Metric icon="globe" label="Networks" value={networkMix.length} note="Telecom operators" tone="green"/>
    </section>

    <section className={styles.visualGrid} aria-label="Sales visualizations">
      <article className={`${styles.panel} ${styles.trendPanel}`}>
        <PanelTitle eyebrow="SALES TREND" title="Network performance" side={<span className={styles.totalPill}>{money.format(totalSales)}</span>}/>
        <div className={styles.chartSummary}><strong>{money.format(totalSales)}</strong><span><i/> Sales volume</span></div>
        <div className={styles.lineChart} role="img" aria-label={`Sales performance trend for the last ${period}`}>
          <div className={styles.chartAxis}><span>1.2M</span><span>800k</span><span>400k</span><span>0</span></div>
          <div className={styles.chartPlot} onPointerMove={moveChartPointer} onPointerLeave={() => setHoveredPoint(null)}>
          <svg viewBox="0 0 760 220" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="analyticsArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#805a9a" stopOpacity=".25"/><stop offset="100%" stopColor="#805a9a" stopOpacity="0"/></linearGradient></defs>
            {[30, 90, 150, 210].map((y) => <line key={y} x1="0" x2="760" y1={y} y2={y} className={styles.gridLine}/>)}
            <path d={areaPath} fill="url(#analyticsArea)"/>
            <path d={linePath} className={styles.chartLine}/>
            {values.map((value, index) => <circle key={index} cx={(index / (values.length - 1)) * 760} cy={210 - value / 6} r={index === hoveredPoint ? 7 : 3.5} className={styles.chartPoint}><title>{money.format(value * 1000)}</title></circle>)}
            {hoveredPoint !== null && <line x1={hoveredPoint / (values.length - 1) * 760} x2={hoveredPoint / (values.length - 1) * 760} y1="15" y2="210" className={styles.chartCrosshair}/>}
          </svg>
          {hoveredValue !== null && <div className={styles.chartTooltip} style={{ left: `${Math.min(90, Math.max(10, hoveredX))}%`, top: `${Math.max(5, hoveredY)}%` }}><strong>{money.format(hoveredValue * 1000)}</strong><span>{period} · point {hoveredPoint! + 1}</span></div>}
          </div>
        </div>
        <div className={styles.chartLabels}>{(period === "7 days" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : period === "30 days" ? ["01", "05", "10", "15", "20", "25", "30"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]).map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>
      </article>

      <article className={`${styles.panel} ${styles.networkPanel}`}>
        <PanelTitle eyebrow="NETWORK MIX" title="Sales by network" side={<Link className={styles.panelLink} href="/admin-management">Admins <Icon name="arrow-right" size={14}/></Link>}/>
        <div className={styles.donutContent}>
          <div className={styles.donutWrap} role="img" aria-label={networkMix.map((network) => `${network.name}: ${money.format(network.value)}`).join(", ")}>
            <svg viewBox="0 0 150 150" aria-hidden="true"><circle cx="75" cy="75" r="59" className={styles.donutTrack}/>{networkSegments.map((network) => <circle key={network.name} cx="75" cy="75" r="59" fill="none" stroke={network.color} strokeWidth="16" strokeDasharray={network.dash} strokeDashoffset={network.offset} className={styles.donutSegment}/>)}</svg>
            <div className={styles.donutCenter}><strong>{networkMix.length}</strong><span>networks</span></div>
          </div>
          <div className={styles.networkLegend}>{networkMix.map((network) => <div className={styles.networkRow} key={network.name}><span className={styles.networkName}><i style={{ background: network.color }}/>{network.name}</span><strong>{money.format(network.value)}</strong></div>)}</div>
        </div>
        <div className={styles.networkFoot}><Icon name="globe" size={15}/><span>{countries.length} country markets</span><span className={styles.footDivider}/><span>{activeRegionCount} active regions</span></div>
      </article>
    </section>

    <section className={styles.categorySection}>
      <PanelTitle eyebrow="PRODUCT PORTFOLIO" title="Six product categories" side={<span className={styles.categoryCount}>2 groups · 3 each</span>}/>
      <div className={styles.categoryGrid}>{categoryGroups.map((group) => <article className={`${styles.categoryCard} ${styles[group.color]}`} key={group.name}>
        <div className={styles.categoryHeader}><span className={styles.categoryIcon}><Icon name={group.icon} size={18}/></span><div><h3>{group.name}</h3><span>3 categories</span></div><strong>{money.format(group.categories.reduce((sum, category) => sum + category.value, 0))}</strong></div>
        <div className={styles.categoryTiles}>{group.categories.map((category, index) => <div className={styles.categoryTile} key={category.name}><span className={styles.tileIndex}>{String(index + 1).padStart(2, "0")}</span><strong>{category.name}</strong><span>{money.format(category.value)}</span></div>)}</div>
      </article>)}</div>
    </section>

    <section className={styles.rankingSection}>
      <PanelTitle eyebrow="LEADERBOARDS" title="Performance rankings" side={<span className={styles.categoryCount}>Ranked by sales</span>}/>
      <div className={styles.rankingGrid}>
        <RankingCard title="Retailers" icon="grid" action={<Link href="/admin-management/nsol">View network <Icon name="arrow-right" size={13}/></Link>}>
          {retailersRanked[0] && <div className={styles.retailerLeader}><span className={styles.leaderLabel}>TOP RETAILER</span><div className={styles.leaderIdentity}><span>01</span><div><strong>{retailersRanked[0].shopName}</strong><small>{retailersRanked[0].location} · {retailersRanked[0].admins} admin networks</small></div></div><strong className={styles.leaderSales}>{money.format(retailersRanked[0].sales)}</strong></div>}
          <div className={styles.retailerList}>{retailersRanked.slice(1).map((retailer, index) => <div className={styles.retailerRow} key={retailer.id}><span className={styles.retailerPlace}>{String(index + 2).padStart(2, "0")}</span><div><strong>{retailer.shopName}</strong><small>{retailer.location} · {retailer.admins} admin networks</small></div><b>{money.format(retailer.sales)}</b></div>)}</div>
        </RankingCard>
        <RankingCard title="Platform admins" icon="layers" action={<Link href="/admin-management">View all <Icon name="arrow-right" size={13}/></Link>}>
          <div className={styles.adminTable}><div className={styles.adminTableHeader}><span>RANK / ADMIN</span><span>RETAILERS</span><span>SALES</span></div>{adminsRanked.map((admin, index) => <div className={styles.adminTableRow} key={admin.id}><span className={`${styles.adminRank} ${index < 3 ? styles.adminRankTop : ""}`}>{String(index + 1).padStart(2, "0")}</span><div className={styles.adminName}><strong>{admin.name}</strong><small>{admin.country}</small></div><strong className={styles.retailerTotal}>{admin.retailerCount}</strong><strong className={styles.adminSales}>{compactMoney.format(admin.sales)}</strong></div>)}</div>
        </RankingCard>
        <RankingCard title="Products" icon="package" action={<span className={styles.rankHint}>Top 5</span>}>
          <div className={styles.productCatalogList}>{productsRanked.map((product, index) => <div className={styles.productCatalogRow} key={product.id}><span className={`${styles.productOrdinal} ${index < 3 ? styles.productOrdinalTop : ""}`}>{String(index + 1).padStart(2, "0")}</span><span className={styles.productGlyph}><Icon name="package" size={16}/></span><div className={styles.productCatalogName}><strong>{product.name}</strong><small>{product.category} · {product.sku}</small></div><strong className={styles.productSales}>{compactMoney.format(product.sales)}</strong></div>)}</div>
        </RankingCard>
      </div>
    </section>
  </div>;
}

function Metric({ icon, label, value, note, tone }: { icon: IconName; label: string; value: number; note: string; tone: string }) {
  return <article className={`${styles.metricCard} ${styles[tone]}`}><div className={styles.metricTop}><span className={styles.metricIcon}><Icon name={icon} size={18}/></span><span className={styles.metricOrb}/></div><span className={styles.metricLabel}>{label}</span><div className={styles.metricValue}><strong>{value}</strong><span>{note}</span></div></article>;
}

function PanelTitle({ eyebrow, title, side }: { eyebrow: string; title: string; side?: ReactNode }) {
  return <div className={styles.panelTitle}><div><span>{eyebrow}</span><h2>{title}</h2></div>{side}</div>;
}

function RankingCard({ title, icon, action, children }: { title: string; icon: IconName; action: ReactNode; children: ReactNode }) {
  return <article className={`${styles.panel} ${styles.rankCard}`}><div className={styles.rankHeader}><span className={styles.rankIcon}><Icon name={icon} size={17}/></span><h3>{title}</h3>{action}</div><div className={styles.rankList}>{children}</div></article>;
}
