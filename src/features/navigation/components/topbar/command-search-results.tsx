import { CommandSearchResult } from "@/features/navigation/components/topbar/command-search-result";
import type { SearchableNavItem } from "@/features/navigation/types/navigation";

interface CommandSearchResultsProps {
  items: SearchableNavItem[];
  selectedIndex: number;
  onSelect: (item: SearchableNavItem) => void;
  onHover: (index: number) => void;
}

export function CommandSearchResults({
  items,
  selectedIndex,
  onSelect,
  onHover,
}: CommandSearchResultsProps) {
  return (
    <div
      id="command-results"
      role="listbox"
      className="max-h-[min(420px,55vh)] overflow-y-auto p-2"
    >
      {items.length > 0 ? (
        <>
          <p
            role="presentation"
            className="px-2.5 pb-1.5 pt-1 text-[11px] font-extrabold text-muted"
          >
            Opciones
          </p>
          <div className="space-y-0.5">
            {items.map((item, index) => (
              <CommandSearchResult
                key={item.id}
                item={item}
                selected={index === selectedIndex}
                onSelect={() => onSelect(item)}
                onHover={() => onHover(index)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="grid min-h-32 place-items-center px-6 text-center">
          <div>
            <p className="text-sm font-extrabold text-foreground">
              Sin coincidencias
            </p>
            <p className="mt-1 text-xs text-muted">Prueba con otra palabra.</p>
          </div>
        </div>
      )}
    </div>
  );
}
