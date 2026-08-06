"use client";

import { useCallback } from "react";

export interface ThemeControls {
  toggleTheme: () => void;
}

export function useTheme(): ThemeControls {
  const toggleTheme = useCallback(() => {
    const nextTheme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("dashboard-theme", nextTheme);
  }, []);

  return { toggleTheme };
}
