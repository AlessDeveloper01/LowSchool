"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { LuSave, LuX } from "react-icons/lu";

import { Modal } from "@/components/feedback/modal";
import { Input } from "@/components/forms/input";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import { createSchoolYearAction, updateSchoolYearAction } from "@/features/school-years/actions/school-year-actions";
import { createSchoolYearSchema, updateSchoolYearSchema } from "@/features/school-years/schemas/schoolYearSchema";
import { useSchoolYearStore } from "@/features/school-years/store/schoolYearStore";

const FORM_ID = "school-year-form";

export function SchoolYearFormModal() {
  const router = useRouter();
  const modal = useSchoolYearStore((state) => state.modal);
  const selected = useSchoolYearStore((state) => state.selected);
  const form = useSchoolYearStore((state) => state.form);
  const pending = useSchoolYearStore((state) => state.pending);
  const result = useSchoolYearStore((state) => state.result);
  const close = useSchoolYearStore((state) => state.closeModal);
  const updateForm = useSchoolYearStore((state) => state.updateForm);
  const setPending = useSchoolYearStore((state) => state.setPending);
  const setResult = useSchoolYearStore((state) => state.setResult);
  const complete = useSchoolYearStore((state) => state.complete);
  const editing = modal === "edit";
  const open = modal === "create" || editing;

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const input = editing ? { id: selected?.id ?? "", ...form } : form;
    const parsed = editing ? updateSchoolYearSchema.safeParse(input) : createSchoolYearSchema.safeParse(input);
    if (!parsed.success) {
      setResult({ success: false, message: "Revisa el formato del ciclo escolar.", fieldErrors: parsed.error.flatten().fieldErrors });
      return;
    }
    setPending(true);
    try {
      const actionResult = editing ? await updateSchoolYearAction(input) : await createSchoolYearAction(form);
      if (!actionResult.success) setResult(actionResult);
      else { complete(actionResult); router.refresh(); }
    } catch {
      setResult({ success: false, message: "No fue posible guardar el ciclo escolar. Comprueba la conexión." });
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && !pending && close()}
      title={editing ? "Editar ciclo escolar" : "Nuevo ciclo escolar"}
      description="Registra el periodo con el formato de dos años consecutivos."
      variant="form"
      size="sm"
      closeOnOverlay={!pending}
      footer={<><Button variant="ghost" leftIcon={<LuX />} disabled={pending} onClick={close}>Cancelar</Button><Button type="submit" form={FORM_ID} leftIcon={<LuSave />} loading={pending} loadingText="Guardando...">{editing ? "Guardar cambios" : "Crear ciclo"}</Button></>}
    >
      <form id={FORM_ID} onSubmit={submit} className="space-y-4">
        {result && !result.success && <FormFeedback tone="error" variant="soft">{result.message}</FormFeedback>}
        <Input label="Nombre del ciclo escolar" value={form.nombre} required autoFocus maxLength={9} placeholder="Ej. 2026-2027" error={result?.fieldErrors?.nombre?.[0]} onChange={(event) => updateForm({ nombre: event.target.value })} />
        <p className="text-xs leading-5 text-muted">El segundo año debe ser consecutivo al primero. Ejemplo: 2026-2027.</p>
      </form>
    </Modal>
  );
}