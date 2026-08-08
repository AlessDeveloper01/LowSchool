export type AttendanceTerm = "T1" | "T2" | "T3";

export interface AttendanceSubject {
  id: string;
  materiaId: string;
  nombre: string;
}

export interface AttendanceGroup {
  id: string;
  label: string;
  grado: number;
  letra: string;
  cicloEscolar: string;
  subjects: AttendanceSubject[];
}

export interface AttendanceValue {
  materiaGrupoId: string;
  trimestre: AttendanceTerm;
  asistencias: number;
  faltas: number;
}

export interface AttendanceStudent {
  inscriptionId: string;
  alumnoId: string;
  matricula: string;
  nombreCompleto: string;
  grupoId: string;
  attendance: AttendanceValue[];
}

export interface AttendanceData {
  groups: AttendanceGroup[];
  students: AttendanceStudent[];
}

export interface AttendanceUpdateInput {
  inscriptionId: string;
  materiaGrupoId: string;
  trimestre: AttendanceTerm;
  asistencias: number;
  faltas: number;
}

export interface AttendanceActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}
