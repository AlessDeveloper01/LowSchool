"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LuGraduationCap,
  LuLayers3,
  LuPencil,
  LuPlus,
  LuSave,
  LuSearch,
  LuTrash2,
  LuUsers,
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
import { NativeSelect } from "@/components/forms/select";
import { Badge } from "@/components/data-display/badge";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import {
  createGroupAction,
  deleteGroupAction,
  promoteGroupAction,
  updateGroupAction,
  type GroupActionResult,
  type GroupOptions,
  type ManagedGroup,
} from "@/features/groups/groups";

const FORM_ID = "group-form";
const PROMOTE_FORM_ID = "promote-group-form";
const gradeOptions = [
  { value: "1", label: "1° grado" },
  { value: "2", label: "2° grado" },
  { value: "3", label: "3° grado" },
];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function GroupsManager({
  groups,
  options,
}: {
  groups: ManagedGroup[];
  options: GroupOptions;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"form" | "delete" | "promote" | null>(null);
  const [selected, setSelected] = useState<ManagedGroup | null>(null);
  const [cicloEscolarId, setCicloEscolarId] = useState(
    options.schoolYears.find((schoolYear) => schoolYear.activo)?.id ??
      options.schoolYears[0]?.id ??
      "",
  );
  const [grado, setGrado] = useState("1");
  const [letra, setLetra] = useState("A");
  const [materias, setMaterias] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<GroupActionResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [targetCicloEscolarId, setTargetCicloEscolarId] = useState("");
  const [targetGrado, setTargetGrado] = useState("2");
  const [targetLetra, setTargetLetra] = useState("A");

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return groups.filter((group) => {
      if (!term) return true;
      const searchable = [
        `${group.grado}${group.letra}`,
        `${group.grado} ${group.letra}`,
        group.cicloEscolar.nombre,
        ...group.materias.map((materia) => materia.nombre),
      ];
      return searchable.some((value) => normalize(value).includes(term));
    });
  }, [groups, search]);

  function resetForm(): void {
    setSelected(null);
    setCicloEscolarId(
      options.schoolYears.find((schoolYear) => schoolYear.activo)?.id ??
        options.schoolYears[0]?.id ??
        "",
    );
    setGrado("1");
    setLetra("A");
    setMaterias([]);
    setResult(null);
  }

  function openCreate(): void {
    resetForm();
    setModal("form");
  }

  function openEdit(group: ManagedGroup): void {
    setSelected(group);
    setCicloEscolarId(group.cicloEscolar.id);
    setGrado(String(group.grado));
    setLetra(group.letra);
    setMaterias(group.materias.map((materia) => materia.materiaId));
    setResult(null);
    setModal("form");
  }

  function openDelete(group: ManagedGroup): void {
    setSelected(group);
    setResult(null);
    setModal("delete");
  }

  function openPromote(group: ManagedGroup): void {
    setSelected(group);
    setTargetCicloEscolarId(
      options.schoolYears.find((schoolYear) => schoolYear.activo)?.id ??
        options.schoolYears[0]?.id ??
        "",
    );
    setTargetGrado(String(Math.min(group.grado + 1, 3)));
    setTargetLetra(group.letra);
    setResult(null);
    setModal("promote");
  }

  function closeModal(): void {
    if (pending) return;
    setModal(null);
    resetForm();
  }

  function toggleSubject(subjectId: string): void {
    setMaterias((current) =>
      current.includes(subjectId)
        ? current.filter((id) => id !== subjectId)
        : [...current, subjectId],
    );
    setResult(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setPending(true);
    setResult(null);

    try {
      const input = { cicloEscolarId, grado: Number(grado), letra, materias };
      const actionResult = selected
        ? await updateGroupAction({ id: selected.id, ...input })
        : await createGroupAction(input);

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
        message: "No fue posible guardar el grupo. Comprueba la conexión.",
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
      const actionResult = await deleteGroupAction({ id: selected.id });
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
        message: "No fue posible eliminar el grupo. Comprueba la conexión.",
      });
    } finally {
      setPending(false);
    }
  }

  async function submitPromotion(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!selected) return;
    setPending(true);
    setResult(null);

    try {
      const actionResult = await promoteGroupAction({
        sourceGroupId: selected.id,
        targetCicloEscolarId,
        targetGrado: Number(targetGrado),
        targetLetra,
      });
      if (!actionResult.success) {
        setResult(actionResult);
        return;
      }

      setNotice(actionResult.message);
      closeModal();
      router.refresh();
    } catch {
      setResult({ success: false, message: "No fue posible promover a los alumnos. Comprueba la conexión." });
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
              Organización académica
            </p>
            <h1 className="mt-2 text-3xl font-black text-foreground">Grupos</h1>
            <p className="mt-2 text-sm text-muted">
              Crea grupos por ciclo, grado, letra y materias asignadas.
            </p>
          </div>
          <Button leftIcon={<LuPlus />} onClick={openCreate}>
            Nuevo grupo
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

        <section className="grid gap-3 sm:grid-cols-3">
          <Summary label="Grupos registrados" value={groups.length} icon={<LuLayers3 />} />
          <Summary
            label="Alumnos inscritos"
            value={groups.reduce((total, group) => total + group.studentsCount, 0)}
            icon={<LuUsers />}
            tone="secondary"
          />
          <Summary
            label="Materias asignadas"
            value={groups.reduce((total, group) => total + group.materias.length, 0)}
            icon={<LuBookIcon />}
            tone="success"
          />
        </section>

        <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-foreground/5 sm:p-5">
          <div className="mb-4">
            <Input
              aria-label="Buscar grupos"
              value={search}
              leftIcon={<LuSearch />}
              placeholder="Buscar por grupo, ciclo o materia..."
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Table variant="hoverable">
            <TableHeader>
              <TableRow>
                <TableHead>Grupo</TableHead>
                <TableHead>Ciclo escolar</TableHead>
                <TableHead>Materias</TableHead>
                <TableHead>Alumnos</TableHead>
                <TableHead align="end">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmpty
                  colSpan={5}
                  message={
                    groups.length === 0
                      ? "Todavía no hay grupos registrados."
                      : "No hay grupos que coincidan con la búsqueda."
                  }
                />
              ) : (
                filtered.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <LuGraduationCap />
                        </span>
                        <div>
                          <p className="font-extrabold text-foreground">
                            {group.grado}° {group.letra}
                          </p>
                          {group.cicloEscolar.activo && (
                            <Badge variant="soft" className="mt-1">
                              Ciclo actual
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{group.cicloEscolar.nombre}</TableCell>
                    <TableCell>
                      <span className="font-bold">{group.materias.length}</span>
                      {group.materias.length > 0 && (
                        <p className="mt-1 max-w-xs truncate text-xs text-muted">
                          {group.materias.map((materia) => materia.nombre).join(", ")}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="font-bold">{group.studentsCount}</TableCell>
                    <TableCell align="end">
                      <TableActions
                        variant="dropdown"
                        actions={[
                          {
                            id: "edit",
                            label: "Editar",
                            icon: <LuPencil />,
                            onSelect: () => openEdit(group),
                          },
                          {
                            id: "promote",
                            label: "Promover alumnos",
                            icon: <LuGraduationCap />,
                            disabled: group.studentsCount === 0,
                            onSelect: () => openPromote(group),
                          },
                          {
                            id: "delete",
                            label: "Eliminar",
                            icon: <LuTrash2 />,
                            destructive: true,
                            disabled: group.studentsCount > 0 || group.hasAcademicRecords,
                            onSelect: () => openDelete(group),
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
            Mostrando {filtered.length} de {groups.length} grupos.
          </p>
        </section>
      </div>

      <Modal
        open={modal === "form"}
        onOpenChange={(open) => !open && closeModal()}
        title={selected ? "Editar grupo" : "Nuevo grupo"}
        description="Selecciona el ciclo, grado, letra y materias del grupo."
        variant="form"
        size="lg"
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
              {selected ? "Guardar cambios" : "Crear grupo"}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} onSubmit={submit} className="space-y-5">
          {result && !result.success && (
            <FormFeedback tone="error" variant="soft">
              {result.message}
            </FormFeedback>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            <NativeSelect
              label="Ciclo escolar"
              value={cicloEscolarId}
              required
              options={options.schoolYears.map((schoolYear) => ({
                value: schoolYear.id,
                label: `${schoolYear.nombre}${schoolYear.activo ? " · Activo" : ""}`,
              }))}
              error={result?.fieldErrors?.cicloEscolarId?.[0]}
              onChange={(event) => setCicloEscolarId(event.target.value)}
            />
            <NativeSelect
              label="Grado"
              value={grado}
              required
              options={gradeOptions}
              error={result?.fieldErrors?.grado?.[0]}
              onChange={(event) => setGrado(event.target.value)}
            />
            <Input
              label="Letra"
              value={letra}
              required
              maxLength={1}
              placeholder="A"
              error={result?.fieldErrors?.letra?.[0]}
              onChange={(event) => setLetra(event.target.value.toUpperCase())}
            />
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold text-foreground">Materias del grupo</p>
                <p className="mt-1 text-xs text-muted">Puedes asignarlas ahora o después.</p>
              </div>
              <span className="text-xs font-bold text-muted">{materias.length} seleccionadas</span>
            </div>
            {options.subjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
                Primero registra materias en el catálogo de materias.
              </div>
            ) : (
              <div className="grid max-h-56 gap-2 overflow-y-auto rounded-xl border border-border p-3 sm:grid-cols-2">
                {options.subjects.map((subject) => (
                  <label
                    key={subject.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-semibold hover:border-primary/20 hover:bg-primary/5"
                  >
                    <input
                      type="checkbox"
                      checked={materias.includes(subject.id)}
                      onChange={() => toggleSubject(subject.id)}
                      className="size-4 accent-(--color-primary)"
                    />
                    <span>{subject.nombre}</span>
                  </label>
                ))}
              </div>
            )}
            {result?.fieldErrors?.materias?.[0] && (
              <p className="mt-1.5 text-xs text-danger">{result.fieldErrors.materias[0]}</p>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        open={modal === "promote"}
        onOpenChange={(open) => !open && closeModal()}
        title="Promover alumnos"
        description="Crea o reutiliza el grupo destino, copia sus materias y registra a todos sus alumnos. No se copian calificaciones ni asistencias."
        variant="form"
        size="md"
        closeOnOverlay={!pending}
        footer={
          <>
            <Button variant="ghost" leftIcon={<LuX />} disabled={pending} onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" form={PROMOTE_FORM_ID} leftIcon={<LuGraduationCap />} loading={pending} loadingText="Promoviendo...">
              Promover alumnos
            </Button>
          </>
        }
      >
        <form id={PROMOTE_FORM_ID} onSubmit={submitPromotion} className="space-y-5">
          {result && !result.success && <FormFeedback tone="error" variant="soft">{result.message}</FormFeedback>}
          <div className="rounded-xl bg-primary/5 p-4 text-sm text-muted">
            Se moverán <strong className="text-foreground">{selected?.studentsCount ?? 0} alumnos</strong> de <strong className="text-foreground">{selected ? `${selected.grado}° ${selected.letra}` : "—"}</strong> al grupo destino.
          </div>
          <NativeSelect
            label="Ciclo escolar destino"
            value={targetCicloEscolarId}
            required
            options={options.schoolYears.map((schoolYear) => ({ value: schoolYear.id, label: `${schoolYear.nombre}${schoolYear.activo ? " · Activo" : ""}` }))}
            error={result?.fieldErrors?.cicloEscolarId?.[0]}
            onChange={(event) => setTargetCicloEscolarId(event.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <NativeSelect
              label="Grado destino"
              value={targetGrado}
              required
              options={gradeOptions}
              error={result?.fieldErrors?.targetGrado?.[0]}
              onChange={(event) => setTargetGrado(event.target.value)}
            />
            <Input
              label="Letra destino"
              value={targetLetra}
              required
              maxLength={1}
              placeholder="A"
              error={result?.fieldErrors?.targetLetra?.[0]}
              onChange={(event) => setTargetLetra(event.target.value.toUpperCase())}
            />
          </div>
          <p className="text-xs text-muted">Si el grupo destino ya existe, se conservará y sólo se agregarán las materias y alumnos que aún no tenga.</p>
        </form>
      </Modal>

      <Modal
        open={modal === "delete"}
        onOpenChange={(open) => !open && closeModal()}
        title="Eliminar grupo"
        description="Esta acción no se puede deshacer."
        variant="destructive"
        size="sm"
        closeOnOverlay={!pending}
        footer={
          <>
            <Button variant="ghost" leftIcon={<LuX />} disabled={pending} onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              leftIcon={<LuTrash2 />}
              loading={pending}
              onClick={() => void confirmDelete()}
            >
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
            Se eliminará el grupo{" "}
            <strong className="text-foreground">
              {selected ? `${selected.grado}° ${selected.letra} · ${selected.cicloEscolar.nombre}` : "seleccionado"}
            </strong>
            . Sólo es posible si no tiene alumnos, calificaciones ni asistencias.
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
  tone?: "primary" | "secondary" | "success";
}) {
  const style =
    tone === "secondary"
      ? "bg-secondary/10 text-secondary"
      : tone === "success"
        ? "bg-success/10 text-success"
        : "bg-primary/10 text-primary";

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

function LuBookIcon() {
  return <LuLayers3 />;
}