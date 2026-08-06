import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type { InputSize, InputVariant } from "./input";
import type { DesignPreset } from "@/components/types";

export interface SearchSuggestion {
  id: string;
  label: string;
  description?: string;
  keywords?: readonly string[];
  disabled?: boolean;
}

export interface SearchFieldProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange" | "onSelect"
  > {
  design?: DesignPreset;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  suggestions: readonly SearchSuggestion[];
  onSelect?: (suggestion: SearchSuggestion) => void;
  filterSuggestion?: (
    suggestion: SearchSuggestion,
    query: string,
  ) => boolean;
  renderSuggestion?: (
    suggestion: SearchSuggestion,
    active: boolean,
  ) => ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openOnFocus?: boolean;
  maxResults?: number;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  label?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  inputVariant?: InputVariant;
  inputSize?: InputSize;
  inputClassName?: string;
  controlClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
}
