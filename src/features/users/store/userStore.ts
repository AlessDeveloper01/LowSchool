"use client";

import { create } from "zustand";

import type { ManagedUser, UserActionResult, UserFormInput, UserModal, UserStatusFilter } from "@/features/users/types/user.types";

const emptyForm: UserFormInput = { name: "", username: "", email: "", role: "ADMINISTRATIVO", password: "", confirmPassword: "" };

interface UserState {
  modal: UserModal;
  selected: ManagedUser | null;
  form: UserFormInput;
  search: string;
  roleFilter: "all" | UserFormInput["role"];
  statusFilter: UserStatusFilter;
  pending: boolean;
  result: UserActionResult | null;
  notice: UserActionResult | null;
  openCreate: () => void;
  openEdit: (user: ManagedUser) => void;
  openStatus: (user: ManagedUser, activate: boolean) => void;
  closeModal: () => void;
  updateForm: (input: Partial<UserFormInput>) => void;
  setSearch: (value: string) => void;
  setRoleFilter: (value: UserState["roleFilter"]) => void;
  setStatusFilter: (value: UserStatusFilter) => void;
  setPending: (value: boolean) => void;
  setResult: (value: UserActionResult | null) => void;
  complete: (result: UserActionResult) => void;
  dismissNotice: () => void;
  reset: () => void;
}

const initialState = { modal: null, selected: null, form: emptyForm, search: "", roleFilter: "all" as const, statusFilter: "all" as UserStatusFilter, pending: false, result: null, notice: null };

export const useUserStore = create<UserState>((set) => ({
  ...initialState,
  openCreate: () => set({ modal: "create", selected: null, form: emptyForm, result: null }),
  openEdit: (user) => set({ modal: "edit", selected: user, form: { name: user.name, username: user.username, email: user.email, role: user.role, password: "", confirmPassword: "" }, result: null }),
  openStatus: (user, activate) => set({ modal: activate ? "activate" : "deactivate", selected: user, result: null }),
  closeModal: () => set({ modal: null, selected: null, form: emptyForm, result: null }),
  updateForm: (input) => set((state) => ({ form: { ...state.form, ...input }, result: null })),
  setSearch: (search) => set({ search }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setPending: (pending) => set({ pending }),
  setResult: (result) => set({ result }),
  complete: (notice) => set({ modal: null, selected: null, form: emptyForm, result: null, notice }),
  dismissNotice: () => set({ notice: null }),
  reset: () => set(initialState),
}));

