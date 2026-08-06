import { LuCornerDownLeft } from "react-icons/lu";

import { Kbd } from "@/components/ui/kbd";

export function CommandSearchFooter() {
  return (
    <div className="flex items-center gap-4 border-t border-border px-3 py-2 text-[10px] font-semibold text-muted">
      <span className="flex items-center gap-1.5">
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        navegar
      </span>
      <span className="flex items-center gap-1.5">
        <Kbd>
          <LuCornerDownLeft aria-hidden="true" />
        </Kbd>
        abrir
      </span>
      <span className="ml-auto flex items-center gap-1.5">
        <Kbd>Esc</Kbd>
        cerrar
      </span>
    </div>
  );
}
