import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { StudentReportCard } from "@/features/students/components/StudentReportCard";
import { getReportCardStudent } from "@/features/students/services/ReportCardService";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ studentId: string }> }): Promise<Metadata> {
  const { studentId } = await params;
  const student = await getReportCardStudent(studentId);
  return { title: student ? `Boleta · ${student.nombreCompleto}` : "Boleta de calificaciones" };
}

export default async function StudentReportCardPage({ params }: { params: Promise<{ studentId: string }> }) {
  const currentUser = await AuthService.getSessionUser();
  if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")) redirect("/dashboard");
  const { studentId } = await params;
  const student = await getReportCardStudent(studentId);
  if (!student) notFound();

  return <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><StudentReportCard student={student} /></div>;
}
