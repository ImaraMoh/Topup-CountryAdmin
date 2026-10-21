import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./Base.module.css";

export const metadata: Metadata = {
  title: "Country Admin | Global operations",
  description: "Manage your global operations with clarity and control.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={styles.base}>{children}</body>
    </html>
  );
}
