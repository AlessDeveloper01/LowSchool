export const designPresets = [
  "minimal",
  "outline",
  "soft",
  "elevated",
  "glass",
  "gradient",
  "pill",
  "sharp",
  "brutalist",
  "customized",
] as const;

export type DesignPreset = (typeof designPresets)[number];
export type SurfaceMode = "contained" | "plain";

export const surfaceDesignStyles: Record<DesignPreset, string> = {
  minimal: "border-transparent bg-transparent shadow-none",
  outline: "rounded-xl border border-border bg-surface shadow-none",
  soft: "rounded-2xl border border-primary/10 bg-primary/6 shadow-none",
  elevated:
    "rounded-2xl border border-border/60 bg-surface shadow-lg shadow-foreground/8",
  glass:
    "rounded-2xl border border-white/25 bg-surface/70 shadow-none backdrop-blur-xl dark:border-white/10",
  gradient:
    "rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/12 via-surface to-tertiary/12 shadow-none",
  pill: "rounded-[2rem] border border-border bg-surface shadow-none",
  sharp: "rounded-none border border-border bg-surface shadow-none",
  brutalist:
    "rounded-none border-2 border-foreground bg-surface shadow-[4px_4px_0_var(--theme-foreground)]",
  customized: "",
};

export const controlDesignStyles: Record<DesignPreset, string> = {
  minimal:
    "rounded-lg border border-transparent bg-transparent shadow-none hover:bg-surface-hover",
  outline: "rounded-xl border border-border bg-surface shadow-none",
  soft: "rounded-xl border border-primary/10 bg-primary/7 shadow-none",
  elevated:
    "rounded-xl border border-border/60 bg-surface shadow-md shadow-foreground/8",
  glass:
    "rounded-xl border border-white/25 bg-surface/65 shadow-none backdrop-blur-xl dark:border-white/10",
  gradient:
    "rounded-xl border border-primary/20 bg-gradient-to-r from-primary/12 via-secondary/10 to-tertiary/12 shadow-none",
  pill: "rounded-full border border-border bg-surface shadow-none",
  sharp: "rounded-none border border-border bg-surface shadow-none",
  brutalist:
    "rounded-none border-2 border-foreground bg-surface shadow-[3px_3px_0_var(--theme-foreground)]",
  customized: "",
};

export const navigationDesignStyles: Record<DesignPreset, string> = {
  minimal: "rounded-none border-transparent bg-transparent shadow-none",
  outline: "rounded-xl border border-border bg-surface shadow-none",
  soft: "rounded-2xl border border-primary/10 bg-primary/6 shadow-none",
  elevated:
    "rounded-2xl border border-border/60 bg-surface shadow-lg shadow-foreground/8",
  glass:
    "rounded-2xl border border-white/25 bg-surface/70 shadow-none backdrop-blur-xl dark:border-white/10",
  gradient:
    "rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/10 via-surface to-tertiary/10 shadow-none",
  pill: "rounded-full border border-border bg-surface shadow-none",
  sharp: "rounded-none border border-border bg-surface shadow-none",
  brutalist:
    "rounded-none border-2 border-foreground bg-surface shadow-[4px_4px_0_var(--theme-foreground)]",
  customized: "",
};

export const overlayDesignStyles: Record<DesignPreset, string> = {
  minimal: "rounded-xl border-transparent bg-surface shadow-none",
  outline: "rounded-xl border border-border bg-surface shadow-none",
  soft: "rounded-2xl border border-primary/10 bg-primary/6 shadow-none",
  elevated:
    "rounded-2xl border border-border/60 bg-surface shadow-2xl shadow-foreground/15",
  glass:
    "rounded-2xl border border-white/25 bg-surface/75 shadow-xl backdrop-blur-2xl dark:border-white/10",
  gradient:
    "rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/12 via-surface to-tertiary/12 shadow-xl",
  pill: "rounded-[2rem] border border-border bg-surface shadow-xl",
  sharp: "rounded-none border border-border bg-surface shadow-xl",
  brutalist:
    "rounded-none border-2 border-foreground bg-surface shadow-[6px_6px_0_var(--theme-foreground)]",
  customized: "",
};

export const mediaDesignStyles: Record<DesignPreset, string> = {
  minimal: "rounded-none border-0 bg-transparent shadow-none",
  outline: "rounded-xl border border-border bg-surface shadow-none",
  soft: "rounded-2xl border border-primary/10 bg-primary/6 shadow-none",
  elevated:
    "rounded-2xl border border-border/60 bg-surface shadow-lg shadow-foreground/10",
  glass:
    "rounded-2xl border border-white/25 bg-surface/65 shadow-none backdrop-blur-xl dark:border-white/10",
  gradient:
    "rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-tertiary/15 shadow-none",
  pill: "rounded-full border border-border bg-surface shadow-none",
  sharp: "rounded-none border border-border bg-surface shadow-none",
  brutalist:
    "rounded-none border-2 border-foreground bg-surface shadow-[4px_4px_0_var(--theme-foreground)]",
  customized: "",
};
