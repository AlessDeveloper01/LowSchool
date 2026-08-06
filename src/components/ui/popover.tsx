"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import {
  overlayDesignStyles,
  type DesignPreset,
} from "@/components/types";
import type { FloatingPosition } from "@/components/ui/tooltip";
import {
  calculateFloatingPosition,
  type FloatingCoordinates,
} from "@/components/ui/floating-position";
import { cn } from "@/lib/cn";

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: FloatingPosition;
  design?: DesignPreset;
  className?: string;
}

export function Popover({ trigger, children, open, defaultOpen = false, onOpenChange, position = "bottom", design, className }: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [coordinates, setCoordinates] =
    useState<FloatingCoordinates | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const isOpen = open ?? internalOpen;

  const setOpen = useCallback((nextOpen: boolean): void => {
    if (open === undefined) setInternalOpen(nextOpen);
    if (!nextOpen) setCoordinates(null);
    onOpenChange?.(nextOpen);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointer(event: MouseEvent): void {
      if (!(event.target instanceof Node)) return;
      const clickedTrigger = containerRef.current?.contains(event.target);
      const clickedPopover = popoverRef.current?.contains(event.target);
      if (!clickedTrigger && !clickedPopover) setOpen(false);
    }
    function handleKey(event: KeyboardEvent): void {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, setOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function updatePosition(): void {
      const anchor = containerRef.current;
      const popover = popoverRef.current;
      if (!anchor || !popover) return;

      setCoordinates(
        calculateFloatingPosition({
          anchor: anchor.getBoundingClientRect(),
          floating: popover.getBoundingClientRect(),
          preferredSide: position,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        }),
      );
    }

    const animationFrame = window.requestAnimationFrame(updatePosition);
    const resizeObserver = new ResizeObserver(updatePosition);
    if (popoverRef.current) resizeObserver.observe(popoverRef.current);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, position]);

  const popover =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            style={{
              left: coordinates?.left ?? 0,
              top: coordinates?.top ?? 0,
              maxWidth: coordinates?.maxWidth,
              maxHeight: coordinates?.maxHeight,
              visibility: coordinates ? "visible" : "hidden",
            }}
            className={cn(
              "fixed z-[100] w-72 overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-4 text-foreground",
              design && overlayDesignStyles[design],
              className,
            )}
          >
            {children}
          </div>,
          document.body,
        )
      : null;

  const accessibleTrigger = isValidElement(trigger)
    ? cloneElement(
        trigger as ReactElement<{
          "aria-expanded"?: boolean;
          "aria-haspopup"?: "dialog";
        }>,
        {
          "aria-expanded": isOpen,
          "aria-haspopup": "dialog",
        },
      )
    : trigger;

  return (
    <div ref={containerRef} className="relative inline-flex min-w-0 max-w-full">
      <span onClick={() => setOpen(!isOpen)}>{accessibleTrigger}</span>
      {popover}
    </div>
  );
}
