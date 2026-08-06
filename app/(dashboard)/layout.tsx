import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { NavigationShell } from "@/features/navigation/components/navigation-shell";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await AuthService.getSessionUser();

  if (!user) redirect("/login");

  return <NavigationShell user={user}>{children}</NavigationShell>;
}
