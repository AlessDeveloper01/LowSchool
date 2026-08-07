"use client";

import { useEffect } from "react";

import { readCachedCustomization } from "@/features/customization/services/customizationCache";
import { useCustomizationStore } from "@/features/customization/store/customizationStore";

const REFRESH_INTERVAL_MS = 60_000;

export function CustomizationProvider() {
  const initialize = useCustomizationStore((state) => state.initialize);
  const refreshFromServer = useCustomizationStore(
    (state) => state.refreshFromServer,
  );

  useEffect(() => {
    const cached = readCachedCustomization();
    if (cached) initialize(cached);

    function refreshWhenVisible(): void {
      if (document.visibilityState === "visible") {
        void refreshFromServer();
      }
    }

    refreshWhenVisible();
    const intervalId = window.setInterval(
      refreshWhenVisible,
      REFRESH_INTERVAL_MS,
    );
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [initialize, refreshFromServer]);

  return null;
}
