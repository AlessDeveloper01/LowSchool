import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { SubjectsManager } from "@/features/subjects/components/SubjectsManager";
import { listSubjects } from "@/features/subjects/subjects";

export const metadata: Metadata = { title: "Materias" };
export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  const currentUser = await AuthService.getSessionUser();
  if (
    !currentUser ||
    (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")
  ) {
    redirect("/dashboard");
  }

  const subjects = await listSubjects();
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <SubjectsManager subjects={subjects} />
    </div>
  );
}