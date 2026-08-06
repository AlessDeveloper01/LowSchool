"use client";

import { LuPlus } from "react-icons/lu";

import type {
  TagInputAddButtonProps,
  TagInputProps,
} from "./tag-input.types";
import { TagInput } from "./tag-input-control";
import { controlDesignStyles } from "@/components/types";
import { cn } from "@/lib/cn";

export function TokenInput(props: TagInputProps) {
  return (
    <TagInput
      addLabel="Agregar token"
      placeholder="Agrega un token"
      variant="soft"
      {...props}
    />
  );
}

export function TagInputAddButton({
  design,
  onAdd,
  disabled,
  className,
  children = "Agregar",
  ...props
}: TagInputAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-extrabold",
        "transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        design && controlDesignStyles[design],
        className,
      )}
      {...props}
    >
      <LuPlus aria-hidden="true" />
      {children}
    </button>
  );
}
