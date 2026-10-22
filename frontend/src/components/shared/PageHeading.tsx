import { ReactNode } from "react";

export default function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div className="header-card-ornament" aria-hidden="true"><span className="header-ornament-glow"/><span className="header-orbit-ring outer"/><span className="header-orbit-ring inner"/><span className="header-orbit-core"/><span className="header-sheen"/><i/><i/><i/></div><div className="page-heading-copy"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}
