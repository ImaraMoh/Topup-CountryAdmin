import { ReactNode, Suspense } from "react";
import AppShell from "@/components/layout/AppShell";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <WorkspaceProvider><Suspense fallback={<div className="app-shell-loading">Loading workspace…</div>}><AppShell>{children}</AppShell></Suspense></WorkspaceProvider>;
}
