import { LuBlocks, LuConstruction } from "react-icons/lu";

import { navigationConfig } from "@/features/navigation/config/nav-config";
import { getPageTitle } from "@/features/navigation/lib/navigation-utils";

interface RoutePlaceholderProps {
  pathname: string;
}

export function RoutePlaceholder({ pathname }: RoutePlaceholderProps) {
  const title = getPageTitle(navigationConfig, pathname);

  return (
    <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-5xl place-items-center p-6">
      <section className="w-full rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-tertiary/12 text-tertiary">
          <LuConstruction className="size-6" aria-hidden="true" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-secondary">
          Módulo preparado
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">
          Esta ruta ya está conectada al sistema de navegación. Sustituye este
          contenido por la feature correspondiente de tu producto.
        </p>
        <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
          <LuBlocks aria-hidden="true" />
          {pathname}
        </div>
      </section>
    </div>
  );
}
