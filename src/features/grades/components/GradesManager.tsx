"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LuBookOpen, LuDownload, LuFileSpreadsheet, LuFileText, LuSave, LuTriangle, LuUsers } from "react-icons/lu";

import { Badge } from "@/components/data-display/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/data-display/table";
import { NativeSelect } from "@/components/forms/select";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import { saveGradesAction } from "@/features/grades/actions/grade-actions";
import { summarizeStudent } from "@/features/grades/services/GradeCalculations";
import { exportAllGroupsGradesXlsx, exportGroupGradesXlsx, openGradesPrint } from "@/features/grades/utils/grade-exports";
import type { GradeGroup, GradeStudent, GradeTerm, GradeUpdateInput, GradesData } from "@/features/grades/types/grade.types";

const terms: Array<{ value: GradeTerm | "ALL"; label: string }> = [
  { value: "ALL", label: "Todos los trimestres" },
  { value: "T1", label: "1er trimestre" },
  { value: "T2", label: "2º trimestre" },
  { value: "T3", label: "3er trimestre" },
];

function formatGrade(value: number | null): string {
  return value === null ? "—" : value.toFixed(2);
}

const termColors: Record<GradeTerm, { group: string; cell: string; input: string; average: string }> = {
  T1: {
    group: "border-primary/30 bg-primary/15 text-primary",
    cell: "bg-primary/5",
    input: "border-primary/25 bg-primary/5 text-primary",
    average: "bg-primary/15 text-primary",
  },
  T2: {
    group: "border-secondary/30 bg-secondary/15 text-secondary",
    cell: "bg-secondary/5",
    input: "border-secondary/25 bg-secondary/5 text-secondary",
    average: "bg-secondary/15 text-secondary",
  },
  T3: {
    group: "border-tertiary/30 bg-tertiary/15 text-tertiary",
    cell: "bg-tertiary/5",
    input: "border-tertiary/25 bg-tertiary/5 text-tertiary",
    average: "bg-tertiary/15 text-tertiary",
  },
};

function gradeClass(value: number | null, trimestre: GradeTerm): string {
  return value !== null && value < 6 ? "border-danger/40 bg-danger/10 text-danger" : termColors[trimestre].input;
}

export function GradesManager({ data }: { data: GradesData }) {
  const router = useRouter();
  const [groupId, setGroupId] = useState("ALL");
  const [term, setTerm] = useState<GradeTerm | "ALL">("ALL");
  const [students, setStudents] = useState(data.students);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; message: string } | null>(null);
  const [dirty, setDirty] = useState<GradeUpdateInput[]>([]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const visibleGroups = useMemo(
    () => (groupId === "ALL" ? data.groups : data.groups.filter((group) => group.id === groupId)),
    [data.groups, groupId],
  );
  const visibleStudents = useMemo(
    () => (groupId === "ALL" ? students : students.filter((student) => student.grupoId === groupId)),
    [groupId, students],
  );
  const summaries = useMemo(
    () => new Map(students.map((student) => [student.inscriptionId, summarizeStudent(student, data.groups)])),
    [data.groups, students],
  );
  const failedCount = visibleStudents.reduce((count, student) => count + (summaries.get(student.inscriptionId)?.isRepeater ? 1 : 0), 0);

  function getValue(student: GradeStudent, subjectId: string, trimestre: GradeTerm): number | null {
    return student.grades.find((grade) => grade.materiaGrupoId === subjectId && grade.trimestre === trimestre)?.valor ?? null;
  }

  function setValue(student: GradeStudent, materiaGrupoId: string, trimestre: GradeTerm, rawValue: string): void {
    const valor = rawValue === "" ? null : Number(rawValue);
    if (valor !== null && (!Number.isFinite(valor) || valor < 0 || valor > 10)) return;

    setStudents((current) => current.map((item) => {
      if (item.inscriptionId !== student.inscriptionId) return item;
      const existing = item.grades.find((grade) => grade.materiaGrupoId === materiaGrupoId && grade.trimestre === trimestre);
      const grades = existing
        ? item.grades.map((grade) => grade === existing ? { ...grade, valor } : grade)
        : [...item.grades, { materiaGrupoId, trimestre, valor }];
      return { ...item, grades };
    }));
    setDirty((current) => [
      ...current.filter((update) => !(update.inscriptionId === student.inscriptionId && update.materiaGrupoId === materiaGrupoId && update.trimestre === trimestre)),
      { inscriptionId: student.inscriptionId, materiaGrupoId, trimestre, valor },
    ]);
    setNotice(null);
  }

  async function save(): Promise<void> {
    if (dirty.length === 0) return;
    setPending(true);
    setNotice(null);
    const result = await saveGradesAction({ updates: dirty });
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
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">Control académico</p>
          <h1 className="mt-2 text-3xl font-black text-foreground">Calificaciones</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">Captura notas de 0 a 10 por matrícula, grupo y trimestre. Los promedios se calculan con las calificaciones disponibles.</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="secondary" leftIcon={<LuFileSpreadsheet />} onClick={() => exportAllGroupsGradesXlsx(data.groups, students)}>Excel masivo</Button>
          <Button variant="secondary" leftIcon={<LuFileText />} onClick={() => openGradesPrint(data.groups, students)}>PDF masivo</Button>
          <Button leftIcon={<LuSave />} loading={pending} loadingText="Guardando..." disabled={dirty.length === 0} onClick={() => void save()}>Guardar cambios {dirty.length > 0 ? `(${dirty.length})` : ""}</Button>
        </div>
      </header>

      {notice && <FormFeedback tone={notice.tone} variant="soft">{notice.message}</FormFeedback>}

      <section className="grid gap-3 sm:grid-cols-3">
        <Summary label="Alumnos mostrados" value={visibleStudents.length} icon={<LuUsers />} />
        <Summary label="Grupos mostrados" value={visibleGroups.length} icon={<LuBookOpen />} tone="secondary" />
        <Summary label="Marcados repetidores" value={failedCount} icon={<LuTriangle />} tone="danger" />
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-foreground/5 md:grid-cols-2">
        <NativeSelect label="Grupo" value={groupId} options={[{ value: "ALL", label: "Todos los grupos" }, ...data.groups.map((group) => ({ value: group.id, label: `${group.label} · ${group.cicloEscolar}` }))]} onChange={(event) => setGroupId(event.target.value)} />
        <NativeSelect label="Trimestre" value={term} options={terms} onChange={(event) => setTerm(event.target.value as GradeTerm | "ALL")} />
      </section>

      {visibleGroups.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">No hay grupos configurados.</section>
      ) : visibleGroups.map((group) => <GroupTable key={group.id} group={group} students={visibleStudents.filter((student) => student.grupoId === group.id)} summaries={summaries} term={term} getValue={getValue} setValue={setValue} onExportExcel={() => exportGroupGradesXlsx(group, visibleStudents.filter((student) => student.grupoId === group.id))} onExportPdf={() => openGradesPrint([group], visibleStudents.filter((student) => student.grupoId === group.id))} />)}
    </div>
  );
}

function GroupTable({ group, students, summaries, term, getValue, setValue, onExportExcel, onExportPdf }: { group: GradeGroup; students: GradeStudent[]; summaries: Map<string, ReturnType<typeof summarizeStudent>>; term: GradeTerm | "ALL"; getValue: (student: GradeStudent, subjectId: string, trimestre: GradeTerm) => number | null; setValue: (student: GradeStudent, materiaGrupoId: string, trimestre: GradeTerm, value: string) => void; onExportExcel: () => void; onExportPdf: () => void }) {
  const activeTerms = term === "ALL" ? (["T1", "T2", "T3"] as GradeTerm[]) : [term];
  const columnsByTerm = activeTerms.map((trimestre) => ({
    trimestre,
    columns: group.subjects.map((subject) => ({ subject, trimestre })),
  }));
  const gradeColumns = columnsByTerm.flatMap(({ columns }) => columns);
  const totalColumns = 2 + gradeColumns.length + activeTerms.length + (term === "ALL" ? group.subjects.length : 0) + 3;

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-foreground/5 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black text-foreground">{group.label}</h2><p className="text-sm text-muted">Ciclo {group.cicloEscolar} · {students.length} alumnos · {group.subjects.length} materias</p></div><div className="flex flex-wrap items-center gap-2"><Badge variant="soft">{term === "ALL" ? "Vista completa" : terms.find((item) => item.value === term)?.label}</Badge><Button size="sm" variant="ghost" leftIcon={<LuDownload />} onClick={onExportExcel}>Excel</Button><Button size="sm" variant="ghost" leftIcon={<LuFileText />} onClick={onExportPdf}>PDF</Button></div></div>
      <Table variant="hoverable" containerClassName="max-h-[68vh]" className="min-w-275" stickyHeader>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="sticky left-0 z-20 min-w-32 bg-background">Matrícula</TableHead>
            <TableHead rowSpan={2} className="sticky left-32 z-20 min-w-56 bg-background">Alumno</TableHead>
            {columnsByTerm.map(({ trimestre, columns }) => (
              <TableHead key={trimestre} colSpan={columns.length + 1} align="center" className={`border-b-2 ${termColors[trimestre].group}`}>
                <span className="block text-xs font-black uppercase tracking-wide">{trimestre}</span>
                <span className="text-[10px] font-semibold">{terms.find((item) => item.value === trimestre)?.label} · materias y promedio</span>
              </TableHead>
            ))}
            {term === "ALL" && <TableHead colSpan={group.subjects.length} align="center" className="border-b-2 border-tertiary/30 bg-tertiary/15 text-tertiary">Promedio por materia</TableHead>}
            <TableHead rowSpan={2} align="center" className="min-w-24 bg-background">Promedio final</TableHead>
            <TableHead rowSpan={2} align="center" className="min-w-20 bg-background">Reprob.</TableHead>
            <TableHead rowSpan={2} align="center" className="min-w-28 bg-background">Estado</TableHead>
          </TableRow>
          <TableRow>
            {columnsByTerm.flatMap(({ trimestre, columns }) => [
              ...columns.map(({ subject }) => <TableHead key={`${trimestre}-${subject.id}`} align="center" className={`min-w-24 ${termColors[trimestre].cell}`}><span className="block text-[10px]">{subject.nombre}</span><span className="text-[10px] font-bold">Calificación</span></TableHead>),
              <TableHead key={`${trimestre}-average`} align="center" className={`min-w-28 font-black ${termColors[trimestre].average}`}>Promedio {trimestre}</TableHead>,
            ])}
            {term === "ALL" && group.subjects.map((subject) => <TableHead key={`avg-${subject.id}`} align="center" className="min-w-24 bg-tertiary/5 text-[10px]">{subject.nombre}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>{students.length === 0 ? <TableRow><TableCell colSpan={totalColumns} className="h-24 text-center text-muted">No hay alumnos inscritos en este grupo.</TableCell></TableRow> : students.map((student) => {
          const summary = summaries.get(student.inscriptionId);
          if (!summary) return null;
          return <TableRow key={student.inscriptionId}><TableCell className="sticky left-0 z-10 bg-surface font-black">{student.matricula}</TableCell><TableCell className="sticky left-32 z-10 bg-surface font-semibold">{student.nombreCompleto}</TableCell>{columnsByTerm.flatMap(({ trimestre, columns }) => [
            ...columns.map(({ subject }) => { const value = getValue(student, subject.id, trimestre); return <TableCell key={`${subject.id}-${trimestre}`} align="center" className={termColors[trimestre].cell}><input aria-label={`${student.matricula} ${subject.nombre} ${trimestre}`} type="number" min="0" max="10" step="0.1" value={value ?? ""} onChange={(event) => setValue(student, subject.id, trimestre, event.target.value)} className={`h-9 w-20 rounded-lg border text-center text-sm font-black outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 ${gradeClass(value, trimestre)}`} /></TableCell>; }),
            <TableCell key={`${trimestre}-average`} align="center" className={`font-black ${termColors[trimestre].average} ${summary.trimesterAverages[trimestre] !== null && summary.trimesterAverages[trimestre]! < 6 ? "text-danger" : ""}`}>{formatGrade(summary.trimesterAverages[trimestre])}</TableCell>,
          ])}{term === "ALL" && group.subjects.map((subject) => <TableCell key={`avg-${subject.id}`} align="center" className={`font-black bg-tertiary/5 ${summary.subjectAverages[subject.id] !== null && summary.subjectAverages[subject.id]! < 6 ? "text-danger" : "text-foreground"}`}>{formatGrade(summary.subjectAverages[subject.id] ?? null)}</TableCell>)}<TableCell align="center" className="font-black text-primary">{formatGrade(summary.finalAverage)}</TableCell><TableCell align="center"><Badge variant={summary.failedSubjects > 0 ? "danger" : "success"}>{summary.failedSubjects}</Badge></TableCell><TableCell align="center">{summary.isRepeater ? <Badge variant="danger">Repetidor</Badge> : <span className="text-xs font-bold text-success">Regular</span>}</TableCell></TableRow>;
        })}</TableBody>
      </Table>
      <p className="text-xs text-muted">Cada pestaña de color agrupa las materias de su trimestre y muestra su promedio al final. Las calificaciones menores a 6 se muestran en rojo. Campo vacío = sin calificación; 0 sí cuenta como calificación.</p>
    </section>
  );
}

function Summary({ label, value, icon, tone = "primary" }: { label: string; value: number; icon: React.ReactNode; tone?: "primary" | "secondary" | "danger" }) {
  const style = tone === "secondary" ? "bg-secondary/10 text-secondary" : tone === "danger" ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary";
  return <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"><span className={`grid size-10 place-items-center rounded-xl ${style}`}>{icon}</span><div><p className="text-xs font-bold text-muted">{label}</p><p className="text-2xl font-black text-foreground">{value}</p></div></div>;
}
