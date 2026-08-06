"use client";

import { useEffect, useState } from "react";
import { LuLaptop, LuMoon, LuSun } from "react-icons/lu";

import { SegmentedControl } from "@/components/forms/toggle";
import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type ThemeMode = "light" | "dark" | "system";
const storageKey = "dashboard-theme";

function applyTheme(mode: ThemeMode): void {
  const shouldUseDark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", shouldUseDark);
  if (mode === "system") localStorage.removeItem(storageKey);
  else localStorage.setItem(storageKey, mode);
}

export function ThemeToggle({ design, className }: { design?: DesignPreset; className?: string }) {
  function toggle(): void {
    applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
  }
  return <button type="button" onClick={toggle} className={cn("grid size-10 place-items-center rounded-lg border border-border bg-surface text-muted hover:bg-surface-hover", design && controlDesignStyles[design], className)} aria-label="Cambiar tema"><LuMoon className="dark:hidden" /><LuSun className="hidden dark:block" /></button>;
}

export interface ThemeSelectorProps {
  value?: ThemeMode;
  onChange?: (mode: ThemeMode) => void;
  design?: DesignPreset;
  className?: string;
}

export function ThemeSelector({ value, onChange, design, className }: ThemeSelectorProps) {
  const [internalMode, setInternalMode] = useState<ThemeMode>("system");
  const mode = value ?? internalMode;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = localStorage.getItem(storageKey);
      setInternalMode(stored === "light" || stored === "dark" ? stored : "system");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function change(nextMode: string): void {
    const next = nextMode as ThemeMode;
    if (value === undefined) setInternalMode(next);
    applyTheme(next);
    onChange?.(next);
  }

  return <SegmentedControl design={design} className={className} value={mode} onChange={change} options={[{ value: "light", label: "Claro", icon: <LuSun /> }, { value: "dark", label: "Oscuro", icon: <LuMoon /> }, { value: "system", label: "Sistema", icon: <LuLaptop /> }]} />;
}

export function AppearanceSelector(props: ThemeSelectorProps) {
  return <ThemeSelector {...props} />;
}
