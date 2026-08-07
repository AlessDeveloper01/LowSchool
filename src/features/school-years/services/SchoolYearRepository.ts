import "server-only";

import { getPrisma } from "@/lib/prisma";
import type {
  CreateSchoolYearData,
  UpdateSchoolYearData,
} from "@/features/school-years/types/school-year.types";

const schoolYearSelect = {
  id: true,
  nombre: true,
  activo: true,
  _count: { select: { grupos: true } },
} as const;

async function findAll() {
  return getPrisma().cicloEscolar.findMany({
    select: schoolYearSelect,
    orderBy: [{ activo: "desc" }, { nombre: "desc" }],
  });
}

async function findById(id: string) {
  return getPrisma().cicloEscolar.findUnique({
    where: { id },
    select: schoolYearSelect,
  });
}

async function findByName(nombre: string, excludeId?: string) {
  return getPrisma().cicloEscolar.findFirst({
    where: {
      nombre: { equals: nombre, mode: "insensitive" },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true, nombre: true },
  });
}

async function create(data: CreateSchoolYearData) {
  return getPrisma().cicloEscolar.create({
    data: { nombre: data.nombre },
    select: schoolYearSelect,
  });
}

async function update(data: UpdateSchoolYearData) {
  return getPrisma().cicloEscolar.update({
    where: { id: data.id },
    data: { nombre: data.nombre },
    select: schoolYearSelect,
  });
}

async function setActive(id: string, activo: boolean) {
  const prisma = getPrisma();
  return prisma.$transaction(async (transaction) => {
    if (activo) {
      await transaction.cicloEscolar.updateMany({ data: { activo: false } });
    }

    return transaction.cicloEscolar.update({
      where: { id },
      data: { activo },
      select: schoolYearSelect,
    });
  });
}

async function remove(id: string) {
  return getPrisma().cicloEscolar.delete({ where: { id }, select: schoolYearSelect });
}

export const SchoolYearRepository = {
  findAll,
  findById,
  findByName,
  create,
  update,
  setActive,
  remove,
};