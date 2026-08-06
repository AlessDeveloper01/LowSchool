import type {
  TagInputSize,
  TagInputVariant,
} from "./tag-input.types";

export const tagInputVariantStyles: Record<TagInputVariant, string> = {
  outline:
    "rounded-xl border border-border bg-surface focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/10",
  soft:
    "rounded-xl border border-primary/10 bg-primary/5 focus-within:border-primary/40",
  filled:
    "rounded-xl border border-transparent bg-surface-hover focus-within:border-primary/40",
  underlined:
    "rounded-none border-b border-border bg-transparent focus-within:border-primary",
  pill:
    "rounded-3xl border border-border bg-surface focus-within:border-secondary focus-within:ring-3 focus-within:ring-secondary/10",
  customized: "",
};

export const tagInputSizeStyles: Record<TagInputSize, string> = {
  sm: "min-h-9 gap-1.5 px-2 py-1.5 text-xs",
  md: "min-h-11 gap-2 px-2.5 py-2 text-sm",
  lg: "min-h-12 gap-2.5 px-3 py-2.5 text-base",
};

export function defaultNormalizeTag(tag: string): string {
  return tag.trim().replace(/\s+/g, " ");
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitTagCandidate(
  candidate: string,
  delimiters: readonly string[],
): string[] {
  const separatorPattern = new RegExp(
    delimiters.map(escapeRegularExpression).join("|"),
    "g",
  );
  return candidate.split(separatorPattern);
}

export interface TagValidationOptions {
  allowDuplicates: boolean;
  maxTags?: number;
  validateTag?: (tag: string) => boolean;
}

export function isValidTag(
  candidate: string,
  tags: readonly string[],
  options: TagValidationOptions,
): boolean {
  const isDuplicate = tags.some(
    (tag) => tag.toLocaleLowerCase() === candidate.toLocaleLowerCase(),
  );
  const withinLimit =
    options.maxTags === undefined || tags.length < options.maxTags;

  return (
    candidate.length > 0 &&
    withinLimit &&
    (options.allowDuplicates || !isDuplicate) &&
    (options.validateTag?.(candidate) ?? true)
  );
}
