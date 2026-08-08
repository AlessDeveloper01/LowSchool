import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { ReportCardGroup, ReportCardStudent, ReportCardTerm } from "@/features/students/types/report-card.types";

type ReportCardStudentPdf = ReportCardStudent & { edad: number | null };

const TERMS: ReportCardTerm[] = ["T1", "T2", "T3"];

function grade(value: number | null): string {
  return value === null ? "—" : value.toFixed(2);
}

function addPageHeader(document: jsPDF, student: ReportCardStudentPdf, group: ReportCardGroup): void {
  document.setFillColor(7, 134, 166);
  document.rect(10, 10, 277, 28, "F");
  document.setTextColor(255, 255, 255);
  document.setFont("helvetica", "bold");
  document.setFontSize(19);
  document.text("BOLETA DE CALIFICACIONES", 17, 21);
  document.setFont("helvetica", "normal");
  document.setFontSize(9);
  document.text(`${group.label} · Ciclo escolar ${group.cicloEscolar}`, 17, 29);
  document.setTextColor(24, 32, 51);
  document.setFont("helvetica", "bold");
  document.setFontSize(12);
  document.text(student.nombreCompleto, 10, 49);
  document.setFont("helvetica", "normal");
  document.setFontSize(9);
  document.text(`Matrícula: ${student.matricula}`, 10, 56);
  document.text(`Edad: ${student.edad ?? "—"} años`, 85, 56);
  document.text(`Tecnología: ${student.tecnologia ?? "—"}`, 140, 56);
  document.text(`CURP: ${student.curp ?? "—"}`, 10, 62);
  document.text(`Nacimiento: ${student.fechaNacimiento ? new Intl.DateTimeFormat("es-MX").format(new Date(student.fechaNacimiento)) : "—"}`, 85, 62);
  document.text(`Dirección: ${student.direccion ?? "—"}`, 10, 68);
  document.text(`Responsable: ${student.nombreResponsable ?? "—"} · Tel. ${student.telefonoResponsable ?? "—"}`, 10, 74);
}

function addGroupReport(document: jsPDF, student: ReportCardStudentPdf, group: ReportCardGroup, pageIndex: number): void {
  if (pageIndex > 0) document.addPage();
  addPageHeader(document, student, group);

  const headers = ["Materia", "T1", "T2", "T3", "Promedio final", "Asistencias", "Faltas"];
  const body = group.subjects.map((subject) => [
    subject.nombre,
    grade(subject.grades.T1),
    grade(subject.grades.T2),
    grade(subject.grades.T3),
    grade(subject.finalAverage),
    String(TERMS.reduce((total, term) => total + subject.attendance[term].asistencias, 0)),
    String(TERMS.reduce((total, term) => total + subject.attendance[term].faltas, 0)),
  ]);

  autoTable(document, {
    startY: 80,
    head: [headers],
    body,
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 3, valign: "middle" },
    headStyles: { fillColor: [7, 134, 166], textColor: 255, fontStyle: "bold", halign: "center" },
    columnStyles: { 0: { cellWidth: 72 }, 1: { halign: "center", cellWidth: 24 }, 2: { halign: "center", cellWidth: 24 }, 3: { halign: "center", cellWidth: 24 }, 4: { halign: "center", cellWidth: 30 }, 5: { halign: "center", cellWidth: 31 }, 6: { halign: "center", cellWidth: 24 } },
    didParseCell: (hook) => {
      if (hook.section === "body" && hook.column.index >= 1 && hook.column.index <= 4 && hook.cell.raw !== "—" && Number(hook.cell.raw) < 6) {
        hook.cell.styles.textColor = [208, 68, 85];
        hook.cell.styles.fontStyle = "bold";
      }
    },
  });

  const finalY = (document as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 100;
  document.setFillColor(245, 247, 251);
  document.roundedRect(10, finalY + 10, 277, 28, 3, 3, "F");
  document.setTextColor(24, 32, 51);
  document.setFont("helvetica", "bold");
  document.setFontSize(11);
  document.text(`Promedio final: ${grade(student.finalAverage)}`, 18, finalY + 22);
  document.text(`Materias reprobadas: ${student.failedSubjects}`, 105, finalY + 22);
  document.text(student.isRepeater ? "ESTADO: REPETIDOR" : "ESTADO: REGULAR", 205, finalY + 22);
  document.setFont("helvetica", "normal");
  document.setFontSize(8);
  document.setTextColor(104, 115, 138);
  document.text("Las calificaciones menores a 6 se muestran en rojo. — = sin calificación.", 10, 195);
  document.text(`Generado el ${new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date())}`, 10, 202);
}

export function exportReportCardPdf(student: ReportCardStudentPdf): void {
  const document = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  student.groups.forEach((group, index) => addGroupReport(document, student, group, index));
  document.save(`boleta-${student.matricula}-${student.nombreCompleto.replace(/[^a-z0-9]+/gi, "-")}.pdf`);
}
