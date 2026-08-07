"use client";

import { create } from "zustand";

import type {
  ManagedSchoolYear,
  SchoolYearActionResult,
  SchoolYearModal,
} from "@/features/school-years/types/school-year.types";

const emptyForm = { nombre: "" };

interface SchoolYearState {
  modal: SchoolYearModal;
  selected: ManagedSchoolYear | null;
  form: typeof emptyForm;
  search: string;
  pending: boolean;
  result: SchoolYearActionResult | null;
  notice: SchoolYearActionResult | null;
  openCreate: () => void;
  openEdit: (schoolYear: ManagedSchoolYear) => void;
  openStatus: (schoolYear: ManagedSchoolYear) => void;
  openDelete: (schoolYear: ManagedSchoolYear) => void;
  closeModal: () => void;
  updateForm: (input: Partial<typeof emptyForm>) => void;
  setSearch: (value: string) => void;
  setPending: (value: boolean) => void;
  setResult: (value: SchoolYearActionResult | null) => void;
  complete: (result: SchoolYearActionResult) => void;
  dismissNotice: () => void;
  reset: () => void;
}

const initialState = {
  modal: null as SchoolYearModal,
  selected: null,
  form: emptyForm,
  search: "",
  pending: false,
  result: null,
  notice: null,
};

export const useSchoolYearStore = create<SchoolYearState>((set) => ({
  ...initialState,
  openCreate: () => set({ modal: "create", selected: null, form: emptyForm, result: null }),
  openEdit: (schoolYear) => set({ modal: "edit", selected: schoolYear, form: { nombre: schoolYear.nombre }, result: null }),
  openStatus: (schoolYear) => set({ modal: "status", selected: schoolYear, result: null }),
  openDelete: (schoolYear) => set({ modal: "delete", selected: schoolYear, result: null }),
  closeModal: () => set({ modal: null, selected: null, form: emptyForm, result: null }),
  updateForm: (input) => set((state) => ({ form: { ...state.form, ...input }, result: null })),
  setSearch: (search) => set({ search }),
  setPending: (pending) => set({ pending }),
  setResult: (result) => set({ result }),
  complete: (notice) => set({ modal: null, selected: null, form: emptyForm, result: null, notice }),
  dismissNotice: () => set({ notice: null }),
  reset: () => set(initialState),
}));