"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { LuTriangleAlert, LuX } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  overlayDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";
export type ModalVariant = "centered" | "compact" | "fullscreen" | "form" | "destructive";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
  design?: DesignPreset;
  className?: string;
}

const modalSizes: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "h-[calc(100dvh-1rem)] max-w-none sm:h-[calc(100dvh-2rem)]",
};

export function Modal({ open, onOpenChange, title, description, children, footer, size = "md", variant = "centered", closeOnOverlay = true, showCloseButton = true, design, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") onOpenChangeRef.current(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] grid max-h-dvh place-items-center overflow-y-auto bg-foreground/35 p-2 backdrop-blur-[2px] sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && closeOnOverlay && onOpenChange(false)}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        tabIndex={-1}
        className={cn(
          "flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface outline-none sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)]",
          modalSizes[size],
          variant === "compact" && "max-w-sm",
          variant === "fullscreen" && "h-dvh max-h-dvh w-screen max-w-none rounded-none border-0",
          variant === "destructive" && "border-danger/30",
          design && overlayDesignStyles[design],
          className,
        )}
      >
        <header className="flex min-w-0 shrink-0 items-start gap-3 border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          {variant === "destructive" && <span className="grid size-9 place-items-center rounded-lg bg-danger/10 text-danger"><LuTriangleAlert /></span>}
          <div className="min-w-0 flex-1">
            <h2 id="modal-title" className="break-words text-base font-extrabold text-foreground">{title}</h2>
            {description && <p id="modal-description" className="mt-1 break-words text-xs leading-5 text-muted">{description}</p>}
          </div>
          {showCloseButton && <button type="button" onClick={() => onOpenChange(false)} className="grid size-10 shrink-0 place-items-center rounded-lg text-muted hover:bg-surface-hover sm:size-8" aria-label="Cerrar"><LuX /></button>}
        </header>
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
        {footer && <footer className="flex max-h-[35dvh] shrink-0 flex-col-reverse gap-2 overflow-y-auto border-t border-border px-4 py-3 [&>*]:w-full sm:flex-row sm:flex-wrap sm:justify-end sm:px-5 sm:py-4 sm:[&>*]:w-auto">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

export const Dialog = Modal;

export interface ConfirmDialogProps extends Omit<ModalProps, "children" | "footer"> {
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  destructive?: boolean;
}

export function ConfirmDialog({ confirmLabel = "Confirmar", cancelLabel = "Cancelar", onConfirm, loading, destructive, ...props }: ConfirmDialogProps) {
  return (
    <Modal
      {...props}
      variant={destructive ? "destructive" : props.variant}
      footer={<><Button variant="ghost" onClick={() => props.onOpenChange(false)}>{cancelLabel}</Button><Button variant={destructive ? "danger" : "primary"} loading={loading} onClick={onConfirm}>{confirmLabel}</Button></>}
    />
  );
}

export function AlertDialog(props: ConfirmDialogProps) {
  return <ConfirmDialog destructive {...props} />;
}

export interface DrawerProps extends Omit<ModalProps, "size" | "variant"> {
  side?: "left" | "right" | "top" | "bottom";
  width?: "sm" | "md" | "lg";
}

const drawerWidths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl" };

export function Drawer({ open, onOpenChange, side = "right", width = "md", title, description, children, footer, closeOnOverlay = true, design, className }: DrawerProps) {
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent): void {
      if (event.key === "Escape") onOpenChangeRef.current(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || typeof document === "undefined") return null;
  const vertical = side === "left" || side === "right";
  return createPortal(
    <div className="fixed inset-0 z-[90] max-h-dvh overflow-hidden bg-foreground/30" onMouseDown={(event) => event.target === event.currentTarget && closeOnOverlay && onOpenChange(false)}>
      <aside className={cn(
        "absolute flex max-h-dvh max-w-full flex-col overflow-hidden bg-surface",
        vertical ? "inset-y-0 w-full" : "inset-x-0 max-h-[85dvh] w-full",
        side === "left" && "left-0",
        side === "right" && "right-0",
        side === "top" && "top-0",
        side === "bottom" && "bottom-0 rounded-t-2xl",
        vertical && drawerWidths[width],
        design && overlayDesignStyles[design],
        className,
      )}>
        <header className="flex min-w-0 shrink-0 items-start gap-3 border-b border-border p-4"><div className="min-w-0 flex-1"><h2 className="break-words font-extrabold">{title}</h2>{description && <p className="break-words text-xs text-muted">{description}</p>}</div><button type="button" onClick={() => onOpenChange(false)} className="-m-1 grid size-11 shrink-0 place-items-center rounded-lg hover:bg-surface-hover sm:size-9" aria-label="Cerrar"><LuX /></button></header>
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-4">{children}</div>
        {footer && <footer className="max-h-[35dvh] shrink-0 overflow-y-auto border-t border-border p-4">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  );
}

export const Sheet = Drawer;
export function BottomSheet(props: Omit<DrawerProps, "side">) {
  return <Drawer side="bottom" {...props} />;
}
