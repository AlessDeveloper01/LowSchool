import Link from "next/link";
import { LuArrowRight, LuClock3, LuReceiptText } from "react-icons/lu";

import { Badge } from "@/components/data-display/badge";
import { formatCurrency } from "@/features/customization/lib/currency";
import type { CurrencyCode } from "@/features/customization/types/customization.types";
import type { DashboardRecentOrder } from "@/features/dashboard/types/dashboard.types";

const timeFormatter = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Mexico_City",
  hour: "numeric",
  minute: "2-digit",
});

interface RecentActivityProps {
  orders: DashboardRecentOrder[];
  currency: CurrencyCode;
}

export function RecentActivity({ orders, currency }: RecentActivityProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-foreground/5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-black text-foreground">Órdenes recientes</p>
          <p className="mt-1 text-xs text-muted">Últimos movimientos del día.</p>
        </div>
        <LuClock3 className="text-tertiary" aria-hidden="true" />
      </div>

      {orders.length === 0 ? (
        <div className="grid min-h-52 place-items-center text-center">
          <div>
            <LuReceiptText className="mx-auto size-8 text-muted/60" />
            <p className="mt-3 text-sm font-bold text-foreground">Aún no hay órdenes hoy</p>
            <p className="mt-1 text-xs text-muted">Las nuevas notas aparecerán aquí.</p>
          </div>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-border">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center gap-3 py-3 first:pt-0">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-black text-primary">
                #{order.folio}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-bold text-foreground">{order.tableLabel}</p>
                  <OrderBadge status={order.status} />
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted">
                  {order.waiterName} · {timeFormatter.format(new Date(order.createdAt))}
                </p>
              </div>
              <p className="shrink-0 text-sm font-black text-foreground">{formatCurrency(order.total, currency)}</p>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/orders/list"
        className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-border text-xs font-black text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        Ver todas las órdenes <LuArrowRight />
      </Link>
    </article>
  );
}

function OrderBadge({ status }: { status: DashboardRecentOrder["status"] }) {
  if (status === "COMPLETADO") return <Badge variant="success">Completada</Badge>;
  if (status === "CANCELADO") return <Badge variant="danger">Cancelada</Badge>;
  return <Badge variant="warning">Pendiente</Badge>;
}
