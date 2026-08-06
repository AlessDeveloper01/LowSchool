import { LuArrowRight, LuBoxes, LuSparkles } from "react-icons/lu";

import { Logo } from "@/components/shared";
import { DemoBlock, ShowcaseSection } from "@/components/shared/showcase/showcase-section";
import { designPresets, type DesignPreset } from "@/components/types";
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
  Kbd,
  Surface,
  SurfaceHeader,
} from "@/components/ui";
import { cn } from "@/lib/cn";

function customizedClass(design: DesignPreset, target: "button" | "surface") {
  if (design !== "customized") {
    return undefined;
  }

  return target === "button"
    ? "rounded-[1.4rem] border-2 border-lime-400 bg-zinc-950 text-lime-300 shadow-[4px_4px_0_#a3e635]"
    : "rounded-[1.75rem] border-2 border-lime-400 bg-zinc-950 text-lime-50 shadow-[5px_5px_0_#a3e635]";
}

export function DesignPresetsShowcase() {
  return (
    <ShowcaseSection
      id="design-presets"
      title="Diez diseños universales"
      description="Cada familia visual acepta la misma prop design. Las variantes semánticas y el comportamiento continúan siendo independientes."
    >
      <div className="space-y-4">
        <DemoBlock title="10 diseños de Button">
          <div className="flex flex-wrap gap-3">
            {designPresets.map((design) => (
              <Button
                key={design}
                design={design}
                variant={design === "customized" ? "customized" : "primary"}
                className={customizedClass(design, "button")}
                rightIcon={<LuArrowRight />}
              >
                {design}
              </Button>
            ))}
          </div>
        </DemoBlock>

        <DemoBlock title="10 diseños de Card">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {designPresets.map((design) => (
              <Card
                key={design}
                design={design}
                className={cn(
                  "min-h-36",
                  customizedClass(design, "surface"),
                )}
              >
                <span className="grid size-8 place-items-center rounded-lg bg-secondary/12 text-secondary">
                  <LuSparkles />
                </span>
                <CardTitle className="mt-3 capitalize">{design}</CardTitle>
                <CardDescription>Forma, borde, fondo y profundidad propios.</CardDescription>
              </Card>
            ))}
          </div>
        </DemoBlock>

        <DemoBlock title="10 diseños de Surface, Logo y Kbd">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {designPresets.map((design) => (
              <Surface
                key={design}
                design={design}
                padding="sm"
                className={customizedClass(design, "surface")}
              >
                <SurfaceHeader
                  eyebrow={design}
                  title="Composición"
                  actions={<Kbd design={design}>⌘K</Kbd>}
                />
                <Logo
                  name="Nexora"
                  variant="compact"
                  size="sm"
                  icon={<LuBoxes />}
                  design={design}
                  className="mt-3"
                />
              </Surface>
            ))}
          </div>
        </DemoBlock>
      </div>
    </ShowcaseSection>
  );
}
