import "server-only";

import { BoxService } from "@/features/box/services/BoxService";
import { DashboardRepository } from "@/features/dashboard/services/DashboardRepository";
import type {
  DashboardMetricComparison,
  DashboardOverviewData,
} from "@/features/dashboard/types/dashboard.types";
import {
  getBusinessDayRange,
  getCurrentBusinessDate,
} from "@/features/orders/lib/business-date";

const HOUR_BUCKETS = ["00", "03", "06", "09", "12", "15", "18", "21"];

function previousBusinessDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  const previous = new Date(Date.UTC(year!, month! - 1, day! - 1));
  return [
    previous.getUTCFullYear(),
    String(previous.getUTCMonth() + 1).padStart(2, "0"),
    String(previous.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function comparison(current: number, previous: number): DashboardMetricComparison {
  if (previous === 0) {
    return {
      value: current === 0 ? 0 : null,
      label: current === 0 ? "Sin movimiento ayer" : "Sin referencia ayer",
    };
  }

  const value = ((current - previous) / previous) * 100;
  return {
    value,
    label: `${value >= 0 ? "+" : ""}${value.toFixed(1)}% contra ayer`,
  };
}

function businessHour(value: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Mexico_City",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(value),
  );
}

async function getOverview(): Promise<DashboardOverviewData> {
  const businessDate = getCurrentBusinessDate();
  const previousDate = previousBusinessDate(businessDate);
  const { start, end } = getBusinessDayRange(businessDate);
  const { start: previousStart, end: previousEnd } =
    getBusinessDayRange(previousDate);
  const [snapshot, activeBox] = await Promise.all([
    DashboardRepository.getDaySnapshot(start, end, previousStart, previousEnd),
    BoxService.getActiveBox(),
  ]);

  const validOrders = snapshot.orders.filter(
    (order) => order.estado !== "CANCELADO",
  );
  const salesTotal = validOrders.reduce(
    (total, order) => total + order.total.toNumber(),
    0,
  );
  const previousSales = snapshot.previous._sum.total?.toNumber() ?? 0;
  const productTotals = new Map<
    string,
    { name: string; quantity: number; sales: number }
  >();
  const hourlySales = HOUR_BUCKETS.map((label) => ({
    label: `${label}:00`,
    sales: 0,
    orderCount: 0,
  }));

  for (const order of validOrders) {
    const bucket = Math.floor(businessHour(order.createdAt) / 3);
    const hourly = hourlySales[bucket];
    if (hourly) {
      hourly.sales += order.total.toNumber();
      hourly.orderCount += 1;
    }

    for (const item of order.items) {
      const current = productTotals.get(item.productoNombre) ?? {
        name: item.productoNombre,
        quantity: 0,
        sales: 0,
      };
      current.quantity += item.cantidad;
      current.sales += item.total.toNumber();
      productTotals.set(item.productoNombre, current);
    }
  }

  const totalTables = snapshot.totalTables;
  const occupiedTables = Math.min(snapshot.occupiedTables, totalTables);

  return {
    businessDate,
    salesTotal,
    validOrderCount: validOrders.length,
    pendingOrderCount: snapshot.orders.filter(
      (order) => order.estado === "ENVIADO",
    ).length,
    completedOrderCount: snapshot.orders.filter(
      (order) => order.estado === "COMPLETADO",
    ).length,
    cancelledOrderCount: snapshot.orders.filter(
      (order) => order.estado === "CANCELADO",
    ).length,
    averageTicket: validOrders.length > 0 ? salesTotal / validOrders.length : 0,
    itemCount: validOrders.reduce(
      (total, order) =>
        total + order.items.reduce((sum, item) => sum + item.cantidad, 0),
      0,
    ),
    activeProductCount: snapshot.activeProducts,
    tables: {
      total: totalTables,
      occupied: occupiedTables,
      available: Math.max(totalTables - occupiedTables, 0),
    },
    service: {
      dineIn: validOrders.filter((order) => order.tipoServicio === "CONSUMIR")
        .length,
      takeaway: validOrders.filter((order) => order.tipoServicio === "LLEVAR")
        .length,
    },
    salesComparison: comparison(salesTotal, previousSales),
    ordersComparison: comparison(
      validOrders.length,
      snapshot.previous._count.id,
    ),
    hourlySales,
    topProducts: [...productTotals.values()]
      .sort(
        (left, right) =>
          right.quantity - left.quantity || right.sales - left.sales,
      )
      .slice(0, 5),
    recentOrders: snapshot.orders.slice(0, 5).map((order) => ({
      id: order.id,
      folio: order.folio,
      status: order.estado,
      tableLabel: order.mesa
        ? `${order.mesa.area === "TERRAZA" ? "Terraza" : "Interior"} · ${order.mesa.nombre}`
        : "Para llevar",
      waiterName: order.meseroNombre,
      total: order.total.toNumber(),
      createdAt: order.createdAt.toISOString(),
    })),
    activeBox,
  };
}

export const DashboardService = { getOverview };
