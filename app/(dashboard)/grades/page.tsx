import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { GradesManager } from "@/features/grades/components/GradesManager";
import { getGradesData } from "@/features/grades/services/GradeService";

export const metadata: Metadata = { title: "Calificaciones" };
export const dynamic = "force-dynamic";

export default async function GradesPage() {
  const currentUser = await AuthService.getSessionUser();
  if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const data = await getGradesData();
  return (
    <div className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
      <GradesManager data={data} />
    </div>
  );
}
