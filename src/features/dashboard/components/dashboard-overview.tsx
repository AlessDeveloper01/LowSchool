import Link from "next/link";
import type { ReactNode } from "react";
import {
  LuArrowRight,
  LuBadgeDollarSign,
  LuCircleAlert,
  LuCircleCheck,
  LuClock3,
  LuPackageCheck,
  LuReceiptText,
  LuShoppingCart,
  LuStore,
  LuUtensils,
  LuWalletCards,
} from "react-icons/lu";

import { Badge } from "@/components/data-display/badge";
import type { SessionUser } from "@/features/auth/types/auth.types";
import { formatCurrency } from "@/features/customization/lib/currency";
import type { CurrencyCode } from "@/features/customization/types/customization.types";
import { MetricCard } from "@/features/dashboard/components/metric-card";
import { PerformanceChart } from "@/features/dashboard/components/performance-chart";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import type {
  DashboardMetricComparison,
  DashboardOverviewData,
} from "@/features/dashboard/types/dashboard.types";

const businessDateFormatter = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Mexico_City",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Mexico_City",
  hour: "numeric",
  minute: "2-digit",
});

interface DashboardOverviewProps {
  data: DashboardOverviewData;
  user: SessionUser;
  currency: CurrencyCode;
}

export function DashboardOverview({ data, user, currency }: DashboardOverviewProps) {
  const canOperate = user.role === "SUPER_ADMIN" || user.role === "ADMIN";
  const occupiedPercentage = data.tables.total > 0
    ? (data.tables.occupied / data.tables.total) * 100
    : 0;

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold capitalize tracking-wide text-secondary">
            {businessDateFormatter.format(new Date(`${data.businessDate}T12:00:00-06:00`))}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">
            {greeting()}, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Este es el estado real de la operación de hoy.
          </p>
        </div>
        {canOperate && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-black text-foreground transition-colors hover:bg-surface-hover"
            >
              <LuReceiptText /> Ver pedidos
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-black text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              <LuShoppingCart /> Crear pedido
            </Link>
          </div>
        )}
      </header>

      {!data.activeBox && canOperate && (
        <section className="flex flex-col gap-4 rounded-2xl border border-warning/30 bg-warning/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-warning/15 text-warning">
              <LuCircleAlert />
            </span>
            <div>
              <p className="font-black text-foreground">No hay una caja abierta</p>
              <p className="mt-1 text-sm text-muted">Debes abrir una caja antes de crear nuevas órdenes.</p>
            </div>
          </div>
          <Link
            href="/box"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-warning px-4 text-sm font-black text-warning-foreground"
          >
            Ir a caja <LuArrowRight />
          </Link>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores del día">
        <MetricCard
          label="Ventas de hoy"
          value={formatCurrency(data.salesTotal, currency)}
          detail={data.salesComparison.label}
          trend={comparisonTrend(data.salesComparison)}
          icon={LuWalletCards}
          accent="primary"
        />
        <MetricCard
          label="Pedidos válidos"
          value={data.validOrderCount}
          detail={data.ordersComparison.label}
          trend={comparisonTrend(data.ordersComparison)}
          icon={LuReceiptText}
          accent="secondary"
        />
        <MetricCard
          label="Ticket promedio"
          value={formatCurrency(data.averageTicket, currency)}
          detail={`${data.itemCount} productos vendidos`}
          icon={LuBadgeDollarSign}
          accent="tertiary"
        />
        <MetricCard
          label="Mesas disponibles"
          value={`${data.tables.available} de ${data.tables.total}`}
          detail={`${data.tables.occupied} ocupadas ahora`}
          icon={LuUtensils}
          accent="success"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
        <PerformanceChart data={data.hourlySales} currency={currency} />
        <CashRegisterCard data={data} currency={currency} occupiedPercentage={occupiedPercentage} />
      </section>

      <section className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <TopProducts data={data} currency={currency} />
        <RecentActivity orders={data.recentOrders} currency={currency} />
      </section>
    </div>
  );
}

function CashRegisterCard({
  data,
  currency,
  occupiedPercentage,
}: {
  data: DashboardOverviewData;
  currency: CurrencyCode;
  occupiedPercentage: number;
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-foreground/5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-black text-foreground">Operación actual</p>
          <p className="mt-1 text-xs text-muted">Caja, pedidos y ocupación.</p>
        </div>
        <Badge variant={data.activeBox ? "success" : "warning"} dot>
          {data.activeBox ? "Caja abierta" : "Caja cerrada"}
        </Badge>
      </div>

      {data.activeBox ? (
        <div className="mt-5 rounded-xl border border-border bg-background/60 p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><LuStore /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-foreground">{data.activeBox.name}</p>
              <p className="mt-0.5 text-[11px] text-muted">
                Caja #{data.activeBox.folio} · abierta {timeFormatter.format(new Date(data.activeBox.openedAt))}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <OperationValue label="Venta en caja" value={formatCurrency(data.activeBox.salesTotal, currency)} />
            <OperationValue label="Monto esperado" value={formatCurrency(data.activeBox.expectedAmount, currency)} />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-border p-5 text-center">
          <LuStore className="mx-auto size-7 text-muted/60" />
          <p className="mt-2 text-sm font-bold text-foreground">Sin caja activa</p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2">
        <OperationValue label="Pendientes" value={String(data.pendingOrderCount)} icon={<LuClock3 />} />
        <OperationValue label="Completadas" value={String(data.completedOrderCount)} icon={<LuCircleCheck />} />
        <OperationValue label="Canceladas" value={String(data.cancelledOrderCount)} icon={<LuCircleAlert />} />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-muted">Ocupación de mesas</span>
          <span className="font-black text-foreground">{Math.round(occupiedPercentage)}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
          <div className="h-full rounded-full bg-secondary" style={{ width: `${occupiedPercentage}%` }} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
        <span className="text-muted">Servicio</span>
        <span className="font-black text-foreground">
          {data.service.dineIn} en mesa · {data.service.takeaway} para llevar
        </span>
      </div>
      <Link href="/box" className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-primary hover:underline">
        Ver gestión de caja <LuArrowRight />
      </Link>
    </article>
  );
}

function TopProducts({ data, currency }: { data: DashboardOverviewData; currency: CurrencyCode }) {
  const maximum = Math.max(...data.topProducts.map((product) => product.quantity), 0);

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-foreground/5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-black text-foreground">Productos más vendidos</p>
          <p className="mt-1 text-xs text-muted">Ranking por unidades de las órdenes válidas de hoy.</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-tertiary/12 text-tertiary"><LuPackageCheck /></span>
      </div>

      {data.topProducts.length === 0 ? (
        <div className="grid min-h-52 place-items-center text-center">
          <div>
            <LuPackageCheck className="mx-auto size-8 text-muted/60" />
            <p className="mt-3 text-sm font-bold text-foreground">Sin productos vendidos hoy</p>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {data.topProducts.map((product, index) => (
            <div key={product.name}>
              <div className="flex items-center gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-background text-[11px] font-black text-muted">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-black text-foreground">{product.name}</p>
                    <p className="shrink-0 text-xs font-black text-foreground">{product.quantity} uds.</p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(product.quantity / maximum) * 100}%` }} />
                  </div>
                </div>
                <p className="w-24 shrink-0 text-right text-xs font-bold text-muted">{formatCurrency(product.sales, currency)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
        <Badge variant="soft">{data.activeProductCount} productos activos</Badge>
        <Badge variant="outline">{data.itemCount} unidades vendidas</Badge>
      </div>
    </article>
  );
}

function OperationValue({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="min-w-0 rounded-lg bg-background/70 px-3 py-2.5">
      <p className="flex items-center gap-1 truncate text-[10px] font-bold uppercase tracking-wide text-muted">{icon}{label}</p>
      <p className="mt-1 truncate text-sm font-black text-foreground">{value}</p>
    </div>
  );
}

function comparisonTrend(value: DashboardMetricComparison): "positive" | "negative" | "neutral" {
  if (value.value === null || value.value === 0) return "neutral";
  return value.value > 0 ? "positive" : "negative";
}

function greeting(): string {
  const hour = Number(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(new Date()));
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}
