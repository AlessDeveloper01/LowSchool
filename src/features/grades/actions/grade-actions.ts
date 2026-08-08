"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { AuthService } from "@/features/auth/services/AuthService";
import { saveGrades } from "@/features/grades/services/GradeService";
import type { GradeActionResult, GradeTerm, GradeUpdateInput } from "@/features/grades/types/grade.types";

const gradeSchema = z.object({
  inscriptionId: z.string().cuid("La inscripción no es válida."),
  materiaGrupoId: z.string().cuid("La materia no es válida."),
  trimestre: z.enum(["T1", "T2", "T3"]),
  valor: z.number().min(0, "La calificación mínima es 0.").max(10, "La calificación máxima es 10.").nullable(),
});

const inputSchema = z.object({ updates: z.array(gradeSchema).max(5000) });

async function canManageGrades(): Promise<boolean> {
  const user = await AuthService.getSessionUser();
  return user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";
}

export async function saveGradesAction(input: unknown): Promise<GradeActionResult> {
  if (!(await canManageGrades())) return { success: false, message: "No tienes permisos para administrar calificaciones." };

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Revisa las calificaciones capturadas.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await saveGrades(parsed.data.updates as Array<GradeUpdateInput & { trimestre: GradeTerm }>);
    revalidatePath("/grades");
    return { success: true, message: "Calificaciones guardadas correctamente." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "No fue posible guardar las calificaciones.",
    };
  }
}
