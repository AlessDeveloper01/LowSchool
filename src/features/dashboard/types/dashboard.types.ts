export interface DashboardMetricComparison {
  value: number | null;
  label: string;
}

export interface DashboardHourlySale {
  label: string;
  sales: number;
  orderCount: number;
}

export interface DashboardTopProduct {
  name: string;
  quantity: number;
  sales: number;
}

export interface DashboardRecentOrder {
  id: string;
  folio: number;
  status: "ENVIADO" | "COMPLETADO" | "CANCELADO";
  tableLabel: string;
  waiterName: string;
  total: number;
  createdAt: string;
}

export interface DashboardOverviewData {
  businessDate: string;
  salesTotal: number;
  validOrderCount: number;
  pendingOrderCount: number;
  completedOrderCount: number;
  cancelledOrderCount: number;
  averageTicket: number;
  itemCount: number;
  activeProductCount: number;
  tables: {
    total: number;
    occupied: number;
    available: number;
  };
  service: {
    dineIn: number;
    takeaway: number;
  };
  salesComparison: DashboardMetricComparison;
  ordersComparison: DashboardMetricComparison;
  hourlySales: DashboardHourlySale[];
  topProducts: DashboardTopProduct[];
  recentOrders: DashboardRecentOrder[];
}
