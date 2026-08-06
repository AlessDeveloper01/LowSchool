import type { ReactNode } from "react";

import type { SearchSuggestion } from "./search-field.types";
import { cn } from "@/lib/cn";

interface SearchFieldMenuProps {
  id: string;
  suggestions: readonly SearchSuggestion[];
  activeIndex: number;
  loading: boolean;
  loadingMessage: string;
  emptyMessage: string;
  className?: string;
  optionClassName?: string;
  renderSuggestion?: (
    suggestion: SearchSuggestion,
    active: boolean,
  ) => ReactNode;
  onActivate: (index: number) => void;
  onSelect: (suggestion: SearchSuggestion) => void;
}

export function SearchFieldMenu({
  id,
  suggestions,
  activeIndex,
  loading,
  loadingMessage,
  emptyMessage,
  className,
  optionClassName,
  renderSuggestion,
  onActivate,
  onSelect,
}: SearchFieldMenuProps) {
  return (
    <div
      id={id}
      role="listbox"
      aria-label="Sugerencias de búsqueda"
      className={cn(
        "absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-surface p-1.5",
        "shadow-xl shadow-foreground/8",
        className,
      )}
    >
      {loading && suggestions.length === 0 ? (
        <SearchFieldStatus>{loadingMessage}</SearchFieldStatus>
      ) : suggestions.length === 0 ? (
        <SearchFieldStatus>{emptyMessage}</SearchFieldStatus>
      ) : (
        suggestions.map((suggestion, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={suggestion.id}
              id={`${id}-option-${index}`}
              type="button"
              role="option"
              aria-selected={isActive}
              disabled={suggestion.disabled}
              onMouseEnter={() => {
                if (!suggestion.disabled) {
                  onActivate(index);
                }
              }}
              onClick={() => onSelect(suggestion)}
              className={cn(
                "flex min-h-11 w-full min-w-0 items-start rounded-lg px-3 py-2.5 text-left transition-colors",
                "hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-primary",
                isActive && "bg-primary/8",
                "disabled:cursor-not-allowed disabled:opacity-45",
                optionClassName,
              )}
            >
              {renderSuggestion ? (
                renderSuggestion(suggestion, isActive)
              ) : (
                <DefaultSuggestion suggestion={suggestion} />
              )}
            </button>
          );
        })
      )}
    </div>
  );
}

function SearchFieldStatus({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 py-6 text-center text-xs font-semibold text-muted">
      {children}
    </p>
  );
}

function DefaultSuggestion({
  suggestion,
}: {
  suggestion: SearchSuggestion;
}) {
  return (
    <span className="min-w-0">
      <span className="block truncate text-sm font-extrabold text-foreground">
        {suggestion.label}
      </span>
      {suggestion.description && (
        <span className="mt-0.5 block truncate text-xs text-muted">
          {suggestion.description}
        </span>
      )}
    </span>
  );
}
