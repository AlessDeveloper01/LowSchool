"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
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
import {
  calculateFloatingPosition,
  type FloatingCoordinates,
} from "@/components/ui/floating-position";
import { cn } from "@/lib/cn";

export type TooltipVariant = "dark" | "light" | "compact" | "rich";
export type FloatingPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content?: ReactNode;
  label?: string;
  children: ReactNode;
  variant?: TooltipVariant;
  design?: DesignPreset;
  position?: FloatingPosition;
  delay?: number;
  arrow?: boolean;
  className?: string;
}

const arrows: Record<FloatingPosition, string> = {
  top: "left-1/2 top-full -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-current",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-current",
  left: "left-full top-1/2 -translate-y-1/2 border-y-4 border-l-4 border-y-transparent border-l-current",
  right: "right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-current",
};

export function Tooltip({ content, label, children, variant = "dark", design, position = "top", delay = 250, arrow = true, className }: TooltipProps) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const [coordinates, setCoordinates] =
    useState<FloatingCoordinates | null>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<number | null>(null);

  function show(): void {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setOpen(true), delay);
  }

  function hide(): void {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setOpen(false);
    setCoordinates(null);
  }

  useEffect(() => {
    if (!open) return;

    function updatePosition(): void {
      const anchor = anchorRef.current;
      const tooltip = tooltipRef.current;
      if (!anchor || !tooltip) return;

      setCoordinates(
        calculateFloatingPosition({
          anchor: anchor.getBoundingClientRect(),
          floating: tooltip.getBoundingClientRect(),
          preferredSide: position,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        }),
      );
    }

    const animationFrame = window.requestAnimationFrame(updatePosition);
    const resizeObserver = new ResizeObserver(updatePosition);
    if (tooltipRef.current) resizeObserver.observe(tooltipRef.current);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const tooltip =
    open && typeof document !== "undefined"
      ? createPortal(
          <span
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            style={{
              left: coordinates?.left ?? 0,
              top: coordinates?.top ?? 0,
              maxWidth: coordinates?.maxWidth,
              visibility: coordinates ? "visible" : "hidden",
            }}
            className={cn(
              "pointer-events-none fixed z-[100] w-max overflow-visible break-words rounded-lg px-2.5 py-1.5 text-xs font-bold",
              variant === "dark" && "bg-foreground text-background",
              variant === "light" && "border border-border bg-surface text-foreground",
              variant === "compact" && "bg-foreground px-2 py-1 text-[10px] text-background",
              variant === "rich" && "border border-border bg-surface p-3 text-foreground",
              design && overlayDesignStyles[design],
              className,
            )}
          >
            <span
              className="block max-w-full overflow-y-auto overscroll-contain"
              style={{ maxHeight: coordinates?.maxHeight }}
            >
              {content ?? label}
            </span>
            {arrow && coordinates && (
              <span
                className={cn(
                  "absolute size-0 text-foreground",
                  variant !== "dark" && "text-surface",
                  arrows[coordinates.side],
                )}
              />
            )}
          </span>,
          document.body,
        )
      : null;

  const describedChildren = isValidElement(children)
    ? cloneElement(
        children as ReactElement<{ "aria-describedby"?: string }>,
        {
          "aria-describedby": open
            ? [
                (
                  children as ReactElement<{
                    "aria-describedby"?: string;
                  }>
                ).props["aria-describedby"],
                tooltipId,
              ]
                .filter(Boolean)
                .join(" ")
            : (
                children as ReactElement<{
                  "aria-describedby"?: string;
                }>
              ).props["aria-describedby"],
        },
      )
    : children;

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex min-w-0 max-w-full"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {describedChildren}
      {tooltip}
    </span>
  );
}
