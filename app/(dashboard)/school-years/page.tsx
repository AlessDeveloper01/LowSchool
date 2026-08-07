import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { SchoolYearService } from "@/features/school-years/services/SchoolYearService";
import { SchoolYearsManager } from "@/features/school-years/components/SchoolYearsManager";
import { generateMetadata } from "@/utils/metadata";

export const metadata: Metadata = generateMetadata({
    title: "Ciclos escolares",
    description: "Administración de ciclos escolares",
});
export const dynamic = "force-dynamic";

export default async function SchoolYearsPage() {
  const currentUser = await AuthService.getSessionUser();
  if (
    !currentUser ||
    (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")
  )
    redirect("/dashboard");

  const schoolYears = await SchoolYearService.listSchoolYears();
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <SchoolYearsManager schoolYears={schoolYears} />
    </div>
  );
}
