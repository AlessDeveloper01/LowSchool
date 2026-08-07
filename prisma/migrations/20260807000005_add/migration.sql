-- CreateEnum
CREATE TYPE "Trimestre" AS ENUM ('T1', 'T2', 'T3');

-- CreateTable
CREATE TABLE "CicloEscolar" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CicloEscolar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grupo" (
    "id" TEXT NOT NULL,
    "grado" INTEGER NOT NULL,
    "letra" TEXT NOT NULL,
    "cicloEscolarId" TEXT NOT NULL,

    CONSTRAINT "Grupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriaGrupo" (
    "id" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,

    CONSTRAINT "MateriaGrupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alumno" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "tecnologia" TEXT,
    "direccion" TEXT,
    "curp" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "telefonoResponsable" TEXT,
    "nombreResponsable" TEXT,

    CONSTRAINT "Alumno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" TEXT NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "repetidor" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" TEXT NOT NULL,
    "inscripcionId" TEXT NOT NULL,
    "materiaGrupoId" TEXT NOT NULL,
    "trimestre" "Trimestre" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" TEXT NOT NULL,
    "inscripcionId" TEXT NOT NULL,
    "materiaGrupoId" TEXT NOT NULL,
    "trimestre" "Trimestre" NOT NULL,
    "faltas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CicloEscolar_nombre_key" ON "CicloEscolar"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Grupo_cicloEscolarId_grado_letra_key" ON "Grupo"("cicloEscolarId", "grado", "letra");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_matricula_key" ON "Alumno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_curp_key" ON "Alumno"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_alumnoId_grupoId_key" ON "Inscripcion"("alumnoId", "grupoId");

-- CreateIndex
CREATE INDEX "Calificacion_inscripcionId_materiaGrupoId_trimestre_idx" ON "Calificacion"("inscripcionId", "materiaGrupoId", "trimestre");

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_inscripcionId_materiaGrupoId_trimestre_key" ON "Asistencia"("inscripcionId", "materiaGrupoId", "trimestre");

-- AddForeignKey
ALTER TABLE "Grupo" ADD CONSTRAINT "Grupo_cicloEscolarId_fkey" FOREIGN KEY ("cicloEscolarId") REFERENCES "CicloEscolar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaGrupo" ADD CONSTRAINT "MateriaGrupo_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaGrupo" ADD CONSTRAINT "MateriaGrupo_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "Grupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES "Inscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_materiaGrupoId_fkey" FOREIGN KEY ("materiaGrupoId") REFERENCES "MateriaGrupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES "Inscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_materiaGrupoId_fkey" FOREIGN KEY ("materiaGrupoId") REFERENCES "MateriaGrupo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
