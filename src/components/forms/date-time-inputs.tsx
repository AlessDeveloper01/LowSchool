import type { InputProps } from "@/components/forms/input";
import { Input } from "@/components/forms/input";
import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export function DateInput(props: InputProps) {
  return <Input {...props} type="date" />;
}

export function TimeInput(props: InputProps) {
  return <Input {...props} type="time" />;
}

export interface DateRangeInputProps {
  design?: DesignPreset;
  startProps?: InputProps;
  endProps?: InputProps;
  className?: string;
}

export function DateRangeInput({ design, startProps, endProps, className }: DateRangeInputProps) {
  return (
    <div className={cn(!className && "grid gap-3 sm:grid-cols-2", design && controlDesignStyles[design], className)}>
      <DateInput label="Desde" design={design} {...startProps} />
      <DateInput label="Hasta" design={design} {...endProps} />
    </div>
  );
}
