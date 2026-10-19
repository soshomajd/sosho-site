import type { Metadata } from "next";
import type { ReactNode } from "react";

import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: "داشبورد مدیریت",
  description: "داشبورد فقط خواندنی مدیریت سوشو استودیو",
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AdminShell>{children}</AdminShell>;
}
