import type { Activity } from "@/types/admin";

export default function ActivityList({ activity }: { activity: Activity[] }) {
  return <div className="activity-list">{activity.map(item => <div className="activity-item" key={item.id}><span className="avatar" style={{ background: item.color }}>{item.initials}</span><div><p><strong>{item.name}</strong> {item.action} <b>{item.target}</b></p><small>{item.time}</small></div></div>)}</div>;
}
