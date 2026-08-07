"use client";

import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/feedback/modal";
import { deleteSchoolYearAction } from "@/features/school-years/actions/school-year-actions";
import { useSchoolYearStore } from "@/features/school-years/store/schoolYearStore";

export function SchoolYearDeleteModal() {
  const router = useRouter();
  const modal = useSchoolYearStore((state) => state.modal);
  const selected = useSchoolYearStore((state) => state.selected);
  const pending = useSchoolYearStore((state) => state.pending);
  const setPending = useSchoolYearStore((state) => state.setPending);
  const setResult = useSchoolYearStore((state) => state.setResult);
  const complete = useSchoolYearStore((state) => state.complete);
  const close = useSchoolYearStore((state) => state.closeModal);

  async function confirm(): Promise<void> {
    if (!selected) return;
    setPending(true);
    try {
      const result = await deleteSchoolYearAction({ id: selected.id });
      if (result.success) { complete(result); router.refresh(); } else setResult(result);
    } catch { setResult({ success: false, message: "No fue posible eliminar el ciclo escolar." }); }
    finally { setPending(false); }
  }

  return <ConfirmDialog open={modal === "delete"} onOpenChange={(open) => !open && !pending && close()} title="Eliminar ciclo escolar" description={`Esta acción eliminará ${selected?.nombre ?? "el ciclo seleccionado"}. Sólo es posible si no tiene grupos relacionados.`} confirmLabel="Eliminar" cancelLabel="Cancelar" onConfirm={confirm} loading={pending} destructive />;
}