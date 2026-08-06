import "server-only";

import { getPrisma } from "@/lib/prisma";
import type { CreateUserData, UpdateUserData } from "@/features/users/types/user.types";

const userSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

async function findAll() {
  return getPrisma().user.findMany({ select: userSelect, orderBy: [{ isActive: "desc" }, { name: "asc" }] });
}

async function findById(id: string) {
  return getPrisma().user.findUnique({ where: { id }, select: userSelect });
}

async function findConflict(username: string, email: string, excludeId?: string) {
  return getPrisma().user.findFirst({
    where: { ...(excludeId ? { id: { not: excludeId } } : {}), OR: [{ username }, { email }] },
    select: { id: true, username: true, email: true },
  });
}

async function countActiveAdmins(excludeId?: string) {
  return getPrisma().user.count({ where: { role: "SUPER_ADMIN", isActive: true, ...(excludeId ? { id: { not: excludeId } } : {}) } });
}

async function create(data: CreateUserData, passwordHash: string) {
  return getPrisma().user.create({
    data: { name: data.name, username: data.username, email: data.email, role: data.role, passwordHash },
    select: userSelect,
  });
}

async function update(data: UpdateUserData, passwordHash?: string) {
  return getPrisma().user.update({
    where: { id: data.id },
    data: { name: data.name, username: data.username, email: data.email, role: data.role, ...(passwordHash ? { passwordHash } : {}) },
    select: userSelect,
  });
}

async function setActive(id: string, isActive: boolean) {
  return getPrisma().user.update({ where: { id }, data: { isActive }, select: userSelect });
}

export const UserRepository = { findAll, findById, findConflict, countActiveAdmins, create, update, setActive };
