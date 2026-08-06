import { useState } from "react";

import {
  defaultFilterSuggestion,
  findNextEnabledIndex,
} from "./search-field.config";
import type {
  SearchFieldProps,
  SearchSuggestion,
} from "./search-field.types";

type SearchFieldStateOptions = Pick<
  SearchFieldProps,
  | "defaultOpen"
  | "defaultValue"
  | "filterSuggestion"
  | "maxResults"
  | "onOpenChange"
  | "onSelect"
  | "onValueChange"
  | "open"
  | "suggestions"
  | "value"
>;

export function useSearchField({
  value,
  defaultValue = "",
  onValueChange,
  suggestions,
  onSelect,
  filterSuggestion = defaultFilterSuggestion,
  open,
  defaultOpen = false,
  onOpenChange,
  maxResults = 8,
}: SearchFieldStateOptions) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(-1);
  const query = value ?? internalValue;
  const isOpen = open ?? internalOpen;
  const filteredSuggestions = suggestions
    .filter((suggestion) => filterSuggestion(suggestion, query))
    .slice(0, maxResults);

  function setOpen(nextOpen: boolean): void {
    if (open === undefined) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      setActiveIndex(-1);
    }
  }

  function commitQuery(nextValue: string): void {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
    setActiveIndex(-1);
    setOpen(true);
  }

  function selectSuggestion(suggestion: SearchSuggestion): void {
    if (suggestion.disabled) {
      return;
    }
    if (value === undefined) {
      setInternalValue(suggestion.label);
    }
    onValueChange?.(suggestion.label);
    onSelect?.(suggestion);
    setOpen(false);
  }

  function moveActive(direction: 1 | -1): void {
    setActiveIndex((current) =>
      findNextEnabledIndex(
        filteredSuggestions,
        current,
        direction,
      ),
    );
  }

  return {
    activeIndex,
    activeSuggestion: filteredSuggestions[activeIndex],
    commitQuery,
    filteredSuggestions,
    isOpen,
    moveActive,
    query,
    selectSuggestion,
    setActiveIndex,
    setOpen,
  };
}
