"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LuBookOpen,
  LuPencil,
  LuPlus,
  LuSearch,
  LuSave,
  LuTrash2,
  LuX,
} from "react-icons/lu";

import { Modal } from "@/components/feedback/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/data-display/table";
import { TableActions } from "@/components/data-display/table-actions";
import { Input } from "@/components/forms/input";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import {
  createSubjectAction,
  deleteSubjectAction,
  updateSubjectAction,
  type ManagedSubject,
  type SubjectActionResult,
} from "@/features/subjects/subjects";

const FORM_ID = "subject-form";

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function SubjectsManager({ subjects }: { subjects: ManagedSubject[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"form" | "delete" | null>(null);
  const [selected, setSelected] = useState<ManagedSubject | null>(null);
  const [nombre, setNombre] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SubjectActionResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return subjects.filter(
      (subject) => !term || normalize(subject.nombre).includes(term),
    );
  }, [search, subjects]);

  function openCreate(): void {
    setSelected(null);
    setNombre("");
    setResult(null);
    setModal("form");
  }

  function openEdit(subject: ManagedSubject): void {
    setSelected(subject);
    setNombre(subject.nombre);
    setResult(null);
    setModal("form");
  }

  function openDelete(subject: ManagedSubject): void {
    setSelected(subject);
    setResult(null);
    setModal("delete");
  }

  function closeModal(): void {
    if (pending) return;
    setModal(null);
    setSelected(null);
    setResult(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setPending(true);
    setResult(null);

    try {
      const actionResult = selected
        ? await updateSubjectAction({ id: selected.id, nombre })
        : await createSubjectAction({ nombre });

      if (!actionResult.success) {
        setResult(actionResult);
        return;
      }

      setNotice(actionResult.message);
      closeModal();
      router.refresh();
    } catch {
      setResult({
        success: false,
        message: "No fue posible guardar la materia. Comprueba la conexión.",
      });
    } finally {
      setPending(false);
    }
  }

  async function confirmDelete(): Promise<void> {
    if (!selected) return;
    setPending(true);
    setResult(null);

    try {
      const actionResult = await deleteSubjectAction({ id: selected.id });
      if (!actionResult.success) {
        setResult(actionResult);
        return;
      }

      setNotice(actionResult.message);
      closeModal();
      router.refresh();
    } catch {
      setResult({
        success: false,
        message: "No fue posible eliminar la materia. Comprueba la conexión.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">
              Catálogo académico
            </p>
            <h1 className="mt-2 text-3xl font-black text-foreground">Materias</h1>
            <p className="mt-2 text-sm text-muted">
              Registra las materias que utilizarás en tus grupos.
            </p>
          </div>
          <Button leftIcon={<LuPlus />} onClick={openCreate}>
            Nueva materia
          </Button>
        </header>

        {notice && (
          <div className="flex items-start gap-3 rounded-xl bg-success/10 p-3 text-success">
            <FormFeedback tone="success" className="min-w-0 flex-1">
              {notice}
            </FormFeedback>
            <button
              type="button"
              aria-label="Cerrar mensaje"
              className="grid size-8 place-items-center rounded-lg hover:bg-success/10"
              onClick={() => setNotice(null)}
            >
              <LuX />
            </button>
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-2">
          <Summary label="Materias registradas" value={subjects.length} icon={<LuBookOpen />} />
          <Summary
            label="Asignaciones a grupos"
            value={subjects.reduce((total, subject) => total + subject.groupsCount, 0)}
            icon={<LuBookOpen />}
            tone="secondary"
          />
        </section>

        <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-foreground/5 sm:p-5">
          <div className="mb-4">
            <Input
              aria-label="Buscar materias"
              value={search}
              leftIcon={<LuSearch />}
              placeholder="Buscar materia..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Table variant="hoverable">
            <TableHeader>
              <TableRow>
                <TableHead>Materia</TableHead>
                <TableHead>Grupos asignados</TableHead>
                <TableHead align="end">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmpty
                  colSpan={3}
                  message={
                    subjects.length === 0
                      ? "Todavía no hay materias registradas."
                      : "No hay materias que coincidan con la búsqueda."
                  }
                />
              ) : (
                filtered.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <LuBookOpen />
                        </span>
                        <p className="font-extrabold text-foreground">{subject.nombre}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{subject.groupsCount}</TableCell>
                    <TableCell align="end">
                      <TableActions
                        variant="dropdown"
                        actions={[
                          {
                            id: "edit",
                            label: "Editar",
                            icon: <LuPencil />,
                            onSelect: () => openEdit(subject),
                          },
                          {
                            id: "delete",
                            label: "Eliminar",
                            icon: <LuTrash2 />,
                            destructive: true,
                            disabled: subject.groupsCount > 0,
                            onSelect: () => openDelete(subject),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <p className="mt-4 text-xs text-muted">
            Mostrando {filtered.length} de {subjects.length} materias.
          </p>
        </section>
      </div>

      <Modal
        open={modal === "form"}
        onOpenChange={(open) => !open && closeModal()}
        title={selected ? "Editar materia" : "Nueva materia"}
        description="Escribe el nombre de la materia."
        variant="form"
        size="sm"
        closeOnOverlay={!pending}
        footer={
          <>
            <Button variant="ghost" leftIcon={<LuX />} disabled={pending} onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form={FORM_ID}
              leftIcon={<LuSave />}
              loading={pending}
              loadingText="Guardando..."
            >
              {selected ? "Guardar cambios" : "Crear materia"}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} onSubmit={submit} className="space-y-4">
          {result && !result.success && (
            <FormFeedback tone="error" variant="soft">
              {result.message}
            </FormFeedback>
          )}
          <Input
            label="Nombre de la materia"
            value={nombre}
            required
            autoFocus
            maxLength={100}
            placeholder="Ej. Matemáticas"
            error={result?.fieldErrors?.nombre?.[0]}
            onChange={(event) => setNombre(event.target.value)}
          />
        </form>
      </Modal>

      <Modal
        open={modal === "delete"}
        onOpenChange={(open) => !open && closeModal()}
        title="Eliminar materia"
        description="Esta acción no se puede deshacer."
        variant="destructive"
        size="sm"
        closeOnOverlay={!pending}
        footer={
          <>
            <Button variant="ghost" leftIcon={<LuX />} disabled={pending} onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="danger" leftIcon={<LuTrash2 />} loading={pending} onClick={() => void confirmDelete()}>
              Eliminar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {result && !result.success && (
            <FormFeedback tone="error" variant="soft">
              {result.message}
            </FormFeedback>
          )}
          <p className="text-sm leading-6 text-muted">
            Se eliminará la materia <strong className="text-foreground">{selected?.nombre}</strong>.
          </p>
        </div>
      </Modal>
    </>
  );
}

function Summary({
  label,
  value,
  icon,
  tone = "primary",
}: {
  label: string;
  value: number;
  icon: ReactNode;
  tone?: "primary" | "secondary";
}) {
  const style = tone === "secondary" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary";
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
      <span className={`grid size-10 place-items-center rounded-xl ${style}`}>{icon}</span>
      <div>
        <p className="text-xs font-bold text-muted">{label}</p>
        <p className="text-2xl font-black text-foreground">{value}</p>
      </div>
    </div>
  );
}