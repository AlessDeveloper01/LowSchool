import "server-only";

import { hash } from "bcryptjs";

import { UserRepository } from "@/features/users/services/UserRepository";
import type { CreateUserData, ManagedUser, UpdateUserData, UserStatusData } from "@/features/users/types/user.types";

const PASSWORD_SALT_ROUNDS = 12;

export class UserServiceError extends Error {
  constructor(message: string, readonly field?: "username" | "email" | "role") {
    super(message);
    this.name = "UserServiceError";
  }
}

type PersistedUser = NonNullable<Awaited<ReturnType<typeof UserRepository.findById>>>;

function toUser(user: PersistedUser): ManagedUser {
  return { ...user, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() };
}

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

async function ensureUnique(username: string, email: string, excludeId?: string): Promise<void> {
  const conflict = await UserRepository.findConflict(username, email, excludeId);
  if (conflict?.username === username) throw new UserServiceError("Ese username ya está registrado.", "username");
  if (conflict?.email === email) throw new UserServiceError("Ese correo electrónico ya está registrado.", "email");
}

async function listUsers(): Promise<ManagedUser[]> {
  return (await UserRepository.findAll()).map(toUser);
}

async function createUser(data: CreateUserData): Promise<ManagedUser> {
  await ensureUnique(data.username, data.email);
  try {
    return toUser(await UserRepository.create(data, await hash(data.password, PASSWORD_SALT_ROUNDS)));
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new UserServiceError("El username o correo ya está registrado.");
    throw error;
  }
}

async function updateUser(data: UpdateUserData, actorId: string): Promise<ManagedUser> {
  const current = await UserRepository.findById(data.id);
  if (!current) throw new UserServiceError("El usuario ya no existe.");
  if (data.id === actorId && data.role !== "SUPER_ADMIN") {
    throw new UserServiceError("No puedes quitarte tu propio rol de administrador.", "role");
  }
  if (current.role === "SUPER_ADMIN" && data.role !== "SUPER_ADMIN" && await UserRepository.countActiveAdmins(current.id) === 0) {
    throw new UserServiceError("Debe permanecer al menos un super administrador activo.", "role");
  }
  await ensureUnique(data.username, data.email, data.id);
  try {
    const passwordHash = data.password ? await hash(data.password, PASSWORD_SALT_ROUNDS) : undefined;
    return toUser(await UserRepository.update(data, passwordHash));
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new UserServiceError("El username o correo ya está registrado.");
    throw error;
  }
}

async function setUserStatus(data: UserStatusData, actorId: string): Promise<ManagedUser> {
  const current = await UserRepository.findById(data.id);
  if (!current) throw new UserServiceError("El usuario ya no existe.");
  if (data.id === actorId && !data.isActive) throw new UserServiceError("No puedes desactivar tu propia cuenta.");
  if (!data.isActive && current.role === "SUPER_ADMIN" && await UserRepository.countActiveAdmins(current.id) === 0) {
    throw new UserServiceError("Debe permanecer al menos un super administrador activo.");
  }
  if (current.isActive === data.isActive) throw new UserServiceError(data.isActive ? "El usuario ya está activo." : "El usuario ya está inactivo.");
  return toUser(await UserRepository.setActive(data.id, data.isActive));
}

export const UserService = { listUsers, createUser, updateUser, setUserStatus };

