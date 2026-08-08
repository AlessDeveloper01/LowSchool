import type {
  GradeGroup,
  GradeStudent,
  GradeStudentSummary,
  GradeTerm,
} from "@/features/grades/types/grade.types";

const TERMS: GradeTerm[] = ["T1", "T2", "T3"];

function average(values: Array<number | null>): number | null {
  const available = values.filter((value): value is number => value !== null);
  if (available.length === 0) return null;
  return available.reduce((sum, value) => sum + value, 0) / available.length;
}

export function roundGrade(value: number | null): number | null {
  return value === null ? null : Math.round(value * 100) / 100;
}

export function summarizeStudent(student: GradeStudent, groups: GradeGroup[]): GradeStudentSummary {
  const group = groups.find((item) => item.id === student.grupoId);
  const subjectIds = group?.subjects.map((subject) => subject.id) ?? [];
  const findGrade = (materiaGrupoId: string, trimestre: GradeTerm) =>
    student.grades.find((grade) => grade.materiaGrupoId === materiaGrupoId && grade.trimestre === trimestre)?.valor ?? null;

  const trimesterAverages = Object.fromEntries(
    TERMS.map((trimestre) => [
      trimestre,
      roundGrade(subjectIds.length === 0 ? null : average(subjectIds.map((subjectId) => findGrade(subjectId, trimestre)))),
    ]),
  ) as Record<GradeTerm, number | null>;

  const subjectAverages = Object.fromEntries(
    subjectIds.map((subjectId) => [subjectId, roundGrade(average(TERMS.map((trimestre) => findGrade(subjectId, trimestre))))]),
  ) as Record<string, number | null>;

  const availableSubjectAverages = Object.values(subjectAverages).filter(
    (value): value is number => value !== null,
  );
  const failedSubjects = availableSubjectAverages.filter((value) => value < 6).length;

  return {
    ...student,
    trimesterAverages,
    subjectAverages,
    finalAverage: roundGrade(average(availableSubjectAverages)),
    failedSubjects,
    isRepeater: failedSubjects > 4,
  };
}
