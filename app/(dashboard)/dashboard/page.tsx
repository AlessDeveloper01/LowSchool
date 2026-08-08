import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { AcademicDashboard } from "@/features/dashboard/components/AcademicDashboard";
import { getAcademicDashboardData } from "@/features/dashboard/services/AcademicDashboardService";

export const metadata: Metadata = { title: "Dashboard académico" };
export const dynamic = "force-dynamic";

export default async function AcademicDashboardPage() {
  const currentUser = await AuthService.getSessionUser();
  if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")) redirect("/dashboard");
  const data = await getAcademicDashboardData();
  return <AcademicDashboard data={data} />;
}
