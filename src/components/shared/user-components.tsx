"use client";

import type { ReactNode } from "react";
import { LuBell, LuChevronDown, LuLogOut, LuShield, LuUserRound } from "react-icons/lu";

import { Avatar, type AvatarProps, type Presence } from "@/components/data-display/avatar";
import { Badge } from "@/components/data-display/badge";
import { Button, type ButtonProps } from "@/components/ui/button";
import { DropdownMenu, type DropdownMenuItem } from "@/components/navigation/dropdown-menu";
import { ProfileCard as BaseProfileCard, type ProfileCardProps } from "@/components/ui/cards";
import {
  controlDesignStyles,
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface UserSummaryProps {
  name: string;
  email?: string;
  role?: string;
  avatar?: AvatarProps;
  compact?: boolean;
  design?: DesignPreset;
  className?: string;
}

export function UserSummary({ name, email, role, avatar, compact, design, className }: UserSummaryProps) {
  return <div className={cn("flex items-center gap-3", design && surfaceDesignStyles[design], design && "p-2", className)}><Avatar alt={name} name={name} size={compact ? "sm" : "md"} design={design} {...avatar} />{!compact && <div className="min-w-0"><p className="truncate text-sm font-extrabold">{name}</p><p className="truncate text-xs text-muted">{role ?? email}</p></div>}</div>;
}

export interface UserMenuProps extends UserSummaryProps {
  items?: DropdownMenuItem[];
  onProfile?: () => void;
  onLogout?: () => void;
}

export function UserMenu({ items, onProfile, onLogout, ...user }: UserMenuProps) {
  const menuItems: DropdownMenuItem[] = items ?? [
    { id: "profile", label: "Mi perfil", icon: <LuUserRound />, onSelect: onProfile },
    { id: "logout", label: "Cerrar sesión", icon: <LuLogOut />, onSelect: onLogout, destructive: true, separatorBefore: true },
  ];
  return <DropdownMenu design={user.design} items={menuItems} trigger={<button type="button" className={cn("flex min-h-11 min-w-0 max-w-full items-center gap-2 rounded-lg p-1 hover:bg-surface-hover", user.design && controlDesignStyles[user.design])}><UserSummary {...user} compact /><LuChevronDown className="shrink-0 text-muted" /></button>} />;
}

export interface UserListItemProps extends UserSummaryProps {
  trailing?: ReactNode;
  onClick?: () => void;
}

export function UserListItem({ trailing, onClick, design, className, ...props }: UserListItemProps) {
  const Component = onClick ? "button" : "div";
  return <Component type={onClick ? "button" : undefined} onClick={onClick} className={cn("flex min-h-11 w-full min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-surface-hover", design && controlDesignStyles[design], className)}><UserSummary {...props} design={design} className="min-w-0 flex-1" /><span className="ml-auto shrink-0">{trailing}</span></Component>;
}

export function UserProfileCard(props: ProfileCardProps) {
  return <BaseProfileCard {...props} />;
}

export interface AccountSwitcherProps {
  accounts: Array<{ id: string; name: string; subtitle?: string; icon?: ReactNode }>;
  activeId: string;
  onChange: (id: string) => void;
  design?: DesignPreset;
}

export function AccountSwitcher({ accounts, activeId, onChange, design }: AccountSwitcherProps) {
  const active = accounts.find((account) => account.id === activeId) ?? accounts[0];
  if (!active) return null;
  return <DropdownMenu design={design} items={accounts.map((account) => ({ id: account.id, label: account.name, icon: account.icon, onSelect: () => onChange(account.id) }))} trigger={<button type="button" className={cn("flex min-h-11 min-w-0 max-w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-bold sm:min-h-10", design && controlDesignStyles[design])}>{active.icon}<span className="min-w-0 truncate">{active.name}</span><LuChevronDown className="shrink-0 text-muted" /></button>} />;
}

export function RoleBadge({ role, design, className }: { role: string; design?: DesignPreset; className?: string }) {
  return <Badge variant="soft" design={design} icon={<LuShield />} className={className}>{role}</Badge>;
}

export function UserStatus({ status, showLabel = true, design }: { status: Presence; showLabel?: boolean; design?: DesignPreset }) {
  const labels: Record<Presence, string> = { online: "En línea", offline: "Desconectado", busy: "Ocupado", away: "Ausente" };
  const colors: Record<Presence, string> = { online: "bg-success", offline: "bg-muted", busy: "bg-danger", away: "bg-warning" };
  return <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold text-muted", design && controlDesignStyles[design], design && "px-2 py-1")}><span className={cn("size-2 rounded-full", colors[status])} />{showLabel && labels[status]}</span>;
}

export function NotificationBell({ count = 0, onClick, design }: { count?: number; onClick?: () => void; design?: DesignPreset }) {
  return <button type="button" onClick={onClick} className={cn("relative grid size-10 place-items-center rounded-lg border border-border bg-surface text-muted hover:bg-surface-hover", design && controlDesignStyles[design])} aria-label={`${count} notificaciones`}><LuBell />{count > 0 && <Badge size="sm" variant="danger" className="absolute -right-1 -top-1 min-w-5">{count > 99 ? "99+" : count}</Badge>}</button>;
}

export function LogoutButton(props: Omit<ButtonProps, "leftIcon">) {
  return <Button variant="ghost" leftIcon={<LuLogOut />} {...props} />;
}
