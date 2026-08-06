"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { LuEllipsis, LuLogOut, LuUserRound } from "react-icons/lu";

import { Avatar } from "@/components/data-display/avatar";
import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import {
  calculateFloatingPosition,
  type FloatingCoordinates,
} from "@/components/ui/floating-position";
import { cn } from "@/lib/cn";

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  href?: string;
  disabled?: boolean;
  destructive?: boolean;
  separatorBefore?: boolean;
  groupLabel?: string;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  design?: DesignPreset;
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  open,
  onOpenChange,
  design,
  className,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [coordinates, setCoordinates] =
    useState<FloatingCoordinates | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | HTMLAnchorElement | null>>([]);
  const isOpen = open ?? internalOpen;

  const setOpen = useCallback((nextOpen: boolean): void => {
    if (open === undefined) setInternalOpen(nextOpen);
    if (!nextOpen) setCoordinates(null);
    onOpenChange?.(nextOpen);
  }, [onOpenChange, open]);

  useEffect(() => {
    function handlePointer(event: MouseEvent): void {
      if (!(event.target instanceof Node)) return;
      const clickedTrigger = containerRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);
      if (!clickedTrigger && !clickedMenu) setOpen(false);
    }
    function handleKey(event: KeyboardEvent): void {
      if (!isOpen) return;
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const enabled = itemRefs.current.filter((item): item is HTMLButtonElement | HTMLAnchorElement => Boolean(item && !("disabled" in item && item.disabled)));
        const currentIndex = enabled.indexOf(document.activeElement as HTMLButtonElement);
        const direction = event.key === "ArrowDown" ? 1 : -1;
        enabled[(currentIndex + direction + enabled.length) % enabled.length]?.focus();
      }
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
      const menu = menuRef.current;
      if (!anchor || !menu) return;

      setCoordinates(
        calculateFloatingPosition({
          anchor: anchor.getBoundingClientRect(),
          floating: menu.getBoundingClientRect(),
          preferredSide: "bottom",
          alignment: align === "right" ? "end" : "start",
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        }),
      );
    }

    const animationFrame = window.requestAnimationFrame(updatePosition);
    const resizeObserver = new ResizeObserver(updatePosition);
    if (menuRef.current) resizeObserver.observe(menuRef.current);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("scroll", updatePosition, true);
    };
  }, [align, isOpen]);

  const menu =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              left: coordinates?.left ?? 0,
              top: coordinates?.top ?? 0,
              maxWidth: coordinates?.maxWidth,
              maxHeight: coordinates?.maxHeight,
              visibility: coordinates ? "visible" : "hidden",
            }}
            className={cn(
              "fixed z-[100] min-w-52 overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-1.5",
              design && navigationDesignStyles[design],
              className,
            )}
          >
            {items.map((item, index) => (
              <div key={item.id}>
                {item.separatorBefore && <div className="my-1 h-px bg-border" />}
                {item.groupLabel && <p className="truncate px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted">{item.groupLabel}</p>}
                {item.href ? (
                  <a ref={(node) => { itemRefs.current[index] = node; }} href={item.href} role="menuitem" aria-disabled={item.disabled} onClick={(event) => { if (item.disabled) event.preventDefault(); else setOpen(false); }} className={itemClass(item)}><MenuItemContent item={item} /></a>
                ) : (
                  <button ref={(node) => { itemRefs.current[index] = node; }} type="button" role="menuitem" disabled={item.disabled} onClick={() => { item.onSelect?.(); setOpen(false); }} className={itemClass(item)}><MenuItemContent item={item} /></button>
                )}
              </div>
            ))}
          </div>,
          document.body,
        )
      : null;

  const accessibleTrigger = isValidElement(trigger)
    ? cloneElement(
        trigger as ReactElement<{
          "aria-expanded"?: boolean;
          "aria-haspopup"?: "menu";
        }>,
        {
          "aria-expanded": isOpen,
          "aria-haspopup": "menu",
        },
      )
    : trigger;

  return (
    <div ref={containerRef} className="relative inline-flex min-w-0 max-w-full">
      <span onClick={() => setOpen(!isOpen)}>{accessibleTrigger}</span>
      {menu}
    </div>
  );
}

function itemClass(item: DropdownMenuItem): string {
  return cn("flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary sm:min-h-9", item.destructive ? "text-danger hover:bg-danger/10" : "text-foreground hover:bg-surface-hover", item.disabled && "pointer-events-none opacity-45", item.className);
}

function MenuItemContent({ item }: { item: DropdownMenuItem }) {
  return (
    <>
      {item.icon !== undefined && (
        <span className={cn("shrink-0", item.iconClassName)}>{item.icon}</span>
      )}
      <span className={cn("min-w-0 flex-1 truncate", item.labelClassName)}>
        {item.label}
      </span>
    </>
  );
}

export interface ContextMenuProps {
  children: ReactNode;
  items: DropdownMenuItem[];
  design?: DesignPreset;
  className?: string;
}

export function ContextMenu({
  children,
  items,
  design,
  className,
}: ContextMenuProps) {
  const [position, setPosition] = useState<{ x: number; y: number }>();
  function openMenu(event: ReactMouseEvent): void {
    event.preventDefault();
    const margin = 8;
    const menuWidth = Math.min(208, window.innerWidth - margin * 2);
    const estimatedHeight = Math.min(
      items.length * 44 + 12,
      window.innerHeight - margin * 2,
    );
    setPosition({
      x: Math.min(
        Math.max(event.clientX, margin),
        window.innerWidth - menuWidth - margin,
      ),
      y: Math.min(
        Math.max(event.clientY, margin),
        window.innerHeight - estimatedHeight - margin,
      ),
    });
  }
  const menu = position && typeof document !== "undefined"
    ? createPortal(
        <div className="fixed inset-0 z-[99]" onClick={() => setPosition(undefined)}>
          <div
            role="menu"
            className={cn(
              "absolute min-w-48 max-w-[calc(100vw-1rem)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-1.5",
              "max-h-[calc(100vh-1rem)]",
              design && navigationDesignStyles[design],
              className,
            )}
            style={{ left: position.x, top: position.y }}
            onClick={(event) => event.stopPropagation()}
          >
            {items.map((item) => <button key={item.id} type="button" role="menuitem" disabled={item.disabled} className={itemClass(item)} onClick={() => { item.onSelect?.(); setPosition(undefined); }}><MenuItemContent item={item} /></button>)}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div onContextMenu={openMenu}>
      {children}
      {menu}
    </div>
  );
}

export function ActionMenu({
  items,
  design,
  className,
}: {
  items: DropdownMenuItem[];
  design?: DesignPreset;
  className?: string;
}) {
  return <DropdownMenu items={items} design={design} className={className} trigger={<button type="button" className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-hover" aria-label="Más acciones"><LuEllipsis /></button>} />;
}

export interface UserDropdownProps {
  name: string;
  email?: string;
  avatarSrc?: string;
  onProfile?: () => void;
  onLogout?: () => void;
  design?: DesignPreset;
  className?: string;
}

export function UserDropdown({
  name,
  email,
  avatarSrc,
  onProfile,
  onLogout,
  design,
  className,
}: UserDropdownProps) {
  const items: DropdownMenuItem[] = [
    { id: "profile", label: "Mi perfil", icon: <LuUserRound />, onSelect: onProfile, groupLabel: email },
    { id: "logout", label: "Cerrar sesión", icon: <LuLogOut />, onSelect: onLogout, destructive: true, separatorBefore: true },
  ];
  return <DropdownMenu items={items} design={design} className={className} trigger={<button type="button" className="rounded-full focus-visible:outline-2 focus-visible:outline-primary" aria-label="Menú de usuario"><Avatar src={avatarSrc} alt={name} name={name} size="sm" /></button>} />;
}
