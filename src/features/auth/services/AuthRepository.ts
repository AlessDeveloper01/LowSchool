import "server-only";

import type { RegisterData } from "@/features/auth/types/auth.types";
import { getPrisma } from "@/lib/prisma";

const sessionUserSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  role: true,
} as const;

async function findByIdentifier(identifier: string) {
  return getPrisma().user.findFirst({
    where: {
      isActive: true,
      OR: [{ username: identifier }, { email: identifier }],
    },
    select: { ...sessionUserSelect, passwordHash: true },
  });
}

async function findActiveSessionById(id: string) {
  return getPrisma().user.findFirst({ where: { id, isActive: true }, select: sessionUserSelect });
}

async function findConflict(username: string, email: string) {
  return getPrisma().user.findFirst({
    where: { OR: [{ username }, { email }] },
    select: { username: true, email: true },
  });
}

async function create(input: RegisterData, passwordHash: string) {
  return getPrisma().user.create({
    data: {
      name: input.name,
      username: input.username,
      email: input.email,
      passwordHash,
    },
    select: sessionUserSelect,
  });
}

export const AuthRepository = {
  findByIdentifier,
  findActiveSessionById,
  findConflict,
  create,
};
