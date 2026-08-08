"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
  LuDownload,
  LuFileSpreadsheet,
  LuGraduationCap,
  LuPencil,
  LuPlus,
  LuSave,
  LuSearch,
  LuTrash2,
  LuUpload,
  LuUsers,
  LuX,
} from "react-icons/lu";

import { Modal } from "@/components/feedback/modal";
import { Badge } from "@/components/data-display/badge";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "@/components/data-display/table";
import { TableActions } from "@/components/data-display/table-actions";
import { Input } from "@/components/forms/input";
import { NativeSelect } from "@/components/forms/select";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import { createStudentAction, deleteStudentAction, importStudentsAction, updateStudentAction } from "@/features/students/actions/student-actions";
import type { ManagedStudent, StudentActionResult, StudentImportMapping, StudentImportPreview, StudentImportRow, StudentOptions, StudentFormInput } from "@/features/students/types/student.types";

const FORM_ID = "student-form";
const importFields: Array<{ key: keyof StudentImportMapping; label: string; required?: boolean }> = [
  { key: "nombre", label: "Nombre", required: true },
  { key: "apellidos", label: "Apellidos", required: true },
  { key: "matricula", label: "Matrícula", required: true },
  { key: "sexo", label: "Sexo" },
  { key: "tecnologia", label: "Tecnología" },
  { key: "direccion", label: "Dirección" },
  { key: "curp", label: "CURP" },
  { key: "fechaNacimiento", label: "Fecha de nacimiento" },
  { key: "telefonoResponsable", label: "Teléfono responsable" },
  { key: "nombreResponsable", label: "Nombre responsable" },
  { key: "grupoId", label: "Grupo" },
  { key: "repetidor", label: "Repetidor" },
];

const emptyMapping: StudentImportMapping = {
  nombre: "", apellidos: "", matricula: "", sexo: "", tecnologia: "", direccion: "", curp: "", fechaNacimiento: "", telefonoResponsable: "", nombreResponsable: "", grupoId: "", repetidor: "",
};

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function emptyForm(options: StudentOptions): StudentFormInput {
  return { nombre: "", apellidos: "", matricula: "", sexo: "", tecnologia: "", direccion: "", curp: "", fechaNacimiento: "", telefonoResponsable: "", nombreResponsable: "", grupoId: options.groups.find((group) => group.active)?.id ?? options.groups[0]?.id ?? "", repetidor: false };
}

function cellText(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value === null || value === undefined ? "" : String(value).trim();
}

function parseBoolean(value: string): boolean {
  return ["true", "1", "si", "sí", "yes", "x"].includes(normalize(value));
}

function dateForInput(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
}

export function StudentsManager({ students, options }: { students: ManagedStudent[]; options: StudentOptions }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"form" | "delete" | "import" | null>(null);
  const [selected, setSelected] = useState<ManagedStudent | null>(null);
  const [form, setForm] = useState<StudentFormInput>(() => emptyForm(options));
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<StudentActionResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState<StudentImportPreview | null>(null);
  const [mapping, setMapping] = useState<StudentImportMapping>(emptyMapping);
  const [importResult, setImportResult] = useState<{ message: string; errors?: Array<{ rowNumber: number; message: string }> } | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return students.filter((student) => !term || [student.nombre, student.apellidos, student.matricula, student.curp ?? "", student.groups.map((group) => `${group.groupLabel} ${group.schoolYear}`).join(" ")].some((value) => normalize(value).includes(term)));
  }, [search, students]);

  function openCreate(): void { setSelected(null); setForm(emptyForm(options)); setResult(null); setModal("form"); }
  function openEdit(student: ManagedStudent): void {
    const group = student.groups[0];
    setSelected(student);
    setForm({ nombre: student.nombre, apellidos: student.apellidos, matricula: student.matricula, sexo: student.sexo ?? "", tecnologia: student.tecnologia ?? "", direccion: student.direccion ?? "", curp: student.curp ?? "", fechaNacimiento: student.fechaNacimiento ? dateForInput(student.fechaNacimiento) : "", telefonoResponsable: student.telefonoResponsable ?? "", nombreResponsable: student.nombreResponsable ?? "", grupoId: group?.groupId ?? "", repetidor: group?.repetidor ?? false });
    setResult(null); setModal("form");
  }
  function closeModal(): void { if (pending) return; setModal(null); setSelected(null); setResult(null); setPreview(null); setImportResult(null); }
  function updateForm(input: Partial<StudentFormInput>): void { setForm((current) => ({ ...current, ...input })); setResult(null); }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault(); setPending(true); setResult(null);
    try {
      const actionResult = selected ? await updateStudentAction({ id: selected.id, ...form }) : await createStudentAction(form);
      if (!actionResult.success) { setResult(actionResult); return; }
      setNotice(actionResult.message); closeModal(); router.refresh();
    } catch { setResult({ success: false, message: "No fue posible guardar el alumno." }); }
    finally { setPending(false); }
  }

  async function confirmDelete(): Promise<void> {
    if (!selected) return; setPending(true); setResult(null);
    try { const actionResult = await deleteStudentAction({ id: selected.id }); if (!actionResult.success) { setResult(actionResult); return; } setNotice(actionResult.message); closeModal(); router.refresh(); }
    catch { setResult({ success: false, message: "No fue posible eliminar el alumno." }); }
    finally { setPending(false); }
  }

  function openImport(): void { setPreview(null); setMapping(emptyMapping); setImportResult(null); setModal("import"); }

  async function readWorkbook(event: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const headers = records.length > 0 ? Object.keys(records[0]) : [];
      setPreview({ headers, rows: records.slice(0, 8).map((record) => Object.fromEntries(headers.map((header) => [header, cellText(record[header])]))) });
      setMapping((current) => ({ ...current, ...Object.fromEntries(importFields.map((field) => [field.key, headers.find((header) => normalize(header).includes(normalize(field.label))) ?? current[field.key]])) }));
      setImportResult(null);
    } catch { setImportResult({ message: "No se pudo leer el archivo. Usa XLSX, XLS o CSV." }); }
  }

  async function importRows(): Promise<void> {
    if (!preview) return;
    const requiredMissing = importFields.filter((field) => field.required && !mapping[field.key]).map((field) => field.label);
    if (requiredMissing.length > 0) { setImportResult({ message: `Asigna estas columnas obligatorias: ${requiredMissing.join(", ")}.` }); return; }
    setPending(true); setImportResult(null);
    try {
      const file = inputRef.current?.files?.[0];
      if (!file) return;
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
      const rows: StudentImportRow[] = records.map((record, index) => ({ rowNumber: index + 2, nombre: cellText(record[mapping.nombre]), apellidos: cellText(record[mapping.apellidos]), matricula: cellText(record[mapping.matricula]), sexo: cellText(record[mapping.sexo]).toUpperCase() === "H" ? "H" : cellText(record[mapping.sexo]).toUpperCase() === "M" ? "M" : "", tecnologia: cellText(record[mapping.tecnologia]), direccion: cellText(record[mapping.direccion]), curp: cellText(record[mapping.curp]), fechaNacimiento: cellText(record[mapping.fechaNacimiento]), telefonoResponsable: cellText(record[mapping.telefonoResponsable]), nombreResponsable: cellText(record[mapping.nombreResponsable]), grupoId: cellText(record[mapping.grupoId]), repetidor: parseBoolean(cellText(record[mapping.repetidor])) }));
      const actionResult = await importStudentsAction({ rows });
      setImportResult({ message: actionResult.message, errors: actionResult.errors });
      if (actionResult.success) { setNotice(actionResult.message); closeModal(); router.refresh(); }
    } catch { setImportResult({ message: "No fue posible importar las filas." }); }
    finally { setPending(false); }
  }

  function downloadTemplate(): void {
    const worksheet = XLSX.utils.aoa_to_sheet([["nombre", "apellidos", "matricula", "sexo", "tecnologia", "direccion", "curp", "fechaNacimiento", "telefonoResponsable", "nombreResponsable", "grupoId", "repetidor"], ["Ana", "López", "MAT-001", "M", "Diseño de software", "Calle 1", "", "2010-05-10", "5550000000", "María López", options.groups[0]?.id ?? "", "no"]]);
    const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, "Alumnos"); XLSX.writeFile(workbook, "plantilla-alumnos.xlsx");
  }

  return <>
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">Control académico</p><h1 className="mt-2 text-3xl font-black text-foreground">Alumnos</h1><p className="mt-2 text-sm text-muted">Administra alumnos, responsables, matrícula e inscripción a grupos.</p></div><div className="flex flex-col gap-2 sm:flex-row"><Button variant="secondary" leftIcon={<LuUpload />} onClick={openImport}>Cargar Excel</Button><Button leftIcon={<LuPlus />} onClick={openCreate}>Nuevo alumno</Button></div></header>
      {notice && <div className="flex items-start gap-3 rounded-xl bg-success/10 p-3 text-success"><FormFeedback tone="success" className="min-w-0 flex-1">{notice}</FormFeedback><button type="button" aria-label="Cerrar mensaje" className="grid size-8 place-items-center rounded-lg hover:bg-success/10" onClick={() => setNotice(null)}><LuX /></button></div>}
      <section className="grid gap-3 sm:grid-cols-3"><Summary label="Alumnos registrados" value={students.length} icon={<LuUsers />} /><Summary label="Con grupo" value={students.filter((student) => student.groups.length > 0).length} icon={<LuGraduationCap />} tone="secondary" /><Summary label="Grupos disponibles" value={options.groups.length} icon={<LuGraduationCap />} tone="success" /></section>
      <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-foreground/5 sm:p-5"><div className="mb-4"><Input aria-label="Buscar alumnos" value={search} leftIcon={<LuSearch />} placeholder="Buscar por nombre, matrícula, CURP o grupo..." onChange={(event) => setSearch(event.target.value)} /></div><Table variant="hoverable"><TableHeader><TableRow><TableHead>Alumno</TableHead><TableHead>Matrícula</TableHead><TableHead>Sexo / edad</TableHead><TableHead>Grupo</TableHead><TableHead>Tecnología</TableHead><TableHead align="end">Acciones</TableHead></TableRow></TableHeader><TableBody>{filtered.length === 0 ? <TableEmpty colSpan={6} message={students.length === 0 ? "Todavía no hay alumnos registrados." : "No hay alumnos que coincidan con la búsqueda."} /> : filtered.map((student) => <TableRow key={student.id}><TableCell><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 font-black text-primary">{student.nombre.charAt(0).toUpperCase()}</span><div><p className="font-extrabold text-foreground">{student.apellidos}, {student.nombre}</p><p className="text-xs text-muted">{student.nombreResponsable || "Sin responsable registrado"}</p></div></div></TableCell><TableCell className="font-bold">{student.matricula}</TableCell><TableCell>{student.sexo ? <Badge variant="outline">{student.sexo === "M" ? "Mujer" : "Hombre"}</Badge> : <Badge variant="outline">Sin sexo</Badge>}<p className="mt-1 text-xs text-muted">{student.edad === null ? "Edad no disponible" : `${student.edad} años`}</p></TableCell><TableCell>{student.groups[0] ? <><p className="font-semibold">{student.groups[0].groupLabel}</p><p className="text-xs text-muted">{student.groups[0].schoolYear}</p></> : <Badge variant="outline">Sin grupo</Badge>}</TableCell><TableCell className="text-sm text-muted">{student.tecnologia || "—"}</TableCell><TableCell align="end"><TableActions variant="dropdown" actions={[{ id: "edit", label: "Editar", icon: <LuPencil />, onSelect: () => openEdit(student) }, { id: "delete", label: "Eliminar", icon: <LuTrash2 />, destructive: true, disabled: student.groups.length > 0, onSelect: () => { setSelected(student); setResult(null); setModal("delete"); } }]} /></TableCell></TableRow>)}</TableBody></Table><p className="mt-4 text-xs text-muted">Mostrando {filtered.length} de {students.length} alumnos.</p></section>
    </div>

    <Modal open={modal === "form"} onOpenChange={(open) => !open && closeModal()} title={selected ? "Editar alumno" : "Nuevo alumno"} description="La fecha y el sexo se completan desde la CURP si los dejas vacíos." variant="form" size="xl" closeOnOverlay={!pending} footer={<><Button variant="ghost" leftIcon={<LuX />} disabled={pending} onClick={closeModal}>Cancelar</Button><Button type="submit" form={FORM_ID} leftIcon={<LuSave />} loading={pending} loadingText="Guardando...">{selected ? "Guardar cambios" : "Crear alumno"}</Button></>}><form id={FORM_ID} onSubmit={submit} className="space-y-5">{result && !result.success && <FormFeedback tone="error" variant="soft">{result.message}</FormFeedback>}<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Input label="Nombre" value={form.nombre} required maxLength={100} error={result?.fieldErrors?.nombre?.[0]} onChange={(event) => updateForm({ nombre: event.target.value })} /><Input label="Apellidos" value={form.apellidos} required maxLength={150} error={result?.fieldErrors?.apellidos?.[0]} onChange={(event) => updateForm({ apellidos: event.target.value })} /><Input label="Matrícula" value={form.matricula} required maxLength={40} error={result?.fieldErrors?.matricula?.[0]} onChange={(event) => updateForm({ matricula: event.target.value })} /><NativeSelect label="Sexo" value={form.sexo} options={[{ value: "", label: "Inferir desde CURP" }, { value: "M", label: "Mujer" }, { value: "H", label: "Hombre" }]} error={result?.fieldErrors?.sexo?.[0]} onChange={(event) => updateForm({ sexo: event.target.value as StudentFormInput["sexo"] })} /><Input label="CURP" value={form.curp} maxLength={18} error={result?.fieldErrors?.curp?.[0]} onChange={(event) => updateForm({ curp: event.target.value.toUpperCase() })} /><Input type="date" label="Fecha de nacimiento" value={form.fechaNacimiento} error={result?.fieldErrors?.fechaNacimiento?.[0]} onChange={(event) => updateForm({ fechaNacimiento: event.target.value })} /><Input label="Tecnología" value={form.tecnologia} maxLength={100} placeholder="Ej. Diseño de software" onChange={(event) => updateForm({ tecnologia: event.target.value })} /><Input label="Nombre del responsable" value={form.nombreResponsable} maxLength={150} onChange={(event) => updateForm({ nombreResponsable: event.target.value })} /><Input label="Teléfono del responsable" value={form.telefonoResponsable} maxLength={30} onChange={(event) => updateForm({ telefonoResponsable: event.target.value })} /><Input label="Dirección" value={form.direccion} maxLength={250} onChange={(event) => updateForm({ direccion: event.target.value })} /></div><div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]"><NativeSelect label="Grupo actual" value={form.grupoId} options={[{ value: "", label: "Sin grupo" }, ...options.groups.map((group) => ({ value: group.id, label: `${group.label} · ${group.schoolYear}` }))]} error={result?.fieldErrors?.grupoId?.[0]} onChange={(event) => updateForm({ grupoId: event.target.value })} /><label className="flex items-center gap-2 self-end pb-3 text-sm font-semibold text-foreground"><input type="checkbox" checked={form.repetidor} onChange={(event) => updateForm({ repetidor: event.target.checked })} className="size-4 accent-(--color-primary)" /> Repetidor</label></div></form></Modal>

    <Modal open={modal === "delete"} onOpenChange={(open) => !open && closeModal()} title="Eliminar alumno" description="Esta acción no se puede deshacer." variant="destructive" size="sm" closeOnOverlay={!pending} footer={<><Button variant="ghost" leftIcon={<LuX />} disabled={pending} onClick={closeModal}>Cancelar</Button><Button variant="danger" leftIcon={<LuTrash2 />} loading={pending} onClick={() => void confirmDelete()}>Eliminar</Button></>}><div className="space-y-4">{result && !result.success && <FormFeedback tone="error" variant="soft">{result.message}</FormFeedback>}<p className="text-sm leading-6 text-muted">Se eliminará a <strong className="text-foreground">{selected?.apellidos}, {selected?.nombre}</strong>. Sólo es posible si no tiene inscripciones.</p></div></Modal>

    <Modal open={modal === "import"} onOpenChange={(open) => !open && closeModal()} title="Cargar alumnos desde Excel" description="Sube el archivo y relaciona visualmente cada columna con un campo del alumno." variant="form" size="full" closeOnOverlay={!pending} footer={<><Button variant="ghost" leftIcon={<LuX />} disabled={pending} onClick={closeModal}>Cancelar</Button><Button variant="secondary" leftIcon={<LuDownload />} onClick={downloadTemplate}>Descargar plantilla</Button><Button leftIcon={<LuUpload />} loading={pending} loadingText="Importando..." disabled={!preview} onClick={() => void importRows()}>Importar alumnos</Button></>}><div className="space-y-5">{importResult && <FormFeedback tone={importResult.errors?.length ? "warning" : "info"} variant="soft">{importResult.message}{importResult.errors && <span className="mt-2 block max-h-28 overflow-y-auto">{importResult.errors.slice(0, 10).map((error) => <span key={error.rowNumber} className="block">Fila {error.rowNumber}: {error.message}</span>)}</span>}</FormFeedback>}<div className="rounded-xl border border-dashed border-border p-4"><input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" onChange={(event) => void readWorkbook(event)} className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:font-bold file:text-white" /><p className="mt-2 text-xs text-muted">Formatos admitidos: XLSX, XLS y CSV. Máximo recomendado: 5,000 filas.</p></div>{preview ? <><div><p className="mb-2 text-sm font-extrabold text-foreground">Mapeo de columnas</p><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{importFields.map((field) => <NativeSelect key={field.key} label={`${field.label}${field.required ? " *" : ""}`} value={mapping[field.key]} options={[{ value: "", label: "No importar" }, ...preview.headers.map((header) => ({ value: header, label: header }))]} onChange={(event) => setMapping((current) => ({ ...current, [field.key]: event.target.value }))} />)}</div></div><div><p className="mb-2 text-sm font-extrabold text-foreground">Vista previa</p><Table><TableHeader><TableRow>{preview.headers.map((header) => <TableHead key={header}>{header}</TableHead>)}</TableRow></TableHeader><TableBody>{preview.rows.map((row, index) => <TableRow key={index}>{preview.headers.map((header) => <TableCell key={header} className="max-w-48 truncate text-xs">{row[header]}</TableCell>)}</TableRow>)}</TableBody></Table></div></> : <div className="grid min-h-48 place-items-center rounded-xl bg-background text-center text-sm text-muted"><div><LuFileSpreadsheet className="mx-auto mb-2 size-10 text-success" /><p>Selecciona un Excel para comenzar el mapeo.</p></div></div>}</div></Modal>
  </>;
}

function Summary({ label, value, icon, tone = "primary" }: { label: string; value: number; icon: ReactNode; tone?: "primary" | "secondary" | "success" }) {
  const style = tone === "secondary" ? "bg-secondary/10 text-secondary" : tone === "success" ? "bg-success/10 text-success" : "bg-primary/10 text-primary";
  return <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"><span className={`grid size-10 place-items-center rounded-xl ${style}`}>{icon}</span><div><p className="text-xs font-bold text-muted">{label}</p><p className="text-2xl font-black text-foreground">{value}</p></div></div>;
}