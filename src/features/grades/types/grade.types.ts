export type GradeTerm = "T1" | "T2" | "T3";

export interface GradeSubject {
  id: string;
  materiaId: string;
  nombre: string;
}

export interface GradeGroup {
  id: string;
  label: string;
  grado: number;
  letra: string;
  cicloEscolar: string;
  subjects: GradeSubject[];
}

export interface GradeValue {
  materiaGrupoId: string;
  trimestre: GradeTerm;
  valor: number | null;
}

export interface GradeStudent {
  inscriptionId: string;
  alumnoId: string;
  matricula: string;
  nombreCompleto: string;
  grupoId: string;
  grades: GradeValue[];
}

export interface GradeStudentSummary extends GradeStudent {
  trimesterAverages: Record<GradeTerm, number | null>;
  subjectAverages: Record<string, number | null>;
  finalAverage: number | null;
  failedSubjects: number;
  isRepeater: boolean;
}

export interface GradesData {
  groups: GradeGroup[];
  students: GradeStudent[];
}

export interface GradeUpdateInput {
  inscriptionId: string;
  materiaGrupoId: string;
  trimestre: GradeTerm;
  valor: number | null;
}

export interface GradeActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}
