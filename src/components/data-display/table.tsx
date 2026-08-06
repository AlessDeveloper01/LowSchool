import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import {
  surfaceDesignStyles,
  type DesignPreset,
  type SurfaceMode,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type TableVariant =
  | "default"
  | "striped"
  | "bordered"
  | "borderless"
  | "compact"
  | "comfortable"
  | "hoverable";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  variant?: TableVariant;
  stickyHeader?: boolean;
  containerClassName?: string;
  design?: DesignPreset;
  surface?: SurfaceMode;
}

export function Table({
  variant = "default",
  stickyHeader,
  containerClassName,
  design,
  surface = "contained",
  className,
  ...props
}: TableProps) {
  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full touch-pan-x overflow-x-auto overscroll-x-contain",
        surface === "contained" && "rounded-xl border border-border",
        surface === "plain" &&
          "rounded-none border-0 bg-transparent shadow-none backdrop-blur-none [&_tfoot]:bg-transparent [&_thead]:bg-transparent",
        variant === "borderless" && "border-0",
        surface === "contained" && design && surfaceDesignStyles[design],
        containerClassName,
      )}
    >
      <table
        className={cn(
          "w-full min-w-[640px] border-collapse text-left text-sm text-foreground",
          variant === "striped" && "[&_tbody_tr:nth-child(even)]:bg-background",
          variant === "bordered" && "[&_td]:border [&_th]:border",
          variant === "compact" &&
            "[&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2",
          variant === "comfortable" &&
            "[&_td]:px-5 [&_td]:py-4 [&_th]:px-5 [&_th]:py-3",
          variant === "hoverable" &&
            "[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-surface-hover",
          stickyHeader && "[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("bg-background text-xs text-muted", className)}
      {...props}
    />
  );
}
export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-border", className)} {...props} />
  );
}
export function TableFooter({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        "border-t border-border bg-background font-bold",
        className,
      )}
      {...props}
    />
  );
}
export function TableRow({
  selected,
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) {
  return (
    <tr
      aria-selected={selected}
      className={cn("transition-colors", selected && "bg-primary/5", className)}
      {...props}
    />
  );
}
export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn("px-4 py-3 font-extrabold", className)} {...props} />
  );
}
export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 align-middle", className)} {...props} />;
}
export function TableCaption({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn("p-3 text-left text-xs text-muted", className)}
      {...props}
    />
  );
}

export function TableEmpty({
  colSpan,
  message = "No hay datos",
}: {
  colSpan: number;
  message?: string;
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32 text-center text-muted">
        {message}
      </TableCell>
    </TableRow>
  );
}

export function TableLoading({ colSpan }: { colSpan: number }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32 text-center text-muted">
        Cargando...
      </TableCell>
    </TableRow>
  );
}
