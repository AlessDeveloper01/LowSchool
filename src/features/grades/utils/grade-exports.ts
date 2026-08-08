import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { summarizeStudent } from "@/features/grades/services/GradeCalculations";
import type { GradeGroup, GradeStudent, GradeTerm } from "@/features/grades/types/grade.types";

const TERMS: GradeTerm[] = ["T1", "T2", "T3"];

function score(value: number | null): string | number {
  return value === null ? "" : value;
}

function groupRows(group: GradeGroup, students: GradeStudent[]) {
  return students.map((student) => {
    const summary = summarizeStudent(student, [group]);
    const row: Record<string, string | number> = {
      Matrícula: student.matricula,
      Alumno: student.nombreCompleto,
    };

    for (const trimestre of TERMS) {
      for (const subject of group.subjects) {
        const value = student.grades.find((grade) => grade.materiaGrupoId === subject.id && grade.trimestre === trimestre)?.valor ?? null;
        row[`${trimestre} · ${subject.nombre}`] = score(value);
      }
      row[`Promedio ${trimestre}`] = score(summary.trimesterAverages[trimestre]);
    }

    for (const subject of group.subjects) row[`Prom. ${subject.nombre}`] = score(summary.subjectAverages[subject.id] ?? null);
    row["Promedio final"] = score(summary.finalAverage);
    row["Materias reprobadas"] = summary.failedSubjects;
    row.Estado = summary.isRepeater ? "Repetidor" : "Regular";
    return row;
  });
}

function styleWorksheet(worksheet: XLSX.WorkSheet): void {
  worksheet["!cols"] = Object.keys(worksheet).length > 0
    ? Array.from({ length: 100 }, (_, index) => ({ wch: index < 2 ? 24 : 16 }))
    : [];
  worksheet["!freeze"] = { xSplit: 2, ySplit: 1 };
  worksheet["!autofilter"] = { ref: worksheet["!ref"] ?? "A1:A1" };
}

function downloadWorkbook(workbook: XLSX.WorkBook, filename: string): void {
  XLSX.writeFile(workbook, filename);
}

export function exportGroupGradesXlsx(group: GradeGroup, students: GradeStudent[]): void {
  const worksheet = XLSX.utils.json_to_sheet(groupRows(group, students));
  styleWorksheet(worksheet);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Calificaciones");
  downloadWorkbook(workbook, `calificaciones-${group.label.replace(/[^a-z0-9]+/gi, "-")}.xlsx`);
}

export function exportAllGroupsGradesXlsx(groups: GradeGroup[], students: GradeStudent[]): void {
  const workbook = XLSX.utils.book_new();
  for (const group of groups) {
    const groupStudents = students.filter((student) => student.grupoId === group.id);
    const worksheet = XLSX.utils.json_to_sheet(groupRows(group, groupStudents));
    styleWorksheet(worksheet);
    const sheetName = `${group.grado}${group.letra}-${group.cicloEscolar}`.replace(/[\\/?*:[\]]/g, "").slice(0, 31) || "Grupo";
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }
  downloadWorkbook(workbook, "calificaciones-todos-los-grupos.xlsx");
}

export function openGradesPrint(groups: GradeGroup[], students: GradeStudent[]): void {
  const document = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  groups.forEach((group, index) => {
    if (index > 0) document.addPage();
    addGroupPdf(document, group, students.filter((student) => student.grupoId === group.id));
  });
  document.save(groups.length === 1 ? `calificaciones-${groups[0].label.replace(/[^a-z0-9]+/gi, "-")}.pdf` : "calificaciones-todos-los-grupos.pdf");
}

function addGroupPdf(document: jsPDF, group: GradeGroup, students: GradeStudent[]): void {
  const rows = groupRows(group, students);
  const headers = rows.length > 0 ? Object.keys(rows[0]) : ["Matrícula", "Alumno"];
  const body = rows.map((row) => headers.map((header) => String(row[header] ?? "")));

  document.setFillColor(91, 91, 214);
  document.rect(10, 10, 277, 18, "F");
  document.setTextColor(255, 255, 255);
  document.setFontSize(17);
  document.setFont("helvetica", "bold");
  document.text(`Calificaciones · ${group.label}`, 16, 20);
  document.setFontSize(9);
  document.setFont("helvetica", "normal");
  document.text(`Ciclo escolar ${group.cicloEscolar} · ${students.length} alumnos`, 16, 25);

  autoTable(document, {
    startY: 34,
    head: [headers],
    body,
    theme: "grid",
    styles: { fontSize: 5.5, cellPadding: 1.8, overflow: "ellipsize", valign: "middle" },
    headStyles: { fillColor: [7, 134, 166], textColor: 255, fontStyle: "bold", halign: "center" },
    alternateRowStyles: { fillColor: [245, 247, 251] },
    columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 31 } },
    didParseCell: (hook) => {
      if (hook.section === "body" && hook.column.index >= 2 && Number(hook.cell.raw) < 6 && hook.cell.raw !== "") {
        hook.cell.styles.textColor = [208, 68, 85];
        hook.cell.styles.fontStyle = "bold";
      }
    },
    didDrawPage: (hook) => {
      document.setFontSize(7);
      document.setTextColor(104, 115, 138);
      document.text(`Generado el ${new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date())} · Página ${hook.pageNumber}`, 10, 202);
    },
  });
}