import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthService } from "@/features/auth/services/AuthService";
import { AttendanceManager } from "@/features/attendance/components/AttendanceManager";
import { getAttendanceData } from "@/features/attendance/services/AttendanceService";

export const metadata: Metadata = { title: "Asistencia" };
export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const currentUser = await AuthService.getSessionUser();
  if (!currentUser || (currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const data = await getAttendanceData();
  return (
    <div className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
      <AttendanceManager data={data} />
    </div>
  );
}
