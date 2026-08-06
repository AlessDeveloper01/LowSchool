import { useState } from "react";

import {
  isValidTag,
  splitTagCandidate,
  type TagValidationOptions,
} from "./tag-input.config";

interface UseTagInputOptions extends TagValidationOptions {
  value?: readonly string[];
  defaultValue: readonly string[];
  onValueChange?: (tags: string[]) => void;
  delimiters: readonly string[];
  normalizeTag: (tag: string) => string;
  disabled: boolean;
  readOnly: boolean;
}

export function useTagInput({
  value,
  defaultValue,
  onValueChange,
  delimiters,
  normalizeTag,
  disabled,
  readOnly,
  ...validationOptions
}: UseTagInputOptions) {
  const [internalTags, setInternalTags] = useState<string[]>([
    ...defaultValue,
  ]);
  const [draft, setDraft] = useState("");
  const tags = value === undefined ? internalTags : [...value];
  const hasCapacity =
    validationOptions.maxTags === undefined ||
    tags.length < validationOptions.maxTags;

  function commitTags(nextTags: string[]): void {
    if (value === undefined) {
      setInternalTags(nextTags);
    }
    onValueChange?.(nextTags);
  }

  function addTag(candidate: string): boolean {
    const normalized = normalizeTag(candidate);
    if (!isValidTag(normalized, tags, validationOptions)) {
      return false;
    }

    commitTags([...tags, normalized]);
    setDraft("");
    return true;
  }

  function addDraftParts(candidate: string): void {
    if (delimiters.length === 0) {
      addTag(candidate);
      return;
    }

    let nextTags = [...tags];
    for (const part of splitTagCandidate(candidate, delimiters)) {
      const normalized = normalizeTag(part);
      if (isValidTag(normalized, nextTags, validationOptions)) {
        nextTags = [...nextTags, normalized];
      }
    }

    if (nextTags.length !== tags.length) {
      commitTags(nextTags);
      setDraft("");
    }
  }

  function removeTag(index: number): void {
    if (disabled || readOnly) {
      return;
    }
    commitTags(tags.filter((_, tagIndex) => tagIndex !== index));
  }

  return {
    addDraftParts,
    addTag,
    draft,
    hasCapacity,
    removeTag,
    setDraft,
    tags,
  };
}
