import "server-only";

import { getPrisma } from "@/lib/prisma";
import type { ReportCardGroup, ReportCardStudent, ReportCardSubject, ReportCardTerm } from "@/features/students/types/report-card.types";

const TERMS: ReportCardTerm[] = ["T1", "T2", "T3"];

function average(values: Array<number | null>): number | null {
  const available = values.filter((value): value is number => value !== null);
  if (available.length === 0) return null;
  return Math.round((available.reduce((sum, value) => sum + value, 0) / available.length) * 100) / 100;
}

function ageFromBirthDate(date: Date | null): number | null {
  if (!date) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  if (today.getMonth() < date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())) age -= 1;
  return age >= 0 ? age : null;
}

function birthDateFromCurp(curp: string | null): Date | null {
  if (!curp || curp.length < 10) return null;
  const value = curp.slice(4, 10);
  const year = Number(value.slice(0, 2));
  const month = Number(value.slice(2, 4));
  const day = Number(value.slice(4, 6));
  if (![year, month, day].every(Number.isInteger) || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const currentYear = new Date().getFullYear() % 100;
  const fullYear = year <= currentYear ? 2000 + year : 1900 + year;
  const date = new Date(fullYear, month - 1, day);
  return date.getFullYear() === fullYear && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

function emptyTermRecord<T>(factory: () => T): Record<ReportCardTerm, T> {
  return { T1: factory(), T2: factory(), T3: factory() };
}

export interface ReportCardStudentWithAge extends ReportCardStudent {
  edad: number | null;
}

export async function getReportCardStudent(studentId: string): Promise<ReportCardStudentWithAge | null> {
  const student = await getPrisma().alumno.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      nombre: true,
      apellidos: true,
      matricula: true,
      sexo: true,
      curp: true,
      fechaNacimiento: true,
      direccion: true,
      telefonoResponsable: true,
      nombreResponsable: true,
      tecnologia: true,
      inscripciones: {
        select: {
          repetidor: true,
          grupo: {
            select: {
              id: true,
              grado: true,
              letra: true,
              cicloEscolar: { select: { nombre: true } },
              materias: {
                select: {
                  id: true,
                  materiaId: true,
                  materia: { select: { nombre: true } },
                  calificaciones: { where: { inscripcion: { alumnoId: studentId } }, select: { trimestre: true, valor: true } },
                  asistencias: { where: { inscripcion: { alumnoId: studentId } }, select: { trimestre: true, asistencias: true, faltas: true } },
                },
                orderBy: { materia: { nombre: "asc" } },
              },
            },
          },
        },
        orderBy: { grupo: { cicloEscolar: { nombre: "desc" } } },
      },
    },
  });

  if (!student) return null;

  const fechaNacimiento = student.fechaNacimiento ?? birthDateFromCurp(student.curp);

  const groups: ReportCardGroup[] = student.inscripciones.map((inscription) => {
    const subjects: ReportCardSubject[] = inscription.grupo.materias.map((subject) => {
      const grades = emptyTermRecord(() => null as number | null);
      const attendance = emptyTermRecord(() => ({ asistencias: 0, faltas: 0 }));
      for (const grade of subject.calificaciones) grades[grade.trimestre] = grade.valor;
      for (const record of subject.asistencias) attendance[record.trimestre] = { asistencias: record.asistencias, faltas: record.faltas };
      const trimesterAverages = { T1: grades.T1, T2: grades.T2, T3: grades.T3 };
      return {
        materiaGrupoId: subject.id,
        materiaId: subject.materiaId,
        nombre: subject.materia.nombre,
        grades,
        trimesterAverages,
        finalAverage: average(TERMS.map((term) => grades[term])),
        attendance,
      };
    });

    return {
      id: inscription.grupo.id,
      label: `${inscription.grupo.grado}° ${inscription.grupo.letra}`,
      cicloEscolar: inscription.grupo.cicloEscolar.nombre,
      grado: inscription.grupo.grado,
      letra: inscription.grupo.letra,
      repetidor: inscription.repetidor,
      subjects,
    };
  });

  const currentGroup = groups[0];
  const finalSubjectAverages = currentGroup?.subjects.map((subject) => subject.finalAverage).filter((value): value is number => value !== null) ?? [];
  const failedSubjects = finalSubjectAverages.filter((value) => value < 6).length;

  return {
    id: student.id,
    nombreCompleto: `${student.apellidos}, ${student.nombre}`,
    matricula: student.matricula,
    sexo: student.sexo,
    curp: student.curp,
    fechaNacimiento: fechaNacimiento?.toISOString() ?? null,
    direccion: student.direccion,
    telefonoResponsable: student.telefonoResponsable,
    nombreResponsable: student.nombreResponsable,
    tecnologia: student.tecnologia,
    groups,
    finalAverage: average(finalSubjectAverages),
    failedSubjects,
    isRepeater: failedSubjects > 4,
    edad: ageFromBirthDate(fechaNacimiento),
  };
}
