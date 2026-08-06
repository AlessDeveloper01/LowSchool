import {
  forwardRef,
  type ComponentPropsWithoutRef,
} from "react";
import type { IconType } from "react-icons";
import {
  LuCircleAlert,
  LuCircleCheck,
  LuInfo,
  LuTriangleAlert,
} from "react-icons/lu";

import {
  controlDesignStyles,
  type DesignPreset,
} from "@/components/types";
import { cn } from "@/lib/cn";

export type FormFeedbackTone = "error" | "success" | "info" | "warning";
export type FormFeedbackVariant = "inline" | "soft" | "outline";

export interface FormFeedbackProps
  extends ComponentPropsWithoutRef<"div"> {
  design?: DesignPreset;
  tone?: FormFeedbackTone;
  variant?: FormFeedbackVariant;
  title?: string;
  showIcon?: boolean;
}

interface ToneStyle {
  icon: IconType;
  text: string;
  soft: string;
  outline: string;
}

const toneStyles: Record<FormFeedbackTone, ToneStyle> = {
  error: {
    icon: LuCircleAlert,
    text: "text-red-600 dark:text-red-400",
    soft: "bg-red-500/10",
    outline: "border-red-500/25",
  },
  success: {
    icon: LuCircleCheck,
    text: "text-emerald-600 dark:text-emerald-400",
    soft: "bg-emerald-500/10",
    outline: "border-emerald-500/25",
  },
  info: {
    icon: LuInfo,
    text: "text-secondary",
    soft: "bg-secondary/10",
    outline: "border-secondary/25",
  },
  warning: {
    icon: LuTriangleAlert,
    text: "text-amber-600 dark:text-amber-400",
    soft: "bg-amber-500/10",
    outline: "border-amber-500/25",
  },
};

export const FormFeedback = forwardRef<HTMLDivElement, FormFeedbackProps>(
  function FormFeedback(
    {
      design,
      tone = "error",
      variant = "inline",
      title,
      showIcon = true,
      children,
      className,
      role,
      ...props
    },
    ref,
  ) {
    const styles = toneStyles[tone];
    const Icon = styles.icon;

    return (
      <div
        ref={ref}
        role={role ?? (tone === "error" ? "alert" : "status")}
        className={cn(
          "flex min-w-0 items-start gap-2.5 text-xs leading-5",
          styles.text,
          variant !== "inline" && "rounded-lg px-3 py-2.5",
          variant === "soft" && styles.soft,
          variant === "outline" && "border bg-transparent",
          variant === "outline" && styles.outline,
          design && controlDesignStyles[design],
          className,
        )}
        {...props}
      >
        {showIcon && <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
        <span className="min-w-0 break-words">
          {title && <strong className="block font-extrabold">{title}</strong>}
          <span className={cn(title && "mt-0.5 block")}>{children}</span>
        </span>
      </div>
    );
  },
);
