import "server-only";

import { getPrisma } from "@/lib/prisma";
import type {
  GradeGroup,
  GradeStudent,
  GradeUpdateInput,
  GradesData,
} from "@/features/grades/types/grade.types";

export async function getGradesData(): Promise<GradesData> {
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
        calificaciones: {
          select: { materiaGrupoId: true, trimestre: true, valor: true },
        },
      },
      orderBy: { alumno: { matricula: "asc" } },
    }),
  ]);

  const mappedGroups: GradeGroup[] = groups.map((group) => ({
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

  const students: GradeStudent[] = inscriptions.map((inscription) => ({
    inscriptionId: inscription.id,
    alumnoId: inscription.alumno.id,
    matricula: inscription.alumno.matricula,
    nombreCompleto: `${inscription.alumno.apellidos}, ${inscription.alumno.nombre}`,
    grupoId: inscription.grupoId,
    grades: inscription.calificaciones.map((grade) => ({
      materiaGrupoId: grade.materiaGrupoId,
      trimestre: grade.trimestre,
      valor: grade.valor,
    })),
  }));

  return { groups: mappedGroups, students };
}

export async function saveGrades(updates: GradeUpdateInput[]): Promise<void> {
  const prisma = getPrisma();
  const uniqueUpdates = new Map(
    updates.map((update) => [
      `${update.inscriptionId}:${update.materiaGrupoId}:${update.trimestre}`,
      update,
    ]),
  );
  const normalizedUpdates = [...uniqueUpdates.values()];

  await prisma.$transaction(async (transaction) => {
    for (const update of normalizedUpdates) {
      if (update.valor === null) {
        await transaction.calificacion.deleteMany({
          where: {
            inscripcionId: update.inscriptionId,
            materiaGrupoId: update.materiaGrupoId,
            trimestre: update.trimestre,
          },
        });
        continue;
      }

      const current = await transaction.calificacion.findFirst({
        where: {
          inscripcionId: update.inscriptionId,
          materiaGrupoId: update.materiaGrupoId,
          trimestre: update.trimestre,
        },
        select: { id: true },
      });

      if (current) {
        await transaction.calificacion.update({
          where: { id: current.id },
          data: { valor: update.valor },
        });
      } else {
        await transaction.calificacion.create({
          data: {
            inscripcionId: update.inscriptionId,
            materiaGrupoId: update.materiaGrupoId,
            trimestre: update.trimestre,
            valor: update.valor,
          },
        });
      }
    }
  });
}
