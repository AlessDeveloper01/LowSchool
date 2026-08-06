import { LuX } from "react-icons/lu";

import { cn } from "@/lib/cn";

interface TagPillProps {
  tag: string;
  name?: string;
  readOnly: boolean;
  disabled: boolean;
  pill: boolean;
  className?: string;
  removeButtonClassName?: string;
  onRemove: () => void;
}

export function TagPill({
  tag,
  name,
  readOnly,
  disabled,
  pill,
  className,
  removeButtonClassName,
  onRemove,
}: TagPillProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-md bg-primary/10 px-2 py-1 font-bold text-primary",
        pill && "rounded-full bg-secondary/12 text-secondary",
        className,
      )}
    >
      <span className="truncate">{tag}</span>
      {!readOnly && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className={cn(
            "grid size-4 shrink-0 place-items-center rounded text-current/70 transition-colors hover:bg-current/10 hover:text-current",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current",
            removeButtonClassName,
          )}
          aria-label={`Eliminar ${tag}`}
        >
          <LuX aria-hidden="true" />
        </button>
      )}
      {name && <input type="hidden" name={name} value={tag} />}
    </span>
  );
}

interface TagInputMessageProps {
  id: string;
  error?: string;
  description?: string;
  maxTags?: number;
  tagCount: number;
}

export function TagInputMessage({
  id,
  error,
  description,
  maxTags,
  tagCount,
}: TagInputMessageProps) {
  if (!error && !description && maxTags === undefined) {
    return null;
  }

  return (
    <div
      id={id}
      className="mt-1.5 flex items-start justify-between gap-3 text-xs"
    >
      <span className={error ? "text-danger" : "text-muted"}>
        {error ?? description}
      </span>
      {maxTags !== undefined && (
        <span className="shrink-0 font-bold text-muted">
          {tagCount}/{maxTags}
        </span>
      )}
    </div>
  );
}
