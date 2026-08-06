import type { ReactNode } from "react";
import { LuArrowRight, LuBell, LuCheck, LuInbox } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardActions,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";

export interface StatCardProps extends Omit<CardProps, "children"> {
  label: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({
  label,
  value,
  change,
  icon,
  trend = "neutral",
  ...props
}: StatCardProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <span className="text-xs font-bold text-muted">{label}</span>
        {icon && <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>}
      </CardHeader>
      <p className="mt-3 text-2xl font-extrabold tracking-tight">{value}</p>
      {change && (
        <p className={cn("mt-2 text-xs font-bold", trend === "up" && "text-success", trend === "down" && "text-danger", trend === "neutral" && "text-muted")}>
          {change}
        </p>
      )}
    </Card>
  );
}

export interface ProfileCardProps extends Omit<CardProps, "children"> {
  name: string;
  role?: string;
  avatar?: ReactNode;
  description?: string;
  actions?: ReactNode;
}

export function ProfileCard({ name, role, avatar, description, actions, ...props }: ProfileCardProps) {
  return (
    <Card {...props}>
      <div className="flex items-center gap-4">
        {avatar ?? <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 font-extrabold text-primary">{name.slice(0, 2).toUpperCase()}</span>}
        <div className="min-w-0">
          <CardTitle className="truncate">{name}</CardTitle>
          {role && <p className="truncate text-xs font-semibold text-secondary">{role}</p>}
        </div>
      </div>
      {description && <CardDescription>{description}</CardDescription>}
      {actions && <CardFooter>{actions}</CardFooter>}
    </Card>
  );
}

export interface FeatureCardProps extends Omit<CardProps, "children"> {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function FeatureCard({ title, description, icon, action, ...props }: FeatureCardProps) {
  return (
    <Card variant="interactive" {...props}>
      {icon && <span className="grid size-10 place-items-center rounded-xl bg-secondary/10 text-secondary">{icon}</span>}
      <CardTitle className="mt-4">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}

export interface PricingCardProps extends Omit<CardProps, "children"> {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export function PricingCard({ name, price, period = "/mes", features, highlighted, actionLabel = "Elegir plan", onAction, ...props }: PricingCardProps) {
  return (
    <Card variant={highlighted ? "selected" : "bordered"} {...props}>
      <CardTitle>{name}</CardTitle>
      <p className="mt-4 break-words text-3xl font-extrabold">{price}<span className="text-sm font-medium text-muted">{period}</span></p>
      <CardContent className="space-y-2.5">
        {features.map((feature) => <p key={feature} className="flex items-center gap-2 text-sm"><LuCheck className="text-success" />{feature}</p>)}
      </CardContent>
      <Button fullWidth variant={highlighted ? "primary" : "outline"} className="mt-6" onClick={onAction}>{actionLabel}</Button>
    </Card>
  );
}

export interface ArticleCardProps extends Omit<CardProps, "children"> {
  title: string;
  excerpt: string;
  image?: ReactNode;
  meta?: string;
  href?: string;
}

export function ArticleCard({ title, excerpt, image, meta, href, ...props }: ArticleCardProps) {
  return (
    <Card padding="none" className="overflow-hidden" {...props}>
      {image && <div className="aspect-video bg-background">{image}</div>}
      <div className="p-5">
        {meta && <p className="text-[11px] font-bold text-secondary">{meta}</p>}
        <CardTitle className="mt-1">{title}</CardTitle>
        <CardDescription>{excerpt}</CardDescription>
        {href && <a href={href} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary">Leer más <LuArrowRight /></a>}
      </div>
    </Card>
  );
}

export interface NotificationCardProps extends Omit<CardProps, "children"> {
  title: string;
  description: string;
  time?: string;
  unread?: boolean;
  actions?: ReactNode;
}

export function NotificationCard({ title, description, time, unread, actions, ...props }: NotificationCardProps) {
  return (
    <Card padding="sm" variant={unread ? "soft" : "default"} horizontal {...props}>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent"><LuBell /></span>
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-extrabold">{title}</p>
        <p className="truncate text-xs text-muted">{description}</p>
        {time && <p className="mt-1 text-[10px] text-muted">{time}</p>}
      </div>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
}

export interface EmptyCardProps extends Omit<CardProps, "children"> {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyCard({ title = "Sin contenido", description = "Todavía no hay elementos para mostrar.", action, icon = <LuInbox />, ...props }: EmptyCardProps) {
  return (
    <Card className="grid min-h-52 place-items-center text-center" {...props}>
      <div>
        <span className="mx-auto grid size-11 place-items-center rounded-xl bg-surface-hover text-muted">{icon}</span>
        <CardTitle className="mt-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </Card>
  );
}

export interface SelectionCardProps extends Omit<CardProps, "onChange"> {
  value: string;
  name: string;
  checked?: boolean;
  onChange?: (value: string) => void;
}

export function SelectionCard({ value, name, checked = false, onChange, children, ...props }: SelectionCardProps) {
  return (
    <label className="block cursor-pointer">
      <input type="radio" className="sr-only" name={name} value={value} checked={checked} onChange={() => onChange?.(value)} />
      <Card selected={checked} clickable={false} {...props}>{children}</Card>
    </label>
  );
}

export interface DashboardCardProps extends CardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function DashboardCard({ title, description, actions, children, ...props }: DashboardCardProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <div className="min-w-0"><CardTitle>{title}</CardTitle>{description && <CardDescription>{description}</CardDescription>}</div>
        {actions && <CardActions>{actions}</CardActions>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
