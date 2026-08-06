"use client";

import {
  LuArrowRight,
  LuBell,
  LuBold,
  LuDownload,
  LuGithub,
  LuPlay,
  LuPlus,
  LuSave,
  LuSparkles,
  LuTrash2,
} from "react-icons/lu";

import {
  BackButton,
  Button,
  ButtonGroup,
  CloseButton,
  CopyButton,
  FloatingActionButton,
  IconButton,
  IconTextButton,
  LinkButton,
  LoadingButton,
  NotificationButton,
  ProviderButton,
  ShortcutButton,
  SplitButton,
  StatusButton,
  ToolbarButton,
} from "@/components/ui";
import { DemoBlock, ShowcaseSection } from "@/components/shared/showcase/showcase-section";

export function ActionsShowcase() {
  return (
    <ShowcaseSection id="buttons" title="Botones y acciones" description="Acciones primarias, estados, grupos, enlaces y controles especializados.">
      <div className="grid gap-4 lg:grid-cols-2">
        <DemoBlock title="Variantes">
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="neutral">Neutral</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="dashed">Dashed</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="secondary-soft">Secondary soft</Button>
            <Button variant="tertiary-soft">Tertiary soft</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="elevated">Elevated</Button>
            <Button variant="inverted">Inverted</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="gradient">Gradient</Button>
            <Button variant="gradient-cool">Gradient cool</Button>
            <Button variant="link">Link</Button>
          </div>
        </DemoBlock>
        <DemoBlock title="Formas">
          <div className="flex flex-wrap items-center gap-2">
            <Button shape="default">Default</Button>
            <Button shape="pill" leftIcon={<LuSparkles />}>Pill</Button>
            <Button shape="square">Square</Button>
            <Button shape="sharp">Sharp</Button>
            <Button
              variant="customized"
              shape="pill"
              className="bg-lime-300 px-6 text-zinc-950 hover:bg-lime-200"
            >
              Customized
            </Button>
          </div>
        </DemoBlock>
        <DemoBlock title="Tamaños y estados">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD</Button>
            <Button size="lg">LG</Button>
            <Button size="xl">XL</Button>
            <Button disabled>Disabled</Button>
            <LoadingButton loadingText="Guardando...">Guardar</LoadingButton>
            <IconButton label="Descargar"><LuDownload /></IconButton>
          </div>
        </DemoBlock>
        <DemoBlock title="Acciones especializadas" className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <CopyButton value="NEXORA-2026" />
            <BackButton />
            <CloseButton />
            <LinkButton href="/dashboard">Ir al dashboard <LuArrowRight /></LinkButton>
            <FloatingActionButton className="static" aria-label="Crear"><LuPlus /></FloatingActionButton>
            <SplitButton leftIcon={<LuSave />} options={[{ label: "Guardar borrador", onSelect: () => undefined }, { label: "Guardar y publicar", onSelect: () => undefined }]}>Guardar</SplitButton>
            <ButtonGroup attached><Button variant="outline">Editar</Button><Button variant="outline" leftIcon={<LuTrash2 />}>Eliminar</Button></ButtonGroup>
          </div>
        </DemoBlock>
        <DemoBlock title="Botones con iconos y shortcuts">
          <div className="flex flex-wrap items-center gap-3">
            <IconTextButton icon={<LuDownload />}>Descargar</IconTextButton>
            <IconTextButton icon={<LuArrowRight />} iconPosition="right" variant="secondary">
              Continuar
            </IconTextButton>
            <ShortcutButton shortcut={["Ctrl", "S"]} leftIcon={<LuSave />}>
              Guardar
            </ShortcutButton>
            <ToolbarButton icon={<LuBold />} label="Negrita" active />
            <ToolbarButton icon={<LuSparkles />} label="Mejorar" showLabel />
            <NotificationButton icon={<LuBell />} label="Notificaciones" count={12} />
          </div>
        </DemoBlock>
        <DemoBlock title="ProviderButton y StatusButton">
          <div className="space-y-3">
            <ProviderButton providerName="GitHub" icon={<LuGithub />} />
            <div className="flex flex-wrap gap-2">
              <StatusButton status="idle" />
              <StatusButton status="loading" />
              <StatusButton status="success" />
              <StatusButton status="error" />
              <StatusButton
                status="idle"
                labels={{ idle: "Desplegar" }}
                icons={{ idle: <LuPlay /> }}
                variant="gradient-cool"
              />
            </div>
          </div>
        </DemoBlock>
      </div>
    </ShowcaseSection>
  );
}
