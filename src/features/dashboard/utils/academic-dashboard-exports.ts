import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { AcademicDashboardStudent } from "@/features/dashboard/types/academic-dashboard.types";

function average(value: number | null): string | number {
  return value === null ? "—" : value.toFixed(2);
}

function rows(students: AcademicDashboardStudent[]) {
  return students.map((student, index) => ({
    Posición: index + 1,
    Matrícula: student.matricula,
    "Nombre completo": student.nombreCompleto,
    Grupo: student.grupo,
    "Ciclo escolar": student.cicloEscolar,
    "Promedio final": average(student.finalAverage),
    "Materias reprobadas": student.failedSubjects,
    Estado: student.isRepeater ? "Repetidor" : student.failedSubjects > 0 ? "En riesgo" : "Regular",
  }));
}

function filenamePart(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

export function exportAcademicDashboardXlsx(bestStudents: AcademicDashboardStudent[], failedStudents: AcademicDashboardStudent[], limitLabel: string): void {
  const workbook = XLSX.utils.book_new();
  const bestSheet = XLSX.utils.json_to_sheet(rows(bestStudents));
  const failedSheet = XLSX.utils.json_to_sheet(rows(failedStudents));
  bestSheet["!cols"] = [{ wch: 10 }, { wch: 16 }, { wch: 32 }, { wch: 12 }, { wch: 16 }, { wch: 16 }, { wch: 20 }, { wch: 14 }];
  failedSheet["!cols"] = bestSheet["!cols"];
  bestSheet["!freeze"] = { xSplit: 2, ySplit: 1 };
  failedSheet["!freeze"] = { xSplit: 2, ySplit: 1 };
  XLSX.utils.book_append_sheet(workbook, bestSheet, "Mejores promedios");
  XLSX.utils.book_append_sheet(workbook, failedSheet, "Más reprobados");
  XLSX.writeFile(workbook, `ranking-academico-${filenamePart(limitLabel)}.xlsx`);
}

function addRankingTable(document: jsPDF, title: string, students: AcademicDashboardStudent[], startY: number): number {
  document.setFont("helvetica", "bold");
  document.setFontSize(12);
  document.setTextColor(24, 32, 51);
  document.text(title, 10, startY);
  autoTable(document, {
    startY: startY + 4,
    head: [["#", "Matrícula", "Nombre completo", "Grupo", "Promedio", "Reprobadas"]],
    body: rows(students).map((row) => [row.Posición, row.Matrícula, row["Nombre completo"], row.Grupo, row["Promedio final"], row["Materias reprobadas"]]),
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 2.5, valign: "middle" },
    headStyles: { fillColor: [7, 134, 166], textColor: 255, fontStyle: "bold", halign: "center" },
    alternateRowStyles: { fillColor: [245, 247, 251] },
    columnStyles: { 0: { cellWidth: 9, halign: "center" }, 1: { cellWidth: 25 }, 2: { cellWidth: 70 }, 3: { cellWidth: 25 }, 4: { cellWidth: 25, halign: "center" }, 5: { cellWidth: 27, halign: "center" } },
  });
  return (document as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? startY + 30;
}

export function exportAcademicDashboardPdf(bestStudents: AcademicDashboardStudent[], failedStudents: AcademicDashboardStudent[], activeSchoolYear: string | null, limitLabel: string): void {
  const document = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  document.setFillColor(7, 134, 166);
  document.rect(10, 10, 277, 22, "F");
  document.setTextColor(255, 255, 255);
  document.setFont("helvetica", "bold");
  document.setFontSize(17);
  document.text("RANKING ACADÉMICO", 16, 20);
  document.setFont("helvetica", "normal");
  document.setFontSize(9);
  document.text(`Ciclo escolar: ${activeSchoolYear ?? "Sin ciclo activo"} · Exportación: ${limitLabel} alumnos`, 16, 27);
  const bestEnd = addRankingTable(document, "Mejores promedios", bestStudents, 42);
  if (bestEnd > 178) document.addPage();
  const failedStart = bestEnd > 178 ? 20 : bestEnd + 12;
  addRankingTable(document, "Alumnos con más materias reprobadas", failedStudents, failedStart);
  document.setFont("helvetica", "normal");
  document.setFontSize(7);
  document.setTextColor(104, 115, 138);
  document.text(`Generado el ${new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date())}`, 10, 202);
  document.save(`ranking-academico-${filenamePart(limitLabel)}.pdf`);
}
