"use client";

import { useState } from "react";
import { LuActivity, LuArrowRight, LuBell, LuCloud, LuCode, LuDatabase, LuEye, LuPencil, LuRocket, LuShieldCheck, LuTrash2, LuUsers } from "react-icons/lu";

import {
  ArticleCard,
  Card,
  CardActions,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DashboardCard,
  EmptyCard,
  FeatureCard,
  NotificationCard,
  PricingCard,
  ProfileCard,
  SelectionCard,
  StatCard,
} from "@/components/ui";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Carousel,
  Chip,
  ComparisonBar,
  DataTable,
  type DataTableFilterGroup,
  DescriptionItem,
  DescriptionList,
  EditableAvatar,
  Heading,
  ImageGallery,
  ImageOverlay,
  ImagePreview,
  Gauge,
  Kpi,
  KeyValue,
  Meter,
  Metric,
  MetricGroup,
  ResponsiveImage,
  Code,
  Blockquote,
  StatusBadge,
  SparkBars,
  Stepper,
  Table,
  type TableAction,
  type TableFilterValues,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  Thumbnail,
  Timeline,
  TrendIndicator,
  TypographyKbd,
} from "@/components/data-display";
import { Button } from "@/components/ui/button";
import { ActionMenu } from "@/components/navigation/dropdown-menu";
import { DemoBlock, ShowcaseSection } from "@/components/shared/showcase/showcase-section";
import {
  designPresets,
  type DesignPreset,
} from "@/components/types/design-preset";

interface Person {
  id: number;
  name: string;
  role: string;
  status: string;
}

type PersonFilterId = "status" | "role";

const people: Person[] = [
  { id: 1, name: "Ana Torres", role: "Diseño", status: "Activo" },
  { id: 2, name: "Luis Ríos", role: "Desarrollo", status: "Activo" },
  { id: 3, name: "Mara Silva", role: "Producto", status: "Pendiente" },
  { id: 4, name: "Joel Cruz", role: "Soporte", status: "Activo" },
  { id: 5, name: "Sara Luna", role: "Marketing", status: "Inactivo" },
  { id: 6, name: "Leo Díaz", role: "Ventas", status: "Activo" },
];

const personFilterGroups = [
  {
    id: "status",
    label: "Estado",
    placeholder: "Todos los estados",
    options: [
      { value: "Activo", label: "Activo" },
      { value: "Pendiente", label: "Pendiente" },
      { value: "Inactivo", label: "Inactivo" },
    ],
    getValue: (person) => person.status,
  },
  {
    id: "role",
    label: "Roles",
    multiple: true,
    options: [
      { value: "Diseño", label: "Diseño" },
      { value: "Desarrollo", label: "Desarrollo" },
      { value: "Producto", label: "Producto" },
      { value: "Soporte", label: "Soporte" },
      { value: "Marketing", label: "Marketing" },
      { value: "Ventas", label: "Ventas" },
    ],
    getValue: (person) => person.role,
  },
] satisfies readonly DataTableFilterGroup<Person, PersonFilterId>[];

function personRowActions(person: Person): TableAction[] {
  return [
    {
      id: "view",
      label: `Ver a ${person.name}`,
      icon: <LuEye />,
      href: "#tables",
    },
    {
      id: "edit",
      label: "Editar",
      icon: <LuPencil />,
      onSelect: () => undefined,
      disabled: person.status === "Inactivo",
    },
    {
      id: "delete",
      label: "Eliminar",
      icon: <LuTrash2 />,
      onSelect: () => undefined,
      destructive: true,
      hidden: person.status === "Pendiente",
    },
  ];
}

function customizedPresetClass(design: DesignPreset): string | undefined {
  return design === "customized"
    ? "rounded-[1.4rem] border-2 border-amber-400 bg-amber-200 text-zinc-950 shadow-[3px_3px_0_#18181b]"
    : undefined;
}

export function DataShowcase() {
  const [selection, setSelection] = useState("cloud");
  const [chipSelected, setChipSelected] = useState(true);
  const [tableSearch, setTableSearch] = useState("");
  const [tableFilters, setTableFilters] = useState<
    TableFilterValues<PersonFilterId>
  >({
    status: "Activo",
    role: ["Diseño", "Desarrollo"],
  });
  const [tableFiltersOpen, setTableFiltersOpen] = useState(true);

  return (
    <>
      <ShowcaseSection id="data-presets" title="10 diseños para datos" description="La misma API visual cambia entre minimal, outline, soft, elevated, glass, gradient, pill, sharp, brutalist y customized.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {designPresets.map((design) => (
            <div key={design} className="space-y-3">
              <Metric
                design={design}
                className={customizedPresetClass(design)}
                label={design}
                value="84.2K"
                trend={<TrendIndicator direction="up" value="+12%" />}
                size="sm"
              />
              <div className="flex items-center gap-2">
                <Avatar
                  alt={design}
                  name={design}
                  design={design}
                  className={customizedPresetClass(design)}
                />
                <Badge
                  design={design}
                  className={customizedPresetClass(design)}
                >
                  {design}
                </Badge>
              </div>
              <Meter
                value={68}
                design={design}
                className={customizedPresetClass(design)}
                indicatorClassName={
                  design === "customized" ? "bg-amber-500" : undefined
                }
              />
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="cards" title="Cards" description="Contenedores base y composiciones frecuentes construidas sobre Card.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Card variant="gradient"><CardHeader><div><CardTitle>Card base</CardTitle><CardDescription>Header, descripción y acciones.</CardDescription></div><CardActions><ActionMenu items={[]} /></CardActions></CardHeader><CardContent>Contenido reutilizable.</CardContent><CardFooter>Footer opcional</CardFooter></Card>
          <StatCard label="Usuarios activos" value="12,840" change="+18.2% este mes" trend="up" icon={<LuUsers />} />
          <ProfileCard name="Alex Rivera" role="Product Designer" description="Diseña experiencias claras y accesibles." actions={<Button size="sm" variant="outline">Ver perfil</Button>} />
          <FeatureCard title="Automatización" description="Conecta procesos repetitivos con flujos simples." icon={<LuRocket />} action={<Button variant="link">Explorar <LuArrowRight /></Button>} />
          <PricingCard name="Pro" price="$29" highlighted features={["Proyectos ilimitados", "Soporte prioritario", "Analítica avanzada"]} />
          <ArticleCard title="Construyendo mejores interfaces" excerpt="Principios prácticos para productos digitales mantenibles." meta="DISEÑO · 8 MIN" image={<div className="grid size-full place-items-center bg-primary/10 text-4xl text-primary"><LuCode /></div>} href="#" />
          <NotificationCard title="Reporte listo" description="El informe mensual terminó de generarse." time="Hace 4 min" unread actions={<Button size="xs" variant="ghost">Abrir</Button>} />
          <EmptyCard action={<Button size="sm">Crear elemento</Button>} />
          <SelectionCard name="hosting" value="cloud" checked={selection === "cloud"} onChange={setSelection}><CardTitle>Cloud</CardTitle><CardDescription>Infraestructura administrada.</CardDescription></SelectionCard>
          <DashboardCard title="Actividad" description="Últimos 7 días" actions={<LuActivity />}><div className="h-24 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10" /></DashboardCard>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="metrics" title="Métricas y micrográficas" description="KPIs, tendencias, medidores y visualizaciones compactas sin una librería de charts.">
        <div className="space-y-4">
          <MetricGroup columns={3}>
            <Metric
              label="Ingresos"
              value="$84,240"
              icon={<LuDatabase />}
              trend={<TrendIndicator direction="up" value="+18.4%" label="vs. mes anterior" />}
              variant="gradient"
            />
            <Metric
              label="Conversión"
              value="7.82%"
              icon={<LuActivity />}
              trend={<TrendIndicator direction="down" value="-0.6%" />}
              variant="accent"
            />
            <Metric
              label="Usuarios"
              value="12,840"
              icon={<LuUsers />}
              trend={<TrendIndicator direction="up" value="+924" />}
              variant="soft"
            />
          </MetricGroup>
          <div className="grid gap-4 lg:grid-cols-2">
            <DemoBlock title="KPI, Meter y ComparisonBar">
              <Kpi label="Objetivo trimestral" value="$184K" target="$220K" progress={84} />
              <Meter className="mt-5" label="Capacidad utilizada" value={72} marker={85} variant="gradient" />
              <ComparisonBar className="mt-5" firstLabel="Desktop" firstValue={68} secondLabel="Mobile" secondValue={32} />
            </DemoBlock>
            <DemoBlock title="Gauge y SparkBars">
              <div className="flex flex-wrap items-center gap-6">
                <Gauge value={86} label="Salud" variant="success" />
                <Gauge value={62} label="Rendimiento" variant="gradient" size={96} />
                <div className="min-w-40 flex-1">
                  <p className="mb-3 text-xs font-extrabold">Actividad semanal</p>
                  <SparkBars values={[32, 58, 46, 75, 64, 88, 96]} variant="gradient" height={86} />
                </div>
              </div>
            </DemoBlock>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="display" title="Badges, avatares e imágenes" description="Identidad visual, estados, contenido multimedia y agrupaciones.">
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoBlock title="Badge, StatusBadge, Tag y Chip">
            <div className="flex flex-wrap items-center gap-2">
              {(["default", "primary", "secondary", "success", "warning", "danger", "info", "outline", "soft"] as const).map((variant) => <Badge key={variant} variant={variant}>{variant}</Badge>)}
              <StatusBadge status="processing" />
              <StatusBadge status="paid" />
              <Tag removable onRemove={() => undefined}>TypeScript</Tag>
              <Chip selected={chipSelected} onSelectedChange={setChipSelected}>React</Chip>
              <Badge counter={24} variant="danger" />
            </div>
          </DemoBlock>
          <DemoBlock title="Avatar, AvatarGroup y EditableAvatar">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar alt="Ana" name="Ana Torres" size="xs" status="online" />
              <Avatar alt="Luis" name="Luis Ríos" size="sm" shape="rounded" />
              <Avatar alt="Mara" name="Mara Silva" size="md" ring />
              <Avatar alt="Joel" name="Joel Cruz" size="lg" status="busy" />
              <EditableAvatar alt="Sara" name="Sara Luna" size="xl" onEdit={() => undefined} />
              <AvatarGroup max={3}><Avatar alt="A" name="Ana" /><Avatar alt="L" name="Luis" /><Avatar alt="M" name="Mara" /><Avatar alt="J" name="Joel" /></AvatarGroup>
            </div>
          </DemoBlock>
          <DemoBlock title="ResponsiveImage, Thumbnail, Preview, Gallery y Overlay" className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResponsiveImage design="minimal" src="/favicon.ico" alt="Responsive" fit="contain" />
              <Thumbnail design="outline" src="/favicon.ico" alt="Thumbnail" fit="contain" />
              <ImagePreview design="elevated" src="/favicon.ico" alt="Preview" fit="contain" />
              <ImageOverlay design="glass" src="/favicon.ico" alt="Overlay" fit="contain"><strong>Image overlay</strong></ImageOverlay>
            </div>
            <ImageGallery design="gradient" className="mt-4" images={[{ src: "/favicon.ico", alt: "Uno" }, { src: "/favicon.ico", alt: "Dos" }, { src: "/favicon.ico", alt: "Tres" }]} />
          </DemoBlock>
          <DemoBlock title="DescriptionList, KeyValue y tipografía visual" className="lg:col-span-2">
            <div className="grid gap-4 lg:grid-cols-2">
              <DescriptionList design="outline" columns={2} className="p-4">
                <DescriptionItem design="minimal" term="Plan" details="Enterprise" />
                <DescriptionItem design="soft" term="Región" details="México" />
              </DescriptionList>
              <div className="space-y-3">
                <KeyValue design="glass" label="Entorno" value="Producción" supportingText="Sincronizado ahora" />
                <Heading design="gradient" className="p-3">Tipografía con superficie</Heading>
                <div className="flex flex-wrap gap-2">
                  <Code design="pill" className="px-3 py-1">pnpm build</Code>
                  <TypographyKbd design="brutalist" className="px-3 py-1">⌘ K</TypographyKbd>
                </div>
                <Blockquote design="sharp" className="p-3">Los presets también funcionan en piezas tipográficas visuales.</Blockquote>
              </div>
            </div>
          </DemoBlock>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="tables" title="Tablas y datos" description="Tabla semántica, DataTable con búsqueda, orden, selección y paginación.">
        <div className="space-y-5">
          <Table variant="striped" design="outline">
            <TableCaption>Equipo del proyecto</TableCaption>
            <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Rol</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
            <TableBody>{people.slice(0, 3).map((person) => <TableRow key={person.id}><TableCell>{person.name}</TableCell><TableCell>{person.role}</TableCell><TableCell><StatusBadge status={person.status === "Activo" ? "active" : "pending"} /></TableCell></TableRow>)}</TableBody>
            <TableFooter><TableRow><TableCell colSpan={3}>{people.length} integrantes</TableCell></TableRow></TableFooter>
          </Table>
          <DemoBlock title="DataTable con búsqueda y filtros conectados">
            <p className="mb-4 max-w-3xl text-xs leading-5 text-muted">
              Busca por texto, combina un estado con varios roles, oculta el
              panel y limpia todo desde la misma barra. Las acciones por fila
              permanecen disponibles en el menú fijo de la última columna.
            </p>
            <DataTable<Person, PersonFilterId>
              design="elevated"
              surface="plain"
              filterDesign="soft"
              data={people}
              searchable
              searchValue={tableSearch}
              onSearchValueChange={setTableSearch}
              searchPlaceholder="Buscar nombre, rol o estado..."
              searchLabel="Buscar integrantes"
              getSearchText={(person) =>
                `${person.name} ${person.role} ${person.status}`
              }
              filterGroups={personFilterGroups}
              filterValues={tableFilters}
              onFilterValuesChange={setTableFilters}
              filtersCollapsible
              filtersOpen={tableFiltersOpen}
              onFiltersOpenChange={setTableFiltersOpen}
              showFilterPanel
              filtersLabel="Mostrar u ocultar filtros"
              clearFiltersLabel="Limpiar búsqueda y filtros"
              selectable
              pageSize={3}
              pageSizeOptions={[3, 6]}
              columns={[
                { key: "name", header: "Nombre", sortable: true },
                { key: "role", header: "Rol", sortable: true },
                {
                  key: "status",
                  header: "Estado",
                  render: (person) => (
                    <Badge
                      variant={
                        person.status === "Activo"
                          ? "success"
                          : person.status === "Inactivo"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {person.status}
                    </Badge>
                  ),
                },
              ]}
              getRowId={(person) => String(person.id)}
              rowActions={personRowActions}
              actionsVariant="dropdown"
            />
          </DemoBlock>
          <div className="grid gap-4 xl:grid-cols-2">
            {(["icons", "dropdown", "buttons"] as const).map((actionsVariant) => (
              <DemoBlock
                key={actionsVariant}
                title={`Acciones · ${actionsVariant}`}
                className={actionsVariant === "buttons" ? "xl:col-span-2" : undefined}
              >
                <DataTable<Person>
                  design={
                    actionsVariant === "icons"
                      ? "outline"
                      : actionsVariant === "dropdown"
                        ? "soft"
                        : "gradient"
                  }
                  data={people.slice(0, 3)}
                  searchable={false}
                  pageSize={3}
                  pageSizeOptions={[3]}
                  columns={[
                    { key: "name", header: "Nombre", sortable: true },
                    { key: "role", header: "Rol", sortable: true },
                    {
                      key: "status",
                      header: "Estado",
                      render: (person) => (
                        <Badge
                          variant={
                            person.status === "Activo" ? "success" : "warning"
                          }
                        >
                          {person.status}
                        </Badge>
                      ),
                    },
                  ]}
                  getRowId={(person) => String(person.id)}
                  rowActions={personRowActions}
                  actionsVariant={actionsVariant}
                />
              </DemoBlock>
            ))}
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="progress" title="Stepper, Timeline y Carousel" description="Representaciones de avance, eventos y contenido secuencial.">
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoBlock title="Stepper"><Stepper design="gradient" currentStep={1} steps={[{ id: "1", title: "Cuenta", icon: <LuUsers /> }, { id: "2", title: "Proyecto", icon: <LuDatabase /> }, { id: "3", title: "Publicar", icon: <LuRocket /> }]} /></DemoBlock>
          <DemoBlock title="Timeline"><Timeline design="minimal" variant="compact" items={[{ id: "1", title: "Proyecto creado", date: "09:30", status: "success", icon: <LuCloud /> }, { id: "2", title: "Seguridad revisada", date: "10:15", icon: <LuShieldCheck /> }, { id: "3", title: "Despliegue pendiente", date: "Ahora", status: "warning", icon: <LuBell /> }]} /></DemoBlock>
          <DemoBlock title="Carousel" className="lg:col-span-2"><Carousel design="elevated" autoplay items={[<div key="1" className="grid h-48 place-items-center bg-primary/10 text-xl font-extrabold text-primary">Primera diapositiva</div>, <div key="2" className="grid h-48 place-items-center bg-secondary/10 text-xl font-extrabold text-secondary">Segunda diapositiva</div>, <div key="3" className="grid h-48 place-items-center bg-accent/10 text-xl font-extrabold text-accent">Tercera diapositiva</div>]} /></DemoBlock>
        </div>
      </ShowcaseSection>
    </>
  );
}
