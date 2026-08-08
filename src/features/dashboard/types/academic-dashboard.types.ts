import type { GradeTerm } from "@/features/grades/types/grade.types";

export interface AcademicDashboardGroup {
  id: string;
  label: string;
  cicloEscolar: string;
  studentCount: number;
  average: number | null;
}

export interface AcademicDashboardStudent {
  alumnoId: string;
  inscriptionId: string;
  matricula: string;
  nombreCompleto: string;
  grupoId: string;
  grupo: string;
  cicloEscolar: string;
  trimesterAverages: Record<GradeTerm, number | null>;
  finalAverage: number | null;
  failedSubjects: number;
  isRepeater: boolean;
  totalSubjects: number;
  missingGrades: number;
}

export interface AcademicDashboardData {
  activeSchoolYear: string | null;
  groups: AcademicDashboardGroup[];
  students: AcademicDashboardStudent[];
  stats: {
    totalStudents: number;
    totalGroups: number;
    generalAverage: number | null;
    approvalRate: number;
    studentsWithFailures: number;
    incompleteStudents: number;
  };
}
