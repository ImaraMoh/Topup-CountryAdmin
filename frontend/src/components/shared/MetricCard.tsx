import type { ReactNode } from "react";
export default function MetricCard({ icon, label, value, change, color }: { icon: ReactNode; label: string; value: string; change: string; color: string }) {
  return <article className={`overview-kpi kpi-${color}`}><div className="overview-kpi-top"><span className="overview-kpi-icon">{icon}</span></div><span className="overview-kpi-label">{label}</span><strong>{value}</strong><small>{change}</small></article>;
}
