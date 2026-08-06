"use client";

import { useState } from "react";
import {
  LuBell,
  LuChartNoAxesCombined,
  LuGauge,
  LuLayoutGrid,
  LuMail,
  LuMenu,
  LuPlus,
  LuSettings2,
  LuSlidersHorizontal,
  LuUserRound,
} from "react-icons/lu";

import {
  Accordion,
  ActionDock,
  ActionMenu,
  ActiveFilters,
  BottomNavigation,
  Breadcrumb,
  Collapsible,
  ContextMenu,
  DashboardNavbar,
  DropdownMenu,
  FilterBar,
  FilterButton,
  FloatingToolbar,
  MobileMenu,
  Navbar,
  NavRail,
  PageHeader,
  Pagination,
  PublicNavbar,
  RangeFilter,
  SimplePagination,
  Sidebar,
  SidebarGroup,
  SortButton,
  SpeedDial,
  Tabs,
  UserDropdown,
  CommandTrigger,
} from "@/components/navigation";
import { SearchInput } from "@/components/forms";
import { Badge } from "@/components/data-display/badge";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-controls";
import { NotificationBell } from "@/components/shared/user-components";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import {
  designPresets,
  type DesignPreset,
} from "@/components/types";
import { DemoBlock, ShowcaseSection } from "@/components/shared/showcase/showcase-section";

const navLinks = [
  { label: "Inicio", href: "#", active: true },
  { label: "Producto", href: "#" },
  { label: "Precios", href: "#" },
];

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", href: "#", icon: <LuGauge />, active: true },
  { id: "analytics", label: "Analítica", icon: <LuChartNoAxesCombined />, badge: 4, children: [{ id: "reports", label: "Reportes", href: "#" }] },
  { id: "settings", label: "Configuración", href: "#", icon: <LuSettings2 /> },
];

const designLabels: Record<DesignPreset, string> = {
  minimal: "Minimal",
  outline: "Outline",
  soft: "Soft",
  elevated: "Elevated",
  glass: "Glass",
  gradient: "Gradient",
  pill: "Pill",
  sharp: "Sharp",
  brutalist: "Brutalist",
  customized: "Customized",
};

export function NavigationShowcase() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(3);
  const [filters, setFilters] = useState([{ id: "status", label: "Estado: activo" }, { id: "country", label: "País: México" }]);
  const [range, setRange] = useState<{ min?: number; max?: number }>({ min: 10, max: 100 });

  return (
    <ShowcaseSection id="navigation" title="Navegación" description="Menús, barras, sidebar, rutas, filtros y navegación adaptable.">
      <div className="space-y-5">
        <DemoBlock title="10 diseños de Breadcrumb">
          <div className="grid gap-3 md:grid-cols-2">
            {designPresets.map((design) => (
              <div key={design} className="min-w-0">
                <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">
                  {designLabels[design]}
                </p>
                <Breadcrumb
                  design={design}
                  className={design === "customized" ? "rounded-3xl border-2 border-dashed border-tertiary bg-tertiary/10" : undefined}
                  items={[
                    { label: "Dashboard", href: "#" },
                    { label: "Proyectos", href: "#" },
                    { label: "Nexora" },
                  ]}
                />
              </div>
            ))}
          </div>
        </DemoBlock>

        <DemoBlock title="10 diseños de Sidebar">
          <div className="grid gap-4 md:grid-cols-2">
            {designPresets.map((design) => (
              <div key={design} className="min-w-0">
                <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">
                  {designLabels[design]}
                </p>
                <div className="h-72 overflow-hidden rounded-2xl bg-background">
                  <Sidebar
                    design={design}
                    variant="light"
                    className={
                      design === "customized"
                        ? "h-full w-full rounded-3xl border-2 border-dashed border-tertiary bg-tertiary/10"
                        : "h-full w-full"
                    }
                    items={sidebarItems}
                    header={<Logo name="Nexora" size="sm" />}
                    footer={<span className="text-xs text-muted">v1.0</span>}
                  />
                </div>
              </div>
            ))}
          </div>
        </DemoBlock>

        <DemoBlock title="Navbar, PublicNavbar y DashboardNavbar">
          <div className="space-y-3 overflow-hidden rounded-xl border border-border">
            <Navbar design="minimal" variant="minimal" logo={<Logo name="Nexora" variant="horizontal" size="sm" />} links={navLinks} actions={<Button size="sm">Comenzar</Button>} />
            <PublicNavbar design="gradient" logo={<Logo name="Public" size="sm" />} links={navLinks} themeSelector={<ThemeToggle />} />
            <DashboardNavbar design="glass" logo={<Logo name="Admin" variant="compact" size="sm" />} search={<SearchInput placeholder="Buscar" />} notifications={<NotificationBell count={3} />} />
          </div>
        </DemoBlock>

        <div className="grid gap-4 lg:grid-cols-2">
          <DemoBlock title="Sidebar, grupos e items">
            <div className="h-80 overflow-hidden rounded-xl border border-border">
              <Sidebar
                className="h-full w-full"
                items={sidebarItems}
                header={<Logo name="Nexora" size="sm" />}
                footer={<span className="text-xs text-muted">v1.0</span>}
              />
            </div>
            <SidebarGroup label="Ejemplo de grupo" className="mt-4"><p className="text-xs text-muted">SidebarGroup organiza bloques personalizados.</p></SidebarGroup>
          </DemoBlock>
          <DemoBlock title="MobileMenu y BottomNavigation">
            <Button leftIcon={<LuMenu />} onClick={() => setMobileOpen(true)}>Abrir menú móvil</Button>
            <MobileMenu design="soft" open={mobileOpen} onOpenChange={setMobileOpen} items={sidebarItems.filter((item) => item.href).map((item) => ({ label: item.label, href: item.href ?? "#", icon: item.icon, active: item.active }))} header={<Logo name="Nexora" size="sm" />} />
            <div className="relative mt-4 overflow-hidden rounded-xl border border-border pt-20">
              <BottomNavigation design="pill" className="static" items={[{ label: "Inicio", href: "#", icon: <LuGauge />, active: true }, { label: "Alertas", href: "#", icon: <LuBell />, badge: 3 }, { label: "Perfil", href: "#", icon: <LuUserRound /> }]} />
            </div>
          </DemoBlock>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <DemoBlock title="ActionDock, FloatingToolbar y CommandTrigger">
            <div className="flex flex-wrap items-center gap-4">
              <ActionDock
                design="outline"
                actions={[
                  { id: "grid", label: "Vista", icon: <LuLayoutGrid />, active: true },
                  { id: "mail", label: "Mensajes", icon: <LuMail />, badge: 5 },
                  { id: "settings", label: "Ajustes", icon: <LuSettings2 /> },
                ]}
              />
              <FloatingToolbar
                design="glass"
                showLabels
                actions={[
                  { id: "create", label: "Crear", icon: <LuPlus /> },
                  { id: "alerts", label: "Alertas", icon: <LuBell /> },
                ]}
              />
              <CommandTrigger design="sharp" />
            </div>
          </DemoBlock>
          <DemoBlock title="NavRail y SpeedDial">
            <div className="flex items-center justify-between gap-6">
              <div className="flex gap-3">
                <NavRail
                  design="elevated"
                  variant="floating"
                  items={[
                    { id: "home", label: "Inicio", icon: <LuGauge />, active: true },
                    { id: "mail", label: "Mensajes", icon: <LuMail />, badge: 3 },
                    { id: "profile", label: "Perfil", icon: <LuUserRound /> },
                  ]}
                />
                <NavRail
                  design="soft"
                  variant="soft"
                  showLabels
                  items={[
                    { id: "overview", label: "Resumen", icon: <LuLayoutGrid />, active: true },
                    { id: "settings", label: "Ajustes", icon: <LuSettings2 /> },
                  ]}
                />
              </div>
              <SpeedDial
                design="gradient"
                defaultOpen
                direction="left"
                actions={[
                  { id: "add", label: "Nuevo", icon: <LuPlus />, onSelect: () => undefined },
                  { id: "message", label: "Mensaje", icon: <LuMail />, onSelect: () => undefined },
                ]}
              />
            </div>
          </DemoBlock>
        </div>

        <DemoBlock title="Breadcrumb y PageHeader">
          <PageHeader
            design="elevated"
            breadcrumb={[{ label: "Dashboard", href: "#" }, { label: "Proyectos", href: "#" }, { label: "Nexora" }]}
            title="Biblioteca de componentes"
            description="Un encabezado adaptable con ruta, badge y acciones."
            badge={<Badge variant="soft">Beta</Badge>}
            primaryAction={<Button>Crear proyecto</Button>}
            secondaryActions={<Button variant="outline">Exportar</Button>}
          />
          <Breadcrumb className="mt-5" maxItems={3} items={[{ label: "Inicio", href: "#" }, { label: "Configuración", href: "#" }, { label: "Equipo", href: "#" }, { label: "Permisos" }]} />
        </DemoBlock>

        <div className="grid gap-4 lg:grid-cols-2">
          <DemoBlock title="Dropdown, ContextMenu, UserDropdown y ActionMenu">
            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu design="soft" trigger={<Button variant="outline">Abrir dropdown</Button>} items={[{ id: "edit", label: "Editar", icon: <LuSlidersHorizontal />, onSelect: () => undefined }, { id: "delete", label: "Eliminar", destructive: true, separatorBefore: true, onSelect: () => undefined }]} />
              <UserDropdown design="glass" name="Alex Rivera" email="alex@nexora.app" onProfile={() => undefined} onLogout={() => undefined} />
              <ActionMenu design="outline" items={[{ id: "one", label: "Primera acción", onSelect: () => undefined }]} />
              <ContextMenu design="brutalist" items={[{ id: "copy", label: "Copiar", onSelect: () => undefined }, { id: "delete", label: "Eliminar", destructive: true, onSelect: () => undefined }]}><div className="rounded-lg border border-dashed border-border px-4 py-3 text-xs text-muted">Clic derecho aquí</div></ContextMenu>
            </div>
          </DemoBlock>
          <DemoBlock title="Tooltip y Popover">
            <div className="flex flex-wrap gap-4">
              <Tooltip label="Información breve" position="top"><Button variant="outline">Tooltip</Button></Tooltip>
              <Tooltip variant="rich" content={<span><strong className="block">Contenido rico</strong><span className="text-muted">Acepta ReactNode.</span></span>} position="right"><Button variant="soft">Rich tooltip</Button></Tooltip>
              <Popover trigger={<Button variant="outline">Popover</Button>}><h4 className="font-extrabold">Preferencias</h4><p className="mt-1 text-xs text-muted">Contenido interactivo y cierre exterior.</p></Popover>
            </div>
          </DemoBlock>
        </div>

        <DemoBlock title="Tabs, Accordion y Collapsible">
          <Tabs design="gradient" items={[{ value: "overview", label: "Resumen", icon: <LuGauge />, content: <p className="text-sm text-muted">Contenido del resumen.</p> }, { value: "settings", label: "Configuración", icon: <LuSettings2 />, content: <p className="text-sm text-muted">Contenido de configuración.</p> }, { value: "disabled", label: "Deshabilitada", content: null, disabled: true }]} />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Accordion design="outline" multiple items={[{ id: "one", title: "¿Cómo se utiliza?", content: "Importa el componente y configura sus props." }, { id: "two", title: "¿Soporta modo oscuro?", content: "Sí, utiliza los tokens semánticos de la plantilla." }]} />
            <Collapsible design="soft" trigger={<Button variant="outline">Mostrar contenido</Button>}><p className="mt-3 rounded-lg bg-background p-3 text-xs text-muted">Contenido colapsable.</p></Collapsible>
          </div>
        </DemoBlock>

        <DemoBlock title="Search, FilterBar, ActiveFilters, Sort y Range">
          <FilterBar
            design="glass"
            search={<SearchInput placeholder="Buscar resultados..." />}
            filters={<><FilterButton count={filters.length} /><SortButton design="soft" items={[{ id: "recent", label: "Más recientes", onSelect: () => undefined }, { id: "name", label: "Nombre", onSelect: () => undefined }]} /></>}
          />
          <div className="mt-3"><ActiveFilters design="pill" filters={filters} onRemove={(id) => setFilters((current) => current.filter((filter) => filter.id !== id))} onClear={() => setFilters([])} /></div>
          <RangeFilter design="outline" className="mt-4 max-w-sm" value={range} onChange={setRange} />
        </DemoBlock>

        <DemoBlock title="Pagination y SimplePagination">
          <Pagination design="pill" currentPage={page} totalPages={12} onPageChange={setPage} />
          <SimplePagination design="soft" className="mt-4" currentPage={page} totalPages={12} onPrevious={() => setPage((current) => Math.max(1, current - 1))} onNext={() => setPage((current) => Math.min(12, current + 1))} />
        </DemoBlock>
      </div>
    </ShowcaseSection>
  );
}
