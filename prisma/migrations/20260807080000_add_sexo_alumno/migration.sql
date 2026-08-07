-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('H', 'M');

-- AlterTable
ALTER TABLE "Alumno" ADD COLUMN "sexo" "Sexo";