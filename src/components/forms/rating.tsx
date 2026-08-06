"use client";

import { LuStar } from "react-icons/lu";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface RatingProps {
  design?: DesignPreset;
  value: number;
  max?: number;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  onChange?: (value: number) => void;
  className?: string;
}

const sizes = { sm: "size-4", md: "size-5", lg: "size-7" };

export function Rating({ design, value, max = 5, readOnly = true, size = "md", onChange, className }: RatingProps) {
  return (
    <div role={readOnly ? "img" : "radiogroup"} aria-label={`${value} de ${max} estrellas`} className={cn("inline-flex gap-1", design && controlDesignStyles[design], className)}>
      {Array.from({ length: max }, (_, index) => {
        const rating = index + 1;
        const active = rating <= value;
        return readOnly ? <LuStar key={rating} className={cn(sizes[size], active ? "fill-warning text-warning" : "text-border")} /> : <button key={rating} type="button" role="radio" aria-checked={active} onClick={() => onChange?.(rating)} className="rounded focus-visible:outline-2 focus-visible:outline-primary"><LuStar className={cn(sizes[size], active ? "fill-warning text-warning" : "text-border hover:text-warning")} /></button>;
      })}
    </div>
  );
}

export function RatingInput(props: Omit<RatingProps, "readOnly">) {
  return <Rating {...props} readOnly={false} />;
}
