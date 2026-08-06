"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface OTPInputProps {
  design?: DesignPreset;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  numericOnly?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

export function OTPInput({ design, value, onChange, length = 6, numericOnly = true, error, disabled, className, inputClassName }: OTPInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const characters = Array.from({ length }, (_, index) => value[index] ?? "");
  const sanitize = (input: string): string => (numericOnly ? input.replace(/\D/g, "") : input).slice(0, length);

  function update(index: number, character: string): void {
    const next = [...characters];
    next[index] = sanitize(character).slice(-1);
    onChange(next.join(""));
    if (next[index] && index < length - 1) refs.current[index + 1]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number): void {
    if (event.key === "Backspace" && !characters[index] && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft") refs.current[Math.max(0, index - 1)]?.focus();
    if (event.key === "ArrowRight") refs.current[Math.min(length - 1, index + 1)]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>): void {
    event.preventDefault();
    const pasted = sanitize(event.clipboardData.getData("text"));
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div className={className}>
      <div role="group" aria-label="Código de verificación" className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1">
        {characters.map((character, index) => <input key={index} ref={(node) => { refs.current[index] = node; }} type="text" inputMode={numericOnly ? "numeric" : "text"} autoComplete={index === 0 ? "one-time-code" : "off"} value={character} onChange={(event) => update(index, event.target.value)} onKeyDown={(event) => handleKeyDown(event, index)} onPaste={handlePaste} disabled={disabled} aria-label={`Dígito ${index + 1} de ${length}`} aria-invalid={Boolean(error)} className={cn("size-11 rounded-lg border border-border bg-surface text-center text-lg font-extrabold outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 disabled:opacity-50", design && controlDesignStyles[design], error && "border-danger", inputClassName)} />)}
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
