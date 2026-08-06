import type { RefObject } from "react";
import { LuSearch } from "react-icons/lu";

import { Kbd } from "@/components/ui/kbd";

interface CommandSearchInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  activeResultId?: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
}

export function CommandSearchInput({
  inputRef,
  query,
  activeResultId,
  onQueryChange,
  onClose,
}: CommandSearchInputProps) {
  return (
    <div className="border-b border-border p-3">
      <div className="flex items-center justify-between gap-4 px-1 pb-2.5">
        <div>
          <h2
            id="command-search-title"
            className="text-sm font-extrabold text-foreground"
          >
            Buscar una página
          </h2>
          <p className="mt-0.5 text-[11px] text-muted">
            Escribe para filtrar la navegación
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md focus-visible:outline-2 focus-visible:outline-primary"
          aria-label="Cerrar búsqueda"
        >
          <Kbd>Esc</Kbd>
        </button>
      </div>
      <div className="flex h-11 items-center gap-2.5 rounded-lg border border-border bg-background px-3 focus-within:border-primary/50">
        <LuSearch className="size-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar..."
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted"
          aria-label="Buscar páginas"
          aria-controls="command-results"
          aria-activedescendant={activeResultId}
        />
      </div>
    </div>
  );
}
