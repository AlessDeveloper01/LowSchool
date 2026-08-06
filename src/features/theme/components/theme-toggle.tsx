"use client";

import { LuMoon, LuSun } from "react-icons/lu";

import { useTheme } from "@/features/theme/hooks/use-theme";
import { cn } from "@/lib/cn";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "grid size-10 place-items-center rounded-lg border border-border bg-surface text-muted",
        "transition-colors duration-200 hover:border-primary/40 hover:bg-surface-hover hover:text-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
      aria-label="Cambiar tema de color"
      title="Cambiar tema"
    >
      <LuMoon className="dark:hidden" aria-hidden="true" />
      <LuSun className="hidden dark:block" aria-hidden="true" />
    </button>
  );
}
