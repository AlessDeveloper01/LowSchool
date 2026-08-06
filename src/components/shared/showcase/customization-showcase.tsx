"use client";

import { useState } from "react";
import {
  LuBell,
  LuBolt,
  LuCheck,
  LuPalette,
  LuSparkles,
} from "react-icons/lu";

import { Badge } from "@/components/data-display";
import { Alert } from "@/components/feedback";
import {
  Checkbox,
  ColorPicker,
  Input,
  Radio,
  Switch,
  Toggle,
} from "@/components/forms";
import { DemoBlock, ShowcaseSection } from "@/components/shared/showcase/showcase-section";
import {
  Button,
  Card,
  GradientBorder,
  Surface,
  SurfaceContent,
  SurfaceHeader,
} from "@/components/ui";

export function CustomizationShowcase() {
  const [notifications, setNotifications] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [brandColor, setBrandColor] = useState("#facc15");

  return (
    <ShowcaseSection
      id="customization"
      title="Personalización sin límites"
      description="La variante customized conserva estructura, estados y accesibilidad; className decide color, forma, borde, tipografía y movimiento."
    >
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <DemoBlock title="Ejemplo completo · Identidad amarilla">
          <Card
            variant="customized"
            className="rounded-[1.75rem] border-2 border-yellow-400 bg-zinc-950 p-6 text-yellow-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge
                  variant="customized"
                  className="rounded-full bg-yellow-400 px-2.5 text-zinc-950"
                >
                  CUSTOMIZED
                </Badge>
                <h3 className="mt-4 text-xl font-black tracking-tight">
                  Configura tu identidad
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  El comportamiento permanece; cambia únicamente el lenguaje
                  visual.
                </p>
              </div>
              <span className="grid size-11 place-items-center rounded-2xl bg-yellow-400 text-xl text-zinc-950">
                <LuPalette />
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <Input
                variant="customized"
                label="Nombre del producto"
                defaultValue="Lumen Studio"
                controlClassName="rounded-2xl border-2 border-zinc-700 bg-zinc-900 px-4 text-zinc-400 focus-within:border-yellow-400 focus-within:ring-4 focus-within:ring-yellow-400/15"
                className="text-yellow-50 placeholder:text-zinc-500"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Radio
                  name="yellow-plan"
                  defaultChecked
                  variant="customized"
                  label="Plan Studio"
                  description="Colores y formas propios"
                  className="rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-4 text-yellow-50 transition hover:border-yellow-400 has-checked:border-yellow-400 has-checked:bg-yellow-400/10"
                  indicatorClassName="accent-yellow-400 focus-visible:outline-yellow-400"
                />
                <Checkbox
                  defaultChecked
                  variant="customized"
                  label="Aplicar a la cuenta"
                  description="Sin cambiar la API"
                  className="rounded-2xl border-2 border-zinc-700 bg-zinc-900 p-4 text-yellow-50 transition hover:border-yellow-400 has-checked:border-yellow-400 has-checked:bg-yellow-400/10"
                  indicatorClassName="accent-yellow-400 focus-visible:outline-yellow-400"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-zinc-900 p-4">
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  variant="customized"
                  label="Alertas"
                  className="text-yellow-50 [&_span]:text-inherit"
                  trackClassName="bg-zinc-700 aria-checked:bg-yellow-400"
                  thumbClassName="bg-zinc-950 text-yellow-400"
                />
                <Toggle
                  variant="customized"
                  pressed={compactMode}
                  onPressedChange={setCompactMode}
                  className="rounded-full border-2 border-zinc-700 px-4 text-zinc-300 hover:border-yellow-400 aria-pressed:border-yellow-400 aria-pressed:bg-yellow-400 aria-pressed:text-zinc-950"
                >
                  <LuBolt />
                  Modo compacto
                </Toggle>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  variant="customized"
                  className="rounded-full bg-yellow-400 px-6 text-zinc-950 hover:bg-yellow-300 focus-visible:outline-yellow-400"
                  leftIcon={<LuCheck />}
                >
                  Guardar estilo
                </Button>
                <Button
                  variant="customized"
                  className="rounded-full border-2 border-zinc-700 px-6 text-yellow-50 hover:border-yellow-400 hover:text-yellow-300"
                >
                  Vista previa
                </Button>
              </div>
            </div>
          </Card>
        </DemoBlock>

        <div className="space-y-4">
          <DemoBlock title="Misma base, distintas decisiones">
            <div className="grid gap-3 sm:grid-cols-2">
              <Surface
                variant="customized"
                className="rounded-none border-l-4 border-fuchsia-500 bg-fuchsia-500/10 p-4 text-fuchsia-950 dark:text-fuchsia-100"
              >
                <SurfaceHeader
                  eyebrow="Editorial"
                  title="Bordes rectos"
                  description="Fucsia, compacto y sin sombras."
                />
              </Surface>
              <Surface
                variant="customized"
                className="rounded-[2rem] bg-cyan-950 p-5 text-cyan-50 ring-1 ring-cyan-400/35"
              >
                <SurfaceHeader
                  eyebrow="Tech"
                  title="Forma orgánica"
                  description="Cian, oscuro y redondeado."
                />
              </Surface>
            </div>
          </DemoBlock>

          <DemoBlock title="Personalización por props">
            <ColorPicker
              label="Color elegido por el cliente"
              value={brandColor}
              onValueChange={setBrandColor}
            />
            <GradientBorder className="mt-3">
              <SurfaceHeader
                eyebrow="Componente adicional"
                title="GradientBorder"
                actions={<LuSparkles className="text-secondary" />}
              />
              <SurfaceContent>
                <p className="text-sm leading-6 text-muted">
                  Las piezas estructurales también se combinan para construir
                  diseños propios sin duplicar lógica.
                </p>
              </SurfaceContent>
            </GradientBorder>
            <Alert
              appearance="customized"
              icon={<LuBell />}
              title="Alerta completamente personalizada"
              description="El rol accesible y la estructura siguen activos."
              className="mt-3 rounded-2xl border border-yellow-500/40 bg-yellow-400/10 text-yellow-800 dark:text-yellow-200"
            />
          </DemoBlock>
        </div>
      </div>
    </ShowcaseSection>
  );
}
