import type { ReactNode } from "react";
import { LuBan, LuCloudOff, LuFileQuestion, LuInbox, LuLoaderCircle, LuLockKeyhole, LuSearchX, LuTriangleAlert, LuWrench } from "react-icons/lu";

import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  size?: "compact" | "full";
  design?: DesignPreset;
  className?: string;
}

export function EmptyState({ icon = <LuInbox />, title = "Sin contenido", description = "No hay elementos para mostrar.", primaryAction, secondaryAction, size = "full", design, className }: EmptyStateProps) {
  return (
    <section className={cn("grid min-w-0 max-w-full place-items-center overflow-hidden text-center", size === "compact" ? "min-h-40 p-4" : "min-h-72 p-6 sm:p-8", design && surfaceDesignStyles[design], className)}>
      <div className="min-w-0 max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-surface-hover text-xl text-muted">{icon}</span>
        <h2 className="mt-4 break-words text-lg font-extrabold text-foreground">{title}</h2>
        <p className="mt-1.5 break-words text-sm leading-6 text-muted">{description}</p>
        {(primaryAction || secondaryAction) && <div className="mt-5 flex flex-wrap justify-center gap-2">{primaryAction}{secondaryAction}</div>}
      </div>
    </section>
  );
}

export function ErrorState(props: EmptyStateProps) { return <EmptyState icon={<LuTriangleAlert />} title="Ocurrió un error" {...props} />; }
export function LoadingState(props: EmptyStateProps) { return <EmptyState icon={<LuLoaderCircle className="animate-spin" />} title="Cargando" description="Espera un momento." {...props} />; }
export function OfflineState(props: EmptyStateProps) { return <EmptyState icon={<LuCloudOff />} title="Sin conexión" description="Revisa tu conexión a internet." {...props} />; }
export function NotFoundState(props: EmptyStateProps) { return <EmptyState icon={<LuFileQuestion />} title="Página no encontrada" description="El recurso solicitado no existe." {...props} />; }
export function PermissionDeniedState(props: EmptyStateProps) { return <EmptyState icon={<LuLockKeyhole />} title="Acceso restringido" description="No tienes permisos para ver este contenido." {...props} />; }
export function NoResultsState(props: EmptyStateProps) { return <EmptyState icon={<LuSearchX />} title="Sin resultados" description="Prueba con otros filtros o términos." {...props} />; }
export function MaintenanceState(props: EmptyStateProps) { return <EmptyState icon={<LuWrench />} title="En mantenimiento" description="Volveremos a estar disponibles pronto." {...props} />; }
export function DisabledState(props: EmptyStateProps) { return <EmptyState icon={<LuBan />} title="No disponible" {...props} />; }
