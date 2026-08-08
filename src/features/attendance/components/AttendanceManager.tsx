"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LuBookOpen, LuSave, LuTriangle, LuUsers } from "react-icons/lu";

import { Badge } from "@/components/data-display/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/data-display/table";
import { NativeSelect } from "@/components/forms/select";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import { saveAttendanceAction } from "@/features/attendance/actions/attendance-actions";
import type { AttendanceData, AttendanceGroup, AttendanceStudent, AttendanceTerm, AttendanceUpdateInput } from "@/features/attendance/types/attendance.types";

const terms: Array<{ value: AttendanceTerm | "ALL"; label: string }> = [
  { value: "ALL", label: "Todos los trimestres" },
  { value: "T1", label: "1er trimestre" },
  { value: "T2", label: "2º trimestre" },
  { value: "T3", label: "3er trimestre" },
];

const termColors: Record<AttendanceTerm, { group: string; cell: string; input: string }> = {
  T1: { group: "border-primary/30 bg-primary/15 text-primary", cell: "bg-primary/5", input: "border-primary/25 bg-primary/5 text-primary" },
  T2: { group: "border-secondary/30 bg-secondary/15 text-secondary", cell: "bg-secondary/5", input: "border-secondary/25 bg-secondary/5 text-secondary" },
  T3: { group: "border-tertiary/30 bg-tertiary/15 text-tertiary", cell: "bg-tertiary/5", input: "border-tertiary/25 bg-tertiary/5 text-tertiary" },
};

function attendanceValue(student: AttendanceStudent, subjectId: string, trimestre: AttendanceTerm) {
  return student.attendance.find((value) => value.materiaGrupoId === subjectId && value.trimestre === trimestre) ?? { asistencias: 0, faltas: 0 };
}

export function AttendanceManager({ data }: { data: AttendanceData }) {
  const router = useRouter();
  const [groupId, setGroupId] = useState("ALL");
  const [term, setTerm] = useState<AttendanceTerm | "ALL">("ALL");
  const [students, setStudents] = useState(data.students);
  const [dirty, setDirty] = useState<AttendanceUpdateInput[]>([]);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const visibleGroups = useMemo(() => groupId === "ALL" ? data.groups : data.groups.filter((group) => group.id === groupId), [data.groups, groupId]);
  const visibleStudents = useMemo(() => groupId === "ALL" ? students : students.filter((student) => student.grupoId === groupId), [groupId, students]);
  const totalAbsences = visibleStudents.reduce((total, student) => total + student.attendance.reduce((sum, value) => sum + value.faltas, 0), 0);

  function setValue(student: AttendanceStudent, materiaGrupoId: string, trimestre: AttendanceTerm, field: "asistencias" | "faltas", rawValue: string): void {
    const value = rawValue === "" ? 0 : Number(rawValue);
    if (!Number.isInteger(value) || value < 0 || value > 366) return;

    setStudents((current) => current.map((item) => {
      if (item.inscriptionId !== student.inscriptionId) return item;
      const existing = item.attendance.find((entry) => entry.materiaGrupoId === materiaGrupoId && entry.trimestre === trimestre);
      const nextValue = { ...(existing ?? { materiaGrupoId, trimestre, asistencias: 0, faltas: 0 }), [field]: value };
      const attendance = existing
        ? item.attendance.map((entry) => entry === existing ? nextValue : entry)
        : [...item.attendance, nextValue];
      return { ...item, attendance };
    }));

    const current = attendanceValue(student, materiaGrupoId, trimestre);
    const nextUpdate = { inscriptionId: student.inscriptionId, materiaGrupoId, trimestre, asistencias: field === "asistencias" ? value : current.asistencias, faltas: field === "faltas" ? value : current.faltas };
    setDirty((current) => [...current.filter((update) => !(update.inscriptionId === student.inscriptionId && update.materiaGrupoId === materiaGrupoId && update.trimestre === trimestre)), nextUpdate]);
    setNotice(null);
  }

  async function save(): Promise<void> {
    if (dirty.length === 0) return;
    setPending(true);
    setNotice(null);
    const result = await saveAttendanceAction({ updates: dirty });
    if (result.success) {
      setDirty([]);
      setNotice({ tone: "success", message: result.message });
      router.refresh();
    } else {
      setNotice({ tone: "error", message: result.message });
    }
    setPending(false);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">Control académico</p><h1 className="mt-2 text-3xl font-black text-foreground">Asistencia</h1><p className="mt-2 max-w-3xl text-sm text-muted">Registra el número de asistencias y faltas por alumno, materia y trimestre.</p></div>
        <Button leftIcon={<LuSave />} loading={pending} loadingText="Guardando..." disabled={dirty.length === 0} onClick={() => void save()}>Guardar cambios {dirty.length > 0 ? `(${dirty.length})` : ""}</Button>
      </header>
      {notice && <FormFeedback tone={notice.tone} variant="soft">{notice.message}</FormFeedback>}
      <section className="grid gap-3 sm:grid-cols-3"><Summary label="Alumnos mostrados" value={visibleStudents.length} icon={<LuUsers />} /><Summary label="Grupos mostrados" value={visibleGroups.length} icon={<LuBookOpen />} tone="secondary" /><Summary label="Faltas registradas" value={totalAbsences} icon={<LuTriangle />} tone="danger" /></section>
      <section className="grid gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-foreground/5 md:grid-cols-2"><NativeSelect label="Grupo" value={groupId} options={[{ value: "ALL", label: "Todos los grupos" }, ...data.groups.map((group) => ({ value: group.id, label: `${group.label} · ${group.cicloEscolar}` }))]} onChange={(event) => setGroupId(event.target.value)} /><NativeSelect label="Trimestre" value={term} options={terms} onChange={(event) => setTerm(event.target.value as AttendanceTerm | "ALL")} /></section>
      {visibleGroups.length === 0 ? <section className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">No hay grupos configurados.</section> : visibleGroups.map((group) => <AttendanceGroupTable key={group.id} group={group} students={visibleStudents.filter((student) => student.grupoId === group.id)} term={term} setValue={setValue} />)}
    </div>
  );
}

function AttendanceGroupTable({ group, students, term, setValue }: { group: AttendanceGroup; students: AttendanceStudent[]; term: AttendanceTerm | "ALL"; setValue: (student: AttendanceStudent, materiaGrupoId: string, trimestre: AttendanceTerm, field: "asistencias" | "faltas", value: string) => void }) {
  const activeTerms = term === "ALL" ? (["T1", "T2", "T3"] as AttendanceTerm[]) : [term];
  const columnsByTerm = activeTerms.map((trimestre) => ({ trimestre, columns: group.subjects.map((subject) => ({ subject, trimestre })) }));
  const totalColumns = 2 + group.subjects.length * activeTerms.length * 2;

  return <section className="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-foreground/5 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-xl font-black text-foreground">{group.label}</h2><p className="text-sm text-muted">Ciclo {group.cicloEscolar} · {students.length} alumnos · {group.subjects.length} materias</p></div><Badge variant="soft">{term === "ALL" ? "Vista completa" : terms.find((item) => item.value === term)?.label}</Badge></div><Table variant="hoverable" containerClassName="max-h-[68vh]" className="min-w-275" stickyHeader><TableHeader><TableRow><TableHead rowSpan={2} className="sticky left-0 z-20 min-w-32 bg-background">Matrícula</TableHead><TableHead rowSpan={2} className="sticky left-32 z-20 min-w-56 bg-background">Alumno</TableHead>{columnsByTerm.map(({ trimestre, columns }) => <TableHead key={trimestre} colSpan={columns.length * 2} align="center" className={`border-b-2 ${termColors[trimestre].group}`}><span className="block text-xs font-black uppercase tracking-wide">{trimestre}</span><span className="text-[10px] font-semibold">Asistencias y faltas</span></TableHead>)}</TableRow><TableRow>{columnsByTerm.flatMap(({ trimestre, columns }) => columns.flatMap(({ subject }) => [<TableHead key={`${trimestre}-${subject.id}-present`} align="center" className={`min-w-24 ${termColors[trimestre].cell}`}><span className="block text-[10px]">{subject.nombre}</span><span className="text-[10px] font-bold">Asist.</span></TableHead>, <TableHead key={`${trimestre}-${subject.id}-absent`} align="center" className={`min-w-24 ${termColors[trimestre].cell}`}><span className="block text-[10px]">{subject.nombre}</span><span className="text-[10px] font-bold text-danger">Faltas</span></TableHead>]))}</TableRow></TableHeader><TableBody>{students.length === 0 ? <TableRow><TableCell colSpan={totalColumns} className="h-24 text-center text-muted">No hay alumnos inscritos en este grupo.</TableCell></TableRow> : students.map((student) => <TableRow key={student.inscriptionId}><TableCell className="sticky left-0 z-10 bg-surface font-black">{student.matricula}</TableCell><TableCell className="sticky left-32 z-10 bg-surface font-semibold">{student.nombreCompleto}</TableCell>{columnsByTerm.flatMap(({ trimestre, columns }) => columns.flatMap(({ subject }) => { const value = attendanceValue(student, subject.id, trimestre); return [<TableCell key={`${trimestre}-${subject.id}-present`} align="center" className={termColors[trimestre].cell}><input aria-label={`${student.matricula} ${subject.nombre} ${trimestre} asistencias`} type="number" min="0" max="366" step="1" value={value.asistencias} onChange={(event) => setValue(student, subject.id, trimestre, "asistencias", event.target.value)} className={`h-9 w-20 rounded-lg border text-center text-sm font-black outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 ${termColors[trimestre].input}`} /></TableCell>, <TableCell key={`${trimestre}-${subject.id}-absent`} align="center" className={termColors[trimestre].cell}><input aria-label={`${student.matricula} ${subject.nombre} ${trimestre} faltas`} type="number" min="0" max="366" step="1" value={value.faltas} onChange={(event) => setValue(student, subject.id, trimestre, "faltas", event.target.value)} className="h-9 w-20 rounded-lg border border-danger/25 bg-danger/5 text-center text-sm font-black text-danger outline-none focus:border-danger focus:ring-3 focus:ring-danger/10" /></TableCell>]; }))}</TableRow>)}</TableBody></Table><p className="text-xs text-muted">Cada materia tiene dos campos: asistencias y faltas. Los campos se guardan en cero cuando no hay registros.</p></section>;
}

function Summary({ label, value, icon, tone = "primary" }: { label: string; value: number; icon: React.ReactNode; tone?: "primary" | "secondary" | "danger" }) {
  const style = tone === "secondary" ? "bg-secondary/10 text-secondary" : tone === "danger" ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary";
  return <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"><span className={`grid size-10 place-items-center rounded-xl ${style}`}>{icon}</span><div><p className="text-xs font-bold text-muted">{label}</p><p className="text-2xl font-black text-foreground">{value}</p></div></div>;
}
