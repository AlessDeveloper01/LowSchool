import { LuX } from "react-icons/lu";

interface SearchFieldEndAdornmentProps {
  loading: boolean;
  loadingMessage: string;
  clearable: boolean;
  hasQuery: boolean;
  onClear: () => void;
}

export function SearchFieldEndAdornment({
  loading,
  loadingMessage,
  clearable,
  hasQuery,
  onClear,
}: SearchFieldEndAdornmentProps) {
  if (loading) {
    return (
      <span
        className="size-4 animate-spin rounded-full border-2 border-border border-t-primary"
        aria-label={loadingMessage}
      />
    );
  }

  if (!clearable || !hasQuery) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClear}
      className="grid size-6 place-items-center rounded-md text-muted transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
      aria-label="Limpiar búsqueda"
    >
      <LuX aria-hidden="true" />
    </button>
  );
}
