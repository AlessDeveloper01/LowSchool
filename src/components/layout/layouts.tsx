import type { ReactNode } from "react";

import { Container } from "@/components/layout/primitives";
import {
  surfaceDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface PageLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  design?: DesignPreset;
  className?: string;
}

export function PageLayout({ children, header, footer, design, className }: PageLayoutProps) {
  return <div className={cn("flex min-h-screen flex-col bg-background", design && surfaceDesignStyles[design], className)}>{header}<main className="flex-1">{children}</main>{footer}</div>;
}

export function DashboardLayout({ children, header, sidebar, design, className }: PageLayoutProps) {
  return <div className={cn("flex min-h-screen bg-background", design && surfaceDesignStyles[design], className)}>{sidebar}<div className="min-w-0 flex-1">{header}<main>{children}</main></div></div>;
}

export interface AuthLayoutProps extends PageLayoutProps {
  title?: string;
  description?: string;
  visual?: ReactNode;
}

export function AuthLayout({ children, title, description, visual, design, className }: AuthLayoutProps) {
  return <div className={cn("grid min-h-screen bg-background lg:grid-cols-2", design && surfaceDesignStyles[design], className)}><main className="grid min-w-0 place-items-center p-4 sm:p-6"><div className="w-full min-w-0 max-w-md">{title && <h1 className="break-words text-3xl font-extrabold">{title}</h1>}{description && <p className="mt-2 break-words text-sm text-muted">{description}</p>}<div className="mt-7 min-w-0">{children}</div></div></main>{visual && <aside className="hidden bg-primary/10 lg:grid lg:place-items-center">{visual}</aside>}</div>;
}

export function PublicLayout({ children, header, footer, design, className }: PageLayoutProps) {
  return <PageLayout header={header} footer={footer} design={design} className={className}><Container>{children}</Container></PageLayout>;
}
