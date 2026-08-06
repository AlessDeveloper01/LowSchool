export type ProgressTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "danger"
  | "gradient"
  | "customized";

export const progressToneStyles: Record<ProgressTone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  gradient: "bg-gradient-to-r from-primary via-secondary to-tertiary",
  customized: "",
};

export function normalizeProgress(value: number): number {
  return Math.min(100, Math.max(0, value));
}
