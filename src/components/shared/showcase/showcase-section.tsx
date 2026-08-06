import type { ReactNode } from "react";

export function ShowcaseSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="min-w-0 scroll-mt-24 border-t border-border py-8 first:border-0 sm:py-10"
    >
      <div className="mb-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-secondary">
          Componentes
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

export function DemoBlock({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-5 ${className ?? ""}`}
    >
      <h3 className="mb-4 text-xs font-extrabold text-foreground">{title}</h3>
      {children}
    </div>
  );
}
