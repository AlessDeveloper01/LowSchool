import "server-only";

import { getPrisma } from "@/lib/prisma";

async function getDaySnapshot(
  start: Date,
  end: Date,
  previousStart: Date,
  previousEnd: Date,
) {
  const prisma = getPrisma();

  const [orders, previous, totalTables, occupiedTables, activeProducts] =
    await Promise.all([
      prisma.pedido.findMany({
        where: { createdAt: { gte: start, lt: end } },
        select: {
          id: true,
          folio: true,
          estado: true,
          tipoServicio: true,
          meseroNombre: true,
          total: true,
          createdAt: true,
          mesa: { select: { nombre: true, area: true } },
          items: {
            select: {
              productoNombre: true,
              cantidad: true,
              total: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.pedido.aggregate({
        where: {
          createdAt: { gte: previousStart, lt: previousEnd },
          estado: { not: "CANCELADO" },
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      prisma.mesa.count({ where: { activo: true } }),
      prisma.mesa.count({
        where: {
          activo: true,
          pedidos: { some: { estado: "ENVIADO" } },
        },
      }),
      prisma.producto.count({
        where: { activo: true, deletedAt: null },
      }),
    ]);

  return { orders, previous, totalTables, occupiedTables, activeProducts };
}

export const DashboardRepository = { getDaySnapshot };
