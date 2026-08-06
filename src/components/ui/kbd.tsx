import type { ComponentProps } from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface KbdProps extends ComponentProps<"kbd"> {
  design?: DesignPreset;
}

export function Kbd({ design, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-md border border-border",
        "bg-background px-1.5 py-0.5 font-sans text-[10px] font-semibold text-muted",
        design && controlDesignStyles[design],
        className,
      )}
      {...props}
    />
  );
}
