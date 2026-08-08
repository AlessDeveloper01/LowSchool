export type ReportCardTerm = "T1" | "T2" | "T3";

export interface ReportCardSubject {
  materiaGrupoId: string;
  materiaId: string;
  nombre: string;
  grades: Record<ReportCardTerm, number | null>;
  trimesterAverages: Record<ReportCardTerm, number | null>;
  finalAverage: number | null;
  attendance: Record<ReportCardTerm, { asistencias: number; faltas: number }>;
}

export interface ReportCardGroup {
  id: string;
  label: string;
  cicloEscolar: string;
  grado: number;
  letra: string;
  repetidor: boolean;
  subjects: ReportCardSubject[];
}

export interface ReportCardStudent {
  id: string;
  nombreCompleto: string;
  matricula: string;
  sexo: "H" | "M" | null;
  curp: string | null;
  fechaNacimiento: string | null;
  direccion: string | null;
  telefonoResponsable: string | null;
  nombreResponsable: string | null;
  tecnologia: string | null;
  groups: ReportCardGroup[];
  finalAverage: number | null;
  failedSubjects: number;
  isRepeater: boolean;
}
