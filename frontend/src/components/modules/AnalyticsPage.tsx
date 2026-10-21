"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useWorkspace } from "@/context/WorkspaceContext";
import PageHeading from "@/components/shared/PageHeading";
import Icon from "@/components/shared/Icon";
import MetricCard from "@/components/shared/MetricCard";

const periods = ["Last 7 days", "Last 30 days", "Last 90 days"] as const;
type Period = (typeof periods)[number];

const activityByPeriod: Record<Period, number[]> = {
  "Last 7 days": [33, 49, 40, 67, 54, 79, 64, 91, 74, 100, 82, 94],
  "Last 30 days": [26, 35, 31, 48, 42, 57, 49, 63, 60, 76, 69, 88],
  "Last 90 days": [18, 27, 24, 39, 35, 46, 43, 59, 53, 67, 62, 81],
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

export default function AnalyticsPage() {
  const { topupSystems, countries, activity } = useWorkspace();
  const [period, setPeriod] = useState<Period>("Last 30 days");
  const activeAdmins = topupSystems.filter((admin) => admin.status === "Active").length;
  const activeCountries = countries.filter((country) => country.status === "Active").length;
  const regionRows = useMemo(() => {
    const regions = ["Asia Pacific", "Europe", "North America", "South America", "Africa", "Middle East"];
    return regions.map((region) => {
      const count = countries.filter((country) => country.region === region).length;
      return { region, count, percent: countries.length ? Math.round((count / countries.length) * 100) : 0 };
    }).sort((a, b) => b.count - a.count);
  }, [countries]);
  const bars = activityByPeriod[period];

  return <div className="module-page analytics-module">
    <PageHeading eyebrow="WORKSPACE PERFORMANCE" title="Analytics" description="Workspace activity and country coverage." action={<label className="analytics-period">Period<select value={period} onChange={(event) => setPeriod(event.target.value as Period)} aria-label="Analytics date range">{periods.map((option) => <option key={option}>{option}</option>)}</select></label>} />
    <div className="metric-grid">
      <MetricCard icon={<Icon name="globe"/>} label="Countries" value={String(countries.length)} change={`${activeCountries} active`} color="blue"/>
      <MetricCard icon={<Icon name="layers"/>} label="Top-up admins" value={String(activeAdmins)} change={`${topupSystems.length} total`} color="purple"/>
      <MetricCard icon={<Icon name="activity"/>} label="Workspace events" value={String(activity.length)} change="Recorded" color="orange"/>
      <MetricCard icon={<Icon name="chart"/>} label="Coverage" value={`${countries.length ? Math.round((activeCountries / countries.length) * 100) : 0}%`} change="Active" color="green"/>
    </div>
    <div className="analytics-grid">
      <section className="analytics-card analytics-chart-card">
        <div className="card-heading"><div><h3>Workspace activity</h3><p>Activity trend · {period.toLowerCase()}</p></div></div>
        <div className="chart-legend"><span><i/>Workspace activity</span><small>relative volume</small></div>
        <div className="activity-chart" role="img" aria-label={`Workspace activity trend for ${period.toLowerCase()}`}>
          <div className="chart-y-labels"><span>High</span><span>Medium</span><span>Low</span></div>
          <div className="chart-plot"><div className="chart-gridlines"><i/><i/><i/><i/></div><div className="chart-bars">{bars.map((height, index) => <div className="chart-bar-column" key={`${period}-${index}`}><span className="chart-bar" style={{ height: `${height}%` }} title={`${days[index]}: relative activity ${height}%`}/><small>{days[index]}</small></div>)}</div></div>
        </div>
      </section>
      <section className="analytics-card region-analytics">
        <div className="card-heading"><div><h3>Country coverage</h3><p>Countries by region</p></div><Link className="secondary-button" href="/countries">View countries <span className="button-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></span></Link></div>
        <div className="region-analytics-list">{regionRows.map(({ region, count, percent }) => <div className="region-analytics-row" key={region}><div><span>{region}</span><strong>{count}</strong></div><div className="region-progress"><i style={{ width: `${percent}%` }}/></div><small>{percent}% of workspace</small></div>)}</div>
      </section>
    </div>
    <section className="analytics-summary"><div><span className="metric-icon blue"><Icon name="globe"/></span><p><strong>{countries.length}</strong><small>countries represented</small></p></div><div><span className="metric-icon purple"><Icon name="user"/></span><p><strong>{topupSystems.length}</strong><small>top-up admin systems</small></p></div><div><span className="metric-icon green"><Icon name="check"/></span><p><strong>{activeCountries}</strong><small>active country operations</small></p></div></section>
  </div>;
}
