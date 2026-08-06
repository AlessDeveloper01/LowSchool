import type { SearchSuggestion } from "./search-field.types";

export function defaultFilterSuggestion(
  suggestion: SearchSuggestion,
  query: string,
): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const searchableText = [
    suggestion.label,
    suggestion.description,
    ...(suggestion.keywords ?? []),
  ]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .toLocaleLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function findNextEnabledIndex(
  suggestions: readonly SearchSuggestion[],
  startIndex: number,
  direction: 1 | -1,
): number {
  if (suggestions.length === 0) {
    return -1;
  }

  let nextIndex = startIndex;
  for (let attempts = 0; attempts < suggestions.length; attempts += 1) {
    nextIndex =
      (nextIndex + direction + suggestions.length) % suggestions.length;
    if (!suggestions[nextIndex]?.disabled) {
      return nextIndex;
    }
  }

  return -1;
}
