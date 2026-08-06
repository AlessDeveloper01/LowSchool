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

    function refreshWhenAvailable(): void {
      if (navigator.onLine && document.visibilityState === "visible") {
        void refreshFromServer();
      }
    }

    refreshWhenAvailable();
    const intervalId = window.setInterval(
      refreshWhenAvailable,
      REFRESH_INTERVAL_MS,
    );
    window.addEventListener("online", refreshWhenAvailable);
    document.addEventListener("visibilitychange", refreshWhenAvailable);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("online", refreshWhenAvailable);
      document.removeEventListener("visibilitychange", refreshWhenAvailable);
    };
  }, [initialize, refreshFromServer]);

  return null;
}
