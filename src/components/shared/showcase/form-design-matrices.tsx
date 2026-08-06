"use client";

import { Input, Radio, Toggle } from "@/components/forms";
import { DemoBlock } from "@/components/shared/showcase/showcase-section";
import {
  designPresets,
  type DesignPreset,
} from "@/components/types";

const presetLabels: Record<DesignPreset, string> = {
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

function customizedInputStyle(design: DesignPreset): string | undefined {
  return design === "customized"
    ? "rounded-[1.4rem] border-2 border-fuchsia-500 bg-fuchsia-500/10 shadow-[3px_3px_0_#d946ef]"
    : undefined;
}

function customizedChoiceStyle(design: DesignPreset): string | undefined {
  return design === "customized"
    ? "rounded-[1.4rem] border-2 border-amber-400 bg-amber-300/15 px-3 py-2"
    : undefined;
}

function customizedToggleStyle(design: DesignPreset): string | undefined {
  return design === "customized"
    ? "rounded-[1.4rem] border-2 border-cyan-400 bg-cyan-400/15 text-cyan-700 aria-pressed:bg-cyan-400 aria-pressed:text-slate-950 dark:text-cyan-200"
    : undefined;
}

export function FormDesignMatrices() {
  return (
    <>
      <DemoBlock title="Input · 10 diseños compartidos" className="xl:col-span-2">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {designPresets.map((design) => (
            <Input
              key={design}
              design={design}
              label={presetLabels[design]}
              placeholder={presetLabels[design]}
              controlClassName={customizedInputStyle(design)}
            />
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="Radio · 10 diseños compartidos" className="xl:col-span-2">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {designPresets.map((design, index) => (
            <Radio
              key={design}
              design={design}
              name="radio-design-preset"
              label={presetLabels[design]}
              description={index % 2 === 0 ? "Opción seleccionable" : undefined}
              defaultChecked={index === 0}
              className={customizedChoiceStyle(design)}
            />
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="Toggle · 10 diseños compartidos" className="xl:col-span-2">
        <div className="flex flex-wrap gap-3">
          {designPresets.map((design) => (
            <Toggle
              key={design}
              design={design}
              defaultPressed
              className={customizedToggleStyle(design)}
            >
              {presetLabels[design]}
            </Toggle>
          ))}
        </div>
      </DemoBlock>
    </>
  );
}
