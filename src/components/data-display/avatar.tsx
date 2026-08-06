"use client";

import { Children, useState, type HTMLAttributes, type ReactNode } from "react";
import Image from "next/image";
import { LuCamera, LuUserRound } from "react-icons/lu";

import {
  mediaDesignStyles,
  type DesignPreset,
} from "@/components/types/design-preset";
import { cn } from "@/lib/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarShape = "circle" | "rounded" | "square";
export type Presence = "online" | "offline" | "busy" | "away";

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  src?: string;
  alt: string;
  name?: string;
  fallback?: ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
  bordered?: boolean;
  ring?: boolean;
  status?: Presence;
  badge?: ReactNode;
  design?: DesignPreset;
}

const sizes: Record<AvatarSize, string> = {
  xs: "size-6 text-[8px]",
  sm: "size-8 text-[10px]",
  md: "size-10 text-xs",
  lg: "size-12 text-sm",
  xl: "size-16 text-lg",
  "2xl": "size-24 text-2xl",
};

const statusColors: Record<Presence, string> = {
  online: "bg-success",
  offline: "bg-muted",
  busy: "bg-danger",
  away: "bg-warning",
};

function initials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function Avatar({ src, alt, name, fallback, size = "md", shape = "circle", bordered, ring, status, badge, design, className, ...props }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-visible bg-primary/10 font-extrabold text-primary",
        sizes[size],
        shape === "circle" && "rounded-full",
        shape === "rounded" && "rounded-xl",
        shape === "square" && "rounded-md",
        bordered && "border-2 border-surface",
        ring && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        design && mediaDesignStyles[design],
        className,
      )}
      {...props}
    >
      <span className="absolute inset-0 overflow-hidden rounded-[inherit]">
        {src && !failed ? (
          <Image src={src} alt={alt} fill sizes="96px" className="object-cover" onError={() => setFailed(true)} />
        ) : (
          <span className="grid size-full place-items-center">{fallback ?? (name ? initials(name) : <LuUserRound />)}</span>
        )}
      </span>
      {status && <span className={cn("absolute bottom-0 right-0 size-[22%] min-h-2 min-w-2 rounded-full border-2 border-surface", statusColors[status])} />}
      {badge && <span className="absolute -right-1 -top-1">{badge}</span>}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  design?: DesignPreset;
}

export function AvatarGroup({ max = 4, size = "md", design, children, className, ...props }: AvatarGroupProps) {
  const items = Children.toArray(children);
  const hiddenCount = Math.max(0, items.length - max);
  return (
    <div className={cn("flex max-w-full flex-wrap -space-x-2 gap-y-2 [&>*]:ring-2 [&>*]:ring-surface", design && mediaDesignStyles[design], className)} {...props}>
      {items.slice(0, max)}
      {hiddenCount > 0 && <Avatar alt={`${hiddenCount} adicionales`} name={`+${hiddenCount}`} fallback={`+${hiddenCount}`} size={size} design={design} />}
    </div>
  );
}

export interface EditableAvatarProps extends AvatarProps {
  onEdit: () => void;
}

export function EditableAvatar({ onEdit, ...props }: EditableAvatarProps) {
  return (
    <span className="relative inline-flex">
      <Avatar {...props} />
      <button type="button" onClick={onEdit} className="absolute -right-1 -bottom-1 grid size-9 place-items-center rounded-full border-2 border-surface bg-primary text-primary-foreground focus-visible:outline-2 focus-visible:outline-primary sm:size-7" aria-label="Cambiar avatar"><LuCamera className="size-3.5" /></button>
    </span>
  );
}
