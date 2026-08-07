export interface ManagedStudent {
  id: string;
  nombre: string;
  apellidos: string;
  matricula: string;
  sexo: "H" | "M" | null;
  edad: number | null;
  tecnologia: string | null;
  direccion: string | null;
  curp: string | null;
  fechaNacimiento: string | null;
  telefonoResponsable: string | null;
  nombreResponsable: string | null;
  groups: Array<{
    inscriptionId: string;
    groupId: string;
    groupLabel: string;
    schoolYear: string;
    repetidor: boolean;
  }>;
}

export interface StudentFormInput {
  nombre: string;
  apellidos: string;
  matricula: string;
  sexo: "H" | "M" | "";
  tecnologia: string;
  direccion: string;
  curp: string;
  fechaNacimiento: string;
  telefonoResponsable: string;
  nombreResponsable: string;
  grupoId: string;
  repetidor: boolean;
}

export interface StudentImportRow {
  rowNumber: number;
  nombre: string;
  apellidos: string;
  matricula: string;
  sexo: "H" | "M" | "";
  tecnologia: string;
  direccion: string;
  curp: string;
  fechaNacimiento: string;
  telefonoResponsable: string;
  nombreResponsable: string;
  grupoId: string;
  repetidor: boolean;
}

export interface StudentImportPreview {
  headers: string[];
  rows: Array<Record<string, string>>;
}

export interface StudentImportMapping {
  nombre: string;
  apellidos: string;
  matricula: string;
  sexo: string;
  tecnologia: string;
  direccion: string;
  curp: string;
  fechaNacimiento: string;
  telefonoResponsable: string;
  nombreResponsable: string;
  grupoId: string;
  repetidor: string;
}

export interface StudentActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  data?: ManagedStudent;
}

export interface StudentImportResult {
  success: boolean;
  message: string;
  created: number;
  updated: number;
  errors?: Array<{ rowNumber: number; message: string }>;
}

export interface StudentOptions {
  groups: Array<{
    id: string;
    label: string;
    schoolYear: string;
    active: boolean;
  }>;
  technologies: string[];
}