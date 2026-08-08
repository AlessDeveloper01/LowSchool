import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma-20260804010000/client";

type PrismaGlobal = typeof globalThis & {
  prisma?: PrismaClient;
  prismaSchemaVersion?: string;
};

const prismaGlobal = globalThis as PrismaGlobal;
const PRISMA_SCHEMA_VERSION = "20260808002511";

type PrismaRuntimeMetadata = {
  _runtimeDataModel?: {
    models?: Record<string, { fields?: Array<{ name?: string }> }>;
  };
};

function hasCurrentAcademicSchema(client: PrismaClient): boolean {
  const metadata = (client as PrismaClient & PrismaRuntimeMetadata)._runtimeDataModel;
  const models = metadata?.models;
  if (!models) return false;

  return [
    "User",
    "AppCustomization",
    "CicloEscolar",
    "Grupo",
    "Materia",
    "MateriaGrupo",
    "Alumno",
    "Inscripcion",
    "Calificacion",
    "Asistencia",
  ].every((model) => model in models);
}

function hasCurrentSchema(client: PrismaClient): boolean {
  return (
    hasCurrentAcademicSchema(client) &&
    "user" in client &&
    "alumno" in client &&
    "inscripcion" in client &&
    prismaGlobal.prismaSchemaVersion === PRISMA_SCHEMA_VERSION
  );
}

/**
 * Returns the shared Prisma client for server-side code.
 *
 * Keeping construction lazy lets static pages and build-time tooling run without
 * opening a database connection. Import this only from Server Components,
 * Server Actions, Route Handlers and files marked with `server-only`.
 */
export function getPrisma(): PrismaClient {
  if (prismaGlobal.prisma && hasCurrentSchema(prismaGlobal.prisma)) {
    return prismaGlobal.prisma;
  }

  if (prismaGlobal.prisma) {
    // Do not disconnect here: requests can still be using the old client while
    // Next.js reloads the module during development. Closing its pg pool makes
    // those in-flight queries fail with "Cannot use a pool after calling end".
    prismaGlobal.prisma = undefined;
    prismaGlobal.prismaSchemaVersion = undefined;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ adapter });

  prismaGlobal.prisma = client;
  prismaGlobal.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;

  return client;
}
