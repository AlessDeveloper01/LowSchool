import { LuChartNoAxesColumnIncreasing } from "react-icons/lu";

import { formatCurrency } from "@/features/customization/lib/currency";
import type { CurrencyCode } from "@/features/customization/types/customization.types";
import type { DashboardHourlySale } from "@/features/dashboard/types/dashboard.types";

interface PerformanceChartProps {
  data: DashboardHourlySale[];
  currency: CurrencyCode;
}

export function PerformanceChart({ data, currency }: PerformanceChartProps) {
  const maximum = Math.max(...data.map((item) => item.sales), 0);
  const peak = data.reduce<DashboardHourlySale | null>(
    (current, item) => (!current || item.sales > current.sales ? item : current),
    null,
  );

  return (
    <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm shadow-foreground/5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-black text-foreground">Ventas por horario</p>
          <p className="mt-1 text-xs text-muted">Importe acumulado en bloques de tres horas.</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary/12 text-secondary">
          <LuChartNoAxesColumnIncreasing aria-hidden="true" />
        </span>
      </div>

      <div className="mt-7 flex h-52 items-end gap-2 sm:gap-3" aria-label="Ventas del día por horario">
        {data.map((item) => {
          const height = maximum > 0 ? Math.max((item.sales / maximum) * 100, 4) : 2;
          return (
            <div key={item.label} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
              <div className="relative flex min-h-0 flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-primary/18 transition-colors group-hover:bg-primary"
                  style={{ height: `${height}%` }}
                  title={`${item.label}: ${formatCurrency(item.sales, currency)} · ${item.orderCount} pedidos`}
                />
              </div>
              <span className="truncate text-center text-[9px] font-bold text-muted sm:text-[10px]">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs">
        <span className="text-muted">Horario con mayor venta</span>
        <span className="font-black text-foreground">
          {peak && peak.sales > 0
            ? `${peak.label} · ${formatCurrency(peak.sales, currency)}`
            : "Sin ventas registradas"}
        </span>
      </div>
    </article>
  );
}
