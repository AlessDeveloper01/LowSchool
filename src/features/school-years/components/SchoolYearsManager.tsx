"use client";

import { useEffect, useMemo } from "react";
import { LuCalendar, LuCircleCheck, LuPencil, LuPlus, LuPower, LuPowerOff, LuSearch, LuTrash2, LuX } from "react-icons/lu";

import { Badge, StatusBadge } from "@/components/data-display/badge";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from "@/components/data-display/table";
import { TableActions } from "@/components/data-display/table-actions";
import { Input } from "@/components/forms/input";
import { Button } from "@/components/ui/button";
import { FormFeedback } from "@/components/ui/form";
import { SchoolYearDeleteModal } from "@/features/school-years/components/SchoolYearDeleteModal";
import { SchoolYearFormModal } from "@/features/school-years/components/SchoolYearFormModal";
import { SchoolYearStatusModal } from "@/features/school-years/components/SchoolYearStatusModal";
import { useSchoolYearStore } from "@/features/school-years/store/schoolYearStore";
import type { ManagedSchoolYear } from "@/features/school-years/types/school-year.types";

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function SchoolYearsManager({ schoolYears }: { schoolYears: ManagedSchoolYear[] }) {
  const search = useSchoolYearStore((state) => state.search);
  const notice = useSchoolYearStore((state) => state.notice);
  const openCreate = useSchoolYearStore((state) => state.openCreate);
  const openEdit = useSchoolYearStore((state) => state.openEdit);
  const openStatus = useSchoolYearStore((state) => state.openStatus);
  const openDelete = useSchoolYearStore((state) => state.openDelete);
  const setSearch = useSchoolYearStore((state) => state.setSearch);
  const dismissNotice = useSchoolYearStore((state) => state.dismissNotice);
  const reset = useSchoolYearStore((state) => state.reset);
  useEffect(() => () => reset(), [reset]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => dismissNotice(), 4500);
    return () => window.clearTimeout(timeout);
  }, [dismissNotice, notice]);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return schoolYears.filter((schoolYear) => !term || normalize(schoolYear.nombre).includes(term));
  }, [schoolYears, search]);
  const activeCount = schoolYears.filter(({ activo }) => activo).length;
  const groupsCount = schoolYears.reduce((total, schoolYear) => total + schoolYear.groupsCount, 0);

  return <>
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">Control académico</p><h1 className="mt-2 text-3xl font-black text-foreground">Ciclos escolares</h1><p className="mt-2 text-sm text-muted">Administra los periodos escolares y define cuál está activo.</p></div>
        <Button leftIcon={<LuPlus />} onClick={openCreate}>Nuevo ciclo escolar</Button>
      </header>
      {notice && <div className="flex items-start gap-3 rounded-xl bg-success/10 p-3 text-success"><FormFeedback tone="success" className="min-w-0 flex-1">{notice.message}</FormFeedback><button type="button" aria-label="Cerrar mensaje" className="grid size-8 place-items-center rounded-lg hover:bg-success/10" onClick={dismissNotice}><LuX /></button></div>}
      <section className="grid gap-3 sm:grid-cols-3"><Summary label="Ciclos registrados" value={schoolYears.length} icon={<LuCalendar />} /><Summary label="Ciclo activo" value={activeCount} icon={<LuCircleCheck />} tone="success" /><Summary label="Grupos relacionados" value={groupsCount} icon={<LuCalendar />} tone="secondary" /></section>
      <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm shadow-foreground/5 sm:p-5">
        <div className="mb-4"><Input aria-label="Buscar ciclos escolares" value={search} leftIcon={<LuSearch />} placeholder="Buscar por año, ejemplo 2026..." onChange={(event) => setSearch(event.target.value)} /></div>
        <Table variant="hoverable"><TableHeader><TableRow><TableHead>Ciclo escolar</TableHead><TableHead>Estado</TableHead><TableHead>Grupos</TableHead><TableHead align="end">Acciones</TableHead></TableRow></TableHeader><TableBody>{filtered.length === 0 ? <TableEmpty colSpan={4} message={schoolYears.length === 0 ? "Todavía no hay ciclos escolares." : "No hay ciclos que coincidan con la búsqueda."} /> : filtered.map((schoolYear) => <TableRow key={schoolYear.id} className={!schoolYear.activo ? "opacity-70" : undefined}><TableCell><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><LuCalendar /></span><div><p className="font-extrabold text-foreground">{schoolYear.nombre}</p>{schoolYear.activo && <Badge variant="soft" className="mt-1" icon={<LuCircleCheck />}>Periodo actual</Badge>}</div></div></TableCell><TableCell><StatusBadge status={schoolYear.activo ? "active" : "inactive"} /></TableCell><TableCell className="font-bold">{schoolYear.groupsCount}</TableCell><TableCell align="end"><TableActions variant="dropdown" actions={[{ id: "edit", label: "Editar", icon: <LuPencil />, onSelect: () => openEdit(schoolYear) }, schoolYear.activo ? { id: "deactivate", label: "Desactivar", icon: <LuPowerOff />, destructive: true, onSelect: () => openStatus(schoolYear) } : { id: "activate", label: "Activar", icon: <LuPower />, onSelect: () => openStatus(schoolYear) }, { id: "delete", label: "Eliminar", icon: <LuTrash2 />, destructive: true, disabled: schoolYear.groupsCount > 0, onSelect: () => openDelete(schoolYear) }]} /></TableCell></TableRow>)}</TableBody></Table>
        <p className="mt-4 text-xs text-muted">Mostrando {filtered.length} de {schoolYears.length} ciclos escolares.</p>
      </section>
    </div>
    <SchoolYearFormModal /><SchoolYearStatusModal /><SchoolYearDeleteModal />
  </>;
}

function Summary({ label, value, icon, tone = "primary" }: { label: string; value: number; icon: React.ReactNode; tone?: "primary" | "success" | "secondary" }) {
  const style = tone === "success" ? "bg-success/10 text-success" : tone === "secondary" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary";
  return <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"><span className={`grid size-10 place-items-center rounded-xl ${style}`}>{icon}</span><div><p className="text-xs font-bold text-muted">{label}</p><p className="text-2xl font-black text-foreground">{value}</p></div></div>;
}
