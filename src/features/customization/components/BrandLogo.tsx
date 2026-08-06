"use client";

import Image from "next/image";

import { useCustomizationStore } from "@/features/customization/store/customizationStore";
import { cn } from "@/lib/cn";

interface BrandLogoProps {
  placement?: "sidebar" | "ticket";
  mode?: "auto" | "light" | "dark";
  className?: string;
}

export function BrandLogo({
  placement = "sidebar",
  mode,
  className,
}: BrandLogoProps) {
  const appName = useCustomizationStore((state) => state.settings.appName);
  const logoLightUrl = useCustomizationStore(
    (state) => state.settings.logoLightUrl,
  );
  const logoDarkUrl = useCustomizationStore(
    (state) => state.settings.logoDarkUrl,
  );
  const ticket = placement === "ticket";
  const resolvedMode = mode ?? (ticket ? "light" : "auto");
  const lightUrl = logoLightUrl ?? logoDarkUrl;
  const darkUrl = logoDarkUrl ?? logoLightUrl;

  if (!lightUrl && !darkUrl) return null;

  function renderLogo(url: string, extraClassName?: string) {
    return (
      <Image
        src={url}
        alt={`Logo de ${appName}`}
        width={ticket ? 320 : 96}
        height={ticket ? 160 : 96}
        sizes={ticket ? "320px" : "96px"}
        className={cn(
          "object-contain",
          ticket ? "mx-auto max-h-24 w-auto max-w-full" : "size-full",
          extraClassName,
          className,
        )}
      />
    );
  }

  if (resolvedMode === "light") return lightUrl ? renderLogo(lightUrl) : null;
  if (resolvedMode === "dark") return darkUrl ? renderLogo(darkUrl) : null;

  if (lightUrl === darkUrl) return lightUrl ? renderLogo(lightUrl) : null;

  return (
    <>
      {lightUrl && renderLogo(lightUrl, "dark:hidden")}
      {darkUrl && renderLogo(darkUrl, "hidden dark:block")}
    </>
  );
}
