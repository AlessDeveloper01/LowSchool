"use client";

import { useRouter } from "next/navigation";
import { LuPower, LuPowerOff, LuX } from "react-icons/lu";

import { Modal } from "@/components/feedback/modal";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import { setUserStatusAction } from "@/features/users/actions/user-actions";
import { useUserStore } from "@/features/users/store/userStore";

export function UserStatusModal() {
  const router = useRouter();
  const modal = useUserStore((state) => state.modal);
  const selected = useUserStore((state) => state.selected);
  const pending = useUserStore((state) => state.pending);
  const result = useUserStore((state) => state.result);
  const close = useUserStore((state) => state.closeModal);
  const setPending = useUserStore((state) => state.setPending);
  const setResult = useUserStore((state) => state.setResult);
  const complete = useUserStore((state) => state.complete);
  const activating = modal === "activate";
  const open = activating || modal === "deactivate";

  async function confirm(): Promise<void> {
    if (!selected) return;
    setPending(true);
    try {
      const actionResult = await setUserStatusAction({ id: selected.id, isActive: activating });
      if (!actionResult.success) setResult(actionResult);
      else { complete(actionResult); router.refresh(); }
    } catch {
      setResult({ success: false, message: "No fue posible actualizar el estado del usuario." });
    } finally {
      setPending(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={(nextOpen) => !nextOpen && !pending && close()} title={activating ? "Activar usuario" : "Desactivar usuario"} description={activating ? "El usuario podrá iniciar sesión nuevamente." : "La sesión dejará de ser válida en la siguiente solicitud al servidor."} variant={activating ? "centered" : "destructive"} size="sm" closeOnOverlay={!pending} footer={<><Button variant="ghost" leftIcon={<LuX />} disabled={pending} onClick={close}>Cancelar</Button><Button variant={activating ? "primary" : "danger"} leftIcon={activating ? <LuPower /> : <LuPowerOff />} loading={pending} onClick={() => void confirm()}>{activating ? "Activar" : "Desactivar"}</Button></>}>
      <div className="space-y-4">{result && !result.success && <FormFeedback tone="error" variant="soft">{result.message}</FormFeedback>}<p className="text-sm leading-6 text-muted">{activating ? "Se activará" : "Se desactivará"} <strong className="text-foreground">{selected?.name}</strong>.</p></div>
    </Modal>
  );
}

