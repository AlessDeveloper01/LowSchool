"use client";

import {
  useId,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

import {
  defaultNormalizeTag,
  tagInputSizeStyles,
  tagInputVariantStyles,
} from "./tag-input.config";
import { TagInputMessage, TagPill } from "./tag-input-parts";
import type { TagInputProps } from "./tag-input.types";
import { useTagInput } from "./use-tag-input";
import { controlDesignStyles } from "@/components/types";
import { cn } from "@/lib/cn";

export function TagInput({
  design,
  value,
  defaultValue = [],
  onValueChange,
  label,
  description,
  error,
  name,
  placeholder = "Escribe y presiona Enter",
  addLabel = "Agregar etiqueta",
  variant = "outline",
  inputSize = "md",
  maxTags,
  delimiters = [",", ";"],
  allowDuplicates = false,
  addOnBlur = true,
  disabled = false,
  readOnly = false,
  validateTag,
  normalizeTag = defaultNormalizeTag,
  inputClassName,
  tagClassName,
  removeButtonClassName,
  className,
  id,
  ...props
}: TagInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const messageId = `${inputId}-message`;
  const tagInput = useTagInput({
    value,
    defaultValue,
    onValueChange,
    delimiters,
    normalizeTag,
    disabled,
    readOnly,
    maxTags,
    allowDuplicates,
    validateTag,
  });

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    const shouldAdd =
      event.key === "Enter" || delimiters.includes(event.key);
    if (shouldAdd && tagInput.draft) {
      event.preventDefault();
      tagInput.addTag(tagInput.draft);
      return;
    }

    if (
      event.key === "Backspace" &&
      !tagInput.draft &&
      tagInput.tags.length > 0
    ) {
      event.preventDefault();
      tagInput.removeTag(tagInput.tags.length - 1);
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>): void {
    const pastedText = event.clipboardData.getData("text");
    if (!delimiters.some((delimiter) => pastedText.includes(delimiter))) {
      return;
    }
    event.preventDefault();
    tagInput.addDraftParts(pastedText);
  }

  return (
    <div className="w-full">
      {label && (
        <label
          id={labelId}
          htmlFor={!readOnly && tagInput.hasCapacity ? inputId : undefined}
          className="mb-1.5 block text-xs font-extrabold text-foreground"
        >
          {label}
        </label>
      )}
      <div
        role="group"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={error || description ? messageId : undefined}
        className={cn(
          "flex flex-wrap items-center transition-all duration-150",
          tagInputVariantStyles[variant],
          tagInputSizeStyles[inputSize],
          design && controlDesignStyles[design],
          error && "border-danger focus-within:border-danger",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        {tagInput.tags.map((tag, index) => (
          <TagPill
            key={`${tag}-${index}`}
            tag={tag}
            name={name}
            readOnly={readOnly}
            disabled={disabled}
            pill={variant === "pill"}
            className={tagClassName}
            removeButtonClassName={removeButtonClassName}
            onRemove={() => tagInput.removeTag(index)}
          />
        ))}
        {!readOnly && tagInput.hasCapacity && (
          <input
            id={inputId}
            value={tagInput.draft}
            onChange={(event) => tagInput.setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (addOnBlur && tagInput.draft) {
                tagInput.addTag(tagInput.draft);
              }
            }}
            onPaste={handlePaste}
            disabled={disabled}
            placeholder={tagInput.tags.length === 0 ? placeholder : ""}
            aria-invalid={Boolean(error)}
            aria-label={label ? undefined : addLabel}
            aria-describedby={error || description ? messageId : undefined}
            className={cn(
              "min-w-20 flex-1 bg-transparent py-0.5 font-semibold text-foreground outline-none sm:min-w-28",
              "placeholder:font-normal placeholder:text-muted/70",
              inputClassName,
            )}
          />
        )}
      </div>
      <TagInputMessage
        id={messageId}
        error={error}
        description={description}
        maxTags={maxTags}
        tagCount={tagInput.tags.length}
      />
    </div>
  );
}
