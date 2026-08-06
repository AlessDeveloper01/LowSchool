import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma-20260804010000/client";

type PrismaGlobal = typeof globalThis & {
  prisma?: PrismaClient;
  prismaSchemaVersion?: string;
};

const prismaGlobal = globalThis as PrismaGlobal;
const PRISMA_SCHEMA_VERSION = "20260804010000";
const REQUIRED_PRODUCT_FIELDS = [
  "id",
  "nombre",
  "descripcion",
  "sku",
  "precioBase",
  "modoPrecio",
  "categoriaId",
  "imagenUrl",
  "imagenPublicId",
  "activo",
  "deletedAt",
  "gruposVariantes",
  "gruposExtras",
] as const;

type PrismaRuntimeMetadata = {
  _runtimeDataModel?: {
    models?: Record<string, { fields?: Array<{ name?: string }> }>;
  };
};

function hasCurrentProductFields(client: PrismaClient): boolean {
  const metadata = (client as PrismaClient & PrismaRuntimeMetadata)
    ._runtimeDataModel;
  const fields = metadata?.models?.Producto?.fields;
  if (!fields) return false;

  const fieldNames = new Set(fields.map(({ name }) => name));
  return REQUIRED_PRODUCT_FIELDS.every((field) => fieldNames.has(field));
}

function hasRequiredDelegates(client: PrismaClient): boolean {
  return (
    "appCustomization" in client &&
    "categoria" in client &&
    "grupoVariante" in client &&
    "variante" in client &&
    "grupoExtra" in client &&
    "extra" in client &&
    "producto" in client &&
    "productoGrupoVariante" in client &&
    "productoGrupoExtra" in client &&
    "mesa" in client &&
    "pedido" in client &&
    "pedidoItem" in client &&
    "pedidoItemVariante" in client &&
    "pedidoItemExtra" in client &&
    "caja" in client &&
    "cajaPlantilla" in client &&
    hasCurrentProductFields(client)
  );
}

function hasCurrentOrderFields(client: PrismaClient): boolean {
  const metadata = (client as PrismaClient & PrismaRuntimeMetadata)._runtimeDataModel;
  const fields = metadata?.models?.Pedido?.fields;
  if (!fields) return false;
  const fieldNames = new Set(fields.map(({ name }) => name));
  return fieldNames.has("meseroNombre") && fieldNames.has("cajaId");
}

function hasCurrentBoxFields(client: PrismaClient): boolean {
  const metadata = (client as PrismaClient & PrismaRuntimeMetadata)._runtimeDataModel;
  const boxFields = metadata?.models?.Caja?.fields;
  const templateFields = metadata?.models?.CajaPlantilla?.fields;
  if (!boxFields || !templateFields) return false;

  const boxFieldNames = new Set(boxFields.map(({ name }) => name));
  const templateFieldNames = new Set(templateFields.map(({ name }) => name));
  return (
    [
      "id",
      "folio",
      "estado",
      "openSlot",
      "montoApertura",
      "montoEsperado",
      "montoDeclarado",
      "diferencia",
      "pedidos",
    ].every((field) => boxFieldNames.has(field)) &&
    ["id", "nombre", "montoApertura", "activo"].every((field) =>
      templateFieldNames.has(field),
    )
  );
}

function hasCurrentSchema(client: PrismaClient): boolean {
  return (
    hasRequiredDelegates(client) &&
    hasCurrentOrderFields(client) &&
    hasCurrentBoxFields(client) &&
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
    void prismaGlobal.prisma.$disconnect().catch(() => undefined);
    prismaGlobal.prisma = undefined;
    prismaGlobal.prismaSchemaVersion = undefined;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ adapter });

  if (
    !hasRequiredDelegates(client) ||
    !hasCurrentOrderFields(client) ||
    !hasCurrentBoxFields(client)
  ) {
    void client.$disconnect().catch(() => undefined);
    throw new Error(
      "El proceso conserva un Prisma Client anterior al módulo de cajas. Ejecuta prisma generate y reinicia pnpm dev para cargar el esquema 20260804010000.",
    );
  }

  if (process.env.NODE_ENV !== "production") {
    prismaGlobal.prisma = client;
    prismaGlobal.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
  }

  return client;
}
