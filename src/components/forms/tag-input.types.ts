import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
} from "react";
import type { DesignPreset } from "@/components/types";

export type TagInputVariant =
  | "outline"
  | "soft"
  | "filled"
  | "underlined"
  | "pill"
  | "customized";

export type TagInputSize = "sm" | "md" | "lg";

export interface TagInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  design?: DesignPreset;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (tags: string[]) => void;
  label?: string;
  description?: string;
  error?: string;
  name?: string;
  placeholder?: string;
  addLabel?: string;
  variant?: TagInputVariant;
  inputSize?: TagInputSize;
  maxTags?: number;
  delimiters?: readonly string[];
  allowDuplicates?: boolean;
  addOnBlur?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  validateTag?: (tag: string) => boolean;
  normalizeTag?: (tag: string) => string;
  inputClassName?: string;
  tagClassName?: string;
  removeButtonClassName?: string;
}

export interface TagInputAddButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type"> {
  design?: DesignPreset;
  onAdd: () => void;
  disabled?: boolean;
}
