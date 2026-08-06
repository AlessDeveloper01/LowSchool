"use client";

import {
  useId,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { LuSearch } from "react-icons/lu";

import { Input } from "./input";
import { SearchFieldEndAdornment } from "./search-field-adornment";
import { SearchFieldMenu } from "./search-field-menu";
import type { SearchFieldProps } from "./search-field.types";
import { useSearchField } from "./use-search-field";
import { cn } from "@/lib/cn";

export function SearchField({
  design,
  value,
  defaultValue = "",
  onValueChange,
  suggestions,
  onSelect,
  filterSuggestion,
  open,
  defaultOpen = false,
  onOpenChange,
  openOnFocus = true,
  maxResults = 8,
  loading = false,
  disabled = false,
  clearable = true,
  label,
  description,
  error,
  placeholder = "Buscar...",
  emptyMessage = "No encontramos coincidencias",
  loadingMessage = "Buscando...",
  inputVariant = "outline",
  inputSize = "md",
  inputClassName,
  controlClassName,
  menuClassName,
  optionClassName,
  renderSuggestion,
  className,
  id,
  onBlur: onRootBlur,
  ...props
}: SearchFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-suggestions`;
  const rootRef = useRef<HTMLDivElement>(null);
  const search = useSearchField({
    value,
    defaultValue,
    onValueChange,
    suggestions,
    onSelect,
    filterSuggestion,
    open,
    defaultOpen,
    onOpenChange,
    maxResults,
  });

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape") {
      event.preventDefault();
      search.setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!search.isOpen) {
        search.setOpen(true);
      }
      search.moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (
      event.key === "Enter" &&
      search.isOpen &&
      search.activeSuggestion
    ) {
      event.preventDefault();
      search.selectSuggestion(search.activeSuggestion);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>): void {
    onRootBlur?.(event);
    const nextTarget = event.relatedTarget;
    if (
      nextTarget instanceof Node &&
      rootRef.current?.contains(nextTarget)
    ) {
      return;
    }
    search.setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={cn("relative w-full", className)}
      onBlur={handleBlur}
      {...props}
    >
      <Input
        design={design}
        id={inputId}
        type="search"
        role="combobox"
        value={search.query}
        onChange={(event) => search.commitQuery(event.target.value)}
        onFocus={() => {
          if (openOnFocus) {
            search.setOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        label={label}
        description={description}
        error={error}
        placeholder={placeholder}
        variant={inputVariant}
        inputSize={inputSize}
        leftIcon={<LuSearch aria-hidden="true" />}
        rightIcon={
          <SearchFieldEndAdornment
            loading={loading}
            loadingMessage={loadingMessage}
            clearable={clearable}
            hasQuery={Boolean(search.query)}
            onClear={() => search.commitQuery("")}
          />
        }
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={search.isOpen}
        aria-activedescendant={
          search.activeSuggestion
            ? `${listboxId}-option-${search.activeIndex}`
            : undefined
        }
        autoComplete="off"
        className={inputClassName}
        controlClassName={controlClassName}
      />
      {search.isOpen && !disabled && (
        <SearchFieldMenu
          id={listboxId}
          suggestions={search.filteredSuggestions}
          activeIndex={search.activeIndex}
          loading={loading}
          loadingMessage={loadingMessage}
          emptyMessage={emptyMessage}
          className={menuClassName}
          optionClassName={optionClassName}
          renderSuggestion={renderSuggestion}
          onActivate={search.setActiveIndex}
          onSelect={search.selectSuggestion}
        />
      )}
    </div>
  );
}

export function AutocompleteField(props: SearchFieldProps) {
  return <SearchField openOnFocus {...props} />;
}
