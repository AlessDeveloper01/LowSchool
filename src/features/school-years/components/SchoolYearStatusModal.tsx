"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/feedback/modal";
import { setSchoolYearStatusAction } from "@/features/school-years/actions/school-year-actions";
import { useSchoolYearStore } from "@/features/school-years/store/schoolYearStore";

export function SchoolYearStatusModal() {
  const router = useRouter();
  const modal = useSchoolYearStore((state) => state.modal);
  const selected = useSchoolYearStore((state) => state.selected);
  const pending = useSchoolYearStore((state) => state.pending);
  const setPending = useSchoolYearStore((state) => state.setPending);
  const setResult = useSchoolYearStore((state) => state.setResult);
  const complete = useSchoolYearStore((state) => state.complete);
  const close = useSchoolYearStore((state) => state.closeModal);
  const activate = Boolean(selected && !selected.activo);

  async function confirm(): Promise<void> {
    if (!selected) return;
    setPending(true);
    try {
      const result = await setSchoolYearStatusAction({ id: selected.id, activo: activate });
      if (result.success) { complete(result); router.refresh(); } else setResult(result);
    } catch { setResult({ success: false, message: "No fue posible cambiar el estado del ciclo escolar." }); }
    finally { setPending(false); }
  }

  return <ConfirmDialog open={modal === "status"} onOpenChange={(open) => !open && !pending && close()} title={activate ? "Activar ciclo escolar" : "Desactivar ciclo escolar"} description={activate ? `¿Quieres activar ${selected?.nombre ?? "este ciclo"}? Los demás ciclos quedarán inactivos.` : `¿Quieres desactivar ${selected?.nombre ?? "este ciclo"}?`} confirmLabel={activate ? "Activar" : "Desactivar"} cancelLabel="Cancelar" onConfirm={confirm} loading={pending} destructive={!activate} />;
}