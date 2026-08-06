import { forwardRef, type ReactNode } from "react";

import { Input, type InputProps } from "./input";
import { cn } from "@/lib/cn";

export interface PrefixFieldProps
  extends Omit<InputProps, "leftIcon" | "prefix" | "rightIcon"> {
  prefix?: ReactNode;
  suffix?: ReactNode;
  prefixClassName?: string;
  suffixClassName?: string;
}

export const PrefixField = forwardRef<HTMLInputElement, PrefixFieldProps>(
  function PrefixField(
    {
      prefix,
      suffix,
      prefixClassName,
      suffixClassName,
      ...props
    },
    ref,
  ) {
    return (
      <Input
        ref={ref}
        leftIcon={
          prefix ? (
            <span
              className={cn(
                "block max-w-24 truncate whitespace-nowrap text-xs font-extrabold text-muted sm:max-w-36",
                prefixClassName,
              )}
            >
              {prefix}
            </span>
          ) : undefined
        }
        rightIcon={
          suffix ? (
            <span
              className={cn(
                "block max-w-24 truncate whitespace-nowrap text-xs font-extrabold text-muted sm:max-w-36",
                suffixClassName,
              )}
            >
              {suffix}
            </span>
          ) : undefined
        }
        {...props}
      />
    );
  },
);
