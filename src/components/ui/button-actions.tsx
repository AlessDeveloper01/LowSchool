"use client";

import { useRef, useState, type ReactNode } from "react";
import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import {
  LuArrowLeft,
  LuCheck,
  LuChevronDown,
  LuCopy,
  LuPlus,
  LuX,
} from "react-icons/lu";

import {
  Button,
  buttonShapes,
  buttonSizes,
  buttonVariants,
  type ButtonProps,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface IconButtonProps extends Omit<ButtonProps, "children"> {
  label: string;
  children: ReactNode;
}

export function IconButton({
  label,
  size = "icon",
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button size={size} aria-label={label} title={label} {...props}>
      {children}
    </Button>
  );
}

export function LoadingButton(props: ButtonProps) {
  return <Button {...props} loading />;
}

export interface CopyButtonProps
  extends Omit<ButtonProps, "onClick" | "leftIcon"> {
  value: string;
  copiedText?: string;
}

export function CopyButton({
  value,
  copiedText = "Copiado",
  children = "Copiar",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue(): Promise<void> {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button
      variant="outline"
      leftIcon={copied ? <LuCheck /> : <LuCopy />}
      onClick={copyValue}
      {...props}
    >
      {copied ? copiedText : children}
    </Button>
  );
}

export interface BackButtonProps extends Omit<ButtonProps, "onClick"> {
  fallbackHref?: string;
}

export function BackButton({
  fallbackHref = "/",
  children = "Volver",
  ...props
}: BackButtonProps) {
  const router = useRouter();

  function goBack(): void {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <Button variant="ghost" leftIcon={<LuArrowLeft />} onClick={goBack} {...props}>
      {children}
    </Button>
  );
}

export function CloseButton(props: Omit<IconButtonProps, "label" | "children">) {
  return (
    <IconButton label="Cerrar" variant="ghost" {...props}>
      <LuX />
    </IconButton>
  );
}

export function FloatingActionButton({
  children = <LuPlus />,
  className,
  ...props
}: Omit<ButtonProps, "size">) {
  return (
    <Button
      size="icon"
      className={cn(
        "fixed bottom-5 right-5 z-40 size-14 rounded-full shadow-lg",
        className,
      )}
      aria-label={props["aria-label"] ?? "Acción principal"}
      {...props}
    >
      {children}
    </Button>
  );
}

export interface LinkButtonProps extends LinkProps {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  design?: DesignPreset;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
}

export function LinkButton({
  variant = "primary",
  design,
  size = "md",
  shape = "default",
  fullWidth = false,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-w-0 max-w-full touch-manipulation items-center justify-center gap-2 font-bold transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        buttonSizes[size],
        design && controlDesignStyles[design],
        buttonVariants[variant],
        buttonShapes[shape],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 truncate">{children}</span>
    </Link>
  );
}

export interface SplitButtonOption {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface SplitButtonProps extends ButtonProps {
  options: SplitButtonOption[];
}

export function SplitButton({
  options,
  children,
  variant = "primary",
  design,
  ...props
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative inline-flex min-w-0 max-w-full">
      <Button variant={variant} design={design} className="min-w-0 rounded-r-none" {...props}>
        {children}
      </Button>
      <Button
        variant={variant}
        design={design}
        size="icon"
        className="rounded-l-none border-l border-current/20"
        aria-label="Mostrar más acciones"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <LuChevronDown />
      </Button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-44 max-w-[calc(100vw-1rem)] overflow-y-auto overscroll-contain rounded-lg border border-border bg-surface p-1 max-sm:fixed max-sm:inset-x-2 max-sm:bottom-2 max-sm:top-auto max-sm:w-auto max-sm:max-h-[calc(100dvh-1rem)]">
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                option.onSelect();
                setOpen(false);
              }}
              className="flex min-h-11 w-full min-w-0 items-center rounded-md px-3 text-left text-xs font-bold text-foreground hover:bg-surface-hover disabled:opacity-50 sm:min-h-9"
            >
              <span className="min-w-0 flex-1 truncate">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
