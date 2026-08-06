"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LuCircleAlert, LuCircleCheck, LuInfo, LuTriangleAlert, LuX } from "react-icons/lu";

import {
  overlayDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";
export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: { label: string; onClick: () => void };
  design?: DesignPreset;
  className?: string;
}

interface ToastItemData extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxVisible?: number;
  design?: DesignPreset;
}

export function ToastProvider({ children, position = "top-right", maxVisible = 4, design }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);

  const value = useMemo<ToastContextValue>(() => ({
    toast: (options) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, ...options }].slice(-maxVisible));
      return id;
    },
    dismiss: (id) => setToasts((current) => current.filter((item) => item.id !== id)),
    dismissAll: () => setToasts([]),
  }), [maxVisible]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport position={position}>
        {toasts.map((item) => <ToastItem key={item.id} item={item} design={item.design ?? design} onClose={() => value.dismiss(item.id)} />)}
      </ToastViewport>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast debe utilizarse dentro de ToastProvider");
  return context;
}

const positionStyles: Record<ToastPosition, string> = {
  "top-right": "right-4 top-4 items-end",
  "top-left": "left-4 top-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "top-center": "left-1/2 top-4 -translate-x-1/2 items-center",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

function ToastViewport({ position, children }: { position: ToastPosition; children: ReactNode }) {
  return <div className={cn("pointer-events-none fixed z-[100] flex max-h-[calc(100dvh-2rem)] w-[min(92vw,380px)] max-w-[calc(100vw-2rem)] flex-col gap-2 overflow-y-auto overscroll-contain", positionStyles[position])}>{children}</div>;
}

const toastStyles = {
  default: { icon: <LuInfo />, color: "text-foreground" },
  success: { icon: <LuCircleCheck />, color: "text-success" },
  error: { icon: <LuCircleAlert />, color: "text-danger" },
  warning: { icon: <LuTriangleAlert />, color: "text-warning" },
  info: { icon: <LuInfo />, color: "text-info" },
};

function ToastItem({ item, design, onClose }: { item: ToastItemData; design?: DesignPreset; onClose: () => void }) {
  const variant = item.variant ?? "default";
  const style = toastStyles[variant];

  useEffect(() => {
    if (item.duration === 0) return;
    const timeoutId = window.setTimeout(onClose, item.duration ?? 4500);
    return () => window.clearTimeout(timeoutId);
  }, [item.duration, onClose]);

  return (
    <div role={variant === "error" ? "alert" : "status"} className={cn("pointer-events-auto flex min-w-0 w-full items-start gap-3 rounded-xl border border-border bg-surface p-3 shadow-lg shadow-foreground/10", design && overlayDesignStyles[design], item.className)}>
      <span className={cn("mt-0.5 text-lg", style.color)}>{style.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-extrabold text-foreground">{item.title}</p>
        {item.description && <p className="mt-0.5 break-words text-xs leading-5 text-muted">{item.description}</p>}
        {item.action && <button type="button" onClick={item.action.onClick} className="mt-2 min-h-10 max-w-full break-words text-left text-xs font-bold text-primary hover:underline sm:min-h-0">{item.action.label}</button>}
      </div>
      <button type="button" onClick={onClose} className="-m-1 grid size-10 shrink-0 place-items-center rounded text-muted hover:bg-surface-hover sm:size-8" aria-label="Cerrar notificación"><LuX /></button>
    </div>
  );
}
