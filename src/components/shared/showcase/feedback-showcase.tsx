"use client";

import { useState } from "react";
import {
  LuBell,
  LuCloudOff,
  LuInfo,
  LuRocket,
  LuShieldCheck,
} from "react-icons/lu";

import {
  Alert,
  AlertDialog,
  ActivityEvent,
  ActivityFeed,
  Announcement,
  AvatarSkeleton,
  Banner,
  BottomSheet,
  CardSkeleton,
  ChartSkeleton,
  CircularProgress,
  Callout,
  ConfirmDialog,
  Dialog,
  Drawer,
  ConnectionStatus,
  FormSkeleton,
  FileProgress,
  EmptyState,
  ErrorState,
  InlineMessage,
  LoadingDots,
  LoadingState,
  ListSkeleton,
  MaintenanceState,
  Modal,
  NoResultsState,
  NotificationItem,
  NotFoundState,
  OfflineState,
  PageLoader,
  PermissionDeniedState,
  ProfileSkeleton,
  ProgressBar,
  ProgressRing,
  Sheet,
  SegmentedProgress,
  Skeleton,
  Spinner,
  StatusBeacon,
  TableSkeleton,
  TextSkeleton,
  useToast,
} from "@/components/feedback";
import { Button } from "@/components/ui/button";
import { DemoBlock, ShowcaseSection } from "@/components/shared/showcase/showcase-section";
import {
  designPresets,
  type DesignPreset,
} from "@/components/types/design-preset";

type OverlayName = "modal" | "dialog" | "confirm" | "alert" | "drawer" | "sheet" | "bottom" | null;

function customizedFeedbackClass(
  design: DesignPreset,
): string | undefined {
  return design === "customized"
    ? "rounded-[1.4rem] border-2 border-fuchsia-400 bg-fuchsia-100 text-fuchsia-950 shadow-[3px_3px_0_#86198f]"
    : undefined;
}

export function FeedbackShowcase() {
  const { toast } = useToast();
  const [overlay, setOverlay] = useState<OverlayName>(null);
  const [showAlert, setShowAlert] = useState(true);
  const [loaderProgress, setLoaderProgress] = useState(64);

  function updateLoaderProgress(step: number): void {
    setLoaderProgress((current) => Math.min(100, Math.max(0, current + step)));
  }

  return (
    <>
      <ShowcaseSection id="feedback-presets" title="10 diseños para feedback" description="Alertas, estados y cargas comparten una capa visual intercambiable sin perder sus variantes semánticas.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {designPresets.map((design) => (
            <div key={design} className="space-y-3">
              <Alert
                design={design}
                className={customizedFeedbackClass(design)}
                variant="info"
                title={design}
                description="Mismo contenido, nueva superficie."
              />
              <div className="flex items-center justify-between gap-3">
                <StatusBeacon
                  design={design}
                  className={customizedFeedbackClass(design)}
                  status="online"
                  label="Operativo"
                />
                <Skeleton
                  design={design}
                  className={
                    design === "customized"
                      ? "h-8 w-16 rounded-full bg-fuchsia-300"
                      : "h-8 w-16"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="feedback" title="Feedback" description="Alertas, mensajes, toasts y estados visuales para comunicar cambios.">
        <div className="space-y-4">
          {showAlert && <Alert variant="info" title="Actualización disponible" description="Hay una nueva versión lista para instalar." dismissible onDismiss={() => setShowAlert(false)} primaryAction={{ label: "Actualizar", onClick: () => undefined }} />}
          <div className="grid gap-3 lg:grid-cols-2">
            <Alert variant="success" appearance="soft" title="Guardado" description="Los cambios se guardaron correctamente." />
            <Alert variant="warning" appearance="outline" title="Revisa la información" description="Algunos campos necesitan atención." />
            <Alert variant="danger" appearance="solid" title="No se pudo completar" description="Intenta nuevamente dentro de unos minutos." />
            <InlineMessage variant="neutral" icon={<LuInfo />}>Mensaje inline para contexto breve.</InlineMessage>
          </div>
          <Banner variant="info" title="Banner informativo" description="Ideal para avisos globales de la aplicación." />
          <Announcement
            design="gradient"
            title="Nueva colección de componentes"
            description="Métricas, formularios y acciones especializadas ya están disponibles."
            badge={<span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-extrabold text-secondary-foreground">NUEVO</span>}
            action={<Button size="xs" variant="outline">Explorar</Button>}
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Callout design="soft" variant="tip" title="Consejo" description="Usa customized para adaptar cada proyecto." />
            <Callout design="outline" variant="success" appearance="outline" title="Integración correcta" description="Todos los contratos están tipados." />
            <Callout design="minimal" variant="accent" appearance="minimal" title="Diseño modular" description="Combina piezas sin duplicar lógica." />
          </div>
          <DemoBlock title="Toast interactivo">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => toast({ title: "Notificación", description: "Toast predeterminado." })}>Default</Button>
              <Button variant="success" onClick={() => toast({ title: "Completado", description: "La operación terminó.", variant: "success" })}>Success</Button>
              <Button variant="danger" onClick={() => toast({ title: "Error", description: "No fue posible guardar.", variant: "error" })}>Error</Button>
              <Button variant="warning" onClick={() => toast({ title: "Advertencia", variant: "warning" })}>Warning</Button>
              <Button variant="gradient" onClick={() => toast({ title: "Toast glass", description: "La superficie también acepta presets.", design: "glass" })}>Glass</Button>
              <Button variant="outline" onClick={() => toast({ title: "Toast brutalist", design: "brutalist" })}>Brutalist</Button>
            </div>
          </DemoBlock>
          <div className="grid gap-4 lg:grid-cols-2">
            <DemoBlock title="Estados y notificaciones">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBeacon design="pill" status="online" pulse label="En línea" />
                <StatusBeacon design="minimal" status="busy" label="Ocupado" />
                <ConnectionStatus design="soft" status="connected" compact />
              </div>
              <ConnectionStatus design="glass" className="mt-4" status="connecting" />
              <NotificationItem
                design="elevated"
                className="mt-4"
                title="Reporte generado"
                description="El archivo de analítica está listo para descargar."
                timestamp="Hace 2 min"
                variant="success"
                unread
                dismissible
                onDismiss={() => undefined}
                onRead={() => undefined}
              />
            </DemoBlock>
            <DemoBlock title="ActivityFeed y ActivityEvent">
              <ActivityFeed design="minimal">
                <ActivityEvent
                  design="soft"
                  title="Proyecto publicado"
                  description="La versión 2.4 está disponible."
                  timestamp="09:40"
                  variant="success"
                  icon={<LuRocket />}
                />
                <ActivityEvent
                  design="outline"
                  title="Seguridad verificada"
                  description="No se encontraron vulnerabilidades."
                  timestamp="10:15"
                  variant="primary"
                  icon={<LuShieldCheck />}
                />
                <ActivityEvent
                  design="sharp"
                  title="Nueva notificación"
                  timestamp="Ahora"
                  variant="warning"
                  icon={<LuBell />}
                />
              </ActivityFeed>
            </DemoBlock>
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="overlays" title="Modal, Dialog, Drawer y Sheet" description="Overlays accesibles con Escape, cierre exterior y bloqueo de scroll.">
        <DemoBlock title="Abrir componentes">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setOverlay("modal")}>Modal</Button>
            <Button variant="secondary" onClick={() => setOverlay("dialog")}>Dialog</Button>
            <Button variant="outline" onClick={() => setOverlay("confirm")}>ConfirmDialog</Button>
            <Button variant="danger" onClick={() => setOverlay("alert")}>AlertDialog</Button>
            <Button variant="soft" onClick={() => setOverlay("drawer")}>Drawer</Button>
            <Button variant="ghost" onClick={() => setOverlay("sheet")}>Sheet</Button>
            <Button variant="outline" onClick={() => setOverlay("bottom")}>BottomSheet</Button>
          </div>
        </DemoBlock>
        <Modal design="glass" open={overlay === "modal"} onOpenChange={(open) => setOverlay(open ? "modal" : null)} title="Editar proyecto" description="Modal centrado y responsivo." footer={<Button onClick={() => setOverlay(null)}>Guardar</Button>}><p className="text-sm text-muted">Contenido del modal.</p></Modal>
        <Dialog design="outline" open={overlay === "dialog"} onOpenChange={(open) => setOverlay(open ? "dialog" : null)} title="Detalles" description="Dialog reutiliza la base del modal."><p className="text-sm text-muted">Información adicional.</p></Dialog>
        <ConfirmDialog design="soft" open={overlay === "confirm"} onOpenChange={(open) => setOverlay(open ? "confirm" : null)} title="Confirmar cambios" description="¿Deseas continuar?" onConfirm={() => setOverlay(null)} />
        <AlertDialog design="brutalist" open={overlay === "alert"} onOpenChange={(open) => setOverlay(open ? "alert" : null)} title="Eliminar proyecto" description="Esta acción no se puede deshacer." onConfirm={() => setOverlay(null)} confirmLabel="Eliminar" />
        <Drawer design="elevated" open={overlay === "drawer"} onOpenChange={(open) => setOverlay(open ? "drawer" : null)} title="Drawer lateral"><p className="text-sm text-muted">Contenido lateral.</p></Drawer>
        <Sheet design="sharp" open={overlay === "sheet"} onOpenChange={(open) => setOverlay(open ? "sheet" : null)} title="Sheet"><p className="text-sm text-muted">Una variante de Drawer.</p></Sheet>
        <BottomSheet design="pill" open={overlay === "bottom"} onOpenChange={(open) => setOverlay(open ? "bottom" : null)} title="Bottom sheet"><p className="text-sm text-muted">Optimizado para móvil.</p></BottomSheet>
      </ShowcaseSection>

      <ShowcaseSection id="loaders" title="Loaders y skeletons" description="Indicadores de carga lineales, circulares y esqueletos de contenido.">
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoBlock title="Spinner, dots y progreso">
            <div className="flex items-center gap-5"><Spinner size="sm" /><Spinner /><Spinner size="lg" /><LoadingDots /></div>
            <ProgressBar design="minimal" className="mt-5" value={68} showValue />
            <CircularProgress design="elevated" className="mt-5" value={74} />
            <SegmentedProgress design="soft" className="mt-5" value={68} segments={8} tone="gradient" label="Configuración" showValue />
            <div className="mt-5 flex items-center gap-5">
              <ProgressRing design="outline" value={82} tone="tertiary" label="Sync" />
              <FileProgress design="glass" className="flex-1" name="reporte-julio.pdf" value={64} sizeLabel="4.8 MB" onCancel={() => undefined} />
            </div>
          </DemoBlock>
          <DemoBlock title="Formas y animaciones de Skeleton">
            <div className="flex items-end gap-3">
              <AvatarSkeleton size="lg" />
              <Skeleton variant="circular" className="size-12" />
              <Skeleton variant="rounded" animation="wave" className="h-12 w-28" />
              <Skeleton variant="rectangular" className="h-12 w-24" />
              <Skeleton
                variant="customized"
                className="h-12 flex-1 rounded-full bg-gradient-to-r from-primary/20 via-secondary/25 to-tertiary/20"
              />
            </div>
            <TextSkeleton className="mt-5" lines={4} lastLineWidth="42%" />
          </DemoBlock>
          <DemoBlock title="Skeletons compuestos">
            <div className="space-y-4">
              <ProfileSkeleton design="pill" />
              <CardSkeleton design="outline" />
              <ListSkeleton design="soft" items={3} />
              <FormSkeleton design="sharp" fields={2} />
              <ChartSkeleton design="gradient" />
              <TableSkeleton design="minimal" rows={3} />
            </div>
          </DemoBlock>
          <DemoBlock
            title="PageLoader interactivo"
            className="lg:col-span-2"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Button
                size="xs"
                variant="outline"
                onClick={() => updateLoaderProgress(-10)}
              >
                −10%
              </Button>
              <Button
                size="xs"
                variant="soft"
                onClick={() => setLoaderProgress(0)}
              >
                Reiniciar
              </Button>
              <Button size="xs" onClick={() => updateLoaderProgress(10)}>
                +10%
              </Button>
              <span className="ml-auto text-xs font-extrabold tabular-nums text-muted">
                Progreso compartido: {loaderProgress}%
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <PageLoader
                layout="compact"
                variant="icon-fill"
                value={loaderProgress}
                icon={<LuRocket />}
                label="Icono rellenable"
                description="El color avanza dentro del icono."
              />
              <PageLoader
                layout="compact"
                variant="ring"
                tone="secondary"
                value={loaderProgress}
                icon={<LuShieldCheck />}
                label="Anillo de seguridad"
                description="Ideal para validaciones por etapas."
              />
              <PageLoader
                layout="compact"
                variant="orbit"
                tone="tertiary"
                value={loaderProgress}
                icon={<LuBell />}
                label="Sincronizando eventos"
                description="Órbita animada con progreso real."
              />
              <PageLoader
                layout="compact"
                variant="steps"
                tone="gradient"
                value={loaderProgress}
                icon={<LuRocket />}
                label="Progreso segmentado"
                description="Los bloques se completan por pasos."
              />
              <PageLoader
                layout="compact"
                variant="scanner"
                tone="secondary"
                value={loaderProgress}
                icon={<LuShieldCheck />}
                label="Escaneando"
                description="Una línea recorre el contenido."
              />
              <PageLoader
                layout="compact"
                variant="pulse"
                tone="tertiary"
                value={loaderProgress}
                icon={<LuBell />}
                label="Procesando señal"
                description="Pulso tecnológico de baja intensidad."
              />
              <PageLoader
                layout="compact"
                variant="minimal"
                value={loaderProgress}
                icon={<LuRocket />}
                label="Carga mínima"
                description="Compacto para módulos internos."
              />
              <PageLoader
                layout="compact"
                variant="spinner"
                surface="contained"
                design="soft"
                label="Carga indeterminada"
                description="Sin porcentaje cuando no existe value."
              />
            </div>
          </DemoBlock>
        </div>
      </ShowcaseSection>

      <ShowcaseSection id="states" title="Estados de página" description="Estados vacíos, errores, conectividad, permisos y mantenimiento.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-border"><EmptyState design="minimal" size="compact" primaryAction={<Button size="sm">Crear</Button>} /></div>
          <div className="rounded-xl border border-border"><ErrorState design="outline" size="compact" /></div>
          <div className="rounded-xl border border-border"><LoadingState design="soft" size="compact" /></div>
          <div className="rounded-xl border border-border"><OfflineState design="elevated" size="compact" icon={<LuCloudOff />} /></div>
          <div className="rounded-xl border border-border"><NotFoundState design="glass" size="compact" /></div>
          <div className="rounded-xl border border-border"><PermissionDeniedState design="gradient" size="compact" /></div>
          <div className="rounded-xl border border-border"><NoResultsState design="sharp" size="compact" /></div>
          <div className="rounded-xl border border-border"><MaintenanceState design="brutalist" size="compact" /></div>
        </div>
      </ShowcaseSection>
    </>
  );
}
