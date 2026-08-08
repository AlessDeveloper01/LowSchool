import "server-only";

import { getPrisma } from "@/lib/prisma";
import type {
  AttendanceData,
  AttendanceGroup,
  AttendanceStudent,
  AttendanceTerm,
  AttendanceUpdateInput,
} from "@/features/attendance/types/attendance.types";

export async function getAttendanceData(): Promise<AttendanceData> {
  const prisma = getPrisma();
  const [groups, inscriptions] = await Promise.all([
    prisma.grupo.findMany({
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
          },
          orderBy: { materia: { nombre: "asc" } },
        },
      },
      orderBy: [{ grado: "asc" }, { letra: "asc" }],
    }),
    prisma.inscripcion.findMany({
      select: {
        id: true,
        grupoId: true,
        alumno: { select: { id: true, nombre: true, apellidos: true, matricula: true } },
        asistencias: {
          select: { materiaGrupoId: true, trimestre: true, faltas: true },
        },
      },
      orderBy: { alumno: { matricula: "asc" } },
    }),
  ]);

  const mappedGroups: AttendanceGroup[] = groups.map((group) => ({
    id: group.id,
    label: `${group.grado}° ${group.letra}`,
    grado: group.grado,
    letra: group.letra,
    cicloEscolar: group.cicloEscolar.nombre,
    subjects: group.materias.map((subject) => ({
      id: subject.id,
      materiaId: subject.materiaId,
      nombre: subject.materia.nombre,
    })),
  }));

  const students: AttendanceStudent[] = inscriptions.map((inscription) => ({
    inscriptionId: inscription.id,
    alumnoId: inscription.alumno.id,
    matricula: inscription.alumno.matricula,
    nombreCompleto: `${inscription.alumno.apellidos}, ${inscription.alumno.nombre}`,
    grupoId: inscription.grupoId,
    attendance: inscription.asistencias.map((attendance) => ({
      materiaGrupoId: attendance.materiaGrupoId,
      trimestre: attendance.trimestre,
      asistencias: 0,
      faltas: attendance.faltas,
    })),
  }));

  return { groups: mappedGroups, students };
}

export async function saveAttendance(updates: AttendanceUpdateInput[]): Promise<void> {
  const prisma = getPrisma();
  const uniqueUpdates = new Map(
    updates.map((update) => [
      `${update.inscriptionId}:${update.materiaGrupoId}:${update.trimestre}`,
      update,
    ]),
  );

  await prisma.$transaction(async (transaction) => {
    for (const update of uniqueUpdates.values()) {
      if (update.asistencias === 0 && update.faltas === 0) {
        await transaction.asistencia.deleteMany({
          where: {
            inscripcionId: update.inscriptionId,
            materiaGrupoId: update.materiaGrupoId,
            trimestre: update.trimestre,
          },
        });
        continue;
      }

      const current = await transaction.asistencia.findFirst({
        where: {
          inscripcionId: update.inscriptionId,
          materiaGrupoId: update.materiaGrupoId,
          trimestre: update.trimestre,
        },
        select: { id: true },
      });

      if (current) {
        await transaction.asistencia.update({
          where: { id: current.id },
          data: { faltas: update.faltas },
        });
      } else {
        await transaction.asistencia.create({
          data: {
            inscripcionId: update.inscriptionId,
            materiaGrupoId: update.materiaGrupoId,
            trimestre: update.trimestre,
            faltas: update.faltas,
          },
        });
      }
    }
  });
}
