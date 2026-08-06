"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { LuSave, LuX } from "react-icons/lu";

import { Modal } from "@/components/feedback/modal";
import { Input, PasswordInput } from "@/components/forms/input";
import { NativeSelect } from "@/components/forms/select";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import { createUserAction, updateUserAction } from "@/features/users/actions/user-actions";
import { createUserSchema, updateUserSchema } from "@/features/users/schemas/userSchema";
import { useUserStore } from "@/features/users/store/userStore";

const FORM_ID = "managed-user-form";
const roleOptions = [
  { value: "SUPER_ADMIN", label: "Super administrador" },
  { value: "MESERO", label: "Mesero" },
  { value: "CLIENTE", label: "Cliente" },
];

export function UserFormModal({ currentUserId }: { currentUserId: string }) {
  const router = useRouter();
  const modal = useUserStore((state) => state.modal);
  const selected = useUserStore((state) => state.selected);
  const form = useUserStore((state) => state.form);
  const pending = useUserStore((state) => state.pending);
  const result = useUserStore((state) => state.result);
  const close = useUserStore((state) => state.closeModal);
  const updateForm = useUserStore((state) => state.updateForm);
  const setPending = useUserStore((state) => state.setPending);
  const setResult = useUserStore((state) => state.setResult);
  const complete = useUserStore((state) => state.complete);
  const editing = modal === "edit";
  const open = modal === "create" || editing;

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const input = editing ? { id: selected?.id ?? "", ...form } : form;
    const parsed = editing ? updateUserSchema.safeParse(input) : createUserSchema.safeParse(input);
    if (!parsed.success) {
      setResult({ success: false, message: "Revisa los campos marcados.", fieldErrors: parsed.error.flatten().fieldErrors });
      return;
    }
    setPending(true);
    try {
      const actionResult = editing ? await updateUserAction({ id: selected?.id ?? "", ...form }) : await createUserAction(form);
      if (!actionResult.success) setResult(actionResult);
      else { complete(actionResult); router.refresh(); }
    } catch {
      setResult({ success: false, message: "No fue posible guardar el usuario. Comprueba la conexión." });
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && !pending && close()}
      title={editing ? "Editar usuario" : "Crear usuario"}
      description={editing ? "La contraseña sólo cambiará si completas ambos campos." : "La cuenta quedará activa inmediatamente."}
      variant="form"
      size="lg"
      closeOnOverlay={!pending}
      footer={<><Button variant="ghost" leftIcon={<LuX />} disabled={pending} onClick={close}>Cancelar</Button><Button type="submit" form={FORM_ID} leftIcon={<LuSave />} loading={pending} loadingText="Guardando...">{editing ? "Guardar cambios" : "Crear usuario"}</Button></>}
    >
      <form id={FORM_ID} onSubmit={submit} className="space-y-4">
        {result && !result.success && <FormFeedback tone="error" variant="soft">{result.message}</FormFeedback>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nombre completo" value={form.name} required autoFocus maxLength={100} placeholder="Ej. María López" error={result?.fieldErrors?.name?.[0]} onChange={(event) => updateForm({ name: event.target.value })} />
          <Input label="Username" value={form.username} required maxLength={30} autoComplete="off" placeholder="maria.lopez" error={result?.fieldErrors?.username?.[0]} onChange={(event) => updateForm({ username: event.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input type="email" label="Correo electrónico" value={form.email} required maxLength={254} autoComplete="off" placeholder="maria@ejemplo.com" error={result?.fieldErrors?.email?.[0]} onChange={(event) => updateForm({ email: event.target.value })} />
          <NativeSelect label="Rol" value={form.role} required options={roleOptions} disabled={editing && selected?.id === currentUserId} description={editing && selected?.id === currentUserId ? "No puedes modificar tu propio rol administrativo." : "Define los permisos principales de la cuenta."} error={result?.fieldErrors?.role?.[0]} onChange={(event) => updateForm({ role: event.target.value as typeof form.role })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordInput label={editing ? "Nueva contraseña" : "Contraseña"} value={form.password} required={!editing} autoComplete="new-password" placeholder={editing ? "Déjala vacía para conservarla" : "Mínimo 8 caracteres"} error={result?.fieldErrors?.password?.[0]} onChange={(event) => updateForm({ password: event.target.value })} />
          <PasswordInput label="Confirmar contraseña" value={form.confirmPassword} required={!editing || Boolean(form.password)} autoComplete="new-password" placeholder="Repite la contraseña" error={result?.fieldErrors?.confirmPassword?.[0]} onChange={(event) => updateForm({ confirmPassword: event.target.value })} />
        </div>
        <p className="text-xs leading-5 text-muted">La contraseña debe incluir mayúscula, minúscula, número y símbolo.</p>
      </form>
    </Modal>
  );
}

