import type { SearchableNavItem } from "@/features/navigation/types/navigation";
import { cn } from "@/lib/cn";

interface CommandSearchResultProps {
  item: SearchableNavItem;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

export function CommandSearchResult({
  item,
  selected,
  onSelect,
  onHover,
}: CommandSearchResultProps) {
  const Icon = item.icon;

  return (
    <button
      id={`command-result-${item.id}`}
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left",
        "transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-primary",
        selected
          ? "bg-primary/8 text-foreground before:absolute before:left-0 before:h-5 before:w-0.5 before:rounded-full before:bg-primary"
          : "text-foreground hover:bg-background",
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-lg border",
          selected
            ? "border-primary/20 bg-primary/10 text-primary"
            : "border-border bg-background text-muted",
        )}
      >
        {Icon && <Icon aria-hidden="true" />}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-extrabold">{item.label}</span>
        <span className="block truncate text-[11px] text-muted">
          {item.breadcrumb}
        </span>
      </span>
    </button>
  );
}
