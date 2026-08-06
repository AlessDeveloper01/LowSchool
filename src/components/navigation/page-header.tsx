import type { ReactNode } from "react";

import type { BreadcrumbItem } from "@/components/navigation/breadcrumb";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import {
  navigationDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  badge?: ReactNode;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  design?: DesignPreset;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  badge,
  primaryAction,
  secondaryActions,
  design,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-4", design && navigationDesignStyles[design], design && "p-5", className)}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2"><h1 className="min-w-0 break-words text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{title}</h1>{badge}</div>
          {description && <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">{description}</p>}
        </div>
        {(primaryAction || secondaryActions) && <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center [&>*]:w-full sm:[&>*]:w-auto">{secondaryActions}{primaryAction}</div>}
      </div>
    </header>
  );
}
