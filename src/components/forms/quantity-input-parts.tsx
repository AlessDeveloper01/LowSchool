import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface QuantityButtonProps {
  label: string;
  disabled: boolean;
  className?: string;
  icon: ReactNode;
  onClick: () => void;
}

export function QuantityButton({
  label,
  disabled,
  className,
  icon,
  onClick,
}: QuantityButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "grid shrink-0 place-items-center text-muted transition-colors hover:bg-surface-hover hover:text-foreground",
        "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary",
        "disabled:cursor-not-allowed disabled:opacity-35",
        className,
      )}
    >
      {icon}
    </button>
  );
}

interface QuantityMessageProps {
  id: string;
  error?: string;
  description?: string;
}

export function QuantityMessage({
  id,
  error,
  description,
}: QuantityMessageProps) {
  if (!error && !description) {
    return null;
  }

  return (
    <p
      id={id}
      className={cn(
        "mt-1.5 text-xs",
        error ? "text-danger" : "text-muted",
      )}
    >
      {error ?? description}
    </p>
  );
}
