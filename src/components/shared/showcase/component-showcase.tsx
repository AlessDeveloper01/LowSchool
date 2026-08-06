"use client";

import { LuArrowUpRight, LuBlocks, LuMoon, LuSun } from "react-icons/lu";
import Link from "next/link";

import { ToastProvider } from "@/components/feedback/toast";
import { ActionsShowcase } from "@/components/shared/showcase/actions-showcase";
import { CustomizationShowcase } from "@/components/shared/showcase/customization-showcase";
import { DesignPresetsShowcase } from "@/components/shared/showcase/design-presets-showcase";
import { DataShowcase } from "@/components/shared/showcase/data-showcase";
import { FeedbackShowcase } from "@/components/shared/showcase/feedback-showcase";
import { FormsShowcase } from "@/components/shared/showcase/forms-showcase";
import { LayoutShowcase } from "@/components/shared/showcase/layout-showcase";
import { NavigationShowcase } from "@/components/shared/showcase/navigation-showcase";
import { ThemeToggle } from "@/components/shared/theme-controls";

const sections = [
  ["buttons", "Botones"],
  ["customization", "Personalización"],
  ["design-presets", "10 diseños"],
  ["forms", "Formularios"],
  ["cards", "Cards"],
  ["metrics", "Métricas"],
  ["display", "Badges e imágenes"],
  ["tables", "Tablas"],
  ["progress", "Stepper y timeline"],
  ["navigation", "Navegación"],
  ["feedback", "Feedback"],
  ["overlays", "Modales"],
  ["loaders", "Loaders"],
  ["states", "Estados"],
  ["layout", "Layout"],
  ["typography", "Tipografía"],
  ["identity", "Usuario y tema"],
] as const;

export function ComponentShowcase() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-4 sm:px-6">
            <span className="grid size-9 place-items-center rounded-lg bg-foreground text-background">
              <LuBlocks />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold">Nexora UI</p>
              <p className="truncate text-[10px] font-semibold text-muted">
                Component library
              </p>
            </div>
            <Link
              href="/dashboard"
              className="ml-auto hidden items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground sm:inline-flex"
            >
              Dashboard <LuArrowUpRight />
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <div className="mx-auto flex max-w-[1500px]">
          <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r border-border px-4 py-6 xl:block">
            <p className="mb-2 px-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">
              Índice
            </p>
            <nav className="space-y-0.5">
              {sections.map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block rounded-lg px-2 py-1.5 text-xs font-bold text-muted hover:bg-surface-hover hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 flex-1 px-4 pb-16 sm:px-6 lg:px-8">
            <section className="py-12 sm:py-16">
              <div className="max-w-3xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">
                  Catálogo interactivo
                </p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Componentes listos para construir.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                  Una biblioteca directa, tipada y adaptable para dashboards,
                  productos públicos y flujos internos.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "21 estilos de botón",
                    "15 campos avanzados",
                    "Métricas sin dependencias",
                    "Feedback y actividad",
                    "Layout responsivo",
                    "Customized en familias clave",
                  ].map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-border bg-surface px-3 py-1.5 text-[10px] font-extrabold text-muted"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold text-muted">
                  <span className="inline-flex items-center gap-1.5"><LuSun /> Claro</span>
                  <span className="inline-flex items-center gap-1.5"><LuMoon /> Oscuro</span>
                  <span>•</span>
                  <span>React 19 · Tailwind v4</span>
                </div>
              </div>
            </section>

            <ActionsShowcase />
            <CustomizationShowcase />
            <DesignPresetsShowcase />
            <FormsShowcase />
            <DataShowcase />
            <NavigationShowcase />
            <FeedbackShowcase />
            <LayoutShowcase />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
