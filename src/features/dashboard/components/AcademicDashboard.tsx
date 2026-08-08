"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LuArrowUpRight, LuBookOpen, LuClipboardCheck, LuDownload, LuFileSpreadsheet, LuFileText, LuGraduationCap, LuSearch, LuTriangleAlert, LuUsers } from "react-icons/lu";

import { Badge } from "@/components/data-display/badge";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "@/components/data-display/table";
import { Input } from "@/components/forms/input";
import { NativeSelect } from "@/components/forms/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { exportAcademicDashboardPdf, exportAcademicDashboardXlsx } from "@/features/dashboard/utils/academic-dashboard-exports";
import type { AcademicDashboardData, AcademicDashboardStudent } from "@/features/dashboard/types/academic-dashboard.types";

const LIMIT_OPTIONS = ["10", "20", "all"] as const;
type RankingLimit = (typeof LIMIT_OPTIONS)[number];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function average(value: number | null): string {
  return value === null ? "—" : value.toFixed(2);
}

function studentStatus(student: AcademicDashboardStudent): string {
  return student.isRepeater ? "Repetidor" : student.failedSubjects > 0 ? "En riesgo" : "Regular";
}

function sortBest(left: AcademicDashboardStudent, right: AcademicDashboardStudent): number {
  return (right.finalAverage ?? -1) - (left.finalAverage ?? -1) || left.failedSubjects - right.failedSubjects || left.nombreCompleto.localeCompare(right.nombreCompleto);
}

function sortFailed(left: AcademicDashboardStudent, right: AcademicDashboardStudent): number {
  return right.failedSubjects - left.failedSubjects || (left.finalAverage ?? 99) - (right.finalAverage ?? 99) || left.nombreCompleto.localeCompare(right.nombreCompleto);
}

function limitStudents(students: AcademicDashboardStudent[], limit: RankingLimit): AcademicDashboardStudent[] {
  return limit === "all" ? students : students.slice(0, Number(limit));
}

export function AcademicDashboard({ data }: { data: AcademicDashboardData }) {
  const [search, setSearch] = useState("");
  const [rankingLimit, setRankingLimit] = useState<RankingLimit>("10");
  const filteredStudents = useMemo(() => {
    const term = normalize(search.trim());
    if (!term) return data.students;
    return data.students.filter((student) => normalize(`${student.nombreCompleto} ${student.matricula} ${student.grupo}`).includes(term));
  }, [data.students, search]);
  const bestStudents = useMemo(() => limitStudents([...filteredStudents].filter((student) => student.finalAverage !== null).sort(sortBest), rankingLimit), [filteredStudents, rankingLimit]);
  const failedStudents = useMemo(() => limitStudents([...filteredStudents].sort(sortFailed), rankingLimit), [filteredStudents, rankingLimit]);
  const quickResults = filteredStudents.slice(0, 8);
  const limitLabel = rankingLimit === "all" ? "todos" : rankingLimit;

  return <div className="mx-auto w-full max-w-[1700px] space-y-6 px-4 py-6 sm:px-6 lg:px-8"><header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">Panel académico</p><h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">Dashboard escolar</h1><p className="mt-2 text-sm text-muted">Rendimiento de los alumnos del ciclo {data.activeSchoolYear ?? "activo"}.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" leftIcon={<LuFileSpreadsheet />} onClick={() => exportAcademicDashboardXlsx(bestStudents, failedStudents, limitLabel)}>Excel</Button><Button variant="outline" size="sm" leftIcon={<LuFileText />} onClick={() => exportAcademicDashboardPdf(bestStudents, failedStudents, data.activeSchoolYear, limitLabel)}>PDF</Button></div></header><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Stat label="Alumnos inscritos" value={data.stats.totalStudents} icon={<LuUsers />} /><Stat label="Grupos activos" value={data.stats.totalGroups} icon={<LuBookOpen />} /><Stat label="Promedio general" value={average(data.stats.generalAverage)} icon={<LuGraduationCap />} /><Stat label="Aprobación" value={`${data.stats.approvalRate}%`} icon={<LuClipboardCheck />} /><Stat label="Con reprobadas" value={data.stats.studentsWithFailures} icon={<LuTriangleAlert />} /></section><section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)]"><Card><CardHeader><div><CardTitle>Buscar alumno</CardTitle><CardDescription>Accede rápidamente a la boleta y al detalle académico.</CardDescription></div><LuSearch className="text-primary" /></CardHeader><CardContent><Input aria-label="Buscar alumno" value={search} leftIcon={<LuSearch />} placeholder="Nombre, matrícula o grupo..." onChange={(event) => setSearch(event.target.value)} /><div className="mt-4 overflow-hidden rounded-xl border border-border"><Table variant="hoverable"><TableHeader><TableRow><TableHead>Alumno</TableHead><TableHead>Grupo</TableHead><TableHead align="center">Promedio</TableHead><TableHead align="end">Acción</TableHead></TableRow></TableHeader><TableBody>{quickResults.length === 0 ? <TableEmpty colSpan={4} message="No hay alumnos que coincidan con la búsqueda." /> : quickResults.map((student) => <TableRow key={student.inscriptionId}><TableCell><p className="font-extrabold">{student.nombreCompleto}</p><p className="text-xs text-muted">{student.matricula}</p></TableCell><TableCell>{student.grupo}</TableCell><TableCell align="center" className={student.finalAverage !== null && student.finalAverage < 6 ? "font-black text-danger" : "font-bold"}>{average(student.finalAverage)}</TableCell><TableCell align="end"><Link href={`/students/${student.alumnoId}/report-card`} className="inline-flex items-center gap-1 text-xs font-black text-primary hover:underline">Ver boleta <LuArrowUpRight /></Link></TableCell></TableRow>)}</TableBody></Table></div><p className="mt-3 text-xs text-muted">{filteredStudents.length} resultado(s) encontrado(s).</p></CardContent></Card><Card><CardHeader><div><CardTitle>Acciones rápidas</CardTitle><CardDescription>Tareas académicas frecuentes.</CardDescription></div><LuDownload className="text-primary" /></CardHeader><CardContent className="grid gap-2"><QuickAction href="/students" icon={<LuUsers />} label="Gestionar alumnos" /><QuickAction href="/grades" icon={<LuGraduationCap />} label="Capturar calificaciones" /><QuickAction href="/attendance" icon={<LuClipboardCheck />} label="Registrar asistencia" /><QuickAction href="/groups" icon={<LuBookOpen />} label="Administrar grupos" /></CardContent></Card></section><section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-black text-foreground">Cantidad para exportar</p><p className="mt-1 text-xs text-muted">Se aplica a los dos rankings y reúne alumnos de todos los grupos.</p></div><NativeSelect aria-label="Cantidad de alumnos para exportar" selectSize="sm" fullWidth={false} value={rankingLimit} onChange={(event) => setRankingLimit(event.target.value as RankingLimit)} options={[{ value: "10", label: "10 alumnos" }, { value: "20", label: "20 alumnos" }, { value: "all", label: "Todos los alumnos" }]} /></section><section className="grid gap-4 xl:grid-cols-2"><RankingCard title="Mejores promedios" description="Ordenados del promedio más alto al más bajo." students={bestStudents} emptyMessage="No hay promedios disponibles." tone="success" /><RankingCard title="Más materias reprobadas" description="Prioriza la atención de alumnos con mayor riesgo académico." students={failedStudents} emptyMessage="No hay alumnos registrados." tone="danger" /></section><section className="rounded-2xl border border-border bg-surface p-5"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="text-base font-black text-foreground">Resumen por grupo</h2><p className="mt-1 text-xs text-muted">Promedio general y cantidad de alumnos del ciclo activo.</p></div><Badge variant="outline">{data.activeSchoolYear ?? "Sin ciclo activo"}</Badge></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{data.groups.map((group) => <div key={group.id} className="rounded-xl border border-border bg-background p-4"><p className="font-black text-foreground">{group.label}</p><p className="mt-1 text-xs text-muted">{group.studentCount} alumnos</p><p className="mt-3 text-xl font-black text-primary">{average(group.average)}</p><p className="text-xs text-muted">promedio del grupo</p></div>)}</div></section></div>;
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) { return <Card padding="sm"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</span><div><p className="text-xs font-bold text-muted">{label}</p><p className="mt-1 text-2xl font-black text-foreground">{value}</p></div></div></Card>; }
function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) { return <Link href={href} className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-extrabold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"><span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>{label}<LuArrowUpRight className="ml-auto text-muted" /></Link>; }
function RankingCard({ title, description, students, emptyMessage, tone }: { title: string; description: string; students: AcademicDashboardStudent[]; emptyMessage: string; tone: "success" | "danger" }) { return <Card><CardHeader><div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div><Badge variant={tone}>{students.length} mostrados</Badge></CardHeader><CardContent><Table variant="hoverable"><TableHeader><TableRow><TableHead>#</TableHead><TableHead>Alumno</TableHead><TableHead>Grupo</TableHead><TableHead align="center">Promedio</TableHead><TableHead align="center">Reprobadas</TableHead><TableHead align="end">Detalle</TableHead></TableRow></TableHeader><TableBody>{students.length === 0 ? <TableEmpty colSpan={6} message={emptyMessage} /> : students.map((student, index) => <TableRow key={student.inscriptionId}><TableCell className="font-black text-muted">{index + 1}</TableCell><TableCell><p className="max-w-44 truncate font-extrabold">{student.nombreCompleto}</p><p className="text-xs text-muted">{student.matricula}</p></TableCell><TableCell>{student.grupo}</TableCell><TableCell align="center" className={student.finalAverage !== null && student.finalAverage < 6 ? "font-black text-danger" : "font-black text-primary"}>{average(student.finalAverage)}</TableCell><TableCell align="center"><Badge variant={student.failedSubjects > 0 ? "danger" : "success"}>{student.failedSubjects}</Badge></TableCell><TableCell align="end"><Link href={`/students/${student.alumnoId}/report-card`} aria-label={`Ver boleta de ${student.nombreCompleto}`} className="text-primary hover:text-primary-hover"><LuArrowUpRight /></Link></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>; }
