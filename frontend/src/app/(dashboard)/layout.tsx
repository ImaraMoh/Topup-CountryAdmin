import { ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import { WorkspaceProvider } from "@/context/WorkspaceContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <WorkspaceProvider><AppShell>{children}</AppShell></WorkspaceProvider>;
}
