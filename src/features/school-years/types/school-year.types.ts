import type { z } from "zod";

import type {
  createSchoolYearSchema,
  deleteSchoolYearSchema,
  schoolYearStatusSchema,
  updateSchoolYearSchema,
} from "@/features/school-years/schemas/schoolYearSchema";

export interface ManagedSchoolYear {
  id: string;
  nombre: string;
  activo: boolean;
  groupsCount: number;
}

export type CreateSchoolYearInput = z.input<typeof createSchoolYearSchema>;
export type CreateSchoolYearData = z.output<typeof createSchoolYearSchema>;
export type UpdateSchoolYearInput = z.input<typeof updateSchoolYearSchema>;
export type UpdateSchoolYearData = z.output<typeof updateSchoolYearSchema>;
export type SchoolYearStatusInput = z.input<typeof schoolYearStatusSchema>;
export type SchoolYearStatusData = z.output<typeof schoolYearStatusSchema>;
export type DeleteSchoolYearInput = z.input<typeof deleteSchoolYearSchema>;
export type DeleteSchoolYearData = z.output<typeof deleteSchoolYearSchema>;

export type SchoolYearModal = "create" | "edit" | "status" | "delete" | null;

export interface SchoolYearActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
  data?: ManagedSchoolYear;
}