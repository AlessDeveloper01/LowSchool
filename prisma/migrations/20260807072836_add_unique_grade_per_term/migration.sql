/*
  Warnings:

  - A unique constraint covering the columns `[inscripcionId,materiaGrupoId,trimestre]` on the table `Calificacion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Calificacion_inscripcionId_materiaGrupoId_trimestre_key" ON "Calificacion"("inscripcionId", "materiaGrupoId", "trimestre");
