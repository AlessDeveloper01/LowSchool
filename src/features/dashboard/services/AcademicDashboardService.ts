import "server-only";

import { getPrisma } from "@/lib/prisma";
import type { GradeTerm } from "@/features/grades/types/grade.types";
import type { AcademicDashboardData, AcademicDashboardGroup, AcademicDashboardStudent } from "@/features/dashboard/types/academic-dashboard.types";

const TERMS: GradeTerm[] = ["T1", "T2", "T3"];

function average(values: Array<number | null>): number | null {
  const available = values.filter((value): value is number => value !== null);
  if (available.length === 0) return null;
  return Math.round((available.reduce((sum, value) => sum + value, 0) / available.length) * 100) / 100;
}

function calculateStudentSummary(
  inscription: {
    id: string;
    grupoId: string;
    alumno: { id: string; nombre: string; apellidos: string; matricula: string };
    grupo: { grado: number; letra: string; cicloEscolar: { nombre: string }; materias: Array<{ id: string }> };
    calificaciones: Array<{ materiaGrupoId: string; trimestre: GradeTerm; valor: number }>;
  },
): AcademicDashboardStudent {
  const subjectIds = inscription.grupo.materias.map((subject) => subject.id);
  const findGrade = (subjectId: string, term: GradeTerm) => inscription.calificaciones.find((grade) => grade.materiaGrupoId === subjectId && grade.trimestre === term)?.valor ?? null;
  const subjectAverages = subjectIds.map((subjectId) => average(TERMS.map((term) => findGrade(subjectId, term))));
  const trimesterAverages = {
    T1: average(subjectIds.map((subjectId) => findGrade(subjectId, "T1"))),
    T2: average(subjectIds.map((subjectId) => findGrade(subjectId, "T2"))),
    T3: average(subjectIds.map((subjectId) => findGrade(subjectId, "T3"))),
  } satisfies Record<GradeTerm, number | null>;
  const failedSubjects = subjectAverages.filter((value) => value !== null && value < 6).length;
  const missingGrades = subjectIds.reduce((total, subjectId) => total + TERMS.filter((term) => findGrade(subjectId, term) === null).length, 0);
  const finalAverage = average(subjectAverages);

  return {
    alumnoId: inscription.alumno.id,
    inscriptionId: inscription.id,
    matricula: inscription.alumno.matricula,
    nombreCompleto: `${inscription.alumno.apellidos}, ${inscription.alumno.nombre}`,
    grupoId: inscription.grupoId,
    grupo: `${inscription.grupo.grado}° ${inscription.grupo.letra}`,
    cicloEscolar: inscription.grupo.cicloEscolar.nombre,
    trimesterAverages,
    finalAverage,
    failedSubjects,
    isRepeater: failedSubjects > 4,
    totalSubjects: subjectIds.length,
    missingGrades,
  };
}

export async function getAcademicDashboardData(): Promise<AcademicDashboardData> {
  const prisma = getPrisma();
  const activeSchoolYear = await prisma.cicloEscolar.findFirst({ where: { activo: true }, select: { id: true, nombre: true } });
  const groups = activeSchoolYear
    ? await prisma.grupo.findMany({
      where: { cicloEscolarId: activeSchoolYear.id },
      select: { id: true, grado: true, letra: true, cicloEscolar: { select: { nombre: true } }, materias: { select: { id: true } } },
      orderBy: [{ grado: "asc" }, { letra: "asc" }],
    })
    : [];

  const inscriptions = activeSchoolYear
    ? await prisma.inscripcion.findMany({
      where: { grupo: { cicloEscolarId: activeSchoolYear.id } },
      select: {
        id: true,
        grupoId: true,
        alumno: { select: { id: true, nombre: true, apellidos: true, matricula: true } },
        grupo: { select: { grado: true, letra: true, cicloEscolar: { select: { nombre: true } }, materias: { select: { id: true } } } },
        calificaciones: { select: { materiaGrupoId: true, trimestre: true, valor: true } },
      },
      orderBy: { alumno: { matricula: "asc" } },
    })
    : [];

  const students = inscriptions.map((inscription) => calculateStudentSummary(inscription));
  const groupData: AcademicDashboardGroup[] = groups.map((group) => {
    const groupStudents = students.filter((student) => student.grupoId === group.id);
    return { id: group.id, label: `${group.grado}° ${group.letra}`, cicloEscolar: group.cicloEscolar.nombre, studentCount: groupStudents.length, average: average(groupStudents.map((student) => student.finalAverage)) };
  });
  const approvedStudents = students.filter((student) => student.finalAverage !== null && student.failedSubjects === 0).length;

  return {
    activeSchoolYear: activeSchoolYear?.nombre ?? null,
    groups: groupData,
    students,
    stats: {
      totalStudents: students.length,
      totalGroups: groupData.length,
      generalAverage: average(students.map((student) => student.finalAverage)),
      approvalRate: students.length === 0 ? 0 : Math.round((approvedStudents / students.length) * 100),
      studentsWithFailures: students.filter((student) => student.failedSubjects > 0).length,
      incompleteStudents: students.filter((student) => student.missingGrades > 0).length,
    },
  };
}
